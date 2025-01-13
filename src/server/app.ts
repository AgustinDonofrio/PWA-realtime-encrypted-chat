import express from "express";
import { initializeApp } from "firebase/app";
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

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// };

// // Initialize Firebase
// const appFirebase = initializeApp(firebaseConfig);

export { app };
