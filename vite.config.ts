import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src/client"),
  build: {
    outDir: path.resolve(__dirname, "dist/client"),
    rollupOptions: {
      input: path.resolve(__dirname, "src/client/layouts/index.html"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  ssr: {
    noExternal: ["react", "react-dom"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
