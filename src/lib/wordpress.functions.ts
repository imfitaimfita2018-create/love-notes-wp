import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// Hardcoded in the backend (never in frontend) per connector guidance.
const SITE = "sustainablegrowthandmarketingengineeringagency.wordpress.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/wordpress_com";

export type WpPost = {
  ID: number;
  title: string;
  date: string;
  URL: string;
  excerpt: string;
  featured_image: string;
  author?: { name?: string };
  like_count?: number;
  discussion?: { comment_count?: number };
};

export type WpPostFull = WpPost & {
  content: string;
  modified?: string;
  tags?: Record<string, { name?: string }>;
  categories?: Record<string, { name?: string }>;
};

export type FeaturedPost = {
  id: string;
  post_id: number;
  pinned: boolean;
  created_at: string;
};

function getWordPressCredentials() {
  const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
  const WORDPRESS_COM_API_KEY = process.env["WORDPRESS_COM_API_KEY"];
  if (!LOVABLE_API_KEY || !WORDPRESS_COM_API_KEY) {
    throw new Error("WordPress.com connection is not configured.");
  }
  return { LOVABLE_API_KEY, WORDPRESS_COM_API_KEY };
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(init?.headers);
    if (
      supabaseKey.startsWith("sb_") &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createServerSupabaseClient() {
  const SUPABASE_URL = process.env["SUPABASE_URL"];
  const SUPABASE_PUBLISHABLE_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase is not configured.");
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
  });
}

async function fetchWordPressPosts(number: number): Promise<{
  posts: WpPost[];
  found: number;
}> {
  const { LOVABLE_API_KEY, WORDPRESS_COM_API_KEY } = getWordPressCredentials();

  const url = new URL(`${GATEWAY_URL}/rest/v1.1/sites/${SITE}/posts/`);
  url.searchParams.set("number", String(number));
  url.searchParams.set(
    "fields",
    "ID,title,date,URL,excerpt,featured_image,author,like_count,discussion",
  );

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": WORDPRESS_COM_API_KEY,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `WordPress gateway request failed [${response.status}]: ${errorBody}`,
    );
    throw new Error(
      `WordPress request failed [${response.status}]: ${errorBody}`,
    );
  }

  const json = (await response.json()) as {
    posts: WpPost[];
    found?: number;
  };
  return { posts: json.posts ?? [], found: json.found ?? 0 };
}

async function fetchWordPressPost(id: number): Promise<WpPostFull> {
  const { LOVABLE_API_KEY, WORDPRESS_COM_API_KEY } = getWordPressCredentials();

  const url = `${GATEWAY_URL}/rest/v1.1/sites/${SITE}/posts/${id}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": WORDPRESS_COM_API_KEY,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `WordPress gateway request failed [${response.status}]: ${errorBody}`,
    );
    throw new Error(
      `WordPress request failed [${response.status}]: ${errorBody}`,
    );
  }

  return (await response.json()) as WpPostFull;
}

async function fetchFeaturedPosts(): Promise<FeaturedPost[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("featured_posts").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []) as FeaturedPost[];
}

const fetchPosts = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({ number: z.number().min(1).max(100).optional() })
      .parse(data),
  )
  .handler(async ({ data }) => fetchWordPressPosts(data?.number ?? 10));

const fetchPost = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ id: z.number().int().positive() }).parse(data),
  )
  .handler(async ({ data }) => fetchWordPressPost(data.id));

const listFeaturedPosts = createServerFn({ method: "GET" }).handler(
  async () => fetchFeaturedPosts(),
);

const getHomePageData = createServerFn({ method: "GET" }).handler(
  async () => {
    const [wp, featured] = await Promise.all([
      fetchWordPressPosts(50),
      fetchFeaturedPosts(),
    ]);
    return { posts: wp.posts, featured: featured ?? [] };
  },
);

const toggleFeaturedPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        postId: z.number().int().positive(),
        pinned: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { data: existing } = await supabase
      .from("featured_posts")
      .select("id")
      .eq("post_id", data.postId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("featured_posts")
        .update({ pinned: data.pinned })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { ok: true, pinned: data.pinned };
    }

    const { error } = await supabase
      .from("featured_posts")
      .insert({ post_id: data.postId, pinned: data.pinned });
    if (error) throw new Error(error.message);
    return { ok: true, pinned: data.pinned };
  });

const deleteFeaturedPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ postId: z.number().int().positive() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const supabase = context.supabase;
    const { error } = await supabase
      .from("featured_posts")
      .delete()
      .eq("post_id", data.postId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export {
  fetchPosts,
  fetchPost,
  listFeaturedPosts,
  getHomePageData,
  toggleFeaturedPost,
  deleteFeaturedPost,
};
