import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/app/modules/**',
        'src/app/widgets/**',
        'src/app/features/**',
        'src/app/entities/**',
        'src/app/shared/hooks/**',
        'src/app/shared/store/**',
        'src/pkg/**',
        'src/*.ts',
      ],
      exclude: [
        'src/app/shared/ui/**',
        'src/config/**',
        'drizzle/**',
        '**/index.ts',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
})
