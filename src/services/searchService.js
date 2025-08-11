import axios from "axios";

export const fetchSearchResult = async (video, targetClass) => {
  const formData = new FormData();
  formData.append("video", video);
  formData.append("target_class", targetClass);

  const response = await axios.post("http://127.0.0.1:8000/search", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
