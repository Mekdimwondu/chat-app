import express from "express";
// import { signUp, logIn, logOut } from "../controller/auth.controller";
const { logIn, logOut, signUp } = require("../controller/auth.controller");
const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.get("/login", logIn);
authRoutes.post("/logout", logOut);

export default authRoutes;
