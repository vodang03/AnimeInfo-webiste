import { useState } from "react";

interface SynopsisProps {
  synopsis: string;
  unstyled?: boolean;
}

export default function Synopsis({
  synopsis,
  unstyled = false,
}: SynopsisProps) {
  const [expanded, setExpanded] = useState(false);

  const firstParagraph = synopsis?.split("\n")[0];
  const hasMore = synopsis?.includes("\n");

  return (
    <div className={unstyled ? undefined : "text-sm text-black pr-2"}>
      <p className="whitespace-pre-line">
        {expanded ? synopsis : firstParagraph}
      </p>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 hover:underline mt-1 text-xs"
        >
          {expanded ? "Ẩn bớt" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}
