import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

const fetchPosts = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({ number: z.number().min(1).max(50).optional() })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
    const WORDPRESS_COM_API_KEY = process.env["WORDPRESS_COM_API_KEY"];
    if (!LOVABLE_API_KEY || !WORDPRESS_COM_API_KEY) {
      throw new Error("WordPress.com connection is not configured.");
    }

    const number = data?.number ?? 10;
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
  });

const fetchPost = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ id: z.number().int().positive() }).parse(data),
  )
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
    const WORDPRESS_COM_API_KEY = process.env["WORDPRESS_COM_API_KEY"];
    if (!LOVABLE_API_KEY || !WORDPRESS_COM_API_KEY) {
      throw new Error("WordPress.com connection is not configured.");
    }

    const url = `${GATEWAY_URL}/rest/v1.1/sites/${SITE}/posts/${data.id}`;

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
  });

export { fetchPosts, fetchPost };
