import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // AppUI scss uses webpack-style `~package` imports.
  resolve: { alias: [{ find: /^~(.*)$/, replacement: "$1" }] },
});
