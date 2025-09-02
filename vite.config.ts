import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // این خط برای دیپلوی صحیح، حیاتی است
  base: './',
  plugins: [react()],
})