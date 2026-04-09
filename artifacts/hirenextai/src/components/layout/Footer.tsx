import { Link } from "wouter";
import { Logo } from "@/components/Logo";
import { Linkedin, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const aboutLinks = [
  { label: "About HirenextAI", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

const supportLinks = [
  { label: "Help Center", href: "/help-center" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const socials = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-background border-t border-border/60 relative z-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Logo size="lg" />
            </Link>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-xs">{t("footer.brandDescription")}</p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-5">{t("footer.about")}</h4>
            <ul className="space-y-3">
              {aboutLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-5">{t("footer.support")}</h4>
            <ul className="space-y-3">
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-5">{t("footer.contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="mailto:support@hirenextai.com" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">
                  support@hirenextai.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <a href="tel:+919999999999" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Bengaluru, Karnataka<br />India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm text-center">{t("footer.copyright")}</p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/privacy-policy" className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200">{t("footer.privacy")}</Link>
            <Link href="/terms" className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200">{t("footer.terms")}</Link>
            <Link href="/cookies" className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200">{t("footer.cookies")}</Link>
            <Link href="/refund-policy" className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200">{t("footer.refund")}</Link>
            <Link href="/contact" className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200">{t("footer.contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
