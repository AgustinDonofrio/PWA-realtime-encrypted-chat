import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json,ts,tsx}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "pwa-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // Un día
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
        ],
      },
      includeAssets: ["**/*"],
      devOptions: {
        enabled: true,
      },
      manifestFilename: "manifest.json",
      manifest: {
        name: "Encrypted Realtime Chat",
        short_name: "PWA Realtime APP Chat",
        description: "Progressive Web Application of a realtime chat.",
        start_url: "/",
        display: "standalone",
        background_color: "#121417",
        theme_color: "#121417",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/screenshot_mobile.png", // 📱 Captura para móviles
            sizes: "390x844",
            type: "image/png",
          },
          {
            src: "/screenshot_desktop.png", // 💻 Captura para escritorio
            sizes: "1440x1024",
            type: "image/png",
            form_factor: "wide", // 📌 Necesario para evitar el warning en desktop
          },
        ],
      },
    }),
  ],
  base: "/",
  build: {
    sourcemap: false,
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
      output: {
        assetFileNames: "[name].[ext]",
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
    },
  },
  server: {
    host: true, // Permite 0.0.0.0 para aceptar conexiones externas
    port: 3000,
  },
  preview: {
    host: true, // Permite 0.0.0.0 en el modo preview
    port: 3000, // Usa el puerto de entorno o 3000
  },
});
