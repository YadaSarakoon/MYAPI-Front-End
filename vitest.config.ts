import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], test: { pool: 'threads', maxWorkers: 2, environment: 'jsdom', include: ['tests/**/*.test.tsx'], clearMocks: true } });
