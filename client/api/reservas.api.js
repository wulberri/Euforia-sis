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

export const getEmailReserve = async (email, accessToken) => {
  const response = await axios.post(`${API_RESOURCE}/active-reserves`, email,
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
}
