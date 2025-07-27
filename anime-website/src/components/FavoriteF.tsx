// components/FavoriteF.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-toastify";

interface Anime {
  mal_id: number;
  // Các trường khác có thể bỏ qua nếu không dùng ở đây
}

interface FavoriteFProps {
  anime: Anime;
}

export default function FavoriteF({ anime }: FavoriteFProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<number | undefined>();

  const { user } = useUser();

  useEffect(() => {
    const fetchFavorites = async () => {
      const user_id = user?.user.user_id;

      setUserId(user_id);

      if (!user_id) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/anime/favorite/${user_id}`
        );
        const favorites: { mal_id: number }[] = response.data;
        const isFav = favorites.some((item) => item.mal_id === anime.mal_id);
        setIsFavorite(isFav);
      } catch (err) {
        console.error("Lỗi khi fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, [anime.mal_id, user]);

  const toggleFavorite = async () => {
    if (!userId) {
      toast.warning("Bạn cần đăng nhập để sử dụng chức năng này.");
      return;
    }

    try {
      if (isFavorite) {
        // Xoá khỏi danh sách yêu thích
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/anime/favorite`,
          {
            data: {
              userId,
              anime_id: anime.mal_id,
            },
          }
        );
        setIsFavorite(false);
        toast.success("Đã xoá khỏi danh sách yêu thích.");
      } else {
        // Thêm vào danh sách yêu thích
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/anime/favorite`,
          {
            userId,
            anime_id: anime.mal_id,
          }
        );
        setIsFavorite(true);
        toast.success("Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("Lỗi thao tác favorite:", error);
      toast.warning("⚠️ Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return isFavorite ? (
    <button
      onClick={toggleFavorite}
      className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded-md font-semibold flex items-center gap-1"
    >
      <FaHeart className="text-white" />
      Đã yêu thích
    </button>
  ) : (
    <button
      onClick={toggleFavorite}
      className="mt-2 px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-black rounded-md font-semibold"
    >
      + Thêm vào yêu thích
    </button>
  );
}
