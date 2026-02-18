"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  Target,
  Handshake,
  Pencil,
  ChevronDown,
} from "lucide-react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import DashboardCharts from "./charts";

// ─── Mock data ────────────────────────────────────────────────────────────────

const seasons = ["2024", "2023", "2022"];
const competitions = ["Todas", "Campeonato Estadual", "Copa Regional", "Liga Municipal"];

const stats = [
  { label: "Jogadores",      value: 11,    icon: Users,            change: 0,   color: "bg-blue-50 text-blue-600"        },
  { label: "Gols Marcados",  value: 42,    icon: SportsSoccerIcon, change: 12,  color: "bg-green-50 text-green-600"     },
  { label: "Assistências",   value: 37,    icon: Handshake,        change: 8,   color: "bg-purple-50 text-purple-600"   },
  { label: "Vitórias",       value: 7,     icon: Trophy,           change: 16,  color: "bg-yellow-50 text-yellow-600"   },
  { label: "Derrotas",       value: 3,     icon: Target,           change: -5,  color: "bg-red-50 text-red-600"         },
  { label: "Aproveitamento", value: "70%", icon: TrendingUp,       change: 4,   color: "bg-emerald-50 text-emerald-600" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Select({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-9 text-sm text-gray-700 shadow-sm transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const isPositive = stat.change >= 0;
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-2 ${stat.color}`}>
          <stat.icon className="h-5 w-5" />
        </div>
        {stat.change !== 0 && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {isPositive ? "+" : ""}{stat.change}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [season, setSeason] = useState("2024");
  const [competition, setCompetition] = useState("Todas");

  return (
    <div className="flex flex-col gap-6 overflow-y-auto pt-6 pb-4">

      {/* Header do time */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md" />
            <Image
              src="/logo-udinese.png"
              alt="Escudo do time"
              width={72}
              height={72}
              className="relative rounded-full ring-2 ring-primary/20"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Udinese Fut7</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                Temporada {season}
              </span>
              <span className="text-xs text-gray-400">Arena-Stat</span>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 active:scale-95">
          <Pencil className="h-4 w-4" />
          Editar Time
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500">Filtrar por:</span>
        <Select options={seasons} value={season} onChange={setSeason} />
        <Select options={competitions} value={competition} onChange={setCompetition} />
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>

      {/* Gráficos */}
      <DashboardCharts />

    </div>
  );
}
