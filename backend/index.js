import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/mongodb.js";

dotenv.config();
const PORT = process.env.PORT || 5432;
const app = express();
app.use(cors());

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
