import axios from "axios";

const API_RESOURCE = "http://localhost:3000/api/booking";

export const doReserve = async (reserve, accessToken) => {
  const response = await axios.post(`${API_RESOURCE}/reserve`, reserve,
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};

export const getReserveHistory = async (accessToken) => {
  const response = await axios.post(`${API_RESOURCE}/history-reserves`,{},
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};

export const deleteReserve = async (reserveID, accessToken) => {
  const response = await axios.delete(`${API_RESOURCE}/reserve/${reserveID}`,
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};