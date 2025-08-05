"use client";

import { fetchGenres } from "@/api/anime";
import {
  confirmUserGenre,
  delAccount,
  fetchAllAvatar,
  fetchGenreByUserID,
  logoutUser,
  updateUserByID,
} from "@/api/user";
import AvatarPickerModal from "@/components/AvatarPickerModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal ";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface Avatar {
  id: number;
  image_url: string;
  source: string;
}

export interface Genres {
  genre_id: number;
  name: string;
}

export interface UserGenre {
  user_id: number;
  genre_id: number;
}

export default function UserProfileForm() {
  const { user, setUser } = useUser();

  const [isEditing, setIsEditing] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isAvatarChange, setIsAvatarChange] = useState(false);

  const [genre, setGenre] = useState<Genres[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const [avatarList, setAvatarList] = useState<string[]>([]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // const restrictedGenres = [12, 26, 28, 49]; // Thể loại cần giới hạn độ tuổi
  // const [userAge, setUserAge] = useState<number | undefined>(undefined);

  const handleAvatarSelect = async (url: string) => {
    setFormData({ ...formData, avatar_url: url });
    setShowAvatarModal(false);
  };

  const [formData, setFormData] = useState({
    username: user?.user.username || "",
    email: user?.user.email || "",
    phone_number: user?.user.phone_number || "",
    avatar_url: user?.user.avatar_url || "",
  });

  const router = useRouter();

  const handleCheckboxChange = (genreName: number) => {
    setSelectedGenres((prevSelected) => {
      const isSelected = prevSelected.includes(genreName);

      if (isSelected) {
        // Bỏ chọn nếu đã chọn
        return prevSelected.filter((name) => name !== genreName);
      } else {
        // Nếu đã chọn 3 rồi thì không cho chọn thêm
        if (prevSelected.length >= 3) {
          return prevSelected;
        }
        return [...prevSelected, genreName];
      }
    });
  };

  const handleConfirmGenres = async () => {
    if (selectedGenres.length === 0) {
      toast.error("Bạn chưa chọn thể loại nào!");
      return;
    }

    try {
      await confirmUserGenre(user!.user.user_id, selectedGenres);
      toast.success("Lưu thể loại thành công!");
    } catch (error) {
      console.error("Lỗi lưu thể loại:", error);
      toast.error("Lưu thể loại thất bại!");
    }
  };

  // const calculateAge = (birthday: Date) => {
  //   const birthDate = new Date(birthday);
  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const m = today.getMonth() - birthDate.getMonth();

  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }

  //   return age;
  // };

  useEffect(() => {
    if (formData.avatar_url !== undefined && isAvatarChange === true) {
      const update = async () => {
        const res = await updateUserByID(user!.user.user_id, formData);
        console.log(res);
        if (res.status === 201) {
          toast.success("Đã cập nhật Avatar thành công");
        }
        setIsAvatarChange(false);
      };
      update();
    }
  }, [formData]);

  // ✅ Cập nhật formData khi userInfo đã fetch xong
  useEffect(() => {
    if (!user) return;

    // if (user?.user?.birthDate) {
    //   const age = calculateAge(new Date(user.user.birthDate));
    //   setUserAge(age); // dùng useState để lưu nếu muốn render lại component
    // }

    setFormData({
      username: user.user.username,
      email: user.user.email,
      phone_number: user.user.phone_number,
      avatar_url: user.user.avatar_url,
    });

    const fetchGenres = async () => {
      try {
        const res = await fetchGenreByUserID(user.user.user_id);
        // Đảm bảo res.genre_id là mảng số

        setSelectedGenres(
          res.map((genre: UserGenre) => Number(genre.genre_id))
        );
      } catch (error) {
        console.log("Lỗi khi lấy genre: ", error);
      }
    };

    fetchGenres();
  }, [user]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const res = await fetchAllAvatar();
        // Giả sử mỗi avatar có field `url`
        setAvatarList(res.map((item: Avatar) => item.image_url));
      } catch (err) {
        console.error("Lỗi khi tải danh sách avatar", err);
      }
    };

    const fetchGenre = async () => {
      try {
        const res = await fetchGenres();
        setGenre(res);
      } catch (error) {
        console.log("Error get genres:", error);
      }
    };

    fetchGenre();
    fetchAvatars();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateUserByID(user!.user.user_id, formData);
      console.log("Cập nhật thành công:", updated);

      if (updated) {
        // Phải đăng nhập lại khi cập nhật tài khoản
        const res = await logoutUser();
        if (res.status === 200) {
          setUser(null);
          toast.success(
            "Đã cập nhật thông tin tài khoản thành công. Vui lòng đăng nhập lại"
          );
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng", error);
    }
  };

  const deleteAccount = async () => {
    await delAccount(user!.user.user_id);
    await logoutUser();
    setUser(null);
    toast.success("Xoá tài khoản thành công");
    router.push("/login");
  };

  return (
    <div className="bg-white flex p-6 gap-8">
      {/* Sidebar trái */}
      <div className="w-72 flex flex-col items-center gap-2">
        <img
          src={`${formData.avatar_url}`}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover object-top border-4 border-gray-300 shadow-sm"
        />
        <div className="text-center">
          <p className="font-semibold text-base">{user?.user.username}</p>
        </div>

        {/* ✅ Nút chọn avatar đã chỉnh giao diện */}
        <button
          className="flex items-center gap-2 text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-md shadow transition"
          onClick={() => {
            setShowAvatarModal(true);
            setIsAvatarChange(true);
          }}
        >
          <span>Chọn ảnh đại diện</span>
        </button>

        {/* Modal tách riêng */}
        {showAvatarModal && (
          <AvatarPickerModal
            avatarList={avatarList}
            onSelect={handleAvatarSelect}
            onClose={() => setShowAvatarModal(false)}
          />
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-mono">
            User ID : {user?.user.user_id}
          </span>
          <button
            className="text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition"
            onClick={() =>
              navigator.clipboard.writeText(`${user?.user.user_id}`)
            }
          >
            Copy
          </button>
        </div>

        <div className="mt-6 w-full space-y-3 text-left">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
          >
            <span>🔄</span>
            <span>Thay đổi thông tin</span>
          </button>
          <button
            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <span>🗑️</span>
            <span>Xoá tài khoản</span>
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            setShowDeleteConfirm(false);
            await deleteAccount();
          }}
        />
      )}

      {/* Form chính */}
      <div className="flex-1 space-y-6">
        {/* Personal Information */}
        <section className="border rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-lg">Thông tin cá nhân</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 ${
                  isEditing
                    ? "border-gray-400 bg-white cursor-text"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Địa chỉ Email
            </label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 ${
                  isEditing
                    ? "border-gray-400 bg-white cursor-text"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <div className="flex items-center gap-3">
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 ${
                  isEditing
                    ? "border-gray-400 bg-white cursor-text"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                isEditing
                  ? "bg-green-600 text-white hover:bg-green-700 transition"
                  : "bg-green-200 text-white cursor-not-allowed"
              }`}
              disabled={!isEditing}
            >
              <span>Lưu</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                isEditing
                  ? "bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isEditing}
            >
              <span>Huỷ</span>
            </button>
          </div>
        </section>

        <section className="border rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold mb-4 text-lg">
            Những thể loại Anime bạn thích (tối đa 3)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {genre.map((namegenre, index) => {
              const isSelected = selectedGenres?.includes(namegenre.genre_id);
              const isDisabled = !isSelected && selectedGenres?.length >= 3;

              return (
                <label
                  key={index}
                  className={`flex items-center space-x-2 cursor-pointer ${
                    isDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="appearance-none h-5 w-5 rounded-full border border-blue-400 checked:bg-blue-400 transition duration-200"
                    value={namegenre.name}
                    checked={selectedGenres?.includes(namegenre.genre_id)}
                    onChange={() => handleCheckboxChange(namegenre.genre_id)}
                    disabled={isDisabled}
                  />
                  <span className="text-gray-800">{namegenre.name}</span>
                </label>
              );
            })}
          </div>

          <button
            className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            onClick={() => handleConfirmGenres()}
          >
            Lưu
          </button>
        </section>
      </div>
    </div>
  );
}
