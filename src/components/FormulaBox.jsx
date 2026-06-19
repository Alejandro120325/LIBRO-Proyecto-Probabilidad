export default function FormulaBox({ formula }) {
    return (
        <article className="rounded-3xl border border-cyan-300/20 bg-slate-950/60 p-6 shadow-xl shadow-cyan-950/20">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                {formula.name}
            </p>

            <div className="mb-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-5">
                <code className="text-xl font-black text-white md:text-2xl">
                    {formula.expression}
                </code>
            </div>

            <p className="leading-7 text-slate-300">
                {formula.description}
            </p>
        </article>
    );
}