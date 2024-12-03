import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}
interface DecodedToken extends JwtPayload {
  userId: string;
}
const protecRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized User" });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        fullName: true,
        gender: true,
        profilePic: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export default protecRoute;
