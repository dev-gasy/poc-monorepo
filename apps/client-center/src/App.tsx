import { Badge, Button } from '@dgig/ui';
import { formatCompactNumber } from '@dgig/utils';

const panels = [
  `Unified workspace for ${formatCompactNumber(4)} client service streams`,
  'Shared UI keeps service dashboards and self-serve surfaces visually consistent',
  'Independent app boundary keeps Client Center releases decoupled from CRM releases',
];

export default function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <Badge tone="accent">Client Center</Badge>
        <h1>A dedicated client experience app without fragmenting the stack.</h1>
        <p>
          Client Center gets its own deployment boundary and local dev entry point, but still pulls
          from the same UI package, utility library, lint rules, and TypeScript setup.
        </p>
        <div className="actions">
          <Button>Open client dashboard</Button>
          <Button variant="outline">Review app boundaries</Button>
        </div>
      </section>

      <section className="list-card">
        <h2>Operational benefits</h2>
        <ul>
          {panels.map((panel) => (
            <li key={panel}>{panel}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
