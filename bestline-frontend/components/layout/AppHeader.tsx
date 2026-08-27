"use client";

import Link from "next/link";
import { usePathname} from "next/navigation";
import {
  Calculator,
  Heart,
  History,
  Home,
  Search,
  Settings,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { theme } from "@/styles/theme";
import type { League } from "@/types/odds";
import { useAuth } from "@/components/auth/AuthProvider";
import SignInButton from "@/components/auth/SignInButton";
import UserMenu from "@/components/auth/UserMenu";

type AppHeaderProps = {
  activeLeague?: League;
  savingSnapshot?: boolean;
  onRefresh?: () => void;
  onSaveSnapshot?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

const SPORTS_LINKS: Array<{
  label: string;
  href: string;
  implemented: boolean;
}> = [
  { label: "NFL", href: "/nfl", implemented: true },
  { label: "NBA", href: "/nba", implemented: true },
  { label: "MLB", href: "/mlb", implemented: true },
  { label: "NHL", href: "/nhl", implemented: false },
  { label: "Soccer", href: "/soccer", implemented: false },
  { label: "NCAAF", href: "/ncaaf", implemented: false },
  { label: "NCAAB", href: "/ncaab", implemented: false },
];

const ICON_LINKS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    implemented: true,
  },
  {
    label: "Tracking",
    href: "/tracking",
    icon: Heart,
    implemented: true,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
    implemented: true,
  },
  {
    label: "Arbitrage",
    href: "/arbitrage",
    icon: TrendingUp,
    implemented: false,
  },
  {
    /* Should be implemented */
    label: "Calculator",
    href: "/calculator",
    icon: Calculator,
    implemented: false,
  },
  {
    /* Should be implemented */
    label: "Settings",
    href: "/settings",
    icon: Settings,
    implemented: true,
  },
]

export default function AppHeader({
  activeLeague,
  savingSnapshot = false,
  onRefresh,
  onSaveSnapshot,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search teams, leagues, books, or events..."
}: AppHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const controlledSearch = typeof onSearchChange === "function";
  const visibleSearchValue = controlledSearch
    ? searchValue ?? ""
    : localSearchQuery;

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleSearchChange = (value: string) => {
    if (controlledSearch) {
      onSearchChange(value);
      return;
    }

    setLocalSearchQuery(value);
  };

  const clearSearch = () => {
    handleSearchChange("");
  };

  return (
    <header className={theme.header}>
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/" className={theme.navBrandLink}>
              <span className={theme.logoDot}>
                <Trophy className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className={theme.brandTitle}>BestLinePicker</div>
                <div className={theme.brandSubtitle}>
                  Compare Odds Across Books
                </div>
              </div>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {SPORTS_LINKS.map((link) => {
                const active =
                  activeLeague?.toLowerCase() === link.label.toLowerCase() ||
                  isActivePath(link.href);
                if (!link.implemented) {
                  return (
                    <span
                      key={link.label}
                      className="rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground opacity-70"
                      title="Coming soon"
                    >
                      {link.label}
                    </span>
                  );
                }
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`${theme.navLink} ${
                      active ? theme.navLinkActive : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((current) => !current)}
              className={theme.iconNavLink}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            {ICON_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActivePath(link.href);
              if (!link.implemented) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`${theme.iconNavLink} text-muted-foreground`}
                    title={`${link.label} mockup`}
                    aria-label={`${link.label} mockup`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              }
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${theme.iconNavLink} ${
                    active ? theme.iconNavLinkActive : ""
                  }`}
                  title={link.label}
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="ml-2 hidden rounded-xl border border-border bg-muted px-3 py-2 text-sm font-bold text-foreground transition hover:bg-secondary/40 lg:inline-flex"
              >
                Refresh
              </button>
            )}
            {onSaveSnapshot && (
              <button
                type="button"
                onClick={onSaveSnapshot}
                disabled={savingSnapshot}
                className="hidden rounded-xl border border-primary bg-primary px-3 py-2 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60 lg:inline-flex"
              >
                {savingSnapshot ? "Saving..." : "Save Snapshot"}
              </button>
            )}
            <div className="ml-2">{user ? <UserMenu /> : <SignInButton />}</div>
          </div>
        </div>
        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="mt-4">
            <div className="flex gap-2">
              <input
                type="search"
                value={visibleSearchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />

              {visibleSearchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className={theme.buttonSecondary}
                  >
                    Clear
                  </button>
              )}
            </div>
          </form>
        )}
        <nav className="mt-4 flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
          {SPORTS_LINKS.map((link) => {
            const active =
              activeLeague?.toLowerCase() === link.label.toLowerCase() ||
              isActivePath(link.href);
            if (!link.implemented) {
              return (
                <span
                  key={link.label}
                  className="flex-shrink-0 rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground opacity-70"
                >
                  {link.label}
                </span>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex-shrink-0 ${theme.navLink} ${
                  active ? theme.navLinkActive : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-3 flex flex-wrap items-center gap-2 lg:hidden">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className={theme.buttonSecondary}
            >
              Refresh
            </button>
          )}
          {onSaveSnapshot && (
            <button
              type="button"
              onClick={onSaveSnapshot}
              disabled={savingSnapshot}
              className={theme.buttonPrimary}
            >
              {savingSnapshot ? "Saving..." : "Save Snapshot"}
            </button>
          )}
          {user ? <UserMenu /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
}