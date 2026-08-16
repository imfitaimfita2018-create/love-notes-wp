# WordPress.com API — دليل سريع للمطوّر

هذا المشروع يقرأ المقالات من موقع WordPress.com عبر بوابة Lovable Connector Gateway.

## الموقع المستهدف

- الموقع: `sustainablegrowthandmarketingengineeringagency.wordpress.com`
- الدومين مثبّت في الخلفية فقط: `src/lib/wordpress.functions.ts` (لا تضعه في كود الواجهة).

## الروابط والتوثيق الرسمي

- توثيق WordPress.com REST API v1.1: https://developer.wordpress.com/docs/api/
- قائمة المقالات: https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/
- مقال واحد: https://developer.wordpress.com/docs/api/1.1/get/sites/%24site/posts/%24post_ID/
- (لموقع ووردبريس مستضاف ذاتيًا يُستخدم `wp/v2`: https://developer.wordpress.org/rest-api/)

## كيف تُنفَّذ الطلبات

كل الطلبات تمرّ عبر البوابة من كود السيرفر فقط:

```
https://connector-gateway.lovable.dev/wordpress_com/rest/v1.1/sites/{SITE}/posts/
```

الترويسات المطلوبة:

```ts
headers: {
  Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
  "X-Connection-Api-Key": process.env["WORDPRESS_COM_API_KEY"]!,
}
```

- المتغيّران أعلاه سرّيان ويُقرآن داخل `.handler()` فقط (server functions).
- لا تستدعِ `public-api.wordpress.com` مباشرة، ولا تضع أي مفتاح في المتصفح.

## نقاط الدخول في الكود

| ملف | الدور |
| --- | --- |
| `src/lib/wordpress.functions.ts` | `fetchPosts({ number })` و `fetchPost({ id })` + الأنواع `WpPost` / `WpPostFull` |
| `src/routes/index.tsx` | الصفحة الرئيسية: بحث + فرز + ترقيم (الحالة محفوظة في `?q&sort&page`) |
| `src/routes/posts.$postId.tsx` | صفحة تفاصيل المقال (المحتوى الكامل) |

## كيف تبدأ

1. تأكد أن اتصال WordPress.com مرتبط بالمشروع (Connectors) حتى تتوفر `WORDPRESS_COM_API_KEY`.
2. لإضافة حقول جديدة: عدّل معامل `fields` في `fetchPosts` ثم أضِفها إلى نوع `WpPost`.
3. لإضافة نقطة نهاية جديدة: أنشئ `createServerFn` جديدة بنفس نمط `fetchPost` (تحقق من `response.ok` وأعِد نص الخطأ كما هو).
4. الصفحات تجلب البيانات عبر `loader` في الراوت، لا عبر `useEffect`.

## ملاحظات

- النطاقات المتاحة للاتصال: `posts`, `media`, `sites`, `users` — نقاط مثل `/me/sites` قد تُرفض.
- المجموعات مُصفّحة: استخدم `number` و `page` أو `offset`.
- الحقول `excerpt` و `content` تأتي كـ HTML جاهز من ووردبريس.