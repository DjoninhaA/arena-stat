import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-6xl font-bold text-primary">Aviso Equipe Arena Stats</h1>
      <p className="mt-4 text-xl text-gray-600">Esssa Página ainda não foi desenvolvida e está sendo criada por nossa equipe.</p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Voltar ao Dashboard
      </Link>
    </main>
  );
}
