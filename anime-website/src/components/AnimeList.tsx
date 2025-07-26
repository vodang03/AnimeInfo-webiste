"use client";

import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import Link from "next/link";
import FavoriteF from "./FavoriteF";
import Synopsis from "./SynopsisExpand";

interface Anime {
  mal_id: number;
  title: string;
  type: string;
  episodes: number;
  status: string;
  image_url: string;
  score: number;
  synopsis: string;
  Genres: { name: string }[];
  Demographics: { name: string }[];
  aired_from: string;
  aired_to: string;
}

interface AnimeListProps {
  animeList: Anime[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AnimeList({
  animeList,
  currentPage,
  totalPages,
  onPageChange,
}: AnimeListProps) {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-indigo-100 to-pink-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 pb-8">
        {animeList.map((anime, index) => (
          <div
            key={index}
            className="flex flex-col w-full backdrop-blur-md bg-white/60 border border-gray-300 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:border-indigo-500 hover:scale-105 transition-all duration-300"
          >
            {/* Title */}
            <Link href={`/anime/${anime.mal_id}`}>
              <h3 className="font-bold text-indigo-800 text-lg hover:underline hover:text-indigo-900 cursor-pointer text-center mb-3">
                {anime.title}
              </h3>
            </Link>

            {/* Main Content */}
            <div className="flex flex-row h-[38vh] overflow-hidden gap-4">
              {/* Image */}
              <div className="flex flex-col w-2/5">
                <img
                  src={anime.image_url}
                  alt={anime.title}
                  className="w-full h-56 object-cover rounded-2xl shadow-sm mb-2 border border-gray-200"
                />

                <div className="text-xs text-gray-700 text-center space-y-1 font-medium mt-2">
                  <p>
                    {anime.type} ({anime.episodes || "???"} eps)
                  </p>
                  <p>
                    {anime.aired_from
                      ? format(new Date(anime.aired_from), "MMM yyyy")
                      : "Unknown"}{" "}
                    -{" "}
                    {anime.aired_to
                      ? format(new Date(anime.aired_to), "MMM yyyy")
                      : "Now"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col text-xs text-gray-800 overflow-y-auto pr-2 scrollbar-none">
                <div className="space-y-1 leading-relaxed">
                  {anime.synopsis && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Synopsis:
                      </span>{" "}
                      <Synopsis synopsis={anime.synopsis} unstyled />
                    </p>
                  )}

                  {anime.Genres?.length > 0 && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Genres:
                      </span>{" "}
                      {anime.Genres.map((g) => g.name).join(", ")}
                    </p>
                  )}

                  {anime.Demographics?.length > 0 && (
                    <p>
                      <span className="font-semibold text-gray-900">
                        Demographics:
                      </span>{" "}
                      {anime.Demographics.map((d) => d.name).join(", ")}
                    </p>
                  )}

                  <p>
                    <span className="font-semibold text-gray-900">Status:</span>{" "}
                    {anime.status}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Type:</span>{" "}
                    {anime.type}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">
                      Episodes:
                    </span>{" "}
                    {anime.episodes || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Score + Favorite */}
            <div className="flex justify-between items-center mt-4 px-3">
              <span className="text-sm font-bold text-pink-600">
                {anime.score}
              </span>
              <FavoriteF anime={anime} />
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
