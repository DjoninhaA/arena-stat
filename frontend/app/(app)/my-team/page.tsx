import Image from "next/image";

export default function MyTeam() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Meu Time</h1>
      <p className="mt-2 text-gray-500">
        Gerencie seu time aqui
      </p>
      <div className="mt-10 flex flex-col items-center">
        <Image
          src="/team-logo.png"
          alt="Logo do time"
          width={200}
          height={200}
          className="rounded-full"
        />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Nome do Time</h2>
      </div>
    </div>
  );
}
