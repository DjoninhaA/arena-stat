import Image from "next/image";
import { Users, Trophy } from "lucide-react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { getTeams, teamLogoUrl, positionLabel, type Team } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const metrics = (team: Team) => [
  { label: "Jogadores",    value: team.players?.length ?? 0, icon: Users           },
  { label: "Gols Marcados", value: "—",                      icon: SportsSoccerIcon }, // ⚠️ backend pendente
  { label: "Vitórias",     value: "—",                       icon: Trophy           }, // ⚠️ backend pendente
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MyTeam() {
  let team: Team | null = null;

  try {
    const teams = await getTeams();
    team = teams[0] ?? null;
  } catch {
    // backend offline ou sem times cadastrados
  }

  const players = team?.players ?? [];
  const logo = teamLogoUrl(team?.logo);

  return (
    <div className="flex h-full flex-col gap-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Time</h1>
        <p className="mt-1 text-gray-500">Gerencie seu time aqui</p>
      </div>

      {/* Sem time cadastrado */}
      {!team && (
        <p className="text-sm text-gray-400">
          Nenhum time cadastrado ainda. Crie um time no backend para começar.
        </p>
      )}

      {team && (
        <div className="flex gap-6 mt-20">
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
                onError={undefined}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center px-2">
                sem logo
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">{team.name}</h2>

            <div className="flex w-full flex-col gap-3">
              {metrics(team).map((metric) => (
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

          {/* Coluna direita: tabela */}
          <div className="flex-1 rounded-lg border border-gray-200">
            {players.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">
                Nenhum jogador cadastrado neste time.
              </p>
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
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {player.name}
                      </td>
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
        </div>
      )}
    </div>
  );
}
