import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic families from the PayNote token spec
        ink: {
          900: "#0A0A0A", // primary text / high-contrast "ink"
        },
        graphite: {
          700: "#4A4A4A", // secondary text
        },
        paper: {
          "0": "#FFFFFF", // canvas
        },
        feather: {
          600: "#1E88E5", // primary
          500: "#2196F3", // hover / accent
          300: "#64B5F6", // soft UI / hovers
        },
        ice: {
          100: "#E9F2FF", // tinted surfaces / empty states
        },
        silver: {
          200: "#D6D6D6", // borders / dividers
        },
        success: {
          500: "#16A34A",
        },
        warning: {
          500: "#D97706",
        },
        danger: {
          500: "#DC2626",
        },

        // Optional semantic aliases for convenience
        pn: {
          bg: "#FFFFFF",                // paper-0
          fg: "#0A0A0A",                // ink-900
          muted: "#4A4A4A",             // graphite-700
          border: "#D6D6D6",            // silver-200
          primary: "#1E88E5",           // feather-600
          "primary-hover": "#2196F3",   // feather-500
          surface: "#E9F2FF",           // ice-100
        },
      },

      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        pill: "999px",
      },

      boxShadow: {
        // subtle elevation with blue-tinted md shadow
        sm: "0 1px 2px rgba(0,0,0,.06)",
        md: "0 6px 18px rgba(30,136,229,.10)",
      },

      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        // optional display family if you add it
        display: ['"Work Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        xs: ["12px", "18px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
        "2xl": ["32px", "40px"],
      },

      // Motion tokens
      transitionDuration: {
        fast: "180ms",
        base: "220ms",
        slow: "320ms",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.2, 0.8, 0.2, 1)", // out-cubic feel
      },

      // Optional gradient for "Quill Sweep"
      backgroundImage: {
        "quill-sweep":
          "linear-gradient(18deg, #1E88E5 0%, #64B5F6 100%)",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};

export default config;
