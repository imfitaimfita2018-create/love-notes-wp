import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { fetchPosts, type WpPost } from "@/lib/wordpress.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "أحدث المقالات | Sustainable Growth & Marketing Engineering",
      },
      {
        name: "description",
        content:
          "تصفّح أحدث المقالات من مدونة Sustainable Growth & Marketing Engineering Agency.",
      },
      { property: "og:title", content: "أحدث المقالات" },
      {
        property: "og:description",
        content:
          "تصفّح أحدث المقالات من مدونة Sustainable Growth & Marketing Engineering Agency.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async () => fetchPosts({ data: { number: 12 } }),
  component: Index,
});

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ar", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type SortKey = "newest" | "oldest" | "popular";

function engagement(p: WpPost) {
  return (p.like_count ?? 0) + (p.discussion?.comment_count ?? 0);
}

function Index() {
  const { posts }: { posts: WpPost[] } = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const hasEngagement = useMemo(
    () => posts.some((p) => engagement(p) > 0),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? posts.filter((p) => p.title.toLowerCase().includes(q))
      : [...posts];
    return list.sort((a, b) => {
      if (sort === "popular") return engagement(b) - engagement(a);
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sort === "oldest" ? diff : -diff;
    });
  }, [posts, query, sort]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900" dir="rtl">
      <header className="border-b border-stone-200 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-sm font-medium tracking-[0.2em] text-emerald-700 uppercase">
            Sustainable Growth & Marketing Engineering
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            أحدث المقالات
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-stone-500">
            مقالات وإرشادات حول النمو المستدام وهندسة التسويق.
          </p>

          <div className="mx-auto mt-6 max-w-md">
            <div className="relative">
              <svg
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن مقال بالعنوان..."
                aria-label="بحث عن مقال"
                className="w-full rounded-full border border-stone-300 bg-white py-3 pr-12 pl-4 text-base text-stone-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="ترتيب المقالات"
          >
            {([
              { key: "newest", label: "الأحدث" },
              { key: "oldest", label: "الأقدم" },
              ...(hasEngagement
                ? [{ key: "popular", label: "الأعلى تفاعلاً" }]
                : []),
            ] as { key: SortKey; label: string }[]).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSort(opt.key)}
                aria-pressed={sort === opt.key}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  sort === opt.key
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-stone-300 bg-white text-stone-600 hover:border-emerald-400 hover:text-emerald-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
            <p className="text-stone-500">
              {query.trim()
                ? "لا توجد مقالات تطابق بحثك."
                : "لا توجد مقالات منشورة بعد."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.ID} post={post} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} Sustainable Growth & Marketing
          Engineering Agency
        </div>
      </footer>
    </div>
  );
}

function PostCard({ post }: { post: WpPost }) {
  const hasImage = Boolean(post.featured_image);
  return (
    <Link
      to="/posts/$postId"
      params={{ postId: String(post.ID) }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-stone-100">
        {hasImage ? (
          <img
            src={post.featured_image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 via-stone-100 to-amber-100">
            <span className="text-4xl">📝</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-stone-900 transition-colors group-hover:text-emerald-700">
          {post.title}
        </h2>

        {post.excerpt && (
          <p
            className="mt-2 line-clamp-3 text-sm text-stone-500"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}

        <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-stone-400">
          <svg
            className="h-4 w-4 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </div>
    </Link>
  );
}
