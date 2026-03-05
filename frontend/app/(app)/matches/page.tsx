"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import { getTeams, getMatches, type Team, type Match } from "@/lib/api";
import AddMatchModal from "@/components/add-match-modal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Result = "upcoming" | "win" | "loss" | "draw";

function matchResult(match: Match): Result {
  if (new Date(match.date) > new Date()) return "upcoming";
  if (match.teamScore > match.opponentScore) return "win";
  if (match.teamScore < match.opponentScore) return "loss";
  return "draw";
}

const resultConfig: Record<Result, { label: string; cls: string }> = {
  upcoming: { label: "A jogar",  cls: "bg-blue-50 text-blue-600"       },
  win:      { label: "Vitória",  cls: "bg-emerald-50 text-emerald-600" },
  loss:     { label: "Derrota",  cls: "bg-red-50 text-red-600"         },
  draw:     { label: "Empate",   cls: "bg-yellow-50 text-yellow-700"   },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MatchCard({ match, teamName }: { match: Match; teamName: string }) {
  const result = matchResult(match);
  const d = new Date(match.date);
  const dateStr = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
  const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const { label, cls } = resultConfig[result];

  return (
    <div className="w-[70%] rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm transition hover:border-primary/30 hover:shadow-md cursor-pointer">
      {/* Date row */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs capitalize text-gray-400">{dateStr} • {timeStr}</span>
        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
      </div>

      {/* Match row: Team — Score — Opponent */}
      <div className="flex items-center justify-center gap-4">
        <span className="w-36 text-right text-sm font-bold text-gray-900">{teamName}</span>

        <div className="flex items-center gap-3">
          {result !== "upcoming" ? (
            <>
              <span className="min-w-8 rounded-lg bg-gray-100 px-3 py-1 text-center text-xl font-black text-gray-900">
                {match.teamScore}
              </span>
              <span className="text-sm font-light text-gray-400">–</span>
              <span className="min-w-8 rounded-lg bg-gray-100 px-3 py-1 text-center text-xl font-black text-gray-900">
                {match.opponentScore}
              </span>
            </>
          ) : (
            <span className="text-sm font-light text-gray-400">vs</span>
          )}
        </div>

        <span className="w-36 text-left text-sm font-bold text-gray-900">{match.opponentName}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  const [team, setTeam] = useState<Team | null>({ id: "t1", name: "Meu Time", primaryColor: "#000", secondaryColor: "#fff", createdAt: "", updatedAt: "" });
  const [matches, setMatches] = useState<Match[]>([
    { id: "1", teamId: "t1", opponentName: "Flamengo FC",  teamScore: 0, opponentScore: 0, date: "2026-03-08T15:00:00Z", createdAt: "", updatedAt: "" },
    { id: "2", teamId: "t1", opponentName: "Santos United",teamScore: 0, opponentScore: 0, date: "2026-03-15T16:00:00Z", createdAt: "", updatedAt: "" },
    { id: "3", teamId: "t1", opponentName: "Vasco SC",     teamScore: 0, opponentScore: 0, date: "2026-03-22T14:00:00Z", createdAt: "", updatedAt: "" },
    { id: "4", teamId: "t1", opponentName: "Palmeiras CF", teamScore: 3, opponentScore: 1, date: "2026-02-22T15:00:00Z", createdAt: "", updatedAt: "" },
    { id: "5", teamId: "t1", opponentName: "Grêmio EC",    teamScore: 1, opponentScore: 1, date: "2026-02-15T16:00:00Z", createdAt: "", updatedAt: "" },
    { id: "6", teamId: "t1", opponentName: "Botafogo AC",  teamScore: 0, opponentScore: 2, date: "2026-02-08T14:00:00Z", createdAt: "", updatedAt: "" },
  ]);
  const [addOpen, setAddOpen] = useState(false);

  const today = new Date();

  useEffect(() => {
    getTeams()
      .then((teams) => {
        const t = teams[0] ?? null;
        setTeam(t);
        if (t) return getMatches(t.id);
        return [] as Match[];
      })
      .then(setMatches)
      .catch(() => {});
  }, []);

  const upcoming = matches
    .filter((m) => new Date(m.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = matches
    .filter((m) => new Date(m.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function handleMatchAdded(match: Match) {
    setMatches((prev) => [...prev, match]);
    setAddOpen(false);
  }

  return (
    <>
      {addOpen && team && (
        <AddMatchModal
          teamId={team.id}
          onAdded={handleMatchAdded}
          onClose={() => setAddOpen(false)}
        />
      )}

      <div className="flex h-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partidas</h1>
            <p className="mt-1 text-gray-500">Histórico e próximos jogos</p>
          </div>
          {team && (
            <button
              onClick={() => setAddOpen(true)}
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Agendar Partida
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Upcoming */}
          <section>
            <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
              Próximos Jogos
            </h2>
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 py-10 text-center">
                <Calendar className="h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-400">Nenhuma partida agendada</p>
                {team && (
                  <button
                    onClick={() => setAddOpen(true)}
                    className="cursor-pointer text-xs text-primary underline underline-offset-2 transition hover:text-primary/80"
                  >
                    Agendar agora
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                {upcoming.map((m) => <MatchCard key={m.id} match={m} teamName={team?.name ?? "Meu Time"} />)}
              </div>
            )}
          </section>

          {/* Past */}
          <section>
            <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
              Partidas Recentes
            </h2>
            {past.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 py-10">
                <p className="text-sm text-gray-400">Nenhuma partida registrada ainda</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                {past.map((m) => <MatchCard key={m.id} match={m} teamName={team?.name ?? "Meu Time"} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
