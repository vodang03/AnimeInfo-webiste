"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import BirthDatePicker from "@/components/BirthDatePicker";
import { fetchGenres } from "@/api/anime";
import { toast } from "react-toastify";
import genreColorMap from "@/utils/genreColorMap";
import { registerUser } from "@/api/user";

interface Genre {
  genre_id: number;
  name: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showGenreModal, setShowGenreModal] = useState(false);
  const [newUserId, setNewUserId] = useState<number | null>(null); // từ backend trả về
  const [genreList, setGenreList] = useState<Genre[]>([]);

  const getGenreColor = (name: string) => {
    return genreColorMap[name] || { bg: "bg-gray-200", text: "text-gray-800" };
  };

  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  // Chọn thể loại bạn thích
  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      if (selectedGenres.length >= 3) {
        toast.error("Bạn chỉ được chọn tối đa 3 thể loại.");
        return;
      }
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleConfirmGenres = async () => {
    if (selectedGenres.length === 0) {
      toast.error("Bạn chưa chọn thể loại nào!");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/user/genre`, {
        user_id: newUserId, // hoặc user id bạn lấy từ response đăng ký
        genres: selectedGenres,
      });
      toast.success("Lưu thể loại thành công!");
      setShowGenreModal(false);
      router.push("/login");
    } catch (error) {
      console.error("Lỗi lưu thể loại:", error);
      toast.error("Lưu thể loại thất bại!");
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate) {
      alert("Vui lòng chọn ngày sinh");
      return;
    }

    try {
      const { userId } = await registerUser(
        username,
        email,
        password,
        birthDate
      );
      setNewUserId(userId);
      setShowGenreModal(true);
      toast.success("Đăng ký thành công!");
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      console.log(err);
    }
  };

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await fetchGenres();
        setGenreList(genres);
      } catch (err) {
        console.error("Không thể tải danh sách thể loại:", err);
      }
    };
    loadGenres();
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Ảnh nền toàn màn hình */}
      <img
        src="/images/login-illustration.webp"
        alt="Register Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Lớp overlay làm tối nhẹ ảnh nền */}
      <div className="absolute inset-0 bg-blue-900/30" />

      {/* Form đăng ký nằm bên phải, cao bằng màn hình */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md z-10 bg-white/20 backdrop-blur-md border-l border-white/30 flex flex-col justify-center p-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Đăng ký
          </h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Tên đăng nhập
              </label>

              <input
                type="text"
                className="w-full px-3 py-2 border border-white/30 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                maxLength={50}
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-white/30 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={100}
                placeholder="Nhập email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-white/30 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white text-sm select-none"
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <BirthDatePicker value={birthDate} onChange={setBirthDate} />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Đăng ký
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-white">
            Đã có tài khoản?{" "}
            <span
              className="text-blue-200 hover:underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </span>
          </p>
        </div>
      </div>

      {/* Modal chọn genre yêu thích */}
      {showGenreModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              Chọn thể loại bạn yêu thích{" "}
              <span className="text-sm">(tối đa 3)</span>
            </h3>

            <div className="flex flex-wrap gap-3 ">
              {genreList.map((genre) => {
                const isSelected = selectedGenres.includes(genre.genre_id);
                const colors = getGenreColor(genre.name);

                return (
                  <button
                    key={genre.genre_id}
                    type="button"
                    onClick={() => toggleGenre(genre.genre_id)}
                    className={`px-5 py-2 rounded-full font-semibold border shadow-sm transform transition-all duration-150
              ${
                isSelected
                  ? `${colors.bg} ${colors.text} scale-105`
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }
            `}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>

            <button
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
              onClick={() => handleConfirmGenres()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
