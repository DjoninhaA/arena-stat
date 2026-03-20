"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import { getTeams, getMatches, type Team, type Match, type Player } from "@/lib/api";
import AddMatchModal from "@/components/add-match-modal";
import MatchEventsModal from "@/components/match-events-modal";

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

function MatchCard({ match, teamName, onClick }: { match: Match; teamName: string; onClick: () => void }) {
  const result = matchResult(match);
  const d = new Date(match.date);
  const dateStr = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
  const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const { label, cls } = resultConfig[result];

  return (
    <div onClick={onClick} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:border-primary/30 hover:shadow-md cursor-pointer sm:px-6">
      {/* Date row */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs capitalize text-gray-400">{dateStr} • {timeStr}</span>
        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
      </div>

      {/* Match row: Team — Score — Opponent */}
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <span className="flex-1 truncate text-right text-sm font-bold text-gray-900">{teamName}</span>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {result !== "upcoming" ? (
            <>
              <span className="min-w-8 rounded-lg bg-gray-100 px-2 py-1 text-center text-lg font-black text-gray-900 sm:px-3 sm:text-xl">
                {match.teamScore}
              </span>
              <span className="text-sm font-light text-gray-400">–</span>
              <span className="min-w-8 rounded-lg bg-gray-100 px-2 py-1 text-center text-lg font-black text-gray-900 sm:px-3 sm:text-xl">
                {match.opponentScore}
              </span>
            </>
          ) : (
            <span className="text-sm font-light text-gray-400">vs</span>
          )}
        </div>

        <span className="flex-1 truncate text-left text-sm font-bold text-gray-900">{match.opponentName}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  const [team, setTeam] = useState<Team | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const today = new Date();

  useEffect(() => {
    getTeams()
      .then((teams) => {
        const t = teams[0] ?? null;
        setTeam(t);
        if (t) {
          setPlayers(t.players ?? []);
          return getMatches(t.id);
        }
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

  function handleMatchUpdated(updated: Match) {
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setSelectedMatch(updated);
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

      {selectedMatch && (
        <MatchEventsModal
          match={selectedMatch}
          players={players}
          onClose={() => setSelectedMatch(null)}
          onMatchUpdated={handleMatchUpdated}
        />
      )}

      <div className="flex h-full flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partidas</h1>
            <p className="mt-1 text-sm text-gray-500">Histórico e próximos jogos</p>
          </div>
          {team && (
            <button
              onClick={() => setAddOpen(true)}
              className="cursor-pointer flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95 sm:px-4"
            >
              <Plus className="h-4 w-4" />
              <span>Agendar Partida</span>
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
                {upcoming.map((m) => <MatchCard key={m.id} match={m} teamName={team?.name ?? "Meu Time"} onClick={() => setSelectedMatch(m)} />)}
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
                {past.map((m) => <MatchCard key={m.id} match={m} teamName={team?.name ?? "Meu Time"} onClick={() => setSelectedMatch(m)} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
