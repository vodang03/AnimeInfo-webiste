"use client";

import { fetchFavoAnime } from "@/api/anime";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Anime {
  mal_id: number;
  title: string;
  image_url: string;
}

export default function PlaylistPage() {
  const [faList, setFaList] = useState<Anime[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      const user_id = user?.user.user_id;
      if (!user_id) return;

      try {
        const response = await fetchFavoAnime(user_id);
        setFaList(response.favorites);
      } catch (err) {
        console.error("Lỗi khi fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="p-5 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-2">Danh sách anime</h1>
      {faList?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
          <div
            className="rounded-lg overflow-hidden shadow-md cursor-pointer bg-white"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="relative">
              <img
                src={faList[0]?.image_url}
                alt="Ảnh đại diện"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
                {faList.length} anime
              </div>
            </div>
            <div className="p-3 bg-red-200">
              <h2 className="font-semibold text-lg">Anime yêu thích</h2>
              <p className="text-sm text-gray-600">
                Nhấn để {isExpanded ? "thu gọn" : "xem chi tiết"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center font-bold text-xl">
          Không có bất kỳ danh sách anime nào cả
        </h1>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mt-2"
          >
            <div className="min-h-screen py-6 bg-gradient-to-br from-indigo-100 to-pink-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 mx-6">
                {faList.map((item) => (
                  <div
                    key={item.mal_id}
                    className="rounded-lg overflow-hidden shadow-md hover:scale-105 transform transition duration-300 cursor-pointer bg-white"
                  >
                    <Link href={`/anime/${item.mal_id}`}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-3 space-y-1">
                        <h2 className="text-base font-semibold line-clamp-2">
                          {item.title}
                        </h2>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
