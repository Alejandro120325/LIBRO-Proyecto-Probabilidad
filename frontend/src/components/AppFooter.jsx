import { BookMarked, GraduationCap, Mail, MapPin, Phone, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";
import SocialLinks from "./SocialLinks.jsx";

export default function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <section className="footer-project">
          <h2><BookMarked />{t("footer.projectLabel")}</h2>
          <strong>{t("footer.fullProject")}</strong>
          <p>{t("footer.description")}</p>
        </section>
        <section>
          <h2><Users />{t("footer.members")}</h2>
          <ul>
            <li>{t("footer.developerAlejandro")}</li>
            <li>{t("footer.developerJosue")}</li>
            <li>{t("footer.developerJuan")}</li>
          </ul>
        </section>
        <section>
          <h2><GraduationCap />{t("footer.academicInfo")}</h2>
          <ul>
            <li>{t("footer.university")}</li>
            <li><BookMarked />{t("footer.career")}</li>
            <li>{t("footer.subject")}</li>
            <li>{t("footer.period")}</li>
          </ul>
        </section>
        <section>
          <h2><Mail />{t("footer.contact")}</h2>
          <address>
            <a href="mailto:proyecto.probabilidad@ups.edu.ec"><Mail />proyecto.probabilidad@ups.edu.ec</a>
            <a href="tel:+593991234567"><Phone />+593 99 123 4567</a>
            <span><MapPin />{t("footer.location")}</span>
          </address>
        </section>
      </div>
      <div className="footer-bottom"><span>{t("footer.projectLine")}</span><SocialLinks /></div>
    </footer>
  );
}
