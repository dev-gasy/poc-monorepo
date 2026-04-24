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
    eyebrow: 'CRM',
    title: 'Pipeline focus, account rhythm, and follow-up work in a restrained console.',
    body: 'A placeholder CRM surface for operators who need dense customer context without a heavy dashboard.',
    primary: 'View pipeline',
    secondary: 'Plan follow-up',
    stats: ['Open accounts', 'Next actions', 'At-risk deals'],
  },
  fr: {
    eyebrow: 'CRM',
    title: 'Pipeline, rythme de compte et suivis dans une console sobre.',
    body: 'Une surface CRM temporaire pour garder le contexte client dense sans tableau de bord lourd.',
    primary: 'Voir pipeline',
    secondary: 'Planifier suivis',
    stats: ['Comptes ouverts', 'Actions suivantes', 'Dossiers a risque'],
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
        appName="CRM"
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

      <section className="metric-grid" aria-label="CRM signals">
        {(text.stats as readonly string[]).map((label, index) => (
          <article key={label}>
            <strong>{index === 1 ? '31' : index === 2 ? '6' : '84'}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
