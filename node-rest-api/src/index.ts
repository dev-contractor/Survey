const express = require("express");
const cors = require('cors');
import  {  Request,  Response } from "express";
import dotenv from "dotenv";
dotenv.config();
//import bookRoutes from "./routes/bookRoutes";
import surveyRoutes from "./routes/surveyRoutes";

import userRoutes from "./routes/usersRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());
//app.use("/api", bookRoutes);
app.use("/api", userRoutes);
app.use("/api", surveyRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Node.js + TypeScript API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});