import axios from "axios";

const API_USER = "http://localhost:3000/api/user";
const API_TOKENS = "http://localhost:3000/api/tokens";

//Petición para la creación de un nuevo usuario
export const signupRequest = async (user) => {
  const response = await axios.post(`${API_USER}/signup/`, user);
  return response.data;
};

//Petición para inicio de sesión
export const signinRequest = async (user) => {
  const response = await axios.post(`${API_USER}/signin/`, user);
  return response;
};

//Petición para cerrar sesión
export const signoutRequest = async (refreshToken) => {
  const response = await axios.delete(`${API_USER}/signout/`, {
    headers: {
      authorization: refreshToken,
    },
  });
  return response.data;
};

//Petición para crear un nuevo token a partir del refreshToken
export const getNewAccessTokenRequest = async (refreshToken) => {
  const response = await axios.post(
    `${API_TOKENS}`,
    {},
    {
      headers: {
        authorization: refreshToken,
      },
    }
  );
  return response.data;
};

//Petición para obtener el usuario a partir de un accessToken
export const getUserInfoRequest = async (accessToken) => {
  const response = await axios.get(`${API_TOKENS}/user/`, {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};

//Petición para obtener todos usuario del servidor
export const getAllUsersRequest = async (accessToken) => {
  const response = await axios.get(`${API_USER}/users/`, {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};


//Petición para obtener el usuario a partir de un accessToken
export const updateUserRequest = async (accessToken, dataToUpdate) => {
  const response = await axios.put(`${API_USER}/users/update`, dataToUpdate, {
    headers: {
      authorization: accessToken,
    },
  });
  return response.data;
};
