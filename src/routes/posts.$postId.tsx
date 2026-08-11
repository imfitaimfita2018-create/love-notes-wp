import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { fetchPost, type WpPostFull } from "@/lib/wordpress.functions";

export const Route = createFileRoute("/posts/$postId")({
  head: ({ loaderData }) => {
    const post = (loaderData ?? undefined) as WpPostFull | undefined;
    const title = post?.title ?? "مقال";
    return {
      meta: [
        { title: `${title} | Sustainable Growth & Marketing Engineering` },
        { name: "description", content: loaderData?.excerpt ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        ...(loaderData?.featured_image
          ? [
              { property: "og:image", content: loaderData.featured_image },
              { name: "twitter:image", content: loaderData.featured_image },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: async ({ params }) => {
    const id = parseInt(params.postId, 10);
    if (Number.isNaN(id)) throw notFound();
    try {
      return await fetchPost({ data: { id } });
    } catch {
      throw notFound();
    }
  },
  component: PostDetail,
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

function PostDetail() {
  const post = Route.useLoaderData() as WpPostFull;
  const hasImage = Boolean(post.featured_image);
  const tags = Object.values(post.tags ?? {}).map((t) => t.name).filter(Boolean);
  const cats = Object.values(post.categories ?? {})
    .map((c) => c.name)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900" dir="rtl">
      <header className="border-b border-stone-200 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            العودة إلى المقالات
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {cats.map((c) => (
            <span
              key={c}
              className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700"
            >
              {c}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-500">
          {post.author?.name && (
            <span className="font-medium text-stone-700">
              {post.author.name}
            </span>
          )}
          <span className="text-stone-300">•</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        {hasImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <img
              src={post.featured_image}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        <div
          className="mt-8 prose prose-stone max-w-none prose-headings:font-bold prose-headings:text-stone-900 prose-a:text-emerald-700 prose-img:rounded-xl prose-img:shadow-sm"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-6">
            <span className="text-xs font-medium text-stone-400">الوسوم:</span>
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-600"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10 border-t border-stone-200 pt-6">
          <a
            href={post.URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
          >
            عرض المقال الأصلي على WordPress
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5h5m0 0v5m0-5L9 15M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5"
              />
            </svg>
          </a>
        </div>
      </article>
    </div>
  );
}
