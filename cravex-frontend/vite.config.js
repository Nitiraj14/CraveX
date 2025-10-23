import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // ✅ This is where Vercel will look for your built files
  },
  server: {
    port: 5173, // optional - for local dev
  },
});
