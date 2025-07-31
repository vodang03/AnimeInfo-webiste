"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCardReverse from "./AnimeCard(rev)";
import { Anime } from "@/app/(anime)/home/page";

interface Props {
  animeList: Anime[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function AnimeSliderReverse({
  animeList,
  currentIndex,
  setCurrentIndex,
}: Props) {
  const prev = () => {
    setCurrentIndex(
      currentIndex === 0 ? animeList.length - 1 : currentIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex(
      currentIndex === animeList.length - 1 ? 0 : currentIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      prev();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, animeList.length]);

  useEffect(() => {
    if (animeList.length > 0) {
      setCurrentIndex(animeList.length - 1);
    }
  }, [animeList]);

  return (
    <div className="relative overflow-hidden w-full mt-2">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {animeList
          .slice()
          .reverse()
          .map((anime) => (
            <div key={anime.mal_id} className="w-full h-[22rem] flex-shrink-0">
              <AnimeCardReverse anime={anime} />
            </div>
          ))}
      </div>

      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-shadow duration-300 z-10"
        aria-label="Next"
      >
        <ChevronLeft className="w-6 h-6 text-indigo-700" />
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-shadow duration-300 z-10"
        aria-label="Previous"
      >
        <ChevronRight className="w-6 h-6 text-indigo-700" />
      </button>
    </div>
  );
}
