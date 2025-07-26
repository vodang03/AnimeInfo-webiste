"use client";

import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pagesToDisplay = generatePageNumbers();
  const [inputPage, setInputPage] = useState("");

  return (
    <div className="flex justify-center mb-4 space-x-1">
      {pagesToDisplay.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-1 text-white select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-zinc-700 text-white hover:bg-zinc-600"
            }`}
          >
            {page}
          </button>
        )
      )}

      <input
        type="number"
        placeholder="Trang"
        className="p-2 rounded text-black border w-24"
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const page = parseInt(inputPage);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
              onPageChange(page);
              setInputPage(""); // Xoá input sau khi nhảy
            }
          }
        }}
      />
    </div>
  );
}
