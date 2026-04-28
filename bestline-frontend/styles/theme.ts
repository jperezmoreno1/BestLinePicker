export const theme = {
  page:
    "min-h-screen bg-[#0b1020] text-slate-100",

  header:
    "sticky top-0 z-50 border-b border-white/10 bg-[#0b1020]/90 backdrop-blur-md",

  headerInner:
  "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5",

  brandWrap:
    "flex items-center gap-3",

  logoDot:
    "h-3.5 w-3.5 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 shadow-[0_0_0_4px_rgba(96,165,250,0.15)]",

  brandTitle:
    "text-lg font-black tracking-wide text-slate-100",

  brandSubtitle:
    "mt-0.5 text-xs text-slate-300/80",

  headerActions:
    "flex flex-wrap items-end gap-3",

  container:
    "mx-auto max-w-7xl px-4 py-5 pb-14",

  card:
    "mt-4 rounded-[18px] border border-white/20 bg-gradient-to-b from-white/95 to-white/90 p-4 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.25)]",

  cardNoMargin:
    "rounded-[18px] border border-white/20 bg-gradient-to-b from-white/95 to-white/90 p-4 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.25)]",

  cardHeader:
    "flex flex-col justify-between gap-3 md:flex-row md:items-start",

  cardTitle:
    "text-base font-black text-slate-900",

  cardSubtitle:
    "mt-1 text-sm text-slate-600",

  labelLight:
    "mb-1.5 block text-xs text-slate-200/90",

  labelDark:
    "mb-1.5 block text-xs font-extrabold text-slate-700",

  selectDark:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-blue-300",

  selectLight:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-300",

  inputLight:
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300",

  buttonPrimary:
    "rounded-xl border border-blue-300/40 bg-gradient-to-br from-blue-400/25 to-violet-400/20 px-4 py-2 text-sm font-extrabold text-slate-100 transition hover:from-blue-400/35 hover:to-violet-400/30 disabled:cursor-not-allowed disabled:opacity-60",

  buttonSecondary:
    "rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 transition hover:bg-white/15",

  navLink:
    "inline-flex items-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 no-underline transition hover:bg-white/15",

  navBrandLink:
    "flex items-center gap-3 no-underline transition hover:opacity-85",

  navLinks:
    "flex flex-wrap items-center gap-2",

  metaPill:
    "rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-800",

  filterGrid:
    "grid gap-3 md:grid-cols-2 lg:grid-cols-5",

  booksBox:
    "mt-4 rounded-2xl border border-slate-200 bg-white p-3",

  booksList:
    "flex flex-wrap gap-3",

  checkboxLabel:
    "flex items-center gap-2 text-sm font-bold text-slate-900",

  gameGrid:
    "mt-3 grid gap-3 lg:grid-cols-[1fr_2fr_1.2fr] lg:items-center",

  autoBox:
    "flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3",

  eventMetaRow:
    "mt-3 flex flex-wrap gap-2",

  eventMetaPill:
    "rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700",

  tabs:
    "mt-3 flex flex-wrap gap-2",

  tab:
    "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 transition hover:bg-slate-50",

  tabActive:
    "border-indigo-200 bg-indigo-50 text-indigo-800",

  tableWrap:
    "mt-3 overflow-x-auto",

  table:
    "w-full border-collapse",

  th:
    "px-3 py-3 text-left text-xs font-bold text-slate-500",

  thRight:
    "px-3 py-3 text-right text-xs font-bold text-slate-500",

  tr:
    "border-t border-slate-200",

  td:
    "px-3 py-3 text-sm text-slate-900",

  tdRight:
    "px-3 py-3 text-right text-sm text-slate-900",

  tdBest:
    "bg-indigo-50",

  bookDot:
    "h-2.5 w-2.5 rounded-full bg-slate-300",

  bookName:
    "font-black text-slate-900",

  odds:
    "font-black text-slate-900",

  oddsBest:
    "font-black text-indigo-800",

  bestPill:
    "rounded-full border border-indigo-200 bg-indigo-100 px-2 py-1 text-[11px] font-black text-indigo-800",

  mutedDash:
    "font-bold text-slate-400",

  calcGrid:
    "mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3",

  calcCard:
    "rounded-2xl border border-slate-200 bg-white p-3",

  calcCardBest:
    "rounded-2xl border border-indigo-200 bg-indigo-50 p-3",

  calcRow:
    "flex justify-between py-1.5 text-sm text-slate-900",

  calcLabel:
    "text-xs font-black text-slate-500",

  calcValue:
    "font-black text-slate-900",

  deltaRow:
    "mt-2 flex justify-between rounded-xl border border-orange-200 bg-orange-50 px-3 py-2",

  deltaLabel:
    "text-xs font-black text-orange-800",

  deltaValue:
    "font-black text-orange-800",

  errorBox:
    "mt-3 rounded-xl border border-red-200 bg-red-100 p-3 text-sm font-extrabold text-red-800",

  loadingBox:
    "mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm font-extrabold text-cyan-800",

  emptyState:
    "mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600",

  snapshotList:
    "mt-3 flex flex-col gap-3",

  snapshotItem:
    "flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 md:flex-row md:items-center",

  snapshotTitle:
    "font-black text-slate-900",

  snapshotSub:
    "mt-1 text-sm text-slate-600",

  snapshotBest:
    "rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800",

  trackingHero:
    "mb-6 flex flex-col justify-between gap-4 rounded-[22px] border border-white/10 bg-white/5 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)] md:flex-row md:items-end",

  trackingEyebrow:
    "text-xs font-black uppercase tracking-[0.2em] text-blue-300",

  trackingTitle:
    "mt-2 text-3xl font-black tracking-tight text-slate-100 md:text-4xl",

  trackingDescription:
    "mt-2 max-w-2xl text-sm leading-6 text-slate-300",

  trackingCard:
    "rounded-[18px] border border-white/20 bg-gradient-to-b from-white/95 to-white/90 p-4 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.25)]",

  trackingCardHeader:
    "flex flex-col justify-between gap-3 md:flex-row md:items-start",

  trackingMeta:
    "text-xs font-black uppercase tracking-wide text-slate-500",

  trackingMatchup:
    "mt-1 text-xl font-black text-slate-900",

  trackingSub:
    "mt-1 text-sm font-bold text-slate-600",

  trackingStatus:
    "w-fit rounded-full border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800",

  trackingStatGrid:
    "mt-4 grid gap-3 md:grid-cols-4",

  trackingStatBox:
    "rounded-2xl border border-slate-200 bg-slate-50 p-3",

  trackingStatLabel:
    "text-xs font-black uppercase text-slate-500",

  trackingStatValue:
    "mt-1 text-lg font-black text-slate-900",

  trackingFooter:
    "mt-5 flex flex-col gap-4 border-t border-slate-200 pt-4 md:flex-row md:items-end md:justify-between",

  trackingRemoveButton:
    "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100",

  trackingBackButton:
    "inline-flex w-fit items-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 no-underline transition hover:bg-white/15",
};