import axios from "axios";
import { toast } from "react-toastify";

const RemoveItem = async (foodId, token) => {
  const API_URL = "http://localhost:4000/api/food/";
  const response = await axios.delete(`${API_URL}remove-food/${foodId}`, {
    headers: {
      Authorization: token,
    },
  });
  try {
    if (response.data.success) {
      toast.success("Xóa thành công!");
      console.log(response.data);
      window.location.reload();
    }
  } catch (error) {
    toast.error("that bai");
    console.log(error);
  }
};

export { RemoveItem };
