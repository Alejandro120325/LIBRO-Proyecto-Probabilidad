export default function ChapterCard({ chapter, index, completed, onOpen }) {
    return (
        <button
            onClick={onOpen}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 text-left shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/50 hover:bg-white/15"
        >
            <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${chapter.color}`} />

            <div className="mb-6 flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-200">
          {chapter.unit}
        </span>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-cyan-200">
          {completed ? "Completado" : `Cap. ${index + 1}`}
        </span>
            </div>

            <div className="mb-6 text-5xl">
                {index === 0 && "🧠"}
                {index === 1 && "📊"}
                {index === 2 && "🎲"}
            </div>

            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                {chapter.badge}
            </p>

            <h3 className="text-2xl font-black text-white">
                {chapter.title}
            </h3>

            <p className="mt-3 leading-7 text-slate-300">
                {chapter.subtitle}
            </p>

            <div className="mt-8 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-300">
          Abrir capítulo
        </span>

                <span className="rounded-full bg-cyan-400 px-4 py-2 font-black text-slate-950 transition group-hover:translate-x-1">
          →
        </span>
            </div>
        </button>
    );
}