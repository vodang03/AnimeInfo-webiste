"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";

interface Anime {
  mal_id: number;
  title: string;
  type: string;
  episodes: number;
  status: string;
  image_url: string;
  score: number;
  synopsis: string;
  Themes: { name: string }[];
  Genres: { name: string }[];
  Demographics: { name: string }[];
}

interface Props {
  animeList: Anime[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function AnimeSlider({
  animeList,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const prev = () =>
    setCurrentIndex(
      currentIndex === 0 ? animeList.length - 1 : currentIndex - 1
    );
  const next = () =>
    setCurrentIndex(
      currentIndex === animeList.length - 1 ? 0 : currentIndex + 1
    );

  // 👇 Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 10000); // 5 giây

    return () => clearInterval(interval); // Dọn khi unmount
  }, [currentIndex, animeList.length]); // Chạy lại khi animeList thay đổi

  return (
    <div className="relative overflow-hidden w-full mt-2">
      {/* Slider container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {Array.isArray(animeList) &&
          animeList.map((anime) => (
            <div key={anime.mal_id} className="w-full h-[22rem] flex-shrink-0">
              <AnimeCard anime={anime} />
            </div>
          ))}
      </div>

      {/* Mũi tên trái */}
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-shadow duration-300 z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6 text-indigo-700" />
      </button>

      {/* Mũi tên phải */}
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-shadow duration-300 z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6 text-indigo-700" />
      </button>
    </div>
  );
}
