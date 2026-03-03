"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Users, Trophy, UserPlus } from "lucide-react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { getTeams, teamLogoUrl, positionLabel, type Team, type Player } from "@/lib/api";
import AddPlayerModal from "@/components/add-player-modal";
import { FootballPitch } from "@/components/football-pitch";

export default function MyTeam() {
  const [team, setTeam] = useState<Team | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);

  useEffect(() => {
    getTeams()
      .then((teams) => setTeam(teams[0] ?? null))
      .catch(() => setTeam(null))
      .finally(() => setLoaded(true));
  }, []);

  function handlePlayerAdded(player: Player) {
    setTeam((prev) =>
      prev ? { ...prev, players: [...(prev.players ?? []), player] } : prev
    );
    setAddPlayerOpen(false);
  }

  const players = team?.players ?? [];
  const logo = teamLogoUrl(team?.logo);

  const metrics = [
    { label: "Jogadores",     value: players.length, icon: Users           },
    { label: "Gols Marcados", value: "—",            icon: SportsSoccerIcon }, // ⚠️ backend pendente
    { label: "Vitórias",      value: "—",            icon: Trophy           }, // ⚠️ backend pendente
  ];

  return (
    <>
      {addPlayerOpen && team && (
        <AddPlayerModal
          teamId={team.id}
          onAdded={handlePlayerAdded}
          onClose={() => setAddPlayerOpen(false)}
        />
      )}

      <div className="flex h-full flex-col gap-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Time</h1>
            <p className="mt-1 text-gray-500">Gerencie seu time aqui</p>
          </div>
          {team && (
            <button
              onClick={() => setAddPlayerOpen(true)}
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Jogador
            </button>
          )}
        </div>

        {/* Carregando */}
        {!loaded && <p className="text-sm text-gray-400">Carregando...</p>}

        {/* Sem time cadastrado */}
        {loaded && !team && (
          <p className="text-sm text-gray-400">
            Nenhum time cadastrado ainda. Crie um time no dashboard para começar.
          </p>
        )}

        {team && (
          <div className="flex gap-6 mt-10">
            {/* Coluna esquerda: logo + métricas */}
            <div className="flex w-56 shrink-0 flex-col items-center gap-4">
              {logo ? (
                <Image
                  src={logo}
                  alt="Logo do time"
                  width={96}
                  height={96}
                  unoptimized
                  className="rounded-full"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center px-2">
                  sem logo
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>

              <div className="flex w-full flex-col gap-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex w-36 items-center gap-3">
                      <metric.icon className="h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="text-lg font-bold text-gray-900 leading-none">{metric.value}</p>
                        <p className="text-xs text-gray-500">{metric.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna direita: tabela + campo lado a lado */}
            <div className="flex flex-1 gap-4">
            <div className="flex-2 min-w-0 rounded-lg border border-gray-200">
              {players.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                  <p className="text-sm text-gray-400">Nenhum jogador cadastrado neste time.</p>
                  <button
                    onClick={() => setAddPlayerOpen(true)}
                    className="cursor-pointer flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 transition hover:border-primary/50 hover:text-primary"
                  >
                    <UserPlus className="h-4 w-4" />
                    Adicionar primeiro jogador
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3 text-center">Camisa</th>
                      <th className="px-6 py-3">Posição</th>
                      <th className="px-6 py-3 text-center">Gols</th>
                      <th className="px-6 py-3 text-center">Assistências</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{player.name}</td>
                        {/* ⚠️ Campo "number" não existe no backend ainda */}
                        <td className="px-6 py-3 text-center text-gray-400">—</td>
                        <td className="px-6 py-3 text-gray-500">
                          {positionLabel[player.position] ?? player.position}
                        </td>
                        {/* ⚠️ Campos "goals" e "assists" não existem no backend ainda */}
                        <td className="px-6 py-3 text-center text-gray-400">—</td>
                        <td className="px-6 py-3 text-center text-gray-400">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

              {/* Campo de futebol */}
              <div className="flex-1">
                <FootballPitch />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
