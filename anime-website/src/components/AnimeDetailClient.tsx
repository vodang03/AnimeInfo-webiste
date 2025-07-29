"use client";

import Synopsis from "@/components/SynopsisExpand";
import { useEffect, useState } from "react";
import FavoriteF from "./FavoriteF";
import Link from "next/link";
import genreColorMap from "@/utils/genreColorMap";
import AnimeComment from "./AnimeComment";
import {
  fetchAnimeRating,
  fetchWatchStatusAPI,
  submitAnimeRating,
  updateWatchStatus,
} from "@/api/anime";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-toastify";

interface Anime {
  mal_id: number;
  title: string;
  type: string;
  episodes: number;
  status: string;
  image_url: string;
  score: number;
  rating: string;
  synopsis: string;
  Genres: { name: string }[];
  Demographics: { name: string }[];
  Themes: { name: string }[];
  aired_from: string;
  aired_to: string;
  year: string;
  season: string;
  title_japanese: string;
  title_english: string;
  source: string;
  duration: string;
  favorites: string;
  trailer_url: string;
}

interface Trailer {
  anime_id: string;
  youtube_video_id: string;
  title: string;
  thumbnail_url: string;
  published_at: string;
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

export default function AnimeDetailClient({
  anime,
  trailer,
}: {
  anime: Anime;
  trailer: Trailer[];
}) {
  const { user } = useUser();

  const [openVideoId, setOpenVideoId] = useState<string | null>(null);
  const primaryGenre = anime.Genres?.[0]?.name ?? "Fantasy";
  const { bg, text } = genreColorMap[primaryGenre] || {
    bg: "bg-white",
    text: "text-black",
  };

  const [userScore, setUserScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [watchStatus, setWatchStatus] = useState<number>(1);

  const handleScoreChange = async (score: number) => {
    setUserScore(score);
    setIsSubmitting(true);

    if (user?.user.user_id === undefined) {
      toast.warning("Bạn cần đăng nhập để cho điểm");
    }

    try {
      await submitAnimeRating(user!.user.user_id, anime.mal_id, score);
      toast.success("Đã đánh giá thành công");
    } catch (err) {
      console.error("Lỗi khi gửi điểm:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWatchStatusChange = async (newStatus: number) => {
    if (!user) return;
    try {
      await updateWatchStatus(user.user.user_id, anime.mal_id, newStatus);
      setWatchStatus(newStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      if (!user) return;

      try {
        const res = await fetchAnimeRating(user.user.user_id, anime.mal_id);

        setUserScore(res.rating?.score ?? null); // 👈 dùng userScore
      } catch (error) {
        console.error("Lỗi khi fetch rating:", error);
      }
    };

    const fetchWatchStatus = async () => {
      if (!user) return;

      try {
        const res = await fetchWatchStatusAPI(user.user.user_id, anime.mal_id);

        setWatchStatus(res.watchstatus.status_type_id);
      } catch (error) {
        console.error("Lỗi khi fetch watch status:", error);
      }
    };

    fetchRating();
    fetchWatchStatus();
  }, [user, anime.mal_id]);

  return (
    <div className="relative rounded-xl shadow-lg">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-90 blur-sm -translate-y-10 "
        style={{
          backgroundImage: `url(${anime.image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 mt-12">
        {/* Background Blur Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center brightness-50 blur-sm scale-110"
          style={{ backgroundImage: `url(${anime.image_url})` }}
        ></div>

        {/* Overlay Content */}
        <div
          className={`relative z-10 flex flex-col md:flex-row p-6 md:p-10 gap-8 backdrop-blur-[8px] ${bg}`}
        >
          {/* Anime Cover */}
          <div className="flex-shrink-0 max-w-60">
            <img
              src={anime.image_url}
              alt={anime.title}
              className="rounded-xl shadow-lg border border-white w-44 h-64 object-cover"
            />
            <div className={`mt-3 space-y-1 text-sm ${text}`}>
              <p>
                <span className="font-semibold">Japanese:</span>{" "}
                {anime.title_japanese || anime.title_english}
              </p>
              <p>
                <span className="font-semibold">Episodes:</span>{" "}
                {anime.episodes ?? "Unknown"}
              </p>
              <p>
                <span className="font-semibold">Source:</span>{" "}
                {anime.source || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Favorites:</span> ❤️{" "}
                {anime.favorites || 0}
              </p>
            </div>
            <div className="mt-2">
              <FavoriteF anime={anime} />
            </div>
          </div>

          {/* Anime Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-indigo-800">
                {anime.title}
              </h1>
              <div className="text-white bg-indigo-600 rounded-xl px-3 py-1 text-sm font-semibold shadow-sm">
                ⭐ {anime.score ?? "N/A"}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                {anime.season || anime.year
                  ? `${
                      anime.season
                        ? anime.season.charAt(0).toUpperCase() +
                          anime.season.slice(1).toLowerCase()
                        : ""
                    }${anime.season && anime.year ? " " : ""}${
                      anime.year || ""
                    }`
                  : "Unknown"}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {anime.type}
              </span>
              <span
                className={`px-2 py-1 rounded-full ${
                  anime.status === "Currently Airing"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {anime.status}
              </span>
            </div>

            {/* Genres & Themes */}
            <div className="mt-4 space-y-2 text-sm">
              {/* Thể loại */}
              {anime.Genres?.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-slate-700">
                    🎭 Thể loại:
                  </span>
                  {anime.Genres.map((genre) => (
                    <Link
                      key={genre.name}
                      href={`/search?genre=${encodeURIComponent(genre.name)}`}
                      className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs hover:bg-slate-200 transition"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Chủ đề */}
              {anime.Themes?.length > 0 && (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-slate-700">
                    🌟 Chủ đề:
                  </span>
                  {anime.Themes.map((theme) => (
                    <Link
                      key={theme.name}
                      href={`/search?theme=${encodeURIComponent(theme.name)}`}
                      className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs border border-indigo-200 hover:bg-indigo-100 transition"
                    >
                      {theme.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* User Rating */}
            <div className="mt-2 flex">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Đánh giá:
                </label>
                <select
                  value={userScore ?? ""}
                  onChange={(e) => {
                    handleScoreChange(parseFloat(e.target.value));
                    if (watchStatus === 1) {
                      handleWatchStatusChange(3);
                    }
                  }}
                  disabled={isSubmitting}
                  className="ml-2 p-1 border rounded-md text-sm"
                >
                  <option value="">-- Điểm --</option>
                  {[...Array(10)].map((_, i) => {
                    const value = i + 1;
                    return (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="ml-2">
                <label className="text-sm font-medium text-slate-700">
                  Trạng thái xem:
                </label>
                <select
                  value={watchStatus}
                  onChange={(e) =>
                    handleWatchStatusChange(Number(e.target.value))
                  }
                  className="ml-2 p-1 border rounded-md text-sm"
                >
                  <option value="1">Chưa xem</option>
                  <option value="2">Lên kế hoạch xem</option>
                  <option value="3">Đang xem</option>
                  <option value="4">Đã xem</option>
                  <option value="5">Bỏ xem</option>
                </select>
              </div>
            </div>

            {/* Demographics */}
            <div className="mt-2 flex flex-wrap gap-2">
              {anime.Demographics?.map((demo) => (
                <span
                  key={demo.name}
                  className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full"
                >
                  {demo.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mt-4 max-h-48 overflow-y-auto pr-2 text-sm text-gray-800 leading-relaxed">
              <Synopsis synopsis={anime.synopsis} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          className={`relative mt-6 p-6 ${bg} backdrop-blur-md rounded-2xl shadow`}
        >
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">
            🎥 Trailer
          </h2>
          {anime.trailer_url || trailer.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500">
              {anime.trailer_url && (
                <div
                  className="flex-shrink-0 w-80 rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer"
                  onClick={() =>
                    setOpenVideoId(getYoutubeId(anime.trailer_url))
                  }
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      anime.trailer_url
                    )}?controls=0&mute=1`}
                    className="w-full h-48 pointer-events-none"
                    allowFullScreen
                    title="Official Trailer"
                  ></iframe>
                </div>
              )}

              {trailer.map((t, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 rounded-xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer"
                  onClick={() => setOpenVideoId(t.youtube_video_id)}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${t.youtube_video_id}?controls=0&mute=1`}
                    className="w-full h-48 pointer-events-none"
                    allowFullScreen
                    title="Official Trailer"
                  ></iframe>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">
              Chưa có trailer nào được cung cấp.
            </p>
          )}
        </div>

        {openVideoId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setOpenVideoId(null)}
          >
            <div
              className="relative w-[80vw] max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                className="w-full h-full rounded-md"
                src={`https://www.youtube.com/embed/${openVideoId}?autoplay=1`}
                title="Trailer lớn"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              <button
                onClick={() => setOpenVideoId(null)}
                className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-70 rounded-full p-2 hover:bg-gray-700 transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimeComment background={bg} animeID={anime.mal_id} />
    </div>
  );
}
