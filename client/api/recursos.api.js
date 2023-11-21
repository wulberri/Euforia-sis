import axios from "axios";

const API_RESOURCE = "http://localhost:3000/api/resources";

export const getAllResources = async () => {
  const response = await axios.get(`${API_RESOURCE}/all-resources/`);
  return response.data;
};

export const createResourceRequest = async (resource) => {
  const response = await axios.post(`${API_RESOURCE}/`, resource);
  return response.data;
};

export const deleteResourceRequest = async (id) => {
  const response = await axios.delete(`${API_RESOURCE}/${id}`);
  return response.data;
};

export const getResourceRequest = async (id) => {
  const response = await axios.get(`${API_RESOURCE}/only-resource/${id}`);
  return response.data;
};

export const updateResourceRequest = async (id, newResource) => {
  const response = await axios.put(`${API_RESOURCE}/${id}`, newResource);
  return response.data;
};

export const getUnitSchedule = async (unitNumber) => {
  const response = await axios.get(`${API_RESOURCE}/unit-schedule/${unitNumber}`);
  return response.data;
};

