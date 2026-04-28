import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-stone-950">
          BestLinePicker
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium text-stone-600">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
          >
            Odds
          </Link>

          <Link
            href="/history"
            className="rounded-lg px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
          >
            History
          </Link>

          <Link
            href="/guides"
            className="rounded-lg px-3 py-2 transition hover:bg-stone-100 hover:text-stone-950"
          >
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}