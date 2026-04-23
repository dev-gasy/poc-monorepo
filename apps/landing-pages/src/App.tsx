import { Badge, Button } from '@dgig/ui';
import { formatCompactNumber } from '@dgig/utils';

const launches = [
  'Campaign templates wired to shared brand primitives',
  'Reusable conversion sections can graduate into packages/landing-pages',
  `Fast local iteration across ${formatCompactNumber(3)} active campaign streams`,
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <Badge tone="accent">Landing Pages</Badge>
        <h1>Campaign surfaces built with shared systems, not copy-pasted pages.</h1>
        <p>
          This app is the delivery point for landing experiences, while the package bucket is
          reserved for reusable sections and domain-specific page modules.
        </p>
        <div className="actions">
          <Button>Ship a campaign</Button>
          <Button variant="outline">Inspect modules</Button>
        </div>
      </section>

      <section className="list-card">
        <h2>Why this split works</h2>
        <ul>
          {launches.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
