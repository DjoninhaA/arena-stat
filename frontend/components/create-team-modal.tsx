"use client";

import { useState, useRef } from "react";
import { Shield, Upload, X } from "lucide-react";
import { createTeam, type Team } from "@/lib/api";

interface Props {
  onCreated: (team: Team) => void;
}

export default function CreateTeamModal({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1d4ed8");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const team = await createTeam({
        name: name.trim(),
        primaryColor,
        secondaryColor,
        logo: logoFile ?? undefined,
      });
      onCreated(team);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar time.");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">

        {/* Ícone + título */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Crie seu time</h2>
          <p className="text-sm text-gray-500">
            Nenhum time foi encontrado. Configure seu time para começar.
          </p>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary underline-offset-2 hover:underline"
              >
                {logoPreview ? "Trocar logo" : "Adicionar logo"}
              </button>
              {logoPreview && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="flex items-center gap-0.5 text-xs text-red-500 underline-offset-2 hover:underline"
                >
                  <X className="h-3 w-3" />
                  Remover
                </button>
              )}
            </div>
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
              placeholder="Ex: Udinese Fut7"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                <span className="text-xs text-gray-500 font-mono">{primaryColor}</span>
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
                <span className="text-xs text-gray-500 font-mono">{secondaryColor}</span>
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

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar time"}
          </button>
        </form>
      </div>
    </div>
  );
}
