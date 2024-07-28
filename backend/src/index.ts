// src/index.ts

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cron from "node-cron";
import router from "./routes";
import cors from "cors";
import { processInvestments } from "./controllers/userInvestment";
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Schedule hourly processing of investments
cron.schedule("0 * * * *", async () => {
  console.log("Processing investments...");
  await processInvestments();
});

// Connect to MongoDB using the URI from the .env file
const mongoUri = process.env.MONGODB_URI as string;
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
