import dotenv from "dotenv";
dotenv.config();

import express from "express";
import indexRouter from "./routes/index";
import { db } from "./firebase/firebase.config";
// require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use("/", indexRouter);

// Start the server
const PORT = process.env.PORT || 3000; // Default to 3000 if no PORT env variable
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Starting dev server...");

export { app };
