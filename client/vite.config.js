import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Ensure this points to your backend server
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyRes", function (proxyRes, req, res) {
            const cookies = proxyRes.headers["set-cookie"];
            if (cookies) {
              proxyRes.headers["set-cookie"] = cookies.map(cookie =>
                cookie.replace(/;(\s)?secure/gi, "")
              );
            }
          });
        },
      },
    },
  },
});