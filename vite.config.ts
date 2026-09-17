import { defineConfig } from 'vite';
import webExtension from 'vite-plugin-web-extension';

const browser = process.env.TARGET_BROWSER === 'firefox' ? 'firefox' : 'chrome';

export default defineConfig({
  root: 'src',
  build: { outDir: `../dist/${browser}`, emptyOutDir: true },
  plugins: [webExtension({ manifest: 'manifest.json', browser, disableAutoLaunch: true })],
});
