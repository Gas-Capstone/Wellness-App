import { defineConfig } from "vitepress";

export default defineConfig({
  srcDir: "docs",
  title: "Upkeep",
  description: "Documentation for Upkeep",
  base: "/Wellness-App/",
  vite: {
    css: {
      postcss: {
        plugins: [],
      },
    },
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting started", link: "/getting-started" },
      { text: "Features", link: "/features" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/getting-started" },
          { text: "Features", link: "/features" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Gas-Capstone/Wellness-App" },
    ],
  },
});
