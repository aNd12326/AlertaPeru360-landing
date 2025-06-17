// @ts-check
import { defineConfig,envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    plugins: [tailwindcss()]
  },
  env: {
    schema:{
      SUPABASE_URL: envField.string({ context: "server", access: "public"}),
      SUPABASE_ANON_KEY: envField.string({ context: "server", access: "public"}),
    }
  }
});