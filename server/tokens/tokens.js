import jwt from "jsonwebtoken";
import "dotenv/config";

//Tokens de accesso ubicados en el archivo .env
const access = process.env.ACCESS_TOKEN_SECRET;
const refresh = process.env.REFRESH_TOKEN_SECRET;

//Tiempo de expiración de los token y el algoritmo que se usa
const jwt_config = {
  expiresIn: 3600,
  algorithm: "HS256",
};

//Funcion para obtener el usuario sin la contraseña y sin el rol
//Esto ya que se envia al front y es poco seguro
export function getUserEncrypt(user) {
  return {
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol
  };
}

// Función para generar tokens utilizando jsonwebtoken
export function generateAccessToken(user) {
  return jwt.sign(getUserEncrypt(user), access, jwt_config);
}
export function generateRefreshToken(user) {
  return jwt.sign(getUserEncrypt(user), refresh, jwt_config);
}

// Función para verificar tokens utilizando jsonwebtoken
export function verifyAccessToken(token) {
  return jwt.verify(token, access);
}
export function verifyRefreshToken(token) {
  return jwt.verify(token, refresh);
}
