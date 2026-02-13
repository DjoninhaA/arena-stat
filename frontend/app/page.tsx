import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold tracking-tight text-primary md:text-8xl">
          Arena Stat
        </h1>
        <p className="text-2xl text-text-muted md:text-3xl">em breve</p>
        <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Ir para o Dashboard
        </Link>
      </div>
    </main>
  );
}
