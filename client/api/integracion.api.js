import axios from "axios";

const API_RESOURCE = "http://127.0.0.1:8000/api/resource/";

export const getAllResourcesInt = async () => {
  const response = await axios.get(`${API_RESOURCE}`);
  return response.data;
};