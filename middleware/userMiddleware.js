import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config.js";

dotenv.config();

function userMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];
  const secret = config.JWT_SECRET;
  const decodedValue = jwt.verify(jwtToken, secret);
  if (decodedValue.id) {
    // req.username = decodedValue.id;
    next();
  } else {
    res.status(403).json({
      msg: "You are not authenticated",
    });
  }
}

export default userMiddleware;
