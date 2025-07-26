import React from "react";

interface Anime {
  mal_id: number;
  title: string;
  image_url: string;
}

interface AnimeHorizontalListProps {
  animeList: Anime[];
  setCurrentIndex: (index: number) => void;
}

const AnimeHorizontalListReverse: React.FC<AnimeHorizontalListProps> = ({
  animeList,
  setCurrentIndex,
}) => {
  return (
    <div className="flex overflow-x-auto space-x-8 mt-4 custom-scrollbar">
      {animeList
        .slice()
        .reverse()
        .map((anime, index) => (
          <div
            key={anime.mal_id}
            className="flex-none w-48 py-4 transform transition duration-200 hover:-translate-y-2 group cursor-pointer"
            onClick={() => setCurrentIndex(index)}
          >
            <div className="relative">
              <img
                src={anime.image_url}
                alt={anime.title}
                className="w-full h-64 object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-transparent backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-b">
                {anime.title}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnimeHorizontalListReverse;
