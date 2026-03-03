"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { updateTeam, teamLogoUrl, type Team } from "@/lib/api";

interface Props {
  team: Team;
  onUpdated: (team: Team) => void;
  onClose: () => void;
}

export default function EditTeamModal({ team, onUpdated, onClose }: Props) {
  const [name, setName] = useState(team.name);
  const [primaryColor, setPrimaryColor] = useState(team.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(team.secondaryColor);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    teamLogoUrl(team.logo)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome do time é obrigatório.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const updated = await updateTeam(team.id, {
        name: name.trim(),
        primaryColor,
        secondaryColor,
        logo: logoFile ?? undefined,
      });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar time.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">

        {/* Título + fechar */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Editar Time</h2>
            <p className="mt-0.5 text-sm text-gray-500">Atualize as informações do seu time.</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-primary/50 hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer text-xs text-primary underline-offset-2 hover:underline"
            >
              {logoPreview ? "Trocar logo" : "Adicionar logo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nome do time</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Cores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Cor principal</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-6 w-6 cursor-pointer rounded border-none bg-transparent p-0"
                />
                <span className="text-xs font-mono text-gray-500">{primaryColor}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Cor secundária</label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-6 w-6 cursor-pointer rounded border-none bg-transparent p-0"
                />
                <span className="text-xs font-mono text-gray-500">{secondaryColor}</span>
              </div>
            </div>
          </div>

          {/* Preview das cores */}
          <div
            className="h-2 w-full rounded-full"
            style={{
              background: `linear-gradient(to right, ${primaryColor} 50%, ${secondaryColor} 50%)`,
            }}
          />

          {/* Erro */}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {/* Ações */}
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
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
