import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    allowedHosts: true,
    watch: {
      // Memblokir SELURUH isi folder public agar tidak dipantau oleh Vite
      ignored: ['**/public/**'] 
    }
  }
})