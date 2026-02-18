import Image from "next/image";
import { Users, Trophy } from "lucide-react";
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const players = [
  { name: "Carlos Silva", number: 1, position: "Goleiro", goals: 0, assists: 0 },
  { name: "Rafael Santos", number: 2, position: "Zagueiro", goals: 1, assists: 0 },
  { name: "Bruno Costa", number: 3, position: "Zagueiro", goals: 2, assists: 1 },
  { name: "Lucas Oliveira", number: 4, position: "Lateral Esquerdo", goals: 0, assists: 3 },
  { name: "Felipe Mendes", number: 6, position: "Lateral Direito", goals: 1, assists: 5 },
  { name: "André Lima", number: 5, position: "Volante", goals: 3, assists: 2 },
  { name: "Thiago Rocha", number: 8, position: "Meia", goals: 5, assists: 7 },
  { name: "Gabriel Souza", number: 10, position: "Meia", goals: 8, assists: 10 },
  { name: "Diego Ferreira", number: 7, position: "Ponta Esquerda", goals: 6, assists: 4 },
  { name: "Matheus Alves", number: 11, position: "Ponta Direita", goals: 4, assists: 3 },
  { name: "Pedro Henrique", number: 9, position: "Centroavante", goals: 12, assists: 2 },
];

const totalGoals = players.reduce((sum, p) => sum + p.goals, 0);
const totalAssists = players.reduce((sum, p) => sum + p.assists, 0);

const maxGoals = Math.max(...players.map((p) => p.goals));
const maxAssists = Math.max(...players.map((p) => p.assists));

const metrics = [
  { label: "Jogadores", value: players.length, icon: Users },
  { label: "Gols na Temporada", value: totalGoals, icon: SportsSoccerIcon },
  { label: "Vitórias", value: 7, icon: Trophy },
];

export default function MyTeam() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Meu Time</h1>
      <p className="mt-2 text-gray-500">Gerencie seu time aqui</p>

      <div className="mt-10 flex flex-col items-center">
        <Image
          src="/logo-udinese.png"
          alt="Logo do time"
          width={120}
          height={120}
          className="rounded-full"
        />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Nome do Time</h2>

        {/* Métricas */}
        <div className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <metric.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              <span className="text-sm text-gray-500">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de jogadores */}
      <div className="mt-10 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
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
              <tr key={player.number} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <span className="flex items-center gap-2">
                    {player.name}
                    {player.goals === maxGoals && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                        Artilheiro
                      </span>
                    )}
                    {player.assists === maxAssists && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        Garçom
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">{player.number}</td>
                <td className="px-6 py-4 text-gray-500">{player.position}</td>
                <td className="px-6 py-4 text-center">{player.goals}</td>
                <td className="px-6 py-4 text-center">{player.assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
