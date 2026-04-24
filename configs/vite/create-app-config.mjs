import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export function createAppConfig(importMetaUrl, cacheKey, options = {}) {
  const workspaceRoot = fileURLToPath(new URL('../../', importMetaUrl));
  const { port } = options;

  return defineConfig({
    cacheDir: `../../node_modules/.vite/${cacheKey}`,
    envDir: workspaceRoot,
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', importMetaUrl)),
        '@dgig/monorepo-config': fileURLToPath(
          new URL('../../configs/monorepo/src/index.ts', importMetaUrl),
        ),
        '@dgig/ui': fileURLToPath(new URL('../../packages/common/ui/src/index.ts', importMetaUrl)),
        '@dgig/utils': fileURLToPath(new URL('../../libs/utils/src/index.ts', importMetaUrl)),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      ...(port
        ? {
            port,
            strictPort: true,
          }
        : {}),
      fs: {
        allow: [workspaceRoot],
      },
    },
    optimizeDeps: {
      exclude: ['@dgig/monorepo-config', '@dgig/ui', '@dgig/utils'],
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'es2022',
    },
  });
}
