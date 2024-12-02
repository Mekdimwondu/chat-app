import express from "express";
const messageRoutes = express.Router();

messageRoutes.get("/conversations", (req, res) => {
  res.send("message sent");
});
export default messageRoutes;
