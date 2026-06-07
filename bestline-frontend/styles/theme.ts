export const theme = {
  page: "min-h-screen bg-background text-foreground",

  header: "sticky top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur-md",

  headerInner:
    "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4",

  brandWrap: "flex items-center gap-3",

  logoDot:
    "flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",

  brandTitle: "text-lg font-black tracking-tight text-primary",

  brandSubtitle: "mt-0.5 text-xs font-medium text-muted-foreground",

  headerActions: "flex flex-wrap items-center gap-2",

  container: "mx-auto max-w-7xl px-4 py-6 pb-14",

  card:
    "mt-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm",

  cardNoMargin:
    "rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm",

  cardHeader:
    "flex flex-col justify-between gap-3 md:flex-row md:items-start",

  cardTitle: "text-base font-black text-foreground",

  cardSubtitle: "mt-1 text-sm leading-6 text-muted-foreground",

  labelLight: "mb-1.5 block text-xs font-bold text-muted-foreground",

  labelDark: "mb-1.5 block text-xs font-extrabold text-muted-foreground",

  selectDark:
    "rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",

  selectLight:
    "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",

  inputLight:
    "w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",

  buttonPrimary:
    "rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",

  buttonSecondary:
    "rounded-xl border border-border bg-muted px-4 py-2 text-sm font-bold text-foreground transition hover:bg-secondary/40",

  navLink:
    "inline-flex items-center rounded-xl px-3 py-2 text-sm font-bold text-foreground transition hover:bg-muted",

  navLinkActive:
    "bg-primary text-primary-foreground hover:bg-primary",

  navBrandLink:
    "flex items-center gap-3 no-underline transition hover:opacity-85",

  navLinks: "flex flex-wrap items-center gap-1",

  iconNavLink:
    "inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition hover:bg-muted",

  iconNavLinkActive:
    "bg-primary text-primary-foreground hover:bg-primary",

  metaPill:
    "rounded-full border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground",

  filterGrid: "grid gap-3 md:grid-cols-2 lg:grid-cols-5",

  booksBox: "mt-4 rounded-2xl border border-border bg-card p-3",

  booksList: "flex flex-wrap gap-3",

  checkboxLabel: "flex items-center gap-2 text-sm font-bold text-foreground",

  gameGrid: "mt-3 grid gap-3 lg:grid-cols-[1fr_2fr_1.2fr] lg:items-center",

  autoBox: "flex flex-col gap-2 rounded-2xl border border-border bg-muted/50 p-3",

  eventMetaRow: "mt-3 flex flex-wrap gap-2",

  eventMetaPill:
    "rounded-full border border-border bg-muted px-3 py-2 text-xs font-bold text-muted-foreground",

  tabs: "mt-3 flex flex-wrap gap-2",

  tab:
    "rounded-full border border-border bg-card px-4 py-2 text-sm font-extrabold text-foreground transition hover:bg-muted",

  tabActive: "border-primary bg-primary text-primary-foreground",

  tableWrap: "mt-3 overflow-x-auto",

  table: "w-full border-collapse",

  th: "px-3 py-3 text-left text-xs font-bold text-muted-foreground",

  thRight: "px-3 py-3 text-right text-xs font-bold text-muted-foreground",

  tr: "border-t border-border",

  td: "px-3 py-3 text-sm text-foreground",

  tdRight: "px-3 py-3 text-right text-sm text-foreground",

  tdBest: "bg-best-line/10",

  bookDot: "h-2.5 w-2.5 rounded-full bg-secondary",

  bookName: "font-black text-foreground",

  odds: "font-black text-foreground",

  oddsBest: "font-black text-primary",

  bestPill:
    "rounded-full border border-best-line bg-best-line px-2 py-1 text-[11px] font-black text-best-line-foreground",

  mutedDash: "font-bold text-muted-foreground",

  calcGrid: "mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3",

  calcCard: "rounded-2xl border border-border bg-muted/40 p-3",

  calcCardBest: "rounded-2xl border border-best-line bg-best-line/10 p-3",

  calcRow: "flex justify-between py-1.5 text-sm text-foreground",

  calcLabel: "text-xs font-black text-muted-foreground",

  calcValue: "font-black text-foreground",

  deltaRow:
    "mt-2 flex justify-between rounded-xl border border-accent/30 bg-accent/10 px-3 py-2",

  deltaLabel: "text-xs font-black text-accent",

  deltaValue: "font-black text-accent",

  errorBox:
    "mt-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-extrabold text-destructive",

  loadingBox:
    "mt-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm font-extrabold text-primary",

  emptyState:
    "mt-3 rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground",

  snapshotList: "mt-3 flex flex-col gap-3",

  snapshotItem:
    "flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-3 md:flex-row md:items-center",

  snapshotTitle: "font-black text-foreground",

  snapshotSub: "mt-1 text-sm text-muted-foreground",

  snapshotBest:
    "rounded-full border border-best-line bg-best-line/10 px-3 py-2 text-xs font-black text-primary",

  trackingHero:
    "mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-end",

  trackingEyebrow:
    "text-xs font-black uppercase tracking-[0.2em] text-primary",

  trackingTitle:
    "mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl",

  trackingDescription:
    "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",

  trackingCard:
    "rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm",

  trackingCardHeader:
    "flex flex-col justify-between gap-3 md:flex-row md:items-start",

  trackingMeta: "text-xs font-black uppercase tracking-wide text-muted-foreground",

  trackingMatchup: "mt-1 text-xl font-black text-foreground",

  trackingSub: "mt-1 text-sm font-bold text-muted-foreground",

  trackingStatus:
    "w-fit rounded-full border border-best-line bg-best-line/10 px-3 py-2 text-xs font-black text-primary",

  trackingStatGrid: "mt-4 grid gap-3 md:grid-cols-4",

  trackingStatBox: "rounded-2xl border border-border bg-muted/40 p-3",

  trackingStatLabel: "text-xs font-black uppercase text-muted-foreground",

  trackingStatValue: "mt-1 text-lg font-black text-foreground",

  trackingFooter:
    "mt-5 flex flex-col gap-4 border-t border-border pt-4 md:flex-row md:items-end md:justify-between",

  trackingRemoveButton:
    "rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-black text-destructive transition hover:bg-destructive/15",

  trackingBackButton:
    "inline-flex w-fit items-center rounded-xl border border-border bg-muted px-4 py-2 text-sm font-bold text-foreground no-underline transition hover:bg-secondary/40",
};