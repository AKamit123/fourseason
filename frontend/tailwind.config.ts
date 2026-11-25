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
            DEFAULT: "#FAF8F5", // Soft luxury alabaster / warm ivory
            dark: "#F3EDE2",    // Subtle cashmere beige for contrasting sections
            light: "#FFFFFF",   // Pure white
            surface: "#FFFFFF", // Card and modal surface
            subtle: "#F7F3EB",  // Soft subtle warm tint
            border: "#E8E0D2",  // Delicate warm neutral border
          },
          gold: {
            DEFAULT: "#B38E36", // Rich champagne gold
            light: "#C9A64C",
            lighter: "#785E1A", // High-contrast readable gold for light mode text
            dark: "#8F6E22",
            darker: "#6A5016",
            pill: "#F6EED8",    // Soft pastel gold pill background
          },
          cream: {
            DEFAULT: "#1E1A16", // Primary luxury text: deep warm charcoal
            light: "#110F0D",   // Deepest luxury headline text
            dark: "#474036",    // Secondary body text
            muted: "#786F62",   // Subtle stone / caption text
          },
          pastel: {
            beige: "#F5EFE6",
            cream: "#FAF8F5",
            almond: "#EFE8DC",
            sand: "#ECE3D4",
            linen: "#F8F5EE",
            pearl: "#FFFFFF",
            blush: "#FAF1EC",
            stone: "#E5DFD5",
            taupe: "#8A8073",
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
