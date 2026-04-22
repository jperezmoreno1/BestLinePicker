export type GuideCategory =
  | "basics"
  | "market-types"
  | "odds-pricing"
  | "calculator"
  | "sportsbook-comparison";

export interface GuideCategoryMeta {
  id: GuideCategory;
  label: string;
  description: string;
}

export interface QuickStartItem {
  id: string;
  title: string;
  description: string;
}

export interface GuideTerm {
  id: string;
  slug: string;
  term: string;
  category: GuideCategory;
  shortDefinition: string;
  fullDefinition: string;
  examples?: string[];
  relatedTerms?: string[];
  appRelevance?: string[];
  searchKeywords?: string[];
}

export interface GuideFAQ {
  id: string;
  question: string;
  answer: string;
}

export const guideCategories: GuideCategoryMeta[] = [
  {
    id: "basics",
    label: "Basic Betting Terms",
    description: "Core concepts every user should understand first.",
  },
  {
    id: "market-types",
    label: "Market Types",
    description: "The main bet types shown in BestLinePicker.",
  },
  {
    id: "odds-pricing",
    label: "Odds & Pricing",
    description: "How odds work and how pricing differs across sportsbooks.",
  },
  {
    id: "calculator",
    label: "Payout & Probability",
    description: "Terms directly tied to your calculator and value comparison.",
  },
  {
    id: "sportsbook-comparison",
    label: "Sportsbook Comparison",
    description: "Concepts related to line shopping and comparing books.",
  },
];

export const quickStartItems: QuickStartItem[] = [
  {
    id: "compare-books",
    title: "Compare multiple sportsbooks",
    description:
      "BestLinePicker lets you look at the same game across different sportsbooks so you can quickly see who is offering the best current price.",
  },
  {
    id: "switch-markets",
    title: "Use market tabs",
    description:
      "Switch between Moneyline, Spread, and Total to compare different types of bets for the same event without leaving the page.",
  },
  {
    id: "best-odds",
    title: "Watch for best-odds highlighting",
    description:
      "Highlighted rows or prices help show which sportsbook currently gives the most favorable number for that market.",
  },
  {
    id: "my-books",
    title: "Filter to My Books",
    description:
      "Use regional and preferred-book filters to focus only on the sportsbooks that are actually available or relevant to you.",
  },
  {
    id: "calculator",
    title: "Use the calculator for context",
    description:
      "The calculator helps translate odds into implied probability, payout, and profit so the pricing is easier to understand.",
  },
];

export const guideTerms: GuideTerm[] = [
  {
    id: "moneyline",
    slug: "moneyline",
    term: "Moneyline",
    category: "market-types",
    shortDefinition: "A bet on which side wins outright.",
    fullDefinition:
      "A moneyline bet is the simplest market type. You are betting on which team or player wins the game outright, without any point spread involved.",
    examples: [
      "Lakers -150 means the Lakers are favored to win outright.",
      "Celtics +130 means the Celtics are underdogs to win outright.",
    ],
    relatedTerms: ["favorite", "underdog", "american-odds"],
    appRelevance: ["Market tab", "Odds table", "Calculator"],
    searchKeywords: ["ml", "winner", "straight winner"],
  },
  {
    id: "spread",
    slug: "spread",
    term: "Spread",
    category: "market-types",
    shortDefinition:
      "A bet based on the margin of victory rather than just who wins.",
    fullDefinition:
      "A spread bet gives one side a handicap and the other side an advantage. The favorite must win by more than the listed number, while the underdog can either win outright or lose by fewer than that number.",
    examples: [
      "Lakers -4.5 means the Lakers must win by 5 or more.",
      "Celtics +4.5 means the Celtics can lose by 4 or fewer and still cover.",
    ],
    relatedTerms: ["favorite", "underdog", "cover"],
    appRelevance: ["Market tab", "Odds table"],
    searchKeywords: ["point spread", "ats"],
  },
  {
    id: "total",
    slug: "total",
    term: "Total (Over/Under)",
    category: "market-types",
    shortDefinition:
      "A bet on whether the combined score goes over or under a number.",
    fullDefinition:
      "A total, also called an over/under, is a bet on the combined number of points, runs, or goals scored in a game. You are not betting on the winner, only on whether the final total goes over or under the posted line.",
    examples: [
      "Over 228.5 wins if the combined score is 229 or more.",
      "Under 8.5 in baseball wins if the combined runs are 8 or fewer.",
    ],
    relatedTerms: ["market", "line-movement"],
    appRelevance: ["Market tab", "Odds table"],
    searchKeywords: ["over under", "totals"],
  },
  {
    id: "favorite",
    slug: "favorite",
    term: "Favorite",
    category: "basics",
    shortDefinition: "The side expected to win.",
    fullDefinition:
      "The favorite is the team or player expected by the sportsbook to win. Favorites are usually shown with negative American odds and often appear with a minus spread.",
    examples: [
      "A team listed at -150 on the moneyline is the favorite.",
      "A team listed at -5.5 on the spread is also the favorite.",
    ],
    relatedTerms: ["underdog", "negative-odds"],
    appRelevance: ["Odds table", "Market understanding"],
  },
  {
    id: "underdog",
    slug: "underdog",
    term: "Underdog",
    category: "basics",
    shortDefinition: "The side expected to lose.",
    fullDefinition:
      "The underdog is the team or player expected to lose. Underdogs usually appear with positive American odds and may receive points on a spread.",
    examples: [
      "A team at +140 on the moneyline is the underdog.",
      "A team at +5.5 on the spread is the underdog.",
    ],
    relatedTerms: ["favorite", "positive-odds"],
    appRelevance: ["Odds table", "Market understanding"],
  },
  {
    id: "american-odds",
    slug: "american-odds",
    term: "American Odds",
    category: "odds-pricing",
    shortDefinition:
      "The odds format using plus and minus numbers, such as +120 or -110.",
    fullDefinition:
      "American odds show how much profit you would make on a $100 bet with positive odds, or how much you need to risk to win $100 with negative odds.",
    examples: [
      "+150 means a $100 bet returns $150 profit.",
      "-120 means you must risk $120 to win $100 profit.",
    ],
    relatedTerms: ["positive-odds", "negative-odds", "implied-probability"],
    appRelevance: ["Odds table", "Calculator"],
    searchKeywords: ["american format", "plus minus odds"],
  },
  {
    id: "positive-odds",
    slug: "positive-odds",
    term: "Positive Odds",
    category: "odds-pricing",
    shortDefinition:
      "Odds with a plus sign that show profit on a $100 wager.",
    fullDefinition:
      "Positive odds, like +130, usually represent an underdog. They tell you how much profit you would make if you bet $100 and the wager wins.",
    examples: ["+130 means $100 wins $130 profit."],
    relatedTerms: ["american-odds", "underdog"],
    appRelevance: ["Odds table", "Calculator"],
  },
  {
    id: "negative-odds",
    slug: "negative-odds",
    term: "Negative Odds",
    category: "odds-pricing",
    shortDefinition:
      "Odds with a minus sign that show how much must be risked to win $100.",
    fullDefinition:
      "Negative odds, like -145, usually represent a favorite. They tell you how much you would need to risk in order to win $100 profit.",
    examples: ["-145 means you must risk $145 to win $100 profit."],
    relatedTerms: ["american-odds", "favorite"],
    appRelevance: ["Odds table", "Calculator"],
  },
  {
    id: "implied-probability",
    slug: "implied-probability",
    term: "Implied Probability",
    category: "calculator",
    shortDefinition:
      "The win percentage suggested by the posted odds.",
    fullDefinition:
      "Implied probability converts betting odds into a percentage that represents the sportsbook's estimated chance of that outcome happening. It helps users compare price and probability more directly.",
    examples: [
      "-150 implies a higher win probability than +150.",
      "Your calculator can turn odds into a percentage for easier comparison.",
    ],
    relatedTerms: ["american-odds", "best-line"],
    appRelevance: ["Calculator", "Best-line comparison"],
    searchKeywords: ["probability", "implied chance"],
  },
  {
    id: "stake",
    slug: "stake",
    term: "Stake",
    category: "calculator",
    shortDefinition: "The amount of money risked on a bet.",
    fullDefinition:
      "Your stake is the amount you wager. The size of the stake affects the resulting payout and profit shown in the calculator.",
    examples: ["A $25 bet has a $25 stake."],
    relatedTerms: ["profit", "payout"],
    appRelevance: ["Calculator"],
  },
  {
    id: "profit",
    slug: "profit",
    term: "Profit",
    category: "calculator",
    shortDefinition: "The amount won excluding the original stake.",
    fullDefinition:
      "Profit is the net amount earned when a bet wins. It does not include the original amount risked. This is different from total payout, which includes the returned stake.",
    examples: [
      "A winning $100 bet at +150 returns $150 profit.",
      "If total payout is $250 on a $100 stake, profit is $150.",
    ],
    relatedTerms: ["payout", "stake"],
    appRelevance: ["Calculator"],
  },
  {
    id: "payout",
    slug: "payout",
    term: "Payout",
    category: "calculator",
    shortDefinition:
      "The total amount returned on a winning bet, including stake and profit.",
    fullDefinition:
      "Payout is the full amount returned if a bet wins. It includes both your original stake and the profit earned.",
    examples: [
      "A $100 bet at +150 returns a $250 payout: $100 stake + $150 profit.",
    ],
    relatedTerms: ["profit", "stake"],
    appRelevance: ["Calculator"],
  },
  {
    id: "sportsbook",
    slug: "sportsbook",
    term: "Sportsbook",
    category: "sportsbook-comparison",
    shortDefinition:
      "The platform or operator that posts betting lines and accepts wagers.",
    fullDefinition:
      "A sportsbook is the operator offering odds on sporting events. Different sportsbooks may show different prices or lines for the same game, which is why comparison tools are valuable.",
    examples: [
      "Two sportsbooks may offer different moneyline prices on the same team.",
    ],
    relatedTerms: ["line-shopping", "best-line"],
    appRelevance: ["Odds comparison table", "My Books filters"],
  },
  {
    id: "line-shopping",
    slug: "line-shopping",
    term: "Line Shopping",
    category: "sportsbook-comparison",
    shortDefinition:
      "Comparing multiple sportsbooks to find the most favorable line or price.",
    fullDefinition:
      "Line shopping means checking multiple sportsbooks before placing a wager so you can get the best available odds or number. Over time, small improvements in price can make a meaningful difference.",
    examples: [
      "Getting +110 instead of +100 on the same pick is a better price.",
      "Finding +4.5 instead of +4 can matter on spread bets.",
    ],
    relatedTerms: ["sportsbook", "best-line", "line-movement"],
    appRelevance: ["Core app concept", "Odds table", "Best odds highlighting"],
    searchKeywords: ["best line", "compare books"],
  },
  {
    id: "best-line",
    slug: "best-line",
    term: "Best Line / Best Odds",
    category: "sportsbook-comparison",
    shortDefinition:
      "The most favorable currently available price among compared sportsbooks.",
    fullDefinition:
      "The best line or best odds refer to the most favorable price available for a given side and market at a given moment. BestLinePicker highlights this so users can quickly identify stronger available prices.",
    examples: [
      "If one book offers +125 and another offers +135, +135 is the better price.",
    ],
    relatedTerms: ["line-shopping", "sportsbook"],
    appRelevance: ["Best odds highlighting", "Comparison table"],
  },
  {
    id: "line-movement",
    slug: "line-movement",
    term: "Line Movement",
    category: "sportsbook-comparison",
    shortDefinition:
      "A change in the odds or betting line over time.",
    fullDefinition:
      "Line movement happens when sportsbooks adjust their odds or numbers. This can happen because of betting activity, injuries, news, or market reaction.",
    examples: [
      "A spread may move from -3.5 to -4.5.",
      "A moneyline may move from +120 to +105.",
    ],
    relatedTerms: ["line-shopping", "market"],
    appRelevance: ["Live odds comparison", "Auto-refresh"],
  },
  {
    id: "market",
    slug: "market",
    term: "Market",
    category: "basics",
    shortDefinition:
      "The type of bet being offered, such as moneyline, spread, or total.",
    fullDefinition:
      "A market is the category of wager available for an event. In BestLinePicker, market tabs let users switch between different bet types for the same game.",
    examples: [
      "Moneyline, spread, and total are all betting markets.",
    ],
    relatedTerms: ["moneyline", "spread", "total"],
    appRelevance: ["Market tabs", "Odds table"],
  },
  {
    id: "my-books",
    slug: "my-books",
    term: "My Books",
    category: "sportsbook-comparison",
    shortDefinition:
      "A filter that shows only selected or preferred sportsbooks.",
    fullDefinition:
      "My Books is a user-focused filter that narrows the comparison table to sportsbooks the user prefers or has access to. This makes the table more relevant and easier to scan.",
    examples: [
      "A user might only want to compare FanDuel, DraftKings, and BetMGM.",
    ],
    relatedTerms: ["sportsbook", "line-shopping"],
    appRelevance: ["Preferred book filtering", "Regional filtering"],
  },
];

export const guideFaqs: GuideFAQ[] = [
  {
    id: "faq-1",
    question: "What does -110 mean?",
    answer:
      "It means you would need to risk $110 to win $100 in profit. Negative odds usually indicate the favored side.",
  },
  {
    id: "faq-2",
    question: "What does +150 mean?",
    answer:
      "It means a $100 bet would win $150 in profit. Positive odds usually indicate the underdog.",
  },
  {
    id: "faq-3",
    question: "What is the difference between payout and profit?",
    answer:
      "Profit is the amount won excluding your original stake. Payout is the total amount returned, including your stake plus profit.",
  },
  {
    id: "faq-4",
    question: "Why do different sportsbooks show different odds?",
    answer:
      "Sportsbooks set and adjust their own numbers independently, so prices can vary. That is exactly why line shopping matters.",
  },
  {
    id: "faq-5",
    question: "Why do odds change over time?",
    answer:
      "Odds can move because of betting action, injuries, lineup news, or broader market reaction across sportsbooks.",
  },
];