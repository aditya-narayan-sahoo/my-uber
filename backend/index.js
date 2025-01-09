import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/mongodb.js";

import userRoutes from "./routes/user.route.js";
import captainRoutes from "./routes/captain.route.js";

dotenv.config();
const PORT = process.env.PORT || 5432;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`);
});
