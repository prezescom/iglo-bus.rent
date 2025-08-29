import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  plugins: [react()],
  publicDir: "public",        // client/public -> dołączy się 1:1
  build: {
    outDir: "dist",           // wynik: client/dist
    copyPublicDir: true
  }
});