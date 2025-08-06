// src/app/(anime)/search/AnimeSearchClient.tsx
"use client"; // Đảm bảo đây là client component

import {
  fetchAnimeSearch,
  fetchGenreAnimeSearch,
  fetchGenres,
  fetchGenreThemeAnimeSearch,
  fetchThemeAnimeSearch,
  fetchThemes,
} from "@/api/anime";
import { Anime } from "@/app/(anime)/home/page";
import { Genres } from "@/app/user/[id]/page";
import AnimeList from "@/components/AnimeList";
import { genreTranslations } from "@/utils/genreTranslations";
import { themeTranslations } from "@/utils/themeTranslations";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface Themes {
  theme_id: number;
  name: string;
}

export default function AnimeSearchClient() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState("score");

  const [sortedAnimeList, setSortedAnimeList] = useState<Anime[]>([]);

  const [isExpand, setIsExpand] = useState(false);
  const [isgenre, setisGenre] = useState<Genres[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const [istheme, setisTheme] = useState<Themes[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string[]>([]);

  const itemsPerPage = 12;

  // useSearchParams chỉ được sử dụng ở đây
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q");
  const genre = searchParams.get("genre");

  const theme = searchParams.get("theme");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAnimeList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAnimeList.length / itemsPerPage);

  const handleCheckboxChangeGenre = (genrename: string) => {
    setSelectedGenres((prevSelected) => {
      const isSelected = prevSelected.includes(genrename);
      const params = new URLSearchParams(searchParams.toString());

      if (isSelected) {
        params.delete("genre");
        router.push(`/search?${params.toString()}`);
        return [];
      } else {
        params.set("genre", genrename); // thay genre hiện tại
        router.push(`/search?${params.toString()}`);
        return [genrename];
      }
    });
  };

  const handleCheckboxChangeTheme = (genrename: string) => {
    setSelectedTheme((prevSelected) => {
      const isSelectedTheme = prevSelected.includes(genrename);

      const params = new URLSearchParams(searchParams.toString());
      if (isSelectedTheme) {
        params.delete("theme");
        router.push(`/search?${params.toString()}`);
        return [];
      } else {
        params.set("theme", genrename); // thay genre hiện tại
        router.push(`/search?${params.toString()}`);
        return [genrename];
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (genre && theme) {
          const data = await fetchGenreThemeAnimeSearch(genre, theme);
          setSelectedGenres([genre]);
          setSelectedTheme([theme]);
          setAnimeList(data);
        } else if (genre) {
          const data = await fetchGenreAnimeSearch(genre);
          setSelectedGenres([genre]);
          setAnimeList(data);
        } else if (theme) {
          const data = await fetchThemeAnimeSearch(theme);
          setSelectedTheme([theme]);
          setAnimeList(data);
        } else if (query) {
          const data = await fetchAnimeSearch(query);
          setAnimeList(data);
        }
        setCurrentPage(1);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm anime:", error);
      }
    };

    fetchData();
  }, [query, genre, theme]); // thêm theme vào dependency array

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await fetchGenres();
        setisGenre(res);
      } catch (error) {
        console.log("Error get genres:", error);
      }
    };
    const fetchTheme = async () => {
      try {
        const res = await fetchThemes();

        console.log(res);

        setisTheme(res);
      } catch (error) {
        console.log("Error get genres:", error);
      }
    };

    fetchTheme();
    fetchGenre();
  }, []);

  useEffect(() => {
    // Tạo bản sao để tránh thay đổi trực tiếp state ban đầu
    const sortedList = [...animeList];

    if (orderBy === "score") {
      sortedList.sort((a, b) => b.score - a.score);
    } else if (orderBy === "title") {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }

    setSortedAnimeList(sortedList);
    setCurrentPage(1);
  }, [orderBy, animeList]); // Thêm animeList vào dependency array (quan trọng!)

  console.log("Anime đã tìm thấy: ", currentItems);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-indigo-800 text-2xl font-bold mb-4">
        Kết quả tìm kiếm: {query && ` "${query}"`}
        {genre && ` (Thể loại: ${genreTranslations[genre] || genre})`}
        {theme && ` (Chủ đề: ${themeTranslations[theme] || theme})`}
      </h2>

      <button
        onClick={() => setIsExpand((prev) => !prev)}
        className="flex items-center gap-2 pb-2 text-indigo-600 font-medium hover: focus:outline-none transition"
      >
        {isExpand ? "Ẩn danh mục" : "Hiện danh mục"}
        {isExpand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {isExpand && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="overflow-hidden py-4 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-md"
          >
            <div className="pl-6 mb-2">Thể loại</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pl-6">
              {isgenre.map((namegenre, index) => {
                return (
                  <label
                    key={index}
                    className={`flex items-center space-x-2 cursor-pointer`}
                  >
                    <input
                      type="checkbox"
                      className="appearance-none h-5 w-5 rounded-full border border-blue-400 checked:bg-blue-400 transition duration-200"
                      value={namegenre.name}
                      checked={selectedGenres?.includes(namegenre.name)}
                      onChange={() => handleCheckboxChangeGenre(namegenre.name)}
                    />
                    <span className="text-gray-800">
                      {genreTranslations[namegenre.name] || namegenre.name}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="pl-6 my-2">Chủ đề</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pl-6">
              {istheme.map((nametheme, index) => {
                return (
                  <label
                    key={index}
                    className={`flex items-center space-x-2 cursor-pointer`}
                  >
                    <input
                      type="checkbox"
                      className="appearance-none h-5 w-5 rounded-full border border-blue-400 checked:bg-blue-400 transition duration-200"
                      value={nametheme.name}
                      checked={selectedTheme?.includes(nametheme.name)}
                      onChange={() => handleCheckboxChangeTheme(nametheme.name)}
                    />
                    <span className="text-gray-800">
                      {themeTranslations[nametheme.name] || nametheme.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bộ lọc sắp xếp */}
      <div className="mb-6 pt-2">
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
