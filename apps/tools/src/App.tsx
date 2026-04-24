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
    eyebrow: 'Tools',
    title: 'Internal utilities, workspace commands, and operational shortcuts.',
    body: 'A small tools surface for keeping command-heavy work close to shared packages and fast feedback loops.',
    primary: 'Open tools',
    secondary: 'View commands',
    stats: ['Utilities', 'Commands', 'Checks'],
  },
  fr: {
    eyebrow: 'Outils',
    title: 'Utilitaires internes, commandes et raccourcis operationnels.',
    body: 'Une petite surface pour garder le travail de commandes pres des paquets partages et des retours rapides.',
    primary: 'Ouvrir outils',
    secondary: 'Voir commandes',
    stats: ['Utilitaires', 'Commandes', 'Verifs'],
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
        appName="Tools"
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

      <section className="metric-grid" aria-label="Tools signals">
        {(text.stats as readonly string[]).map((label, index) => (
          <article key={label}>
            <strong>{index === 1 ? '18' : index === 2 ? '42' : '7'}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
