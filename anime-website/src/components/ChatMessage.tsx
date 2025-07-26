import { FaFileAlt } from "react-icons/fa";
import classNames from "classnames";

interface ChatMessageProps {
  isSender: boolean;
  message: string;
  file?: string;
  avatarUrl: string;
}

export default function ChatMessage({
  isSender,
  message,
  file,
  avatarUrl,
}: ChatMessageProps) {
  return (
    <div className={classNames("flex gap-2 mb-4", { "justify-end": isSender })}>
      {!isSender && <img src={avatarUrl} className="w-8 h-8 rounded-full" />}
      <div className={classNames("max-w-md", { "text-right": isSender })}>
        <div
          className={classNames(
            "p-3 rounded-lg",
            isSender ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
          )}
        >
          <p>{message}</p>
          {file && (
            <a
              href={file}
              download
              className={classNames(
                "flex items-center mt-2 text-sm",
                isSender ? "text-indigo-200" : "text-indigo-600"
              )}
            >
              <FaFileAlt className="mr-2" /> {file.split("/").pop()}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
