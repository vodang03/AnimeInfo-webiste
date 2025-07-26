"use client"; // 👈 BẮT BUỘC để dùng useState, useEffect

import { fetchAnimeSearch, fetchGenreAnimeSearch } from "@/api/anime";
import AnimeList from "@/components/AnimeList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function AnimeSearched() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState("score");
  const itemsPerPage = 18;

  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const genre = searchParams.get("genre");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = animeList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(animeList.length / itemsPerPage);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const data = await fetchGenreAnimeSearch(genre!);
        setAnimeList(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };
    const fetchData = async () => {
      try {
        const data = await fetchAnimeSearch(query!);
        setAnimeList(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };

    if (genre) {
      fetchGenreData();
    } else if (query) {
      fetchData();
    }
  }, [query, genre]);

  useEffect(() => {
    // Tạo bản sao để tránh thay đổi trực tiếp state ban đầu
    const sortedList = [...animeList];

    if (orderBy === "score") {
      sortedList.sort((a, b) => b.score - a.score);
    } else if (orderBy === "title") {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }

    setAnimeList(sortedList);
    setCurrentPage(1);
  }, [orderBy]);

  console.log("Anime đã tìm thấy: ", currentItems);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-indigo-800 text-2xl font-bold mb-4">
        Kết quả tìm kiếm: {query || genre}
      </h2>

      {/* Bộ lọc sắp xếp */}
      <div className="mb-6">
        <label className="mr-2 text-gray-700 font-medium">Sắp xếp theo:</label>
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-400"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="score">⭐ Điểm</option>
          <option value="title">🔠 Tên</option>
        </select>
      </div>

      <AnimeList
        animeList={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
