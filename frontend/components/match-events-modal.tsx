"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Plus } from "lucide-react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import {
  getMatchEvents,
  createMatchEvent,
  deleteMatchEvent,
  updateMatch,
  type Match,
  type MatchEvent,
  type Player,
} from "@/lib/api";

interface Props {
  match: Match;
  players: Player[];
  onClose: () => void;
  onMatchUpdated: (match: Match) => void;
}

export default function MatchEventsModal({ match, players, onClose, onMatchUpdated }: Props) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [scorerId, setScorerId] = useState("");
  const [assisterId, setAssisterId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opponentScore, setOpponentScore] = useState(match.opponentScore);
  const [updatingScore, setUpdatingScore] = useState(false);

  useEffect(() => {
    getMatchEvents(match.id)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [match.id]);

  async function handleAddEvent() {
    if (!scorerId) { setError("Selecione o jogador que marcou."); return; }
    setError(null);
    setSaving(true);
    try {
      const event = await createMatchEvent(match.id, {
        scoreId: scorerId,
        assisterId: assisterId || undefined,
      });
      const newEvents = [...events, event];
      setEvents(newEvents);
      setScorerId("");
      setAssisterId("");
      const updated = await updateMatch(match.id, { teamScore: newEvents.length });
      onMatchUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar gol.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    try {
      await deleteMatchEvent(match.id, eventId);
      const newEvents = events.filter((e) => e.id !== eventId);
      setEvents(newEvents);
      const updated = await updateMatch(match.id, { teamScore: newEvents.length });
      onMatchUpdated(updated);
    } catch {
      setError("Erro ao remover evento.");
    }
  }

  async function handleOpponentScore(delta: number) {
    const next = Math.max(0, opponentScore + delta);
    setOpponentScore(next);
    setUpdatingScore(true);
    try {
      const updated = await updateMatch(match.id, { opponentScore: next });
      onMatchUpdated(updated);
    } finally {
      setUpdatingScore(false);
    }
  }

  const d = new Date(match.date);
  const dateStr = d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
  const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <SportsSoccerIcon className="text-primary" style={{ fontSize: 20 }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Eventos da Partida</h2>
              <p className="text-xs text-gray-500 capitalize">{dateStr} • {timeStr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scoreboard */}
        <div className="flex items-center justify-center gap-4 px-6 py-3 bg-gray-50 border-y border-gray-100 shrink-0">
          <span className="text-sm font-bold text-gray-900 flex-1 text-right truncate">
            {/* team name not available here; show event count */}
            Seu time
          </span>
          <div className="flex items-center gap-2">
            <span className="min-w-10 rounded-lg bg-white border border-gray-200 px-3 py-1 text-center text-xl font-black text-gray-900">
              {events.length}
            </span>
            <span className="text-gray-400 font-light">–</span>
            <span className="min-w-10 rounded-lg bg-white border border-gray-200 px-3 py-1 text-center text-xl font-black text-gray-900">
              {opponentScore}
            </span>
          </div>
          <span className="text-sm font-bold text-gray-900 flex-1 text-left truncate">
            {match.opponentName}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 p-6 overflow-y-auto">

          {/* Gols do seu time */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Gols do seu time
            </h3>

            {loading ? (
              <p className="text-sm text-gray-400">Carregando...</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum gol registrado.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {events.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <SportsSoccerIcon style={{ fontSize: 16 }} className="text-primary shrink-0" />
                      <span className="font-medium text-gray-900">{ev.scorer?.name ?? ev.scorerId}</span>
                      {ev.assister && (
                        <span className="text-gray-400 text-xs">
                          ass. {ev.assister.name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="cursor-pointer rounded p-1 text-gray-300 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add event form */}
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-gray-200 p-3">
              <p className="text-xs font-medium text-gray-500">Registrar gol</p>
              <select
                value={scorerId}
                onChange={(e) => setScorerId(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Quem marcou?</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={assisterId}
                onChange={(e) => setAssisterId(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Assistência (opcional)</option>
                {players
                  .filter((p) => p.id !== scorerId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              <button
                onClick={handleAddEvent}
                disabled={saving}
                className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {saving ? "Salvando..." : "Adicionar Gol"}
              </button>
            </div>
          </div>

          {/* Gols adversário */}
          <div className="flex flex-col items-center">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Gols do adversário
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpponentScore(-1)}
                disabled={updatingScore || opponentScore === 0}
                className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-10 rounded-lg border border-gray-200 px-4 py-1.5 text-center text-lg font-black text-gray-900">
                {opponentScore}
              </span>
              <button
                onClick={() => handleOpponentScore(1)}
                disabled={updatingScore}
                className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
