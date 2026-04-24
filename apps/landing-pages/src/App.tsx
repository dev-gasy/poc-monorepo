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
    eyebrow: 'Landing pages',
    title: 'Campaign pages with brand controls, launch notes, and conversion checkpoints.',
    body: 'A simple acquisition workspace for drafting page variants, reviewing audience promises, and keeping brand tone visible while content changes.',
    primary: 'Draft campaign',
    secondary: 'Review variants',
    stats: ['Live drafts', 'Audience paths', 'Brand checks'],
  },
  fr: {
    eyebrow: 'Pages campagne',
    title: 'Pages de campagne avec controles de marque et reperes de conversion.',
    body: 'Un espace simple pour preparer des variantes, revoir les promesses au public et garder le ton de marque visible.',
    primary: 'Creer campagne',
    secondary: 'Revoir variantes',
    stats: ['Brouillons actifs', 'Parcours publics', 'Verifs marque'],
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
        appName="Landing Pages"
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

      <section className="metric-grid" aria-label="Landing page signals">
        {(text.stats as readonly string[]).map((label, index) => (
          <article key={label}>
            <strong>{index === 1 ? '5' : index === 2 ? '98%' : '9'}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
