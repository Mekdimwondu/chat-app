import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log(`server Running on port ${PORT}`);
});
