const WP_URL = "https://demo.wp-api.org/wp-json/wp/v2";

export async function getPosts() {
  try {
    const res = await fetch(`${WP_URL}/posts`);
    if (!res.ok) throw new Error("فشل في جلب البيانات من وردبريس");
    return await res.json();
  } catch (error) {
    console.error("خطأ أثناء الاتصال بـ WordPress:", error);
    return [];
  }
}