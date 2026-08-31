const SOCIALS = [
  { label: "اینستاگرام", href: "https://instagram.com" },
  { label: "یوتیوب", href: "https://youtube.com" },
  { label: "ساندکلاود", href: "https://soundcloud.com" },
  { label: "اسپاتیفای", href: "https://open.spotify.com" }
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-5 md:px-8 border-t border-line/60">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-wide text-crimson mb-4">درباره سایکو</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">
          ذهن تاریک، صدای واقعی
        </h2>
        <p className="text-bone/70 leading-8">
          سایکو یک هنرمند ترپ و هیپ‌هاپ فارسی‌زبان است که مرزهای صدا و فرهنگ
          را جابه‌جا می‌کند. هر ترک، روایتی از یک تجربه‌ی شخصی است؛ ترکیبی از
          ملودی‌های تاریک، بیت‌های سنگین و کلامی صادقانه.
        </p>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 px-5 md:px-8 border-t border-line/60">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-wide text-crimson mb-4">ارتباط</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">همکاری و پیام</h2>
        <p className="text-bone/70 mb-8">
          برای پیشنهاد همکاری، رزرو نمایش یا هر پیام دیگری، از طریق شبکه‌های
          زیر در ارتباط باشید.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-full border border-line px-5 py-2.5 text-sm hover:border-violet/60 hover:text-bone transition-colors text-bone/70"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative py-10 px-5 md:px-8 border-t border-line/60 text-center text-xs text-bone/40">
      © {new Date().getFullYear()} PSYCHO — تمامی حقوق محفوظ است
    </footer>
  );
}
