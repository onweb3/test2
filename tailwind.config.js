/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      ibm: "'IBM Plex Sans', sans-serif",
      inter: "'Inter', sans-serif",
      plus: "'Plus Jakarta Sans', sans-serif",
      "work-sans": "'Work Sans', sans-serif",
    },
    colors: {
      white: "white",
      black: "black",
      transparent: "transparent",
      blue: "#00A3FF",
      green: "#4EFF4A",
      grey: "rgba(201, 196, 189, 1)",
      grey2: "#83888F",
      greyDark: "#151515",
      main: {
        bg: "#232323",
        green: "#40D98C",
        "green-shade": {
          10: "rgba(64, 217, 140,.1)",
          20: "rgba(64, 217, 140,.2)",
          30: "rgba(64, 217, 140,.3)",
          40: "rgba(64, 217, 140,.4)",
          50: "rgba(64, 217, 140,.5)",
          60: "rgba(64, 217, 140,.6)",
          70: "rgba(64, 217, 140,.7)",
          80: "rgba(64, 217, 140,.8)",
          90: "rgba(64, 217, 140,.9)",
          100: "rgba(64, 217, 140,1)",
        },
      },
    },
    extend: {
      borderWidth: {
        1: "1px",
      },
      spacing: {
        "navbar-height": "var(--navbar-height)",
        "sidebar-width": "var(--sidebar-width)",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(to bottom right, #00A3FF, #4EFF4A)",

        "hero-bg":
          "radial-gradient(54.98% 54.98% at 37.8% 25.8%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.35) 100%)",

        "feature-card":
          "radial-gradient(70.56% 70.56% at 50% 29.44%, rgba(69, 69, 69, 0.41) 0%, rgba(0, 0, 0, 0.205) 100%)",

        "team-card":
          "radial-gradient(70.56% 70.56% at 50% 29.44%, rgba(69, 69, 69, 0.41) 0%, rgba(64, 217, 140, 0.2) 100%)",

        "feature-card-border":
          "linear-gradient(105.54deg, #00A3FF 0.76%, rgba(0, 163, 255, 0) 34.37%, rgba(64, 217, 140, 0.2) 63.91%, #40D98C 98.54%)",

        "green-radial":
          "radial-gradient(70.56% 70.56% at 50% 29.44%, rgba(46, 79, 47, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)",
      },
    },
  },
  plugins: [],
};
