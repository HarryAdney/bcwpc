import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  compressHTML: false, // Disable HTML compression
  site: 'https://westburton-yorkshire.org.uk',
  integrations: [
    mdx(),
    icon(),
    tailwind({
      applyBaseStyles: false,
      config: { path: './tailwind.config.js' },
    }),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          logger: {
            warn: () => {},
          },
        },
      },
      // Force CSS to be output as separate files
      devSourcemap: true,
    },
    build: {
      cssCodeSplit: true, // Ensure CSS is output as separate files
      assetsInlineLimit: 0, // Disable inlining of assets
    },
  },
})
