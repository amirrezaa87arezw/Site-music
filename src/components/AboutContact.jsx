import { InstagramIcon, YoutubeIcon, SoundcloudIcon, SpotifyIcon } from "./icons";

const SOCIALS = [
  { label: "اینستاگرام", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "یوتیوب", href: "https://youtube.com", Icon: YoutubeIcon },
  { label: "ساندکلاود", href: "https://soundcloud.com", Icon: SoundcloudIcon },
  { label: "اسپاتیفای", href: "https://open.spotify.com", Icon: SpotifyIcon }
];

export function SocialIcons({ size = "h-10 w-10" }) {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={`focus-ring ${size} rounded-full border border-line flex items-center justify-center text-bone/60 hover:text-bone hover:border-violet/60 transition-colors`}
        >
          <Icon className="h-[45%] w-[45%]" />
        </a>
      ))}
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-5 md:px-8 border-t border-line/60">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1fr] gap-10 items-center">
        <div>
          <p className="text-xs tracking-wide text-crimson mb-4">درباره سایکو</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[0.95] text-gradient">
            ذهن تاریک.
            <br />
            صدای واقعی.
          </h2>
        </div>
        <div>
          <p className="text-bone/70 leading-8 mb-5">
            سایکو یک هنرمند ترپ و هیپ‌هاپ فارسی‌زبان است که مرزهای صدا و فرهنگ
            را جابه‌جا می‌کند. هر ترک، روایتی از یک تجربه‌ی شخصی است؛ ترکیبی از
            ملودی‌های تاریک، بیت‌های سنگین و کلامی صادقانه.
          </p>
          <a
            href="#music"
            className="focus-ring inline-flex items-center gap-2 text-sm text-violet hover:text-crimson transition-colors"
          >
            بیشتر بدان
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="relative py-24 px-5 md:px-8 border-t border-line/60">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-wide text-crimson mb-4">ارتباط</p>
        <h2 className="font-display text-3xl md:text-4xl mb-8">همکاری و پیام</h2>
        <p className="text-bone/70 mb-8">
          برای پیشنهاد همکاری، رزرو نمایش یا هر پیام دیگری، از طریق شبکه‌های
          زیر در ارتباط باشید.
        </p>
        <div className="flex justify-center">
          <SocialIcons />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative py-10 px-5 md:px-8 border-t border-line/60">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <span className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center font-display text-sm">
          پ
        </span>
        <SocialIcons size="h-8 w-8" />
        <p className="text-xs text-bone/40">© {new Date().getFullYear()} PSYCHO — تمامی حقوق محفوظ است</p>
      </div>
    </footer>
  );
}
