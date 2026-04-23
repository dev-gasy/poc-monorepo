import { Badge, Button } from '@dgig/ui';
import { formatCompactNumber } from '@dgig/utils';

const queues = [
  { label: 'Active pipelines', value: formatCompactNumber(12) },
  { label: 'Sales pods', value: formatCompactNumber(5) },
  { label: 'Automations', value: formatCompactNumber(24) },
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <Badge tone="accent">CRM</Badge>
        <h1>Pipeline operations with the same shared foundations.</h1>
        <p>
          This app lives beside UI Auto and the other product surfaces, but still reuses the shared
          UI package, utility layer, and root developer workflow.
        </p>
        <div className="actions">
          <Button>Open pipeline view</Button>
          <Button variant="outline">Review shared UI</Button>
        </div>
      </section>

      <section className="grid">
        {queues.map((queue) => (
          <article key={queue.label} className="stat-card">
            <p>{queue.label}</p>
            <strong>{queue.value}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
