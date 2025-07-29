"use client";

import { fetchFavoAnime, fetchWatchStatusAnime } from "@/api/anime";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import AnimeSectionCard from "@/components/AnimeSectionCard";

export interface Anime {
  mal_id: number;
  title: string;
  image_url: string;
}

export default function PlaylistPage() {
  const [faList, setFaList] = useState<Anime[]>([]);

  const [statusLists, setStatusLists] = useState<{
    planning: Anime[];
    watching: Anime[];
    completed: Anime[];
    dropped: Anime[];
  }>({
    planning: [],
    watching: [],
    completed: [],
    dropped: [],
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const { user } = useUser();

  const fetchAnimeByWatchStatus = async () => {
    const user_id = user?.user.user_id;
    if (!user_id) return;

    try {
      const response = await fetchWatchStatusAnime(user_id);

      const planning = [];
      const watching = [];
      const completed = [];
      const dropped = [];

      for (const item of response.favorites) {
        console.log(item);

        const anime = item.Anime;
        switch (item.status_type_id) {
          case 2:
            planning.push(anime);
            break;
          case 3:
            watching.push(anime);
            break;
          case 4:
            completed.push(anime);
            break;
          case 5:
            dropped.push(anime);
            break;
        }
      }

      setStatusLists({ planning, watching, completed, dropped });
    } catch (err) {
      console.error(`Lỗi khi fetch status:`, err);
    }
  };

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

    fetchAnimeByWatchStatus();
    fetchFavorites();
  }, [user]);

  const sectionData = [
    { key: "favorites", title: "Anime yêu thích", data: faList },
    { key: "planning", title: "Anime dự định xem", data: statusLists.planning },
    { key: "watching", title: "Anime đang xem", data: statusLists.watching },
    { key: "completed", title: "Anime đã xem", data: statusLists.completed },
    { key: "dropped", title: "Anime bỏ dở", data: statusLists.dropped },
  ];

  return (
    <div className="p-5 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-2">Danh sách anime</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {sectionData.map(
          ({ key, title, data }) =>
            data.length > 0 && (
              <AnimeSectionCard
                key={key}
                sectionKey={key}
                title={title}
                animeList={data}
                expandedSection={expandedSection}
                onToggle={toggleSection}
              />
            )
        )}
      </div>
    </div>
  );
}
