import { Bookmark, LogOut, User, UserPen } from "lucide-react";

interface Genre {
  genre_id: number;
  name: string;
}

interface UsesrMenuPros {
  user: {
    user: { username: string; user_id: number; role: string; Genres: Genre[] };
  } | null;
  handleLogout: () => void;
  hovered: string | null;
  setHovered: React.Dispatch<React.SetStateAction<string | null>>;
  onNavigate: (url: string) => void; // hàm chuyển trang
}

const UserMenu: React.FC<UsesrMenuPros> = ({
  user,
  handleLogout,
  hovered,
  setHovered,
  onNavigate,
}) => {
  if (!user) {
    return (
      <div>
        <button
          className=" bg-white text-indigo-700 mr-4 px-3 py-1.5 rounded-full border hover:bg-indigo-50 transition"
          onClick={() => onNavigate("/login")}
        >
          Đăng nhập
        </button>
        <button
          className="bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
          onClick={() => onNavigate("/register")}
        >
          Đăng ký
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div
        onClick={() => setHovered((prev) => (prev === "user" ? null : "user"))}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 font-semibold cursor-pointer hover:bg-indigo-200 transition duration-200 shadow-sm hover:shadow-md"
      >
        <User className="w-4 h-4" />
        <span>{user.user.username}</span>
      </div>

      {hovered === "user" && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in-up">
          <li
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => {
              handleLogout();
              setHovered(null);
            }}
          >
            <LogOut className="w-4 h-4 text-gray-500" />
            <span>Đăng xuất</span>
          </li>

          <li
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => {
              onNavigate(`/user/${user.user.user_id}`);
              setHovered(null);
            }}
          >
            <UserPen className="w-4 h-4 text-gray-500" />
            <span>Tài khoản cá nhân</span>
          </li>

          <li
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => {
              onNavigate(`/user/animelist`);
              setHovered(null);
            }}
          >
            <Bookmark className="w-4 h-4 text-gray-500" />
            <span>Danh sách anime</span>
          </li>

          {user.user.role === "admin" && (
            <div>
              <li
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  onNavigate("/admin/users");
                  setHovered(null);
                }}
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>Quản lý tài khoản</span>
              </li>

              <li
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  onNavigate("/admin/animes");
                  setHovered(null);
                }}
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>Quản lý anime</span>
              </li>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
