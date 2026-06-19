export default function ProgressBar({ completedCount, total }) {
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return (
        <div className="mx-auto max-w-7xl px-4 pt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-300">
                    <span>Progreso del libro</span>
                    <span>{completedCount}/{total} unidades · {percentage}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-500 transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}