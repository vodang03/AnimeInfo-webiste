"use client"; // 👈 BẮT BUỘC để dùng useState, useEffect

import { fetchAnimeByGenres, fetchSeasonalAnime } from "@/api/anime";
import AnimeHorizontalList from "@/components/AnimeHorizontalList";
import AnimeHorizontalListReverse from "@/components/AnimeHorizontalList(rev)";
import AnimeSlider from "@/components/AnimeSlider";
import AnimeSliderReverse from "@/components/AnimeSlider(rev)";
import getCurrentSeasonTitle from "@/components/CurentSeason";
import getCurrentSeasonAndYear from "@/components/GetCurrentSeason";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

export interface Anime {
  mal_id: number;
  title: string;
  type: string;
  title_vietnamese: string;
  episodes: number;
  status: string;
  image_url: string;
  score: number;
  synopsis: string;
  Themes: { name: string }[];
  Genres: { name: string; genre_id: number }[]; // ví dụ: ["Action", "Adventure"]
  Demographics: { name: string }[];
  aired_from: string;
  aired_to: string;
}

export default function AnimeHome() {
  // Lấy thông tin user
  const { user } = useUser();
  const genreIds = user?.user.Genres.map((g) => g.genre_id) || [];

  const [seasonAnimeList, setSeasonAnimeList] = useState<Anime[]>([]);

  const [suggestAnimeList, setSuggestAnimeList] = useState<Anime[]>([]);

  const [currentSeasonIndex, setCurrentSeasonIndex] = useState(0);
  const [currentSuggestIndex, setCurrentSuggestIndex] = useState(0);

  useEffect(() => {
    const fetchSeasonal = async () => {
      const { season, year } = getCurrentSeasonAndYear();

      try {
        const res = await fetchSeasonalAnime(season, year);

        setSeasonAnimeList(res);
      } catch (err) {
        console.error("Error fetching seasonal anime:", err);
      }
    };

    fetchSeasonal();
  }, [user]);

  // 👇 useEffect chạy khi user thay đổi (sau khi fetch xong user)
  useEffect(() => {
    const fetchSuggest = async () => {
      if (genreIds.length === 0) return;

      try {
        const data = await fetchAnimeByGenres(genreIds);
        setSuggestAnimeList(data);
      } catch (err) {
        console.error("Error fetching suggest anime:", err);
      }
    };

    if (user) fetchSuggest();
  }, [user]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <img
        src="/images/Welcome.png"
        alt="Hình ảnh chào mừng"
        className="max-h-[70vh] w-auto mx-auto block object-contain"
      />

      <h1 className="text-indigo-800 text-2xl font-bold mt-10">
        {getCurrentSeasonTitle()}
      </h1>
      <AnimeSlider
        animeList={seasonAnimeList}
        currentIndex={currentSeasonIndex}
        setCurrentIndex={setCurrentSeasonIndex}
      />
      <AnimeHorizontalList
        animeList={seasonAnimeList}
        setCurrentIndex={setCurrentSeasonIndex}
      />

      {suggestAnimeList.length > 0 && (
        <>
          <h1 className="text-indigo-800 text-2xl font-bold mt-10">
            Những bộ anime có thể bạn thích
          </h1>
          <AnimeSliderReverse
            animeList={suggestAnimeList}
            currentIndex={currentSuggestIndex}
            setCurrentIndex={setCurrentSuggestIndex}
          />
          <AnimeHorizontalListReverse
            animeList={suggestAnimeList}
            setCurrentIndex={setCurrentSuggestIndex}
          />
        </>
      )}
    </div>
  );
}
