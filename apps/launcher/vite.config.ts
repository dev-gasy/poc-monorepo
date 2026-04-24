import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';

import { createAppConfig } from '@dgig/vite-config';

import { createLauncherCommandRunnerPlugin } from './command-runner-plugin';

export default mergeConfig(
  createAppConfig(import.meta.url, 'launcher', { port: 3001 }) as UserConfig,
  {
    plugins: [createLauncherCommandRunnerPlugin()],
  } as UserConfig,
);
