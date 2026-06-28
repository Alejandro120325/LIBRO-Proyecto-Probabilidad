import { Crown, Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Alert from "../../components/Alert.jsx";
import Loading from "../../components/Loading.jsx";
import { adminService } from "../../services/adminService.js";
import { getApiErrorMessage } from "../../services/api.js";
import { formatDate } from "../../utils/format.js";

export default function AdminLeaderboardPage() {
  const [leaders, setLeaders] = useState(null); const [error, setError] = useState("");
  useEffect(() => { adminService.getAdminLeaderboard().then(({ leaderboard }) => setLeaders(leaderboard)).catch((err) => setError(getApiErrorMessage(err))); }, []);
  if (!leaders && !error) return <Loading label="Ordenando el ranking" />;
  return <div className="page-enter space-y-6"><header className="admin-page-header"><div><p>Clasificación global</p><h1>Ranking administrativo</h1><span>Rendimiento completo con identidad y última actividad.</span></div><Trophy /></header>{error && <Alert>{error}</Alert>}<section className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Puesto</th><th>Usuario</th><th>Promedio</th><th>Mejor puntaje</th><th>Juegos</th><th>Última actividad</th></tr></thead><tbody>{leaders?.map((leader) => <tr key={leader.id}><td><span className={`rank-number rank-${leader.position}`}>{leader.position === 1 ? <Crown /> : leader.position <= 3 ? <Medal /> : leader.position}</span></td><td><strong>{leader.name}</strong><small>{leader.email}</small></td><td><b className="text-amber-300">{Math.round(leader.averagePercentage)}%</b></td><td>{Math.round(leader.bestPercentage)}%</td><td>{leader.completedGames}</td><td>{formatDate(leader.lastActivity)}</td></tr>)}</tbody></table>{!leaders?.length && <div className="admin-empty">El ranking todavía no tiene participantes.</div>}</section></div>;
}
