import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import coinRoutes from "./routes/coins.js";
import upbitRoutes from "./routes/upbit.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes, coinRoutes, upbitRoutes);

export default app;
