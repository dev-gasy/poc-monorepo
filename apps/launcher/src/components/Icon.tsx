import type { ReactNode } from 'react';

import type { IconName } from '../types';

export function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    check: <path d="m5 12 4 4 10-10" />,
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      </>
    ),
    external: (
      <>
        <path d="M14 3h7v7" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
    play: <path d="M8 5v14l11-7Z" />,
    stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
    terminal: (
      <>
        <path d="m4 7 5 5-5 5" />
        <path d="M12 19h8" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>
    ),
    x: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  };

  return (
    <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
