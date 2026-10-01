"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onClear,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search products"
        placeholder="Search products..."
        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 pr-24 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50"
        >
          Clear
        </button>
      )}
    </div>
  );
}