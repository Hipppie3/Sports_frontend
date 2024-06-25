import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   server: {
    proxy: {
        '/api': { 
          target: 'https://basketballbackend-715cf6a06fb1.herokuapp.com/', 
          changeOrigin: true, 
          secure: false, 
          rewrite: (path) => path.replace(/^\/api/, "") 
      },
    },
  },
  plugins: [react()]
})
