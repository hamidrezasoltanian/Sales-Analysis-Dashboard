import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This makes the environment variable from the deploy script available to the client-side code.
    // Vite loads the .env file, making VITE_GEMINI_API_KEY available here.
    // We then assign its value to process.env.API_KEY, which the app code uses.
    'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
  }
});