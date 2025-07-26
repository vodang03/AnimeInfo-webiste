// src/app/(anime)/search/page.tsx
import AnimeSearchClient from "@/components/AnimeSearchClient";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    // Bọc AnimeSearchClient trong Suspense
    <Suspense fallback={<div>Đang tải kết quả tìm kiếm...</div>}>
      <AnimeSearchClient />
    </Suspense>
  );
}
