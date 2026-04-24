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
    eyebrow: 'Client center',
    title: 'Service requests, account context, and support moments in one calm surface.',
    body: 'A compact client portal placeholder for account summaries, active requests, and handoffs that need a shared brand system from day one.',
    primary: 'Open requests',
    secondary: 'Account profile',
    stats: ['Active cases', 'Response SLA', 'Shared documents'],
  },
  fr: {
    eyebrow: 'Centre client',
    title: 'Demandes, contexte de compte et soutien dans une interface claire.',
    body: 'Un portail client compact pour les resumes de compte, les demandes actives et les transferts avec une marque partagee des le depart.',
    primary: 'Demandes ouvertes',
    secondary: 'Profil du compte',
    stats: ['Dossiers actifs', 'SLA de reponse', 'Documents partages'],
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
        appName="Client Center"
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

      <section className="metric-grid" aria-label="Client center signals">
        {(text.stats as readonly string[]).map((label, index) => (
          <article key={label}>
            <strong>{index === 1 ? '4h' : index === 2 ? '18' : '12'}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
