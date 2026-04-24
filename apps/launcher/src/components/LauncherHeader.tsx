import { RUNNER_PILL_LABELS } from '../constants';
import type { RunnerAvailability } from '../types';

export function LauncherHeader({ availability }: { availability: RunnerAvailability }) {
  return (
    <header className="page-header">
      <div>
        <p className="page-breadcrumb">@dgig/frontend-workspace / launcher</p>
        <h1>Launcher</h1>
        <p className="page-copy">
          Run apps and workspace tasks from one operational list, with GitHub-style scanning and
          lightweight execution feedback.
        </p>
      </div>
      <div className="page-meta">
        <span role="status" aria-live="polite" className={`runner-pill is-${availability}`}>
          {RUNNER_PILL_LABELS[availability]}
        </span>
        <code className="runner-command">pnpm dev:launcher</code>
      </div>
    </header>
  );
}
