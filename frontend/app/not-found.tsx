import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página não encontrada</p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Voltar ao Dashboard
      </Link>
    </main>
  );
}
