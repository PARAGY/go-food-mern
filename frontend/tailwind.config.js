/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff5200", // Swiggy Orange
        secondary: "#1a1a1a", // Deep Black
        light: "#f8f9fa",
        dark: "#212529",
        success: "#60b246", // Swiggy Green
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Premium font
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
