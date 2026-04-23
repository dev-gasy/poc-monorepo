import { Badge, Button } from '@dgig/ui';
import { formatCompactNumber } from '@dgig/utils';

const modules = [
  { label: 'Operator tools', value: formatCompactNumber(7) },
  { label: 'Shared commands', value: formatCompactNumber(18) },
  { label: 'Workspace tasks', value: formatCompactNumber(42) },
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <Badge tone="accent">Tools</Badge>
        <h1>Internal operations tools stay close to shared code and fast feedback loops.</h1>
        <p>
          This app is where utilities and operator workflows can evolve quickly while still
          consuming the same shared modules used across customer-facing surfaces.
        </p>
        <div className="actions">
          <Button>Open tool suite</Button>
          <Button variant="outline">View utilities</Button>
        </div>
      </section>

      <section className="grid">
        {modules.map((module) => (
          <article key={module.label} className="stat-card">
            <p>{module.label}</p>
            <strong>{module.value}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
