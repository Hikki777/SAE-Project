import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig({
  base: './', // Usar rutas relativas para que funcione con file://
  
  // Cargar variables de entorno desde .env.development y .env.production
  envDir: './', // Por defecto Vite busca en el mismo nivel
  
  plugins: [
    react(),
    // VitePWA deshabilitado temporalmente para evitar problemas con file://
    /*
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
    */
  ],
  build: {
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000, // Aumentado
    rollupOptions: {
      output: {
        // manualChunks eliminado para dejar que Vite maneje las dependencias correctamente
        // Esto soluciona el error "Cannot read properties of undefined (reading 'forwardRef')"
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
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
    exclude: ['qr-scanner']
  }
});
