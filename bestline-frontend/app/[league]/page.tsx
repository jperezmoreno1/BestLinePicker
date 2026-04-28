import { notFound } from "next/navigation";
import OddsPageClient from "@/components/odds/OddsPageClient";
import type { League } from "@/types/odds";

type LeaguePageProps = {
  params: Promise<{
    league: string;
  }>;
};

const LEAGUE_ROUTE_MAP: Record<string, League> = {
  nfl: "NFL",
  nba: "NBA",
  mlb: "MLB",
};

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { league: leagueParam } = await params;
  const league = LEAGUE_ROUTE_MAP[leagueParam?.toLowerCase() ?? ""];

  if (!league) {
    notFound();
  }

  return <OddsPageClient initialLeague={league} />;
}