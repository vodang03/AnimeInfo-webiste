interface AnimeSuggestion {
  mal_id: number;
  title: string;
  image_url: string;
}

interface SearchBarPros {
  pathname: string;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  suggestions: AnimeSuggestion[];
  setSuggestions: (value: AnimeSuggestion[]) => void;
  isInputFocused: boolean;
  setIsInputFocused: (value: boolean) => void;
  onSearch: (query: string) => void; // nhận hàm onSearch từ ngoài
  onNavigate: (url: string) => void; // hàm chuyển trang
}

const SearchBar: React.FC<SearchBarPros> = ({
  pathname,
  searchTerm,
  setSearchTerm,
  suggestions,
  setSuggestions,
  isInputFocused,
  setIsInputFocused,
  onSearch,
  onNavigate,
}) => {
  const handleSearch = (query: string) => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <div className="relative w-72">
      <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
        <svg
          className="w-5 h-5 text-gray-400 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
          />
        </svg>

        <input
          type="text"
          placeholder="Tìm kiếm anime..."
          className="flex-1 text-sm bg-transparent focus:outline-none text-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchTerm);
              setSuggestions([]);
              setIsInputFocused(false);
            }
          }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 300);
          }}
        />
      </div>

      {isInputFocused && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-white text-black rounded-xl shadow-lg max-h-72 overflow-y-auto z-50 border border-gray-200">
          {suggestions.map((anime) => (
            <li
              key={anime.mal_id}
              className="flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer transition border-b"
              onClick={() => {
                onNavigate(`/anime/${anime.mal_id}`);
                setSearchTerm("");
                setSuggestions([]);
              }}
            >
              <img
                src={anime.image_url}
                alt={anime.title}
                className="w-12 h-16 object-cover rounded-lg border"
              />
              <div>
                <p className="text-sm font-semibold line-clamp-1">
                  {anime.title}
                </p>
                <p className="text-xs text-gray-500">ID: {anime.mal_id}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
