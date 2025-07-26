import { toast } from "react-toastify";

export const checkLogin = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  if (!user?.id) {
    toast.warn("Vui lòng đăng nhập để thực hiện chức năng này!", {
      position: "top-center",
      autoClose: 3000,
    });
    return null;
  }
  return user.id;
};
