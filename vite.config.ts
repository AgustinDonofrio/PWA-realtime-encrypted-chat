import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname, "src/client");

export default defineConfig({
  plugins: [react()],
  base: "./",
  root,
  appType: "mpa",
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: resolve(root, "index.html"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  resolve: {
    alias: {
      "@": resolve(root),
      "@client": resolve(__dirname, "src/client"),
      "@server": resolve(__dirname, "src/server"),
    },
  },
});
