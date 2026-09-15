import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    envPrefix: 'FIREBASE_',
    plugins: [
        react(),
        legacy(),
        tailwindcss()
    ]
})
