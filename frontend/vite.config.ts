import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["."],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, benefits most from long-term caching
          "vendor-react": ["react", "react-dom"],
          // Routing
          "vendor-router": ["react-router-dom"],
          // Clerk auth SDK
          "vendor-clerk": ["@clerk/clerk-react"],
          // Charts
          "vendor-recharts": ["recharts"],
          // Three.js (heavy — isolate it)
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          // Radix UI components
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select",
          ],
          // Animation
          "vendor-animation": ["framer-motion", "gsap", "lenis"],
          // Data fetching
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
