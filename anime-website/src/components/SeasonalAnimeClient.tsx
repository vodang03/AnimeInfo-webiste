"use client";

import { fetchSeasonalAnime } from "@/api/anime";
import { Anime } from "@/app/(anime)/home/page";
import AnimeList from "@/components/AnimeList";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SeasonalAnimeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [animeList, setAnimeList] = useState<Anime[]>([]);

  const season = searchParams.get("season") || "summer";
  const year = parseInt(searchParams.get("year") || "2025");

  const [selectedSeason, setSelectedSeason] = useState(season);
  const [selectedYear, setSelectedYear] = useState(year);
  const [orderBy, setOrderBy] = useState("score");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // số lượng mỗi trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = animeList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(animeList.length / itemsPerPage);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    const loadAnime = async () => {
      try {
        const data = await fetchSeasonalAnime(season, year);
        setAnimeList(data);
      } catch (error) {
        console.error("Failed to load anime:", error);
      }
    };

    setSelectedSeason(season);
    setSelectedYear(year);
    loadAnime();
  }, [season, year]);

  useEffect(() => {
    const sortedList = [...animeList];

    if (orderBy === "score") {
      sortedList.sort((a, b) => b.score - a.score);
    } else if (orderBy === "title") {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }

    setAnimeList(sortedList);
    setCurrentPage(1);
  }, [orderBy]);

  useEffect(() => {
    // Nếu không có query param trên URL thì tự động thêm
    if (!searchParams.get("season") || !searchParams.get("year")) {
      const defaultSeason = "summer";
      const defaultYear = new Date().getFullYear().toString();

      const params = new URLSearchParams({
        season: searchParams.get("season") || defaultSeason,
        year: searchParams.get("year") || defaultYear,
      });

      // Sử dụng replace để không thêm vào history
      router.replace(`/seasonal-anime?${params.toString()}`);
    }
  }, []);

  // Hàm xử lý khi nhấn nút "Lọc"
  const handleFilter = async () => {
    const params = new URLSearchParams({
      season: selectedSeason,
      year: selectedYear.toString(),
    });

    router.push(`/seasonal-anime?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-indigo-800 text-2xl font-bold mb-4">
        Anime theo mùa
      </h2>

      {/* Bộ lọc season và năm */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-400"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
        >
          <option value="winter">❄️ Mùa đông</option>
          <option value="spring">🌸 Mùa xuân</option>
          <option value="summer">☀️ Mùa hè</option>
          <option value="fall">🍂 Mùa thu</option>
        </select>

        <select
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-400"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={handleFilter}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          🔍 Lọc
        </button>
      </div>

      {/* Bộ lọc sắp xếp */}
      <div className="mb-6">
        <label className="mr-2 text-gray-700 font-medium">Sắp xếp theo:</label>
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-indigo-400"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="score">⭐ Score (Điểm)</option>
          <option value="title">🔠 Title (Tên)</option>
        </select>
      </div>

      {/* Danh sách anime */}
      <AnimeList
        animeList={currentItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
