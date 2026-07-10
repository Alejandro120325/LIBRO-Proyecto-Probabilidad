import { Crown, Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "../../components/common/Alert.jsx";
import Loading from "../../components/common/Loading.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function AdminLeaderboardPage() {
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState(null); const [error, setError] = useState("");
  useEffect(() => { adminService.getAdminLeaderboard().then(({ leaderboard }) => setLeaders(leaderboard)).catch((err) => setError(getApiErrorMessage(err))); }, []);
  if (!leaders && !error) return <Loading label={t("adminRanking.loading")} />;
  return <div className="page-enter space-y-6"><header className="admin-page-header"><div><p>{t("adminRanking.eyebrow")}</p><h1>{t("adminRanking.title")}</h1><span>{t("adminRanking.subtitle")}</span></div><Trophy /></header>{error && <Alert>{error}</Alert>}<section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t("adminRanking.place")}</th><th>{t("adminRanking.user")}</th><th>{t("ranking.average")}</th><th>{t("ranking.best")}</th><th>{t("ranking.games")}</th><th>{t("adminRanking.last")}</th></tr></thead><tbody>{leaders?.map((leader) => <tr key={leader.id}><td><span className={`rank-number rank-${leader.position}`}>{leader.position === 1 ? <Crown /> : leader.position <= 3 ? <Medal /> : leader.position}</span></td><td><strong>{leader.name}</strong><small>{leader.email}</small></td><td><b className="text-amber-300">{Math.round(leader.averagePercentage)}%</b></td><td>{Math.round(leader.bestPercentage)}%</td><td>{leader.completedGames}</td><td>{formatDate(leader.lastActivity)}</td></tr>)}</tbody></table>{!leaders?.length && <div className="admin-empty">{t("adminRanking.empty")}</div>}</section></div>;
}
