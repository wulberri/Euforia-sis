import { pool } from "../database/db.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  getUserEncrypt,
} from "../tokens/tokens.js";

export const prueba = (req, res) => {
  return res.status(200).json("hola");
};

/* *************************************** SIGN UP ********************************************/
export const signup = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    //Validación de los campos necesarios para la creación del usuario
    if (!nombre || !correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Los valores del formulario son requeridos" });
    }

    const [result_get] = await pool.query(
      "SELECT * FROM usuario WHERE correo = ?",
      [correo]
    );
    if (result_get.length === 0) {
      const hash = await bcrypt.hash(contrasena, 10); //Encriptar la contraseña
      const [result] = await pool.query(
        "INSERT INTO `usuario` (`nombre`, `correo`, `contrasena`) VALUES (?, ?, ?);",
        [nombre, correo, hash]
      );

      if (result.affectedRows > 0) {
        //Si se creo, mostramos estado -> Solicitud completada
        res.status(201).json({ message: "Usuario registrado exitosamente" });
      } else {
        //Sino, mostramos estado -> Error del servidor
        res.status(500).json({ error: "Error al registrar el usuario" });
      }
    } else {
      return res.status(409).json({ error: "Usuario ya existente" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* *************************************** SIGN IN ********************************************/
export const signin = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validación de los campos necesarios para la creación del usuario
    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Los valores del formulario son requeridos" });
    }

    //Obtener el usuario con el correo recibido
    const [result] = await pool.query(
      "SELECT * FROM usuario WHERE correo = ?",
      [correo]
    );

    //Si la respuesta es que si hay un usuario
    if (result.length > 0) {
      const user = result[0];
      /*Se comprueba que las contraseñas coincidan 
      La que se envia por body (contrasena), que vendria siendo lo que llega del formulario del front
      como el hash que se obtiene de la base de datos del usuario obtenido en la consulta anterior */
      if (await bcrypt.compare(contrasena, user.contrasena)) {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await pool.query("INSERT INTO `tokens` (`token`) VALUES (?);", [
          refreshToken,
        ]);
        res
          .status(200)
          .json({ user: getUserEncrypt(user), accessToken, refreshToken });
      } else {
        res.status(401).json({ error: "Credenciales inválidas" });
      }
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Error interno del servidor
  }
};

/* ************************************* SIGN OUT **********************************************/
export const signout = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;

    const [result] = await pool.query(
      "DELETE FROM tokens WHERE `tokens`.`token` = ?",
      [refreshToken]
    );
    return res.status(200).json({ mensaje: "Cerró sesión exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Error interno del servidor
  }
};

/* *******************************************************************************************/
export const dashboard = (req, res) => {
  return res.json({ user: req.user });
};

/* *******************************************************************************************/
export const getAllUsers = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT `correo`,`nombre`,`rol` FROM `usuario` WHERE `id_usuario` != ? AND `id_usuario` != 83",
      [req.user.id_usuario]
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Error interno del servidor
  }
};

/* *******************************************************************************************/
export const updateUsers = async (req, res) => {
  try {
    const { rol, correo } = req.body;
    const [result] = await pool.query(
      "UPDATE `usuario` SET `rol` = ? WHERE `correo` = ?",
      [rol, correo]
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Error interno del servidor
  }
};
