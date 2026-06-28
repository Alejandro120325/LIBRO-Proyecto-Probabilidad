import { Play, Video } from "lucide-react";

export default function VideoBox({ title }) {
  return (
    <div className="video-box">
      <div className="grid size-10 place-items-center rounded-xl bg-slate-900 text-white"><Play className="ml-0.5 size-4 fill-white" /></div>
      <div><p className="text-xs font-bold text-slate-800">{title}</p><p className="mt-1 text-[11px] text-slate-500"><Video className="mr-1 inline size-3" />Espacio listo para agregar un enlace embed de YouTube.</p></div>
    </div>
  );
}
