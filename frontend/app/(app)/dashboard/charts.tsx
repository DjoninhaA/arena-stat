"use client";

// ─── Data ─────────────────────────────────────────────────────────────────────

const goalsPerRound = [
  { rodada: "R1",  marcados: 3, sofridos: 1 },
  { rodada: "R2",  marcados: 1, sofridos: 2 },
  { rodada: "R3",  marcados: 4, sofridos: 0 },
  { rodada: "R4",  marcados: 2, sofridos: 2 },
  { rodada: "R5",  marcados: 5, sofridos: 1 },
  { rodada: "R6",  marcados: 3, sofridos: 3 },
  { rodada: "R7",  marcados: 6, sofridos: 1 },
  { rodada: "R8",  marcados: 4, sofridos: 2 },
  { rodada: "R9",  marcados: 7, sofridos: 0 },
  { rodada: "R10", marcados: 7, sofridos: 1 },
];

const topScorers = [
  { nome: "Pedro H.",    gols: 12 },
  { nome: "G. Souza",   gols: 8  },
  { nome: "D. Ferreira",gols: 6  },
  { nome: "T. Rocha",   gols: 5  },
  { nome: "A. Lima",    gols: 3  },
];

const resultsData = [
  { name: "Vitórias", value: 7, color: "#22c55e" },
  { name: "Empates",  value: 2, color: "#facc15" },
  { name: "Derrotas", value: 3, color: "#ef4444" },
];

// ─── Shared ───────────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

// ─── Bar chart ────────────────────────────────────────────────────────────────

function GoalsBarChart() {
  const max = Math.max(...goalsPerRound.flatMap(d => [d.marcados, d.sofridos]));
  const maxH = 110;
  return (
    <div>
      <div className="flex h-28 items-end gap-1">
        {goalsPerRound.map(d => (
          <div key={d.rodada} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-end justify-center gap-px">
              <div
                className="flex-1 rounded-t-sm bg-green-500 transition-all duration-700"
                style={{ height: `${(d.marcados / max) * maxH}px` }}
              />
              <div
                className="flex-1 rounded-t-sm bg-red-400 transition-all duration-700"
                style={{ height: `${(d.sofridos / max) * maxH}px` }}
              />
            </div>
            <span className="mt-1 text-[9px] text-gray-400">{d.rodada}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-3 rounded-sm bg-green-500" />
          <span className="text-xs text-gray-500">Marcados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-3 rounded-sm bg-red-400" />
          <span className="text-xs text-gray-500">Sofridos</span>
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal bar chart ─────────────────────────────────────────────────────

function ScorersChart() {
  const max = topScorers[0].gols;
  return (
    <div className="flex flex-col gap-3 py-1">
      {topScorers.map(d => (
        <div key={d.nome} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-right text-xs text-gray-600">{d.nome}</span>
          <div className="flex-1 rounded-full bg-gray-100">
            <div
              className="h-2.5 rounded-full bg-indigo-500 transition-all duration-700"
              style={{ width: `${(d.gols / max) * 100}%` }}
            />
          </div>
          <span className="w-5 shrink-0 text-right text-xs font-semibold text-gray-700">{d.gols}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut chart (CSS conic-gradient) ─────────────────────────────────────────

function DonutChart() {
  const total = resultsData.reduce((s, d) => s + d.value, 0);
  const gradient = resultsData.map((d, i, arr) => {
    const start = arr.slice(0, i).reduce((s, x) => s + (x.value / total) * 100, 0);
    const end = start + (d.value / total) * 100;
    return `${d.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
  }).join(", ");

  return (
    <div className="flex flex-col items-center gap-4 pt-1">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div
          className="h-full w-full rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="absolute flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white shadow-inner">
          <span className="text-base font-bold text-gray-800">70%</span>
          <span className="text-[10px] text-gray-400">aproveit.</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {resultsData.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-500">
              {d.name} <span className="font-medium text-gray-700">{d.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SVG line chart ───────────────────────────────────────────────────────────

function LineChartSVG() {
  const W = 1200, H = 80;
  const padX = 30, padTop = 8, padBottom = 22;
  const chartW = W - padX * 2;
  const chartH = H - padTop - padBottom;
  const max = Math.max(...goalsPerRound.flatMap(d => [d.marcados, d.sofridos]));
  const n = goalsPerRound.length;

  const px = (i: number) => padX + (i / (n - 1)) * chartW;
  const py = (v: number) => padTop + chartH - (v / max) * chartH;

  const mPts = goalsPerRound.map((d, i) => `${px(i)},${py(d.marcados)}`).join(" ");
  const sPts = goalsPerRound.map((d, i) => `${px(i)},${py(d.sofridos)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-24">
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1={padX} y1={padTop + chartH * (1 - t)} x2={W - padX} y2={padTop + chartH * (1 - t)} stroke="#f3f4f6" strokeWidth="1" />
      ))}
      <polyline points={mPts} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={sPts} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 4" />
      {goalsPerRound.map((d, i) => (
        <g key={i}>
          <circle cx={px(i)} cy={py(d.marcados)} r="5" fill="#22c55e" />
          <circle cx={px(i)} cy={py(d.sofridos)} r="5" fill="#ef4444" />
          <text x={px(i)} y={H - 3} textAnchor="middle" fontSize="11" fill="#9ca3af">{d.rodada}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function DashboardCharts() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Gols Marcados vs Sofridos">
          <GoalsBarChart />
        </ChartCard>
        <ChartCard title="Top Artilheiros">
          <ScorersChart />
        </ChartCard>
        <ChartCard title="Distribuição de Resultados">
          <DonutChart />
        </ChartCard>
      </div>

      <ChartCard title="Evolução de Gols na Temporada">
        <div className="mb-3 flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 rounded bg-green-500" />
            <span className="text-xs text-gray-500">Marcados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-6 rounded border-t-2 border-dashed border-red-400" />
            <span className="text-xs text-gray-500">Sofridos</span>
          </div>
        </div>
        <LineChartSVG />
      </ChartCard>
    </>
  );
}
