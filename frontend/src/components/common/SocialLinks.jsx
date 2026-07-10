import { Github, Instagram, Linkedin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext.jsx";

const links = [
  { label: "GitHub", href: "https://github.com/Alejandro120325", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jairo-alejandro-ojeda-herrera-9466543a6/", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/alejo_ojeda1203/", icon: Instagram },
];

export default function SocialLinks() {
  const { t } = useLanguage();
  return <div className="social-links"><span>{t("footer.connect")}</span><nav aria-label={t("footer.connect")}>{links.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /><span>{label}</span></a>)}</nav></div>;
}
