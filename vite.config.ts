import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";


export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    server: {
      port: 3000,
      strictPort: true,
    },
    envDir: "environment",
    envPrefix: "HONESTYBAR_",
    appType: "spa",
    publicDir: "src/public/",
    plugins: [
      react(),
      VitePWA({
        devOptions: {
          enabled: true,
        },
        includeAssets: [
          "favicon.ico"
        ],
        manifest: {
          name: "Honesty Bar Kiosk",
          short_name: "Bar Kiosk",
          description: "Kenze Honesty Bar Kiosk App",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          start_url: process.env.HONESTYBAR_KIOSK_URL,
          display: "standalone",
          icons: [
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  });
};
