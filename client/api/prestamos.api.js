import axios from "axios";

const API_RESOURCE = "http://localhost:3000/api/loan";

export const startLoan = async (reserve, accessToken) => {
  const response = await axios.post(`${API_RESOURCE}/start-loan`, reserve,
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};

export const endLoan = async (reserve, accessToken) => {
  const response = await axios.post(`${API_RESOURCE}/end-loan`, reserve,
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
}

export const getActiveLoans = async (email, accessToken) => {
  const response = await axios.post(`${API_RESOURCE}/active-loans`, email,
  {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
}
