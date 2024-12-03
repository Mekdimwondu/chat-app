import express from "express";
import { getMe, logIn, logOut, signUp } from "../controller/auth.controller";
import protecRoute from "../middleware/protectRoute";

const authRoutes = express.Router();

authRoutes.get("/me", protecRoute, getMe);
authRoutes.post("/signup", signUp);
authRoutes.post("/login", logIn);
authRoutes.post("/logout", logOut);

export default authRoutes;
