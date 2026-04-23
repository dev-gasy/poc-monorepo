export const brands = ['dgig', 'tpic', 'cibc'] as const;

export type Brand = (typeof brands)[number];

export interface BrandPreset {
  id: Brand;
  label: string;
  wordmark: string;
  colors: {
    accent: string;
    accentStrong: string;
    accentSoft: string;
    glow: string;
    surface: string;
    border: string;
    text: string;
  };
  customization: {
    heroLabel: string;
    supportLabel: string;
  };
}

export const brandPresets: Record<Brand, BrandPreset> = {
  dgig: {
    id: 'dgig',
    label: 'dGig',
    wordmark: 'dGig',
    colors: {
      accent: '#d45e2c',
      accentStrong: '#8c3511',
      accentSoft: 'rgba(212, 94, 44, 0.22)',
      glow: 'rgba(255, 198, 152, 0.9)',
      surface: '#fff0df',
      border: 'rgba(140, 53, 17, 0.18)',
      text: '#2f241d',
    },
    customization: {
      heroLabel: 'Growth workflows',
      supportLabel: 'Operator-ready',
    },
  },
  tpic: {
    id: 'tpic',
    label: 'TPIC',
    wordmark: 'TPIC',
    colors: {
      accent: '#0f8a7b',
      accentStrong: '#0b5b51',
      accentSoft: 'rgba(15, 138, 123, 0.2)',
      glow: 'rgba(145, 232, 218, 0.72)',
      surface: '#e7fbf7',
      border: 'rgba(11, 91, 81, 0.16)',
      text: '#14312e',
    },
    customization: {
      heroLabel: 'Partner delivery',
      supportLabel: 'Advisory-first',
    },
  },
  cibc: {
    id: 'cibc',
    label: 'CIBC',
    wordmark: 'CIBC',
    colors: {
      accent: '#b61f3a',
      accentStrong: '#7d1024',
      accentSoft: 'rgba(182, 31, 58, 0.2)',
      glow: 'rgba(243, 165, 181, 0.7)',
      surface: '#ffe9ee',
      border: 'rgba(125, 16, 36, 0.16)',
      text: '#35111a',
    },
    customization: {
      heroLabel: 'Enterprise rollout',
      supportLabel: 'Client-grade',
    },
  },
};

export function isBrand(value: string): value is Brand {
  return brands.includes(value as Brand);
}

export function getBrandPreset(brand: Brand): BrandPreset {
  return brandPresets[brand];
}

export function getBrandCssVariables(brand: Brand): Record<string, string> {
  const preset = getBrandPreset(brand);

  return {
    '--brand-accent': preset.colors.accent,
    '--brand-accent-strong': preset.colors.accentStrong,
    '--brand-accent-soft': preset.colors.accentSoft,
    '--brand-glow': preset.colors.glow,
    '--brand-surface': preset.colors.surface,
    '--brand-border': preset.colors.border,
    '--brand-text': preset.colors.text,
  };
}
