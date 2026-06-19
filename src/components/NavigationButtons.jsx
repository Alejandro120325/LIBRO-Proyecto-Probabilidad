export default function NavigationButtons({
                                              currentIndex,
                                              total,
                                              onPrevious,
                                              onNext,
                                              onIndex,
                                          }) {
    const isLast = currentIndex === total - 1;

    return (
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
                onClick={onPrevious}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-slate-200 transition hover:bg-white/10"
            >
                ← Anterior
            </button>

            <button
                onClick={onIndex}
                className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-6 py-4 font-black text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-950"
            >
                Volver al índice
            </button>

            <button
                onClick={onNext}
                className="rounded-2xl bg-cyan-400 px-6 py-4 font-black text-slate-950 transition hover:scale-[1.03] hover:bg-cyan-300"
            >
                {isLast ? "Finalizar unidad →" : "Siguiente →"}
            </button>
        </div>
    );
}