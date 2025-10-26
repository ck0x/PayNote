import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",

        brand: {
          DEFAULT: "hsl(var(--brand))",
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))", // ≈ #00b456 (pigment-green)
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },

        // Additional theme colors
        "pigment-green": "hsl(var(--pigment-green))",
        tan: "hsl(var(--tan))",
        "rich-black": "hsl(var(--rich-black))",
        moonstone: "hsl(var(--moonstone))",
        xanthous: "hsl(var(--xanthous))",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.1" }],
        sm: ["0.875rem", { lineHeight: "1.25" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.3" }],
        "2xl": ["1.5rem", { lineHeight: "1.25" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.15" }],
        "5xl": ["3rem", { lineHeight: "1.05" }],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem", // playful pill cards
      },
      boxShadow: {
        // Soft, elevated cards that feel “notebook-y”
        card: "0 6px 20px -6px hsl(var(--shadow)/0.18)",
        hover: "0 10px 28px -8px hsl(var(--shadow)/0.22)",
        inset: "inset 0 1px 0 hsl(var(--foreground)/0.06)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, hsl(var(--brand-400)) 0%, hsl(var(--brand-600)) 100%)",
        "mint-wash":
          "radial-gradient(60% 50% at 50% 0%, hsl(var(--brand-100)) 0%, transparent 60%)",

        // Multi-color gradients using theme colors
        "gradient-top":
          "linear-gradient(0deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-right":
          "linear-gradient(90deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-bottom":
          "linear-gradient(180deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-left":
          "linear-gradient(270deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-top-right":
          "linear-gradient(45deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-bottom-right":
          "linear-gradient(135deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-top-left":
          "linear-gradient(225deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-bottom-left":
          "linear-gradient(315deg, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
        "gradient-radial":
          "radial-gradient(circle, hsl(var(--pigment-green)), hsl(var(--tan)), hsl(var(--rich-black)), hsl(var(--moonstone)), hsl(var(--xanthous)))",
      },
      transitionTimingFunction: {
        playful: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        ink: "cubic-bezier(0.18, 0.84, 0.22, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        normal: "220ms",
        slow: "420ms",
      },
      keyframes: {
        "ink-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "card-pop": {
          "0%": { transform: "scale(0.98)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "underline-scribe": {
          "0%": { "stroke-dashoffset": "60" },
          "100%": { "stroke-dashoffset": "0" },
        },
      },
      animation: {
        "ink-float": "ink-float 3s ease-in-out infinite",
        "card-pop": "card-pop 240ms playful both",
        "underline-scribe": "underline-scribe 900ms ink forwards",
      },
      rings: {},
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
