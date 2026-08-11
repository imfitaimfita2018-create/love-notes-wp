import { createFileRoute, Link } from "@tanstack/react-router";
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

function Index() {
  const { posts }: { posts: WpPost[] } = Route.useLoaderData();

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
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
            <p className="text-stone-500">لا توجد مقالات منشورة بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
