"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Header/Logo";
import NavMenu from "./Header/NavMenu";
import SearchBar from "./Header/SearchBar";
import UserMenu from "./Header/UserMenu";
import { fetchhintAnime } from "@/api/anime";
import { toast } from "react-toastify";
import { logoutUser } from "@/api/user";
import { useUser } from "@/contexts/UserContext";

interface NavbarProps {
  onSelectAnimeOption: (option: string) => void;
}

interface Anime {
  title: string;
  mal_id: number;
  image_url: string; // hoặc images.jpg.image_url nếu dùng từ Jikan
}

export default function Navbar({ onSelectAnimeOption }: NavbarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  // Gợi ý tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Anime[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { user, setUser } = useUser();

  // Ẩn khi đang ở trang login hoặc register
  const pathname = usePathname();

  const menuItems = [
    { label: "Trang chủ", value: "Home", dropdown: undefined },
    {
      label: "Anime",
      dropdown: [
        { label: "Đang phát sóng", value: "Top Airing" },
        { label: "Anime hay nhất", value: "Top Anime" },
        { label: "Anime theo mùa", value: "Seasonal Anime" },
      ],
      value: undefined,
    },
    {
      label: "Cộng đồng",
      dropdown: [{ label: "Phòng thảo luận", value: "Discussion Room" }],
      value: undefined,
    },
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetchhintAnime(searchTerm);
        setSuggestions(res);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Chức năng đăng xuất
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.success("Đã đăng xuất tài khoản thành công");
      router.push("/login");
    } catch (error) {
      toast.error("Đăng xuất thất bại");
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  // Mở Chi tiết anime
  const handleNavigate = (url: string) => {
    router.push(url);
  };

  return (
    <div className="top-0 z-50 bg-transparent backdrop-blur-none shadow-none border-none pb-4 flex items-center justify-between gap-6">
      {/* Logo */}
      <Logo onClick={() => router.push("/")} />

      {/* Menu điều hướng */}
      <NavMenu
        pathname={pathname}
        menuItems={menuItems}
        hovered={hovered}
        setHovered={setHovered}
        onSelectAnimeOption={onSelectAnimeOption}
      />

      {/* Thanh tìm kiếm */}
      <SearchBar
        pathname={pathname}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
        isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
      />

      {/* Đăng nhập/Đăng ký hoặc Tên người dùng */}
      <UserMenu
        user={user}
        handleLogout={handleLogout}
        hovered={hovered}
        setHovered={setHovered}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
