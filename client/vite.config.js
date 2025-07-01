import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Forward API calls during development so that requests like "/api/show/all" reach the Express server
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend server
        changeOrigin: true,
      },
    },
  },
});
