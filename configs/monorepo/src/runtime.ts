import { fromThrowable } from 'neverthrow';

import { brands, getBrandPreset, isBrand, type Brand } from './brands';
import { isLanguage, languages, type Language } from './languages';

type ConfigValue = string | boolean | undefined | null;

export type MonorepoConfigSource = Record<string, ConfigValue>;

export interface MonorepoConfig {
  endpointUrl: string;
  brand: Brand;
  language: Language;
}

export const monorepoEnvKeys = {
  endpointUrl: 'VITE_ENDPOINT_URL',
  brand: 'VITE_BRAND',
  language: 'VITE_LANGUAGE',
} as const;

export const defaultMonorepoConfig: MonorepoConfig = {
  endpointUrl: 'http://localhost:4000',
  brand: 'dgig',
  language: 'en',
};

function readString(source: MonorepoConfigSource, key: string): string | undefined {
  const value = source[key];

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : undefined;
}

function readBrand(source: MonorepoConfigSource): Brand {
  const rawValue = readString(source, monorepoEnvKeys.brand);

  if (!rawValue) {
    return defaultMonorepoConfig.brand;
  }

  if (!isBrand(rawValue)) {
    throw new Error(`Invalid brand "${rawValue}". Expected one of: ${brands.join(', ')}.`);
  }

  return rawValue;
}

function readLanguage(source: MonorepoConfigSource): Language {
  const rawValue = readString(source, monorepoEnvKeys.language);

  if (!rawValue) {
    return defaultMonorepoConfig.language;
  }

  if (!isLanguage(rawValue)) {
    throw new Error(`Invalid language "${rawValue}". Expected one of: ${languages.join(', ')}.`);
  }

  return rawValue;
}

function readEndpointUrl(source: MonorepoConfigSource): string {
  const rawValue =
    readString(source, monorepoEnvKeys.endpointUrl) ?? defaultMonorepoConfig.endpointUrl;

  return fromThrowable(
    () => new URL(rawValue).toString().replace(/\/$/, ''),
    () => new Error(`Invalid endpoint URL "${rawValue}". Expected a valid absolute URL.`),
  )().match(
    (endpointUrl) => endpointUrl,
    (error) => {
      throw error;
    },
  );
}

export function createMonorepoConfig(source: MonorepoConfigSource = {}): MonorepoConfig {
  const brand = readBrand(source);

  return {
    endpointUrl: readEndpointUrl(source),
    brand,
    language: readLanguage(source),
  };
}

export function getActiveBrandConfig(source: MonorepoConfigSource = {}) {
  const config = createMonorepoConfig(source);

  return {
    ...config,
    brandPreset: getBrandPreset(config.brand),
  };
}
