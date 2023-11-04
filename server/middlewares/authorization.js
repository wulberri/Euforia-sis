import { verifyAccessToken } from "../tokens/tokens.js";
import { pool } from "../database/db.js";

export const authorization = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        res.status(401).json({ mensaje: "No se proporciona token" });
      }
    } else {
      res.status(401).json({ mensaje: "No se proporciona token" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  const [result] = await pool.query(
    "SELECT * FROM `usuario` WHERE `id_usuario` = ?",
    [req.user.id_usuario]
  );
  if (result[0].rol === "usuario") {
    return res.status(400).json({ mensaje: "No tiene permisos de administrador" });
  }
  next();
};
