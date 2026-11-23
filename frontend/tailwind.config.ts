import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fs: {
          navy: {
            DEFAULT: "#0E1B3A",
            dark: "#070D20",
            light: "#16264E",
            surface: "#101F42"
          },
          gold: {
            DEFAULT: "#C8A24B",
            light: "#E7C977",
            lighter: "#F0D88A",
            dark: "#A8842F",
            darker: "#7A5E1C"
          },
          cream: {
            DEFAULT: "#F7F3EC",
            light: "#FFFFFF",
            dark: "#EDE6D8",
            muted: "#E0D7C6"
          }
        }
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        script: ["'Pinyon Script'", "cursive"],
        sans: ["'Manrope'", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      },
      animation: {
        'marquee': 'fsMarquee 34s linear infinite',
        'fade-in': 'fsFade .5s ease both',
        'fade-up': 'fsFadeUp .7s ease both',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fsMarquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fsFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fsFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      }
    },
  },
  plugins: [],
};
export default config;
