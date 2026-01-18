import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
        "logo.png",
      ],
      manifest: {
        name: "Sistema de Gestión Institucional",
        short_name: "Gestión Institucional",
        description:
          "Sistema Integral de Gestión Institucional - Control de asistencias, gestión académica y documentos oficiales",
        theme_color: "#ffffff",
        start_url: "/",
        icons: [
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4000000,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false, // Ahorrar memoria en producción
    reportCompressedSize: false, // Acelerar build
    chunkSizeWarningLimit: 500, // Reducido para detectar chunks grandes
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar React y sus dependencias principales
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor-react";
          }

          // Separar librerías de gráficos
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/d3-")
          ) {
            return "vendor-charts";
          }

          // Separar librerías de PDF (pesadas)
          if (
            id.includes("node_modules/jspdf") ||
            id.includes("node_modules/exceljs")
          ) {
            return "vendor-pdf";
          }

          // Separar componentes de UI y animaciones
          if (
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/lucide-react")
          ) {
            return "vendor-ui";
          }

          // Separar utilidades HTTP y fechas
          if (
            id.includes("node_modules/axios") ||
            id.includes("node_modules/date-fns")
          ) {
            return "vendor-utils";
          }

          // Separar react-router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }

          // Separar react-hot-toast
          if (id.includes("node_modules/react-hot-toast")) {
            return "vendor-toast";
          }

          // Resto de node_modules en un chunk general
          if (id.includes("node_modules")) {
            return "vendor-misc";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true, // Fail if port is busy
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['qr-scanner'] // Evitar que Vite optimice/pre-bundlee qr-scanner para que el worker cargue correctamente
  }
});
