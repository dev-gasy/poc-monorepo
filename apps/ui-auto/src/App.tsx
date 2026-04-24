import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import {
  brandPresets,
  brands,
  getActiveBrandConfig,
  getBrandCssVariables,
  languageLabels,
  languages,
  type Brand,
  type Language,
} from '@dgig/monorepo-config';
import { WorkspaceHeader } from '@dgig/ui';

const initialConfig = getActiveBrandConfig(import.meta.env);
const copy = {
  en: {
    eyebrow: 'UI automation',
    title: 'Automation-facing UI patterns with brand state always in view.',
    body: 'A practical sandbox for checking component states, workflow surfaces, and presentation details before they become shared patterns.',
    primary: 'Run scenario',
    secondary: 'Inspect states',
    stats: ['Scenarios', 'Components', 'Checks'],
  },
  fr: {
    eyebrow: 'Automatisation UI',
    title: 'Patrons UI pour automatisation avec la marque toujours visible.',
    body: 'Un bac a sable pratique pour verifier les etats de composants et les surfaces de travail avant partage.',
    primary: 'Executer scenario',
    secondary: 'Inspecter etats',
    stats: ['Scenarios', 'Composants', 'Verifs'],
  },
} satisfies Record<Language, Record<string, string | readonly string[]>>;

const brandOptions = brands.map((brand) => ({ label: brandPresets[brand].label, value: brand }));
const languageOptions = languages.map((language) => ({
  label: languageLabels[language],
  value: language,
}));

export default function App() {
  const [brand, setBrand] = useState<Brand>(initialConfig.brand);
  const [language, setLanguage] = useState<Language>(initialConfig.language);
  const text = copy[language];
  const style = useMemo(() => getBrandCssVariables(brand) as CSSProperties, [brand]);

  return (
    <main className="surface-shell" style={style}>
      <WorkspaceHeader
        appName="UI Auto"
        brand={brand}
        brands={brandOptions}
        language={language}
        languages={languageOptions}
        onBrandChange={setBrand}
        onLanguageChange={setLanguage}
      />

      <section className="surface-hero">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="hero-copy">{text.body}</p>
        <div className="action-row">
          <button type="button">{text.primary}</button>
          <button type="button" className="secondary-action">
            {text.secondary}
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="UI automation signals">
        {(text.stats as readonly string[]).map((label, index) => (
          <article key={label}>
            <strong>{index === 1 ? '24' : index === 2 ? '99%' : '14'}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
