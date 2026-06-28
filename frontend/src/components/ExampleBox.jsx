import { CheckCircle2 } from "lucide-react";

export default function ExampleBox({ example }) {
  return (
    <div className="example-box">
      <p className="book-label">Ejemplo resuelto</p>
      <h3 className="mt-1 font-serif text-xl font-bold text-slate-900">{example.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{example.description}</p>
      {example.data && <div className="my-3 flex flex-wrap gap-2">{example.data.map((value, index) => <span key={`${value}-${index}`} className="data-chip">{value}</span>)}</div>}
      {example.distribution && (
        <div className="my-4 flex h-28 items-end gap-3 border-b border-slate-300 px-2">
          {example.distribution.map((item) => <div key={item.value} className="flex flex-1 flex-col items-center gap-1"><span className="text-[10px] font-bold text-violet-700">{item.probability}%</span><div className="w-full max-w-14 rounded-t bg-violet-500" style={{ height: `${item.probability * 1.3}px` }} /><span className="text-[10px] text-slate-500">{item.value}</span></div>)}
        </div>
      )}
      <ol className="mt-4 space-y-2">{example.steps.map((step, index) => <li key={step} className="flex gap-2 text-xs leading-5 text-slate-700"><span className="step-number">{index + 1}</span><span>{step}</span></li>)}</ol>
      <div className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold leading-5 text-emerald-900"><CheckCircle2 className="mt-0.5 size-4 shrink-0" />{example.result}</div>
    </div>
  );
}
