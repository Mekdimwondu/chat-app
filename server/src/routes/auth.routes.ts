import express from "express";
const authRoutes = express.Router();

authRoutes.get("/login", (req, res) => {
  res.send("login route");
});
export default authRoutes;
