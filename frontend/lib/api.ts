const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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
  number?: number;
  position: Position;
  teamId: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  // ⚠️ Campos pendentes (calculados via MatchEvent):
  // goals?: number;
  // assists?: number;
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

export interface Match {
  id: string;
  teamId: string;
  opponentName: string;
  teamScore: number;
  opponentScore: number;
  date: string;
  createdAt: string;
  updatedAt: string;
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

export async function createPlayer(data: {
  name: string;
  number?: number;
  position: Position;
  teamId: string;
}): Promise<Player> {
  const res = await fetch(`${API_URL}/player`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Falha ao adicionar jogador");
  }
  return res.json();
}

export async function updateTeam(
  id: string,
  data: { name?: string; primaryColor?: string; secondaryColor?: string; logo?: File }
): Promise<Team> {
  const form = new FormData();
  if (data.name) form.append("name", data.name);
  if (data.primaryColor) form.append("primaryColor", data.primaryColor);
  if (data.secondaryColor) form.append("secondaryColor", data.secondaryColor);
  if (data.logo) form.append("logo", data.logo);

  const res = await fetch(`${API_URL}/team/${id}`, { method: "PUT", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Falha ao atualizar time");
  }
  return res.json();
}

export async function getMatches(teamId: string): Promise<Match[]> {
  const res = await fetch(`${API_URL}/match/team/${teamId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar partidas");
  return res.json();
}

export async function createMatch(data: {
  teamId: string;
  opponentName: string;
  date: string;
}): Promise<Match> {
  const res = await fetch(`${API_URL}/match`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Falha ao agendar partida");
  }
  return res.json();
}

export async function createTeam(data: {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: File;
}): Promise<Team> {
  const form = new FormData();
  form.append("name", data.name);
  form.append("primaryColor", data.primaryColor);
  form.append("secondaryColor", data.secondaryColor);
  if (data.logo) form.append("logo", data.logo);

  const res = await fetch(`${API_URL}/team`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Falha ao criar time");
  }
  return res.json();
}
