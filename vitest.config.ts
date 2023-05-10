/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
	test: {
		include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
	},
})
