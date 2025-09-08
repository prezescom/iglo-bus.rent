import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig({
  // budujemy z katalogu client/
  root: "client",
  plugins: [react()],

  // katalog public dla Vite to client/public
  publicDir: "public",

  build: {
    outDir: "dist",        // wynik: client/dist
    copyPublicDir: true,
    emptyOutDir: true
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url))
    }
  }
});