"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";
import { createMatch, type Match } from "@/lib/api";

interface Props {
  teamId: string;
  onAdded: (match: Match) => void;
  onClose: () => void;
}

export default function AddMatchModal({ teamId, onAdded, onClose }: Props) {
  const [opponent, setOpponent] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opponent.trim()) { setError("O nome do adversário é obrigatório."); return; }
    if (!date) { setError("A data é obrigatória."); return; }
    setError(null);
    setLoading(true);
    try {
      const match = await createMatch({ teamId, opponentName: opponent.trim(), date: new Date(date).toISOString() });
      onAdded(match);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao agendar partida.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">

        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Agendar Partida</h2>
              <p className="text-xs text-gray-500">Preencha os dados da partida</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Adversário</label>
            <input
              type="text"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Ex: Flamengo FC"
              autoFocus
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Data e Hora</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
