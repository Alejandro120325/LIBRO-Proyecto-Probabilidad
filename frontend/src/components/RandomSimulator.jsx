import { Dices, RotateCw } from "lucide-react";
import { useState } from "react";

export default function RandomSimulator() {
  const [lastRoll, setLastRoll] = useState(null);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);

  const roll = () => {
    const value = Math.floor(Math.random() * 6) + 1;
    setLastRoll(value);
    setCounts((current) => current.map((count, index) => count + (index === value - 1 ? 1 : 0)));
  };

  const max = Math.max(1, ...counts);
  return (
    <div className="simulator">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-violet-300">Mini simulador</p><h3 className="mt-1 font-bold text-white">Lanza un dado virtual</h3></div>
        <button onClick={roll} className="button button-outline button-sm"><RotateCw className="size-4" /> Lanzar</button>
      </div>
      <div className="mt-5 grid grid-cols-[72px_1fr] items-end gap-5">
        <div className="grid aspect-square place-items-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-3xl font-black text-violet-200 shadow-inner">
          {lastRoll ?? <Dices className="size-8" />}
        </div>
        <div className="flex h-16 items-end gap-2 border-b border-white/10">
          {counts.map((count, index) => <div key={index} className="flex flex-1 flex-col items-center"><div className="w-full rounded-t bg-gradient-to-t from-violet-600 to-cyan-300 transition-all" style={{ height: `${Math.max(3, (count / max) * 48)}px` }} /><span className="mt-1 text-[9px] text-slate-500">{index + 1}</span></div>)}
        </div>
      </div>
    </div>
  );
}
