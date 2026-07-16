import { ArrowLeft, BookOpen, BriefcaseBusiness, CalendarDays, Code2, Database, Globe2, Layers3, Mail, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AppFooter from "../components/layout/AppFooter.jsx";
import HeaderPreferences from "../components/layout/HeaderPreferences.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const developers = [
  {
    name: "Alejandro Ojeda",
    roleKey: "about.role.frontend",
    descriptionKey: "about.dev.alejandro",
    metaKey: "about.dev.alejandroMeta",
    email: "alejandro.ojeda@nexorf.dev",
  },
  {
    name: "Josue Vele",
    roleKey: "about.role.backend",
    descriptionKey: "about.dev.josue",
    metaKey: "about.dev.josueMeta",
    email: "josue.vele@nexorf.dev",
  },
  {
    name: "Juan Figueroa",
    roleKey: "about.role.docs",
    descriptionKey: "about.dev.juan",
    metaKey: "about.dev.juanMeta",
    email: "juan.figueroa@nexorf.dev",
  },
];

const technologies = ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "SQLite", "JWT", "Web Speech API"];

const featureKeys = [
  "about.feature.book",
  "about.feature.auth",
  "about.feature.roles",
  "about.feature.games",
  "about.feature.results",
  "about.feature.audit",
  "about.feature.readAloud",
  "about.feature.language",
  "about.feature.theme",
  "about.feature.visualThemes",
];

const facts = [
  { icon: BriefcaseBusiness, labelKey: "about.fact.studio", valueKey: "about.fact.studioValue" },
  { icon: MapPin, labelKey: "about.fact.location", valueKey: "about.fact.locationValue" },
  { icon: CalendarDays, labelKey: "about.fact.period", valueKey: "about.fact.periodValue" },
  { icon: Mail, labelKey: "about.fact.contact", valueKey: "about.fact.contactValue" },
];

export default function AboutPage() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const panelPath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <div className="about-shell fantasy-landing min-h-screen text-stone-100">
      <div className="library-vignette" />

      <header className="relative z-30 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="fantasy-brand" aria-label={t("header.home")}>
          <span><BookOpen /></span>
          <div><strong>{t("header.project")}</strong><small>{t("header.subtitle")}</small></div>
        </Link>
        <nav className="flex items-center gap-2" aria-label={t("header.mainNav")}>
          <Link to="/" className="button button-ghost button-sm"><ArrowLeft />{t("header.home")}</Link>
          {isAuthenticated ? (
            <Link to={panelPath} className="button button-primary button-sm">{user?.role === "admin" ? t("common.administration") : t("common.dashboard")}</Link>
          ) : (
            <Link to="/login" className="button button-primary button-sm">{t("auth.login")}</Link>
          )}
          <HeaderPreferences />
        </nav>
      </header>

      <main className="about-page page-enter relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-6 lg:px-8">
        <section className="about-hero glass-panel soft-border">
          <div className="about-hero-copy">
            <div className="fantasy-eyebrow"><Sparkles /> {t("about.nav")}</div>
            <h1>{t("about.title")}</h1>
            <h2 className="about-subtitle">{t("about.subtitle")}</h2>
            <p>{t("about.description")}</p>
            <div className="about-hero-actions">
              <Link to="/book" className="button button-primary"><BookOpen />{t("common.openBook")}</Link>
              <a className="button button-outline" href={`mailto:${t("about.fact.contactValue")}`}><Mail />{t("about.contactAction")}</a>
            </div>
          </div>
          <div className="about-logo-card" aria-label={t("about.logoLabel")}>
            <img src="/Nexorf.png" alt={t("about.logoAlt")} className="about-logo" />
          </div>
        </section>

        <section className="about-facts-grid" aria-label={t("about.fakeData")}>
          {facts.map(({ icon: Icon, labelKey, valueKey }) => (
            <article key={labelKey} className="about-fact glass-card hover-lift">
              <Icon />
              <span>{t(labelKey)}</span>
              <strong>{t(valueKey)}</strong>
            </article>
          ))}
        </section>

        <section className="about-section">
          <div className="section-heading">
            <div><p>{t("about.teamEyebrow")}</p><h2>{t("about.developers")}</h2></div>
          </div>
          <div className="about-team-grid">
            {developers.map((developer) => (
              <article key={developer.name} className="about-dev-card glass-card hover-lift">
                <div className="about-dev-avatar">{developer.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                <div>
                  <span>{t(developer.roleKey)}</span>
                  <h3>{developer.name}</h3>
                  <p>{t(developer.descriptionKey)}</p>
                  <small>{t(developer.metaKey)}</small>
                  <a href={`mailto:${developer.email}`}><Mail />{developer.email}</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-split-grid">
          <article className="about-section glass-panel soft-border">
            <div className="section-heading">
              <div><p>{t("about.stackEyebrow")}</p><h2>{t("about.technologies")}</h2></div>
              <Code2 />
            </div>
            <div className="about-badges">
              {technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
          </article>

          <article className="about-section glass-panel soft-border">
            <div className="section-heading">
              <div><p>{t("about.productEyebrow")}</p><h2>{t("about.features")}</h2></div>
              <Layers3 />
            </div>
            <div className="about-feature-list">
              {featureKeys.map((key) => (
                <span key={key}><ShieldCheck />{t(key)}</span>
              ))}
            </div>
          </article>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
