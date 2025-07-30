"use client";
import { useEffect, useState } from "react";
// import axios from "axios";
import {
  fetchAnime,
  fetchAnimeById,
  importAnime,
  updateAnimeById,
} from "@/api/anime";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";

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
  synopsis_vn: string;
  Genres: { name: string }[];
  Demographics: { name: string }[];
  Themes: { name: string }[];
  aired_from: string;
  aired_to: string;
  year: string;
  season: string;
  title_japanese: string;
  title_vietnamese: string;
  title_english: string;
  source: string;
  duration: string;
  favorites: string;
  trailer_url: string;
}

export default function AdminAnimePage() {
  //   const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [animeId, setAnimeId] = useState<string>("");
  const [animeDetail, setAnimeDetail] = useState<Anime>();
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  const [showDetail, setShowDetail] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const handleImport = async () => {
    setLoading(true);
    setMessage("Đang cập nhật dữ liệu anime...");
    try {
      const res = await importAnime(); // axios.post hoặc fetch gọi backend
      console.log(res);

      setMessage("✅ Cập nhật xong anime!");
    } catch (err) {
      setMessage("❌ Lỗi cập nhật anime!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAnime = async () => {
    if (!animeId.trim()) {
      setMessage("❗ Vui lòng nhập ID anime!");
      return;
    }

    setLoading(true);
    setMessage("Đang lấy thông tin anime...");
    setShowDetail(false);

    try {
      const anime = await fetchAnimeById(Number(animeId));
      if (anime === null) {
        setAnimeDetail(anime);
        setMessage("❌ Không có ID trùng khớp");
      } else {
        setAnimeDetail(anime);
        setMessage("✅ Đã lấy được anime!");
      }
    } catch (err) {
      setMessage("❌ Lỗi lấy anime!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title_vietnamese_raw = formData.get("title_vietnamese");
    const synopsis_raw = formData.get("synopsis_vn");

    // Kiểm tra kiểu, chỉ lấy nếu là string, ngược lại gán null hoặc báo lỗi
    const title_vietnamese =
      typeof title_vietnamese_raw === "string" ? title_vietnamese_raw : null;

    const synopsis_vn = typeof synopsis_raw === "string" ? synopsis_raw : null;

    if (synopsis_vn === null) {
      setMessage("❌ Dữ liệu nhập không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      const result = await updateAnimeById(animeDetail!.mal_id, {
        title_vietnamese,
        synopsis_vn,
      });
      toast.success("Đã lưu thành công!");
      console.log(result);
    } catch (error) {
      setMessage("❌ Lỗi lưu!");
      console.log(error);
      // if (error?.response?.status === 404) {
      //   toast.warning("Không có thông tin cập nhật");
      // }
    } finally {
      setLoading(false);
      setAnimeDetail(undefined);
    }
  };

  useEffect(() => {
    const getAllanime = async () => {
      try {
        const anime = await fetchAnime(currentPage, 10);
        console.log(anime);
        setTotalPages(Math.ceil(anime.total / 20));
        setAnimeList(anime.data);
      } catch (error) {
        console.log("Lỗi khi lấy thông tinn anime", error);
      }
    };

    getAllanime();
  }, [currentPage]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Quản lý Anime</h1>

      <button
        onClick={handleImport}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Đang cập nhật..." : "Cập nhật Anime vào Database (Jikan)"}
      </button>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={animeId}
          onChange={(e) => setAnimeId(e.target.value)}
          placeholder="Nhập ID..."
          className="border rounded px-3 py-2 w-28"
        />
        <button
          onClick={handleFetchAnime}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Đang lấy..." : "Lấy Anime Theo ID"}
        </button>
        <button
          onClick={() => {
            setAnimeDetail(undefined);
            setMessage("✅ Đã lấy danh sách");
          }}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Đang lấy..." : "Lấy danh sách đầy đủ"}
        </button>
      </div>

      <p className="text-sm text-gray-600">{message}</p>

      <h1 className="text-3xl">Thông tin anime</h1>
      {!animeDetail && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {!animeDetail &&
        animeList.map((anime) => (
          <div
            key={anime.mal_id}
            className="p-4 rounded bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
            onClick={() => {
              setAnimeDetail(anime);
              setShowDetail(true);
              setAnimeId(anime.mal_id.toString());
            }}
          >
            <p className="text-lg font-semibold">{anime.title}</p>
            <p className="text-sm text-gray-600">ID: {anime.mal_id}</p>
            <p className="text-sm text-gray-500 italic">
              Click để chỉnh sửa chi tiết
            </p>
          </div>
        ))}

      {animeDetail && (
        <div
          className="p-4 rounded bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
          onClick={() => {
            setShowDetail(!showDetail);
            setAnimeDetail(undefined);
          }}
        >
          <p className="text-lg font-semibold">{animeDetail.title}</p>
          <p className="text-sm text-gray-600">ID: {animeDetail.mal_id}</p>
          <p className="text-sm text-gray-500 italic">
            Click để chỉnh sửa chi tiết
          </p>
        </div>
      )}

      {animeDetail && showDetail && (
        <form
          className="border p-4 rounded bg-green-100 space-y-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold">Chỉnh sửa Anime</h2>
          <p className="text-sm">ID: {animeDetail.mal_id}</p>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Tiêu đề chính</label>
            <input
              type="text"
              defaultValue={animeDetail.title}
              className="w-full border rounded px-3 py-2"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tiêu đề tiếng Anh
            </label>
            <input
              type="text"
              defaultValue={animeDetail.title_english}
              className="w-full border rounded px-3 py-2"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tiêu đề tiếng Việt
            </label>
            <input
              type="text"
              name="title_vietnamese"
              defaultValue={animeDetail.title_vietnamese}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Loại phim</label>
              <input
                type="text"
                defaultValue={animeDetail.type}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Số tập</label>
              <input
                type="number"
                defaultValue={animeDetail.episodes}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Trạng thái</label>
              <input
                type="text"
                defaultValue={animeDetail.status}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Độ tuổi</label>
              <input
                type="text"
                defaultValue={animeDetail.rating}
                className="w-full border rounded px-3 py-2"
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tóm tắt tiếng Anh
            </label>
            <textarea
              defaultValue={animeDetail.synopsis}
              name="synopsis"
              className="w-full border rounded px-3 py-2 h-32 resize-none"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tóm tắt tiếng Việt
            </label>
            <textarea
              defaultValue={animeDetail.synopsis_vn}
              name="synopsis_vn"
              className="w-full border rounded px-3 py-2 h-32 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </form>
      )}
    </div>
  );
}
