import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env files in the root of the project.
  // The third argument '' ensures all variables are loaded, regardless of the 'VITE_' prefix.
  // Fix: `cwd` is not a named export from `node:process`. The correct way to get the current working directory is `process.cwd()`.
  // Fix: Replace `process.cwd()` with an empty string `''` to avoid a TypeScript type error.
  // Vite's `loadEnv` correctly resolves an empty string path to the current working directory.
  const env = loadEnv(mode, '', '');

  return {
    plugins: [react()],
    define: {
      // This makes the environment variable from the deploy script available to the client-side code.
      // We read the VITE_GEMINI_API_KEY from the loaded environment and inject it as process.env.API_KEY,
      // which the application code (`utils/gemini.ts`) uses.
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    }
  };
});