export default function ProgressCard({ label, value, detail, color = "cyan", icon: Icon }) {
  const colors = {
    cyan: "from-cyan-300 to-blue-500 shadow-cyan-500/20",
    emerald: "from-emerald-300 to-teal-500 shadow-emerald-500/20",
    violet: "from-violet-300 to-fuchsia-500 shadow-violet-500/20",
  };

  return (
    <article className="glass-card flex items-center gap-4 p-5">
      <div className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${colors[color]} text-[#050816] shadow-lg`}>
        <Icon className="size-5" strokeWidth={2.4} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-white">{value}</p>
        <p className="mt-1 truncate text-xs text-slate-400">{detail}</p>
      </div>
    </article>
  );
}
