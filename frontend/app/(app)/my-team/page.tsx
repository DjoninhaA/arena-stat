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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meu Time</h1>
            <p className="mt-1 text-sm text-gray-500">Gerencie seu time aqui</p>
          </div>
          {team && (
            <button
              onClick={() => setAddPlayerOpen(true)}
              className="cursor-pointer flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 active:scale-95 sm:px-4"
            >
              <UserPlus className="h-4 w-4" />
              <span>Adicionar Jogador</span>
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
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto lg:flex-row lg:mt-4">
            {/* Coluna esquerda: logo + nome + métricas */}
            <div className="flex flex-col gap-3 lg:w-56 lg:shrink-0 lg:items-center">
              {/* Logo + nome */}
              <div className="flex flex-col items-center gap-2 lg:flex-col lg:items-center lg:gap-2">
                {logo ? (
                  <Image
                    src={logo}
                    alt="Logo do time"
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-full lg:h-24 lg:w-24"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center px-2 lg:h-24 lg:w-24">
                    sem logo
                  </div>
                )}
                <h2 className="text-base font-bold text-gray-900 lg:text-xl">{team.name}</h2>
              </div>

              {/* Métricas: 3 colunas no mobile, empilhadas no desktop */}
              <div className="grid grid-cols-3 gap-2 lg:w-full lg:grid-cols-1 lg:gap-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm lg:flex-row lg:justify-start lg:p-3"
                  >
                    <metric.icon className="mb-1 h-4 w-4 shrink-0 text-primary lg:mb-0 lg:mr-3 lg:h-5 lg:w-5" />
                    <div className="text-center lg:text-left">
                      <p className="text-sm font-bold text-gray-900 leading-none lg:text-lg">{metric.value}</p>
                      <p className="text-[10px] text-gray-500 lg:text-xs">{metric.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna direita: tabela + campo */}
            <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row">
              {/* Tabela */}
              <div className="rounded-lg border border-gray-200 lg:flex-1">
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
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-3 py-2 sm:px-6 sm:py-3">Nome</th>
                        <th className="px-2 py-2 text-center sm:px-6 sm:py-3">Nº</th>
                        <th className="px-2 py-2 sm:px-6 sm:py-3">Posição</th>
                        <th className="px-2 py-2 text-center sm:px-6 sm:py-3">Gols</th>
                        <th className="px-2 py-2 text-center sm:px-6 sm:py-3">Ass.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {players.map((player) => (
                        <tr key={player.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900 sm:px-6 sm:py-3">{player.name}</td>
                          <td className="px-2 py-2 text-center text-gray-500 sm:px-6 sm:py-3">
                            {player.number ?? <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500 sm:px-6 sm:py-3 sm:text-sm">
                            {positionLabel[player.position] ?? player.position}
                          </td>
                          {/* ⚠️ Campos "goals" e "assists" não existem no backend ainda */}
                          <td className="px-2 py-2 text-center text-gray-400 sm:px-6 sm:py-3">—</td>
                          <td className="px-2 py-2 text-center text-gray-400 sm:px-6 sm:py-3">—</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Campo de futebol */}
              <div className="lg:flex-1">
                <FootballPitch players={players} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
