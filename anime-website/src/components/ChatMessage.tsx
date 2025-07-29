import { FaFileAlt } from "react-icons/fa";
import classNames from "classnames";

interface ChatMessageProps {
  isSender: boolean;
  message: string;
  username: string;
  file?: string;
  avatarUrl: string;
}

export default function ChatMessage({
  isSender,
  message,
  username,
  file,
  avatarUrl,
}: ChatMessageProps) {
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
        {/* Tên người gửi */}
        {!isSender && (
          <p className="text-sm text-gray-500 font-medium mb-1">{username}</p>
        )}

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
