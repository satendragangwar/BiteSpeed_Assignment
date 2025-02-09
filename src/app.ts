import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";

import ContactRoutes from "./routes/contacts";

config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || "8000", 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/identify", ContactRoutes);

// Ping
app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

// Starting Server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
