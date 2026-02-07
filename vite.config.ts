import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const config: Record<string, any> = {
    base: mode === 'gh-pages' ? '/vue-slot-table/' : '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.spec.ts'],
    },
  }

  if (mode === 'lib') {
    config.build = {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'VueSlotTable',
        fileName: 'vue-slottable',
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    }
  }

  return config
})
