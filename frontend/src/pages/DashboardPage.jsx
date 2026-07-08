import { ArrowRight, BookOpen, BriefcaseBusiness, ChartNoAxesCombined, CircleGauge, Mail, MapPin, Medal, Pencil, Phone, Sparkles, Trophy, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loading from "../components/Loading.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import ProfileEditModal from "../components/ProfileEditModal.jsx";
import ResultCard from "../components/ResultCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { chapters } from "../data/chapters.js";
import { getApiErrorMessage } from "../services/api.js";
import { resultService } from "../services/resultService.js";

const themeClass = {
  cyan: "unit-card-cyan",
  emerald: "unit-card-emerald",
  violet: "unit-card-violet",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, translateObject } = useLanguage();
  const localizedChapters = translateObject(chapters);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    resultService.getSummary()
      .then(({ summary: data }) => setSummary(data))
      .catch((requestError) => setError(getApiErrorMessage(requestError)));
  }, []);

  if (!summary && !error) return <Loading label={t("dashboard.loading")} />;
  const data = summary || { completedGames: 0, averagePercentage: 0, bestPercentage: 0, completedUnits: 0, recentResults: [], byUnit: [] };

  return (
    <div className="page-enter space-y-8">
      {error && <Alert>{error}</Alert>}
      {profileMessage && <Alert type="success" onClose={() => setProfileMessage("")}>{profileMessage}</Alert>}
      <section className="dashboard-hero glass-panel soft-border">
        <div className="relative z-10 max-w-2xl">
          <div className="eyebrow"><Sparkles className="size-4" /> {t("dashboard.eyebrow")}</div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">{t("dashboard.hello", { name:user?.name?.split(" ")[0] })}</h1>
          <p className="mt-3 max-w-xl leading-7 text-slate-300">{t("dashboard.hero")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/book" className="button button-primary">{t("common.openBook")} <BookOpen className="size-5" /></Link>
            <Link to="/my-results" className="button button-ghost">{t("dashboard.myResults")} <ChartNoAxesCombined className="size-4" /></Link>
            <Link to="/leaderboard" className="button button-ghost">{t("common.ranking")} <Trophy className="size-4" /></Link>
          </div>
        </div>
        <div className="hero-progress" style={{ "--progress": `${Math.round((data.completedUnits / 3) * 100)}%` }}>
          <div><strong>{data.completedUnits}/3</strong><span>{t("dashboard.unitsPassed")}</span></div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <ProgressCard label={t("dashboard.progress")} value={`${data.completedUnits}/3`} detail={t("dashboard.progressDetail")} color="cyan" icon={CircleGauge} />
        <ProgressCard label={t("dashboard.average")} value={`${Math.round(data.averagePercentage)}%`} detail={t("dashboard.gamesDone", { count:data.completedGames })} color="emerald" icon={ChartNoAxesCombined} />
        <ProgressCard label={t("dashboard.best")} value={`${Math.round(data.bestPercentage)}%`} detail={t("dashboard.personalBest")} color="violet" icon={Medal} />
      </section>

      <section className="student-profile-card glass-panel soft-border">
        <div className="student-profile-heading">
          <div className="student-profile-avatar"><UserRound /></div>
          <div><p>{t("profile.title")}</p><h2>{user?.name}</h2><span><Mail />{user?.email}</span></div>
        </div>
        <div className="student-profile-details">
          <span><Phone />{user?.phone || t("profile.notSet")}</span>
          <span><MapPin />{user?.city || t("profile.notSet")}</span>
          <span><BriefcaseBusiness />{user?.career || t("profile.notSet")}</span>
        </div>
        <div className="student-profile-action">
          <p>{user?.phone && user?.city && user?.career ? t("profile.updated") : t("profile.complete")}</p>
          <button type="button" className="button button-outline button-sm" onClick={() => setProfileOpen(true)}><Pencil />{t("profile.edit")}</button>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div><p>{t("dashboard.journey")}</p><h2>{t("dashboard.continue")}</h2></div>
          <Link to="/book">{t("dashboard.viewIndex")} <ArrowRight className="size-4" /></Link>
        </div>
        <div className="dashboard-grid">
          {localizedChapters.map((chapter) => {
            const progress = data.byUnit.find((item) => Number(item.unitId) === chapter.id);
            return (
              <Link key={chapter.id} to={`/book/unit/${chapter.id}`} className={`unit-card hover-lift ${themeClass[chapter.theme]}`}>
                <div className="flex items-center justify-between"><span className="unit-number">0{chapter.id}</span><span className="status-dot">{progress?.bestPercentage >= 60 ? t("dashboard.passed") : progress ? t("dashboard.inProgress") : t("dashboard.new")}</span></div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-current/70">{chapter.category}</p>
                <h3 className="mt-2 text-xl font-black text-white">{chapter.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{chapter.subtitle}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4"><span className="text-xs text-slate-500">{t("ranking.best")}: {Math.round(progress?.bestPercentage || 0)}%</span><ArrowRight className="size-4 transition group-hover:translate-x-1" /></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="section-heading"><div><p>{t("dashboard.recent")}</p><h2>{t("dashboard.latest")}</h2></div><Link to="/my-results">{t("dashboard.history")} <ArrowRight className="size-4" /></Link></div>
        {data.recentResults.length ? (
          <div className="grid gap-3 lg:grid-cols-2">{data.recentResults.map((result) => <ResultCard key={result.id} result={result} compact />)}</div>
        ) : (
          <div className="empty-state"><BookOpen className="size-7 text-amber-300" /><div><h3>{t("dashboard.noResults")}</h3><p>{t("dashboard.noResultsText")}</p></div><Link to="/book" className="button button-outline button-sm">{t("dashboard.start")}</Link></div>
        )}
      </section>
      <ProfileEditModal open={profileOpen} user={user} onClose={() => setProfileOpen(false)} onSaved={setProfileMessage} />
    </div>
  );
}
