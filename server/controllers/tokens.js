import { pool } from "../database/db.js";
import { generateAccessToken, verifyRefreshToken } from "../tokens/tokens.js";

//Recibe un refreshToken y devuelve un nuevo accessToken
export const createNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization;
    if (refreshToken) {
      const [result] = await pool.query("SELECT * FROM tokens WHERE token=?", [
        refreshToken,
      ]);

      if (result.length > 0) {
        const payload = verifyRefreshToken(result[0].token);
        if (payload) {
          const accessToken = generateAccessToken(payload);
          return res.status(200).json({ accessToken });
        }
        return res.status(401).json({ error: "No autorizado" });
      } else {
        return res.status(401).json({ error: "No autorizado" });
      }
    } else {
      return res.status(401).json({ error: "No autorizado" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserInfo = (req, res) => {
  res.status(200).json(req.user);
}