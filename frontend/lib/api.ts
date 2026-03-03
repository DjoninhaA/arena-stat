const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Position =
  | "GOALKEEPER"
  | "CENTER_BACK"
  | "RIGHT_BACK"
  | "LEFT_BACK"
  | "DEFENSIVE_MIDFIELDER"
  | "MIDFIELDER"
  | "STRIKER";

export const positionLabel: Record<Position, string> = {
  GOALKEEPER: "Goleiro",
  CENTER_BACK: "Zagueiro",
  RIGHT_BACK: "Lateral Direito",
  LEFT_BACK: "Lateral Esquerdo",
  DEFENSIVE_MIDFIELDER: "Volante",
  MIDFIELDER: "Meia",
  STRIKER: "Centroavante",
};

export interface Player {
  id: string;
  name: string;
  position: Position;
  teamId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  // ⚠️ Campos ainda não existem no backend:
  // number?: number;   (camisa)
  // goals?: number;    (gols)
  // assists?: number;  (assistências)
}

export interface Team {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  players?: Player[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function teamLogoUrl(logo?: string): string | null {
  if (!logo) return null;
  return `${API_URL}/uploads/logos/${logo}`;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${API_URL}/team`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar times");
  return res.json();
}

export async function getTeamById(id: string): Promise<Team> {
  const res = await fetch(`${API_URL}/team/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar time");
  return res.json();
}

export async function getPlayers(): Promise<Player[]> {
  const res = await fetch(`${API_URL}/player`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar jogadores");
  return res.json();
}
