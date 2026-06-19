export default function BookCover({ onStart }) {
    return (
        <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
            <div className="grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">

                <div className="text-center md:text-left">
                    <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
                        Probabilidad y Estadística
                    </p>

                    <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">
                        Libro <span className="text-cyan-300">Interactivo</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                        Explora los temas principales de cada unidad mediante información,
                        fórmulas, ejercicios resueltos y videos explicativos.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
                        <button
                            onClick={onStart}
                            className="shine-btn rounded-2xl bg-cyan-400 px-8 py-4 text-lg font-black text-slate-950 shadow-2xl shadow-cyan-500/30 transition hover:scale-105 hover:bg-cyan-300"
                        >
                            Abrir libro
                        </button>

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-slate-300 backdrop-blur-xl">
                            3 unidades · Fórmulas · Ejercicios · Videos
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="book-scene">
                        <div className="interactive-book">
                            <div className="book-side"></div>

                            <div className="book-front">
                                <div className="book-label">Libro digital</div>

                                <div>
                                    <h2>Probabilidad & Estadística</h2>
                                    <p>Unidades interactivas</p>
                                </div>

                                <div className="book-line"></div>

                                <span>📘</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}