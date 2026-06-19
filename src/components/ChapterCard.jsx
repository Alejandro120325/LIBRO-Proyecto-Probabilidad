export default function BookLayout({ children, onCover, onIndex }) {
    return (
        <div className="relative z-10 min-h-screen">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <button
                        onClick={onCover}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                    >
                        📘 Portada
                    </button>

                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                            Libro interactivo
                        </p>
                        <h2 className="text-sm font-black text-white md:text-lg">
                            Probabilidad y Estadística
                        </h2>
                    </div>

                    <button
                        onClick={onIndex}
                        className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/20"
                    >
                        Índice
                    </button>
                </div>
            </header>

            {children}
        </div>
    );
}