import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "public",          // domyślnie tak jest, ale wpisujemy jawnie
  build: {
    outDir: "dist",             // ważne: NIE dist/public
    copyPublicDir: true         // skopiuj public/ → dist/
  }
});
