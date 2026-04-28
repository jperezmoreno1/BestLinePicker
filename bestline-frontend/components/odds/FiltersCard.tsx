import { theme } from "@/styles/theme";
import {
  BOOKS_OPTIONS,
  REGIONS_OPTIONS,
  type BooksMode,
  type EventStatus,
  type SortBy,
  type SortOrder,
} from "@/types/odds";

type FiltersCardProps = {
  region: string;
  selectedBooks: string[];
  booksMode: BooksMode;
  eventStatus: EventStatus;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onRegionChange: (value: string) => void;
  onBooksModeChange: (value: BooksMode) => void;
  onEventStatusChange: (value: EventStatus) => void;
  onSortByChange: (value: SortBy) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onToggleBook: (bookValue: string) => void;
};

export default function FiltersCard({
  region,
  selectedBooks,
  booksMode,
  eventStatus,
  sortBy,
  sortOrder,
  onRegionChange,
  onBooksModeChange,
  onEventStatusChange,
  onSortByChange,
  onSortOrderChange,
  onToggleBook,
}: FiltersCardProps) {
  return (
    <section className={theme.card}>
      <div className={theme.filterGrid}>
        <div>
          <label className={theme.labelDark}>Region</label>
          <select
            value={region}
            onChange={(event) => onRegionChange(event.target.value)}
            className={theme.selectLight}
          >
            {REGIONS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={theme.labelDark}>Books View</label>
          <select
            value={booksMode}
            onChange={(event) =>
              onBooksModeChange(event.target.value as BooksMode)
            }
            className={theme.selectLight}
          >
            <option value="all">All Books</option>
            <option value="best_only">Best Only</option>
          </select>
        </div>

        <div>
          <label className={theme.labelDark}>Event Status</label>
          <select
            value={eventStatus}
            onChange={(event) =>
              onEventStatusChange(event.target.value as EventStatus)
            }
            className={theme.selectLight}
          >
            <option value="all">All Events</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
          </select>
        </div>

        <div>
          <label className={theme.labelDark}>Sort By</label>
          <select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as SortBy)}
            className={theme.selectLight}
          >
            <option value="start_time">Start Time</option>
            <option value="best_value">Best Value</option>
          </select>
        </div>

        <div>
          <label className={theme.labelDark}>Sort Order</label>
          <select
            value={sortOrder}
            onChange={(event) =>
              onSortOrderChange(event.target.value as SortOrder)
            }
            className={theme.selectLight}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className={theme.booksBox}>
        <div className="mb-3 text-sm font-black text-slate-700">My Books</div>

        <div className={theme.booksList}>
          {BOOKS_OPTIONS.map((book) => {
            const checked = selectedBooks.includes(book.value);

            return (
              <label key={book.value} className={theme.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleBook(book.value)}
                  className="h-4 w-4"
                />
                <span>{book.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}