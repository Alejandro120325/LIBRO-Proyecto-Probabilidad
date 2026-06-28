export default function AdminStatCard({ label, value, detail, icon: Icon, tone = "gold" }) {
  return (
    <article className={`admin-stat admin-stat-${tone}`}>
      <span><Icon /></span>
      <div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div>
    </article>
  );
}
