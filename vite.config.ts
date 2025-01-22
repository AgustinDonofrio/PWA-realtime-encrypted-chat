import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

const root = resolve(__dirname, "src");

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 2, // 2 días
              },
            },
          },
          {
            urlPattern:
              /\.(?:html|css|js|json|png|jpg|jpeg|svg|ico|woff|woff2|ttf|otf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 semana
              },
            },
          },
        ],
        navigateFallback: "/index.html",
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "PWA Realtime chat",
        short_name: "PWA-RC",
        description: "Progressive Web Application of a Realtime Chat",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,png,jpg}"], // Incluye index.html
      },
    }),
  ],
  base: "/",
  root,
  build: {
    sourcemap: false,
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: resolve(root, "index.html"),
      output: {
        assetFileNames: "[name].[ext]", // Usar un nombre fijo para los archivos estáticos
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(root),
      "@client": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
    },
  },
});
