// src/components/AppShell.tsx
"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import ChatWidget from "./ChatWidget";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [, setSelectedAnimeOption] = useState("Top Anime");
  const router = useRouter();

  const handleSelectAnimeOption = (option: string) => {
    setSelectedAnimeOption(option);
    if (option === "Top Anime") {
      router.push("/top-anime"); // 👈 chuyển trang
    } else if (option === "Seasonal Anime") {
      router.push("/seasonal-anime");
    } else if (option === "Top Airing") {
      router.push("/top-airing");
    } else if (option === "Discussion Room") {
      router.push("/discussion");
    } else if (option === "Home") {
      router.push("/home");
    }
  };

  return (
    <main className="pb-40 px-32 bg-gradient-to-br from-sky-50 to-indigo-100 min-h-screen">
      <Navbar onSelectAnimeOption={handleSelectAnimeOption} />
      {children}
      {/* Thêm ToastContainer ở đây */}
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ChatWidget />
    </main>
  );
}
