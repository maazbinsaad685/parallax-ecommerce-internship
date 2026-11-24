import { Search, X } from 'lucide-react';
export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-box">
      <Search size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="product-search">
        Search products by title
      </label>
      <input
        id="product-search"
        type="search"
        placeholder="Search the collection…"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange('')}>
          <X size={17} />
        </button>
      )}
    </div>
  );
}
