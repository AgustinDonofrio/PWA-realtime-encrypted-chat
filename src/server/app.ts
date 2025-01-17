import express from "express";
import { createServer, resolveConfig } from "vite";
import { resolve } from "path";
// require("dotenv").config();

const viteConfig = {
  vitePort: 5173,
  distPath: "",
  rootPath: "",
};

const app = express();

// Middlewares
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
const PORT = process.env.PORT || 3000; // Default to 3000 if no PORT env variable
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Starting dev server...");

export { app };
