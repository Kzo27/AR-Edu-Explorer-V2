import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Plugin untuk React dan Tailwind CSS sudah terpasang dengan baik
  plugins: [react(), tailwindcss()],
  
  // Tambahkan pengaturan server di bawah ini untuk mengatasi error ngrok
  server: {
    // 'true' mengizinkan semua host (termasuk link dari ngrok yang selalu berubah)
    allowedHosts: true,
  }
})