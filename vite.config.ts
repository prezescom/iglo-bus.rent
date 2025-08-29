import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // Budujemy z katalogu client/
  root: "client",
  plugins: [react()],

  // Statyki trzymamy w client/public (kopiowane 1:1 do dist)
  publicDir: "public",

  build: {
    outDir: "dist",         // wynik będzie w client/dist
    copyPublicDir: true,
    emptyOutDir: true
  },

  // Alias @ -> client/src (żeby działały importy "@/...")
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url)),
    },
  },
});