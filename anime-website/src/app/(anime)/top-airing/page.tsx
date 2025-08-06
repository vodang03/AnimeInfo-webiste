"use client"; // 👈 BẮT BUỘC để dùng useState, useEffect

import AnimeList from "@/components/AnimeList";
import axios from "axios";
import { useEffect, useState } from "react";
import { Anime } from "../home/page";

export default function TopAiring() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12; // số lượng mỗi trang

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/anime/airing`, {
        params: { page: currentPage, limit: itemsPerPage },
      })
      .then((res) => {
        setAnimeList(res.data.data); // Vì API trả về một Object
        setTotalPages(Math.ceil(res.data.total / itemsPerPage)); // ⬅ tổng số trang
      })
      .catch((err) => console.error("Error fetching anime:", err));
  }, [currentPage]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-indigo-800 text-2xl font-bold mb-4">
        Anime đang phát sóng
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
