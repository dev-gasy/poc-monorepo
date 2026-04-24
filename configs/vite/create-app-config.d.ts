import type { UserConfigExport } from 'vite';

export interface CreateAppConfigOptions {
  port?: number;
}

export declare function createAppConfig(
  importMetaUrl: string,
  cacheKey: string,
  options?: CreateAppConfigOptions,
): UserConfigExport;
