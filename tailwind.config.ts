import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px", // Extra small devices (larger phones)
      },
      colors: {
        // Bảng màu Huế truyền thống
        hue: {
          red: "#B33A2B", // Màu chủ đạo - Deep Red-Orange
          redDark: "#8B2A1F", // Đỏ đậm hơn cho hover/active
          brown: "#3b1f18", // Nâu đất - broth color
          brownLight: "#92400E",
          gold: "#e07a44", // Vàng cam - secondary warm orange
          goldLight: "#EAB308",
          cream: "#f8efeb", // Kem nhạt - background color
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
