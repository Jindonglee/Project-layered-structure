import jwt from "jsonwebtoken";
import redisClient from "../utils/redis/index.js";
import dataSource from "../typeorm/index.js";
dataSource.initialize();

export default async function (req, res, next) {
  try {
    const { authorization } = req.cookies;

    if (!authorization) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new Error("Access Token 및 Refresh Token이 존재하지 않습니다.");
      }

      const userId = redisClient.get(refreshToken);
      if (!userId) {
        throw new Error("Refresh Token이 만료되었거나 잘못된 형식입니다.");
      }

      const userInfo = await dataSource.getRepository("Users").findOne({
        where: { userId: userId },
      });

      const newAccessToken = jwt.sign(
        { userId: userInfo.userId },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
          expiresIn: "12h",
        }
      );
      const user = await dataSource.getRepository("Users").findOne({
        where: { userId: userInfo.userId },
      });

      res.cookie("authorization", `Bearer ${newAccessToken}`);
      req.locals = { user: user };
      next();
    } else {
      const [tokenType, token] = authorization.split(" ");
      if (tokenType !== "Bearer") {
        throw new Error("토큰타입이 Bearer 형식이 아닙니다.");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      const userId = decodedToken.userId;

      const user = await dataSource.getRepository("Users").findOne({
        where: { userId: userId },
      });

      if (!user) {
        throw new Error("토큰 사용자가 존재하지 않습니다.");
      }

      req.locals = { user: user };
      next();
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "토큰이 만료되었습니다." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "토큰이 조작되었습니다." });
    }
    return res.status(400).json({ message: err.message });
  }
}
