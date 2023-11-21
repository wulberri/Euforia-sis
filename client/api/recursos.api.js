import axios from "axios";

const API_RESOURCE = "http://localhost:3000/api/resources";

export const getAllResources = async () => {
  const response = await axios.get(`${API_RESOURCE}/all-resources/`);
  return response.data;
};

export const getUnitSchedule = async (unitNumber) => {
  const response = await axios.get(`${API_RESOURCE}/unit-schedule/${unitNumber}`);
  return response.data;
};
