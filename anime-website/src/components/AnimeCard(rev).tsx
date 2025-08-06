import genreColorMap from "@/utils/genreColorMap";
import Link from "next/link";
import React from "react";
import { AnimeCardProps } from "./AnimeCard";
import { genreTranslations } from "@/utils/genreTranslations";
import { themeTranslations } from "@/utils/themeTranslations";
import { audienceTranslations } from "@/utils/audienceTranslations";

const AnimeCardReverse: React.FC<AnimeCardProps> = ({ anime }) => {
  const primaryGenre = anime.Genres?.[0]?.name ?? "Fantasy";
  const { bg, text } = genreColorMap[primaryGenre] || {
    bg: "bg-white",
    text: "text-black",
  };

  return (
    <div
      className={`flex ${bg} ${text} rounded-2xl shadow-lg overflow-hidden p-6`}
    >
      <div className="w-1/4 flex items-center ml-2">
        <img
          src={anime.image_url}
          alt={anime.title}
          className="w-[70%] object-cover rounded-lg"
        />
      </div>

      <div className="w-3/4 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-indigo-700">
            {anime.title_vietnamese || anime.title}
          </h2>

          <div className="text-sm text-gray-600 mt-2">
            <span className="mr-2">🎬 {anime.type}</span>
            <span className="mr-2">📺 {anime.episodes} ep</span>
            <span className="mr-2">⭐ {anime.score}</span>
            <span className="mr-2">📡 {anime.status}</span>
          </div>

          <p className="text-gray-700 text-sm mt-3 line-clamp-4">
            {anime.synopsis}
          </p>

          <div className="mt-3 text-sm">
            <strong>Thể loại:</strong>{" "}
            {anime.Genres.map((g, index) => (
              <span key={g.name}>
                {index > 0 && ", "}
                <Link href={`/search?genre=${encodeURIComponent(g.name)}`}>
                  {genreTranslations[g.name] || g.name}
                </Link>
              </span>
            ))}
          </div>

          {anime.Themes.length > 0 && (
            <div className="text-sm">
              <strong>Chủ đề:</strong>{" "}
              {anime.Themes.map((g, index) => (
                <span key={g.name}>
                  {index > 0 && ", "}
                  <Link href={`/search?theme=${encodeURIComponent(g.name)}`}>
                    {themeTranslations[g.name] || g.name}
                  </Link>
                </span>
              ))}
            </div>
          )}

          {anime.Demographics.length > 0 && (
            <div className="text-sm ">
              <strong>Đối tượng:</strong>{" "}
              {anime.Demographics.map(
                (d) => audienceTranslations[d.name] || d.name
              ).join(", ")}
            </div>
          )}

          <Link href={`/anime/${anime.mal_id}`}>
            <button className="mt-4 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 ease-in-out">
              Xem chi tiết
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimeCardReverse;
