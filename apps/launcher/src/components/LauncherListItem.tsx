import type { ReactNode } from 'react';

import type { CommandStatus } from '../types';

interface LauncherListItemProps {
  id: string;
  title: ReactNode;
  lane: string;
  description: string;
  content: ReactNode;
  actions: ReactNode;
  status: CommandStatus | undefined;
  statusParts: string[];
}

function StatusFooter({
  id,
  status,
  statusParts,
}: {
  id: string;
  status: CommandStatus | undefined;
  statusParts: string[];
}) {
  return (
    <footer className="launch-footer">
      <p className="status-line">
        {statusParts.map((part, index) => (
          <span
            key={`${id}-${part}`}
            className={index === 0 ? `status-text is-${status?.state ?? 'idle'}` : undefined}
          >
            {index > 0 ? ' · ' : ''}
            {part}
          </span>
        ))}
      </p>
    </footer>
  );
}

export function LauncherListItem({
  id,
  title,
  description,
  content,
  actions,
  status,
  statusParts,
}: LauncherListItemProps) {
  return (
    <li className="launch-item">
      <article className="launch-row">
        <header className="launch-header">
          <div className="row-main">
            <div className="card-heading">
              <h3>{title}</h3>
            </div>

            <p className="card-copy">{description}</p>
          </div>

          <div className="row-side">
            <div className="card-actions">{actions}</div>
          </div>
        </header>

        <div className="launch-content">
          {content}

          {status?.logs.length ? <pre className="command-log">{status.logs.join('\n')}</pre> : null}
        </div>

        <StatusFooter id={id} status={status} statusParts={statusParts} />
      </article>
    </li>
  );
}
