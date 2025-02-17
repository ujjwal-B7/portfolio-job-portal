import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      screens: {
        mediumLarge: "1090px",
      },
      spacing: {
        large: "900px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-blue": "#0f5288",
        "hover-blue": "#1d80ac",
        "hover-light": "#E8EEF3",
        danger: "#c81e1e",
        success: "#388e42",
        "primary-border": "#c7c7c7",
      },
      fontFamily: {
        "switzer-semi-bold": ["Switzer Semi-Bold"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    // require("@tailwindcss/forms")({
    //   strategy: "class",
    // }),
  ],
};
export default config;
