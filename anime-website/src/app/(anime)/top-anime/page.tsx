"use client"; // 👈 BẮT BUỘC để dùng useState, useEffect

import AnimeList from "@/components/AnimeList";
import axios from "axios";
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
  Genres: { name: string }[]; // ví dụ: ["Action", "Adventure"]
  Demographics: { name: string }[];
  aired_from: string;
  aired_to: string;
}

export default function TopAnime() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 18; // số lượng mỗi trang

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/anime/bestalltime`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      })
      .then((res) => {
        setAnimeList(res.data.data); // ⬅ danh sách anime
        setTotalPages(Math.ceil(res.data.total / itemsPerPage)); // ⬅ tổng số trang
      })
      .catch((err) => console.error("Error fetching anime:", err));
  }, [currentPage]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-indigo-800 text-2xl font-bold mb-4">
        Anime hay nhất mọi thời đại
      </h2>

      <AnimeList
        animeList={animeList}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
