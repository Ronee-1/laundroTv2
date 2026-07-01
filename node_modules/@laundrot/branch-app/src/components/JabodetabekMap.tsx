interface MapPin {
  id_cabang: string;
  nama_cabang: string;
  latitude: number;
  longitude: number;
  pin_color: 'green' | 'yellow' | 'red';
}

interface JabodetabekMapProps {
  branches: MapPin[];
}

const MAP_COORDS: Record<string, { x: number; y: number }> = {
  'CBG-001': { x: 45, y: 70 },
  'CBG-002': { x: 40, y: 45 },
  'CBG-003': { x: 70, y: 50 },
  'CBG-004': { x: 20, y: 40 },
  'CBG-005': { x: 48, y: 90 },
};

export function JabodetabekMap({ branches }: JabodetabekMapProps) {
  const greenCount = branches.filter((b) => b.pin_color === 'green').length;
  const yellowCount = branches.filter((b) => b.pin_color === 'yellow').length;
  const redCount = branches.filter((b) => b.pin_color === 'red').length;

  return (
    <div className="bg-white rounded-4xl border border-slate-100 shadow-card p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Peta Interaktif Jabodetabek</h3>
          <p className="text-xs text-slate-400 mt-1">Status operasional cabang berdasarkan budget & inventaris</p>
        </div>
        <div className="flex gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Aman ({greenCount})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Peringatan ({yellowCount})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Kritis ({redCount})</span>
        </div>
      </div>

      <div className="relative bg-slate-50/80 border border-slate-200/60 rounded-[20px] h-80 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <span className="text-slate-900 font-black text-4xl tracking-[0.3em] uppercase">JABODETABEK</span>
        </div>

        {branches.map((branch) => {
          const coord = MAP_COORDS[branch.id_cabang] ?? { x: 50, y: 50 };
          const colorMap: Record<string, { bg: string; ring: string }> = {
            green: { bg: 'bg-emerald-500', ring: 'ring-emerald-200' },
            yellow: { bg: 'bg-amber-500', ring: 'ring-amber-200' },
            red: { bg: 'bg-rose-500', ring: 'ring-rose-200' },
          };
          const c = colorMap[branch.pin_color] ?? colorMap['green']!;

          return (
            <div key={branch.id_cabang} className="absolute -translate-x-1/2 -translate-y-1/2 group z-10" style={{ left: `${coord.x}%`, top: `${coord.y}%` }}>
              <div className={`w-6 h-6 rounded-full ${c.bg} ring-4 ${c.ring} flex items-center justify-center text-white font-bold text-[9px] shadow-lg cursor-pointer hover:scale-125 transition-transform duration-300`}>
                {branch.id_cabang.replace('CBG-00', '')}
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-44 bg-white border border-slate-200 p-3 rounded-xl shadow-elevated opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none z-20">
                <p className="text-[11px] font-bold text-[#0F172A]">{branch.nama_cabang}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{branch.id_cabang}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-400 text-center">Hover pada penanda untuk melihat detail cabang</p>
    </div>
  );
}
