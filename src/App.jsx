import { useState } from "react";
import BookCover from "./components/BookCover";

export default function App() {
    const [screen, setScreen] = useState("cover");

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="aurora-bg"></div>

            {screen === "cover" && (
                <BookCover onStart={() => setScreen("index")} />
            )}

            {screen === "index" && (
                <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
                    <div className="max-w-5xl text-center">
                        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
                            Índice interactivo
                        </p>

                        <h1 className="text-5xl font-black text-white">
                            Capítulos del libro
                        </h1>

                        <p className="mt-4 text-lg text-slate-300">
                            Si estás viendo esto, React ya funciona correctamente.
                        </p>

                        <div className="mt-10 grid gap-6 md:grid-cols-3">
                            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                <div className="mb-4 text-5xl">🧠</div>
                                <p className="text-sm font-black uppercase tracking-widest text-cyan-300">
                                    Unidad 1
                                </p>
                                <h2 className="mt-2 text-2xl font-black">
                                    Regla de Bayes
                                </h2>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                <div className="mb-4 text-5xl">📊</div>
                                <p className="text-sm font-black uppercase tracking-widest text-emerald-300">
                                    Unidad 2
                                </p>
                                <h2 className="mt-2 text-2xl font-black">
                                    Media, mediana y moda
                                </h2>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                                <div className="mb-4 text-5xl">🎲</div>
                                <p className="text-sm font-black uppercase tracking-widest text-violet-300">
                                    Unidad 3
                                </p>
                                <h2 className="mt-2 text-2xl font-black">
                                    Variables aleatorias
                                </h2>
                            </div>
                        </div>

                        <button
                            onClick={() => setScreen("cover")}
                            className="mt-10 rounded-2xl bg-cyan-400 px-8 py-4 font-black text-slate-950 transition hover:scale-105 hover:bg-cyan-300"
                        >
                            Volver a la portada
                        </button>
                    </div>
                </section>
            )}
        </main>
    );
}