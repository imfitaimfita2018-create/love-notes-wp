import React from "react";

export function RouteComponent() {
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
            ندمج استراتيجيات التسويق المتقدمة، تحليلات البيانات الدقيقة عبر GA4 و Looker Studio، والحلول التقنية لنقل عملك إلى أبعاد جديدة.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-4 rounded-xl transition shadow-xl">
              طلب تدقيق مجاني لموقعك
            </a>
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
