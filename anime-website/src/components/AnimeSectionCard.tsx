"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Anime } from "@/app/user/animelist/page";

interface Props {
  title: string;
  animeList: Anime[];
  sectionKey: string;
  expandedSection: string | null;
  onToggle: (key: string) => void;
}

export default function AnimeSectionCard({
  title,
  animeList,
  sectionKey,
  expandedSection,
  onToggle,
}: Props) {
  const isExpanded = expandedSection === sectionKey;

  return (
    <>
      <div
        className="rounded-lg overflow-hidden shadow-md cursor-pointer bg-white"
        onClick={() => onToggle(sectionKey)}
      >
        <div className="relative">
          <img
            src={animeList[0]?.image_url}
            alt="Ảnh đại diện"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
            {animeList.length} anime
          </div>
        </div>
        <div className="p-3 bg-red-200">
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-sm text-gray-600">
            Nhấn để {isExpanded ? "thu gọn" : "xem chi tiết"}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mt-2 col-span-full"
          >
            <div className="min-h-screen py-6 bg-gradient-to-br from-indigo-100 to-pink-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 mx-6">
                {animeList.map((item) => (
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
    </>
  );
}
