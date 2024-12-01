import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`server Running on port ${PORT}`);
});
