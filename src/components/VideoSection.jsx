import { useState } from "react";

export default function ExerciseBox({ exercise, number }) {
    const [showSolution, setShowSolution] = useState(false);

    return (
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="mb-4 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
          {number}
        </span>

                <div>
                    <h3 className="text-2xl font-black text-white">
                        {exercise.title}
                    </h3>
                    <p className="mt-3 leading-8 text-slate-300">
                        {exercise.statement}
                    </p>
                </div>
            </div>

            <button
                onClick={() => setShowSolution(!showSolution)}
                className="mt-4 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 font-black text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-950"
            >
                {showSolution ? "Ocultar solución" : "Ver solución paso a paso"}
            </button>

            {showSolution && (
                <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
                    <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                        Desarrollo
                    </p>

                    <ol className="space-y-3">
                        {exercise.steps.map((step, index) => (
                            <li key={step} className="flex gap-3 leading-7 text-slate-200">
                <span className="font-black text-emerald-300">
                  {index + 1}.
                </span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>

                    <div className="mt-5 rounded-2xl bg-slate-950/70 p-4">
                        <p className="font-black text-white">Respuesta final:</p>
                        <p className="mt-2 leading-7 text-slate-300">{exercise.answer}</p>
                    </div>
                </div>
            )}
        </article>
    );
}