"use client";

import { Genres } from "@/app/user/[id]/page";
import { genreTranslations } from "@/utils/genreTranslations";
import { themeTranslations } from "@/utils/themeTranslations";
import { Themes } from "./AnimeSearchClient";

interface Props {
  isExpand: boolean;
  genres: Genres[];
  themes: Themes[];
  selectedGenres: string[];
  selectedThemes: string[];
  onGenreChange: (name: string) => void;
  onThemeChange: (name: string) => void;
}

export default function CategoryFilter({
  isExpand,
  genres,
  themes,
  selectedGenres,
  selectedThemes,
  onGenreChange,
  onThemeChange,
}: Props) {
  if (!isExpand) return null;

  return (
    <div className="overflow-hidden py-4 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-md">
      <div className="pl-6 mb-2">Thể loại</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pl-6">
        {genres.map((genre, index) => (
          <label
            key={index}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              className="appearance-none h-5 w-5 rounded-full border border-blue-400 checked:bg-blue-400 transition duration-200"
              value={genre.name}
              checked={selectedGenres.includes(genre.name)}
              onChange={() => onGenreChange(genre.name)}
            />
            <span className="text-gray-800">
              {genreTranslations[genre.name] || genre.name}
            </span>
          </label>
        ))}
      </div>

      <div className="pl-6 my-2">Chủ đề</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pl-6">
        {themes.map((theme, index) => (
          <label
            key={index}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              className="appearance-none h-5 w-5 rounded-full border border-blue-400 checked:bg-blue-400 transition duration-200"
              value={theme.name}
              checked={selectedThemes.includes(theme.name)}
              onChange={() => onThemeChange(theme.name)}
            />
            <span className="text-gray-800">
              {themeTranslations[theme.name] || theme.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
