"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { theme } from "@/styles/theme";

export default function Navbar() {
  const router = useRouter();
  return (
    <header className={theme.header}>
      <div className={theme.headerInner}>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="relative z-50 flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left no-underline transition hover:opacity-85"
          aria-label="Go to BestLinePicker home page"
        >
          <span className={theme.logoDot} />

          <div>
            <div className={theme.brandTitle}>BestLinePicker</div>
            <div className={theme.brandSubtitle}>Find the best line faster</div>
          </div>
        </button>

        <nav className={theme.navLinks}>
          <Link href="/nfl" className={theme.navLink}>
            NFL
          </Link>

          <Link href="/nba" className={theme.navLink}>
            NBA
          </Link>

          <Link href="/mlb" className={theme.navLink}>
            MLB
          </Link>

          <Link href="/tracking" className={theme.navLink}>
            Tracking
          </Link>

          <Link href="/guides" className={theme.navLink}>
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}