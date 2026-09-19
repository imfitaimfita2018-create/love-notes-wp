import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: AgencyLandingPage,
});

function AgencyLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Marketing Engineering Agency
          </div>
          <nav className="hidden md:flex space-x-reverse space-x-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-emerald-400 transition">الخدمات الهندسية</a>
            <a href="#analytics" className="hover:text-emerald-400 transition">تحليلات البيانات</a>
            <a href="#about" className="hover:text-emerald-400 transition">منهجيتنا</a>
          </nav>
          <div>
            <a href="#contact" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm">
              ابدأ مشروعك
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            هندسة التسويق المبنية على البيانات والذكاء الاصطناعي
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            هندسة النمو المستدام <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              لشركات المستقبل
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            ندمج استراتيجيات التسويق المتقدمة، تحليلات البيانات الدقيقة عبر GA4 و Looker Studio، والحلول التقنية لنقل عملك إلى أبعاد جديدة من الكفاءة والعائد على الاستثمار.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-4 rounded-xl transition shadow-xl shadow-emerald-500/20">
              طلب تدقيق مجاني لموقعك
            </a>
            <a href="#services" className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-8 py-4 rounded-xl transition">
              استكشف خدماتنا الهندسية
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">قدراتنا وحلولنا الهندسية</h2>
            <p className="text-slate-400">نقدم حلولاً متكاملة تدمج الهندسة البرمجية مع دقة التحليلات التسويقية.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">📊</div>
              <h3 className="text-xl font-bold mb-3">تحليلات GA4 & Looker Studio</h3>
              <p className="text-slate-400 text-sm leading-relaxed">تصميم وبناء لوحات معلومات تفاعلية ومتابعة دقيقة لمؤشرات الأداء الرئيسية (KPIs).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">⚡</div>
              <h3 className="text-xl font-bold mb-3">التدقيق التقني & SEO</h3>
              <p className="text-slate-400 text-sm leading-relaxed">تحسين سرعة الأداء عبر PageSpeed Insights وضمان أعلى معدلات أرشفة وظهور على محركات البحث.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🤖</div>
              <h3 className="text-xl font-bold mb-3">تطوير مدعوم بالذكاء الاصطناعي</h3>
              <p className="text-slate-400 text-sm leading-relaxed">بناء صفحات هبوط وتطبيقات ويب سريعة وعالية التحويل باستخدام أحدث الأدوات التقنية.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">🎯</div>
              <h3 className="text-xl font-bold mb-3">استراتيجيات B2B وتقسيم العملاء</h3>
              <p className="text-slate-400 text-sm leading-relaxed">تحليل سلوك العملاء وتجزئة البيانات عبر بايثون وأدوات الذكاء الاصطناعي لضمان نمو مستدام.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; 2026 Sustainable Growth and Marketing Engineering Agency. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
