"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BirthDatePicker from "@/components/BirthDatePicker";
import { toast } from "react-toastify";
import { registerUser } from "@/api/user";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Xử lý đăng ký
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate) {
      alert("Vui lòng chọn ngày sinh");
      return;
    }

    try {
      await registerUser(username, email, password, birthDate);
      router.push("/login");
      toast.success("Đăng ký thành công!");
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      console.log(err);
    }
  };

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
    </div>
  );
}
