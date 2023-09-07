import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authMiddle = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["AuthenticationToken"];
  if (token) {
    try {
      jwt.verify(
        token,
        "secretcode",
        (
          error: jwt.VerifyErrors | null,
          decoded: string | jwt.JwtPayload | undefined
        ) => {
          if (error) {
            return res
              .status(401)
              .json({ error: true, message: "Token is not valid" });
          } else {
            const userId = (decoded as jwt.JwtPayload).id;
            res.locals.userId = userId;
            next();
          }
        }
      );
    } catch {
      console.log("no valid token catch");
      res.status(401).json({ error: true, message: "not authorized" });
    }
  } else {
    console.log("No token, authorization denied");
    res.status(500).json({ error: true, message: "not authorized" });
  }
};

export default authMiddle;
