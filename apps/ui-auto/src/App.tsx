import type { CSSProperties } from 'react';

import {
  createMonorepoConfig,
  getBrandCssVariables,
  getBrandPreset,
  languageLabels,
  type MonorepoConfigSource,
} from '@dgig/monorepo-config';
import { Badge, Button } from '@dgig/ui';
import { formatCompactNumber } from '@dgig/utils';

import { FeatureCard } from '@/components/FeatureCard';
import { MetricCard } from '@/components/MetricCard';

const monorepoConfig = createMonorepoConfig(import.meta.env as MonorepoConfigSource);
const brandPreset = getBrandPreset(monorepoConfig.brand);
const endpointHost = new URL(monorepoConfig.endpointUrl).host;
const brandVariables = getBrandCssVariables(monorepoConfig.brand) as CSSProperties;

const metrics = [
  {
    label: 'Active brand',
    value: brandPreset.wordmark,
    detail: `${brandPreset.customization.heroLabel} with ${brandPreset.customization.supportLabel.toLowerCase()} surfaces.`,
  },
  {
    label: 'Language',
    value: languageLabels[monorepoConfig.language],
    detail: 'English and French are first-class monorepo settings for every app.',
  },
  {
    label: 'Endpoint',
    value: endpointHost,
    detail:
      'One backend base URL can be shared across UI Auto, CRM, tools, landing pages, and Client Center.',
  },
  {
    label: 'Product apps',
    value: formatCompactNumber(5),
    detail: 'One root env contract now applies across the whole workspace.',
  },
];

const features = [
  {
    eyebrow: 'One Config Package',
    title: 'A dedicated workspace package owns endpoint, brand, and language.',
    body: 'Validation, defaults, and brand presets live in one place instead of being repeated in every app.',
  },
  {
    eyebrow: 'Brand Presets',
    title: 'dGig, TPIC, and CIBC each expose different colors and UI customizations.',
    body: 'Apps can consume the same preset object for text, surface treatment, accents, and any future brand-level differences.',
  },
  {
    eyebrow: 'Root Env Contract',
    title: 'A single root `.env` feeds every Vite app in the monorepo.',
    body: 'The shared Vite config points env loading at the workspace root, which keeps runtime configuration centralized.',
  },
];

const badgeStyle: CSSProperties = {
  backgroundColor: 'var(--brand-surface)',
  color: 'var(--brand-accent-strong)',
  borderColor: 'var(--brand-border)',
};

const primaryButtonStyle: CSSProperties = {
  background: 'linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-accent-strong) 100%)',
  boxShadow: '0 16px 32px var(--brand-accent-soft)',
};

const secondaryButtonStyle: CSSProperties = {
  borderColor: 'var(--brand-border)',
  color: 'var(--brand-text)',
};

export default function App() {
  return (
    <main className="page-shell" style={brandVariables}>
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="hero">
        <div className="hero-copy">
          <Badge tone="accent" style={badgeStyle}>
            {brandPreset.label} brand
          </Badge>
          <p className="hero-kicker">
            {brandPreset.customization.heroLabel} · {languageLabels[monorepoConfig.language]} ·{' '}
            {endpointHost}
          </p>
          <h1>One React workspace, themed per brand and configured from the monorepo root.</h1>
          <p className="hero-body">
            `@dgig/monorepo-config` now owns the shared runtime parameters for the whole repo:
            backend endpoint URL, brand selection, and language. UI Auto reads that package
            directly, and the same contract is ready for every other app.
          </p>
          <div className="hero-actions">
            <Button style={primaryButtonStyle}>Launch UI Auto</Button>
            <Button style={secondaryButtonStyle} variant="outline">
              Inspect Monorepo Config
            </Button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span />
            <span />
            <span />
          </div>
          <div className="panel-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
          <div className="signal-lines" aria-hidden="true">
            <div />
            <div />
            <div />
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="story-card">
          <p className="section-label">Monorepo Config</p>
          <h2>One root contract for runtime settings.</h2>
          <p>
            Every app can now read the same endpoint URL, brand, and language values without
            inventing its own env schema or configuration wrapper.
          </p>
        </div>

        <div className="story-card contrast">
          <p className="section-label">Branding</p>
          <h2>Preset-driven colors and customizations, not scattered conditionals.</h2>
          <p>
            The active preset for {brandPreset.label} now drives accents, surfaces, and UI copy
            hooks from a single typed source of truth.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="section-intro">
          <p className="section-label">Why it matters</p>
          <h2>Centralized configuration without hiding how the app actually behaves.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </main>
  );
}
