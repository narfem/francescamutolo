import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || 'https://jqgfsvdtbwedmoduykdb.supabase.co'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ2ZzdmR0YndlZG1vZHV5a2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDA0MzksImV4cCI6MjA4Njk3NjQzOX0.2BgSHLe_ZlNeKkE3rcjJv2WDkF-vZOQc9p_8Xs7dmME'),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
        },
      },
    },
  }
});