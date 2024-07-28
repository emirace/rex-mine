import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthRequest extends Request {
  user?: User;
}

// Middleware to verify token and optionally check for specific role
export const auth =
  (requiredRole?: string) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      req.user = decoded.user as User;
      // console.log(req.user);

      if (requiredRole && req.user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Access denied, insufficient permissions" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid" });
    }
  };
