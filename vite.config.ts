import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: Import `cwd` from `node:process` to resolve TypeScript error where `process.cwd()` is not recognized.
import { cwd } from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env files in the root of the project.
  // The third argument '' ensures all variables are loaded, regardless of the 'VITE_' prefix.
  const env = loadEnv(mode, cwd(), '');

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