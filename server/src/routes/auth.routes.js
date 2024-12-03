"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
// const { logIn, logOut, signUp } = require("../controller/auth.controller");
const authRoutes = express_1.default.Router();
authRoutes.post("/signup", auth_controller_1.signUp);
// authRoutes.get("/login", logIn);
// authRoutes.post("/logout", logOut);
exports.default = authRoutes;
