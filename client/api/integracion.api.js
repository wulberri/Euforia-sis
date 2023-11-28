import axios from "axios";

const API_RESOURCE = "http://localhost:3000/api/integration";

export const getAllResourcesInt = async () => {
  const response = await axios.get(`${API_RESOURCE}/all-resources`);
  return response.data;
};