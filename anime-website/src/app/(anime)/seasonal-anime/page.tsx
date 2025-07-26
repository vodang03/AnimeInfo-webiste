// src/app/(anime)/seasonal-anime/page.tsx
import SeasonalAnimeClient from "@/components/SeasonalAnimeClient";
import { Suspense } from "react";

export default function SeasonalAnimePage() {
  return (
    // Bọc SeasonalAnimeClient trong Suspense
    <Suspense fallback={<div>Đang tải anime theo mùa...</div>}>
      <SeasonalAnimeClient />
    </Suspense>
  );
}
