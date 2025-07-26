"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { checkUserLogin, fetchCurrentUser } from "@/api/user";
import { useUser } from "@/contexts/UserContext";

export default function LoginPage() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await checkUserLogin(emailOrUsername, password); // cookie sẽ tự lưu token

      const user = await fetchCurrentUser(); // ✅ Gọi lại API để lấy user sau đăng nhập
      setUser(user); // ✅ Lưu vào context

      toast.success("Đăng nhập thành công!");
      router.push("/"); // chuyển hướng sau khi đăng nhập
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Ảnh nền toàn màn hình */}
      <img
        src="/images/login-illustration.webp"
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Lớp overlay làm tối nhẹ ảnh nếu cần */}
      <div className="absolute inset-0 bg-blue-900/30" />

      {/* Form đăng nhập */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-full h-full max-w-md">
        <div className="bg-white/20 backdrop-blur-md p-8 shadow-2xl w-full h-full max-w-md border border-white/30 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Đăng nhập
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">
                Email hoặc UserName
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-white/30 rounded bg-white/10 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                placeholder="Nhập email hoặc tên đăng nhập"
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Đăng nhập
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-white">
            Chưa có tài khoản?{" "}
            <span
              className="text-blue-200 hover:underline cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
