import { FaFileAlt } from "react-icons/fa";
import classNames from "classnames";

interface ChatMessageProps {
  isSender: boolean;
  message: string;
  username: string;
  created_at: Date;
  file?: string;
  avatarUrl: string;
}

export default function ChatMessage({
  isSender,
  message,
  username,
  created_at,
  file,
  avatarUrl,
}: ChatMessageProps) {
  // So sánh với ngày hiện tại
  const formatSmartDate = (rawDate: string | Date) => {
    const date = new Date(rawDate);
    const now = new Date();

    const isSameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isSameDay) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div
      className={classNames("flex items-end mb-4", {
        "justify-end": isSender,
      })}
    >
      {/* Avatar và tên (bên trái) */}
      {!isSender && (
        <div className="flex flex-col items-center mr-2">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full shadow-md"
          />
        </div>
      )}

      {/* Bong bóng chat */}
      <div
        className={classNames("max-w-xs sm:max-w-md", {
          "text-right": isSender,
        })}
      >
        <div className="flex items-center gap-2">
          {/* Tên người gửi */}
          {!isSender && (
            <p className="text-sm text-gray-500 font-medium mb-1">{username}</p>
          )}

          <div
            className={classNames("w-full", {
              "text-right": isSender,
              "text-left pb-1": !isSender,
            })}
          >
            <span className="text-xs text-gray-500">
              {formatSmartDate(created_at)}
            </span>
          </div>
        </div>

        {/* Nội dung tin nhắn */}
        <div
          className={classNames(
            "rounded-2xl px-4 py-2 shadow-sm break-words",
            isSender
              ? "bg-indigo-600 text-white rounded-br-none"
              : "bg-white text-gray-800 border rounded-bl-none"
          )}
        >
          <p className="whitespace-pre-line">{message}</p>

          {/* File đính kèm */}
          {file && (
            <a
              href={file}
              download
              className={classNames(
                "flex items-center mt-2 text-sm hover:underline",
                isSender ? "text-indigo-100" : "text-indigo-600"
              )}
            >
              <FaFileAlt className="mr-2" />
              {file.split("/").pop()}
            </a>
          )}
        </div>
      </div>

      {/* Khoảng trắng avatar phía phải nếu là sender */}
      {isSender && (
        <div className="w-9 ml-2 flex-shrink-0">
          {/* Để cân đối với avatar bên trái */}
        </div>
      )}
    </div>
  );
}
