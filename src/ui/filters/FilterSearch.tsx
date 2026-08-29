import { Search, X } from 'lucide-react';
import { useApp } from '../../state';

export function FilterSearch() {
  const { state, setFilter } = useApp();
  const value = state.filters.keyword ?? '';

  return (
    <label htmlFor="filter-search" className="relative block min-w-0 w-full sm:flex-1 md:max-w-xs">
      <span className="sr-only">Search activities</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-quiet" />
      <input
        id="filter-search"
        type="search"
        value={value}
        onChange={(e) => setFilter('keyword', e.target.value || undefined)}
        placeholder="Search…"
        className="h-10 w-full rounded-full border border-hair bg-paper pl-9 pr-8 text-sm outline-none placeholder:text-quiet focus:border-ink"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setFilter('keyword', undefined)}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-quiet hover:bg-warm"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </label>
  );
}
