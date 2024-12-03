import express from "express";
import { logIn, logOut, signUp } from "../controller/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", logIn);
authRoutes.post("/logout", logOut);

export default authRoutes;
