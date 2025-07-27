import { toast } from "react-toastify";

export const checkLogin = (user_id: number) => {
  if (!user_id) {
    toast.warn("Vui lòng đăng nhập để thực hiện chức năng này!", {
      position: "top-center",
      autoClose: 3000,
    });
    return null;
  }
  return true;
};
