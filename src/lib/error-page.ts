export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>لم يتم تحميل الصفحة</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet" />
    <style>
      body { font: 15px/1.5 "Cairo", system-ui, -apple-system, sans-serif; background: #0a0c14; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 1rem; background: rgba(15, 23, 42, 0.45); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #94a3b8; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #f59e0b; color: #0a0c14; }
      .secondary { background: transparent; color: #f8fafc; border-color: rgba(148, 163, 184, 0.3); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>لم يتم تحميل الصفحة</h1>
      <p>حدث خطأ من جانبنا. يمكنك تحديث الصفحة أو العودة إلى الصفحة الرئيسية.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">إعادة المحاولة</button>
        <a class="secondary" href="/">الصفحة الرئيسية</a>
      </div>
    </div>
  </body>
</html>`;
}
