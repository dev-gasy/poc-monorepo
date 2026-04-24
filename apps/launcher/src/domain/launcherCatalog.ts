export type LauncherCommandKind = 'app' | 'task';
export type LauncherCommandMode = 'persistent' | 'oneshot';

export interface LauncherCommandEntry {
  readonly id: string;
  readonly kind: LauncherCommandKind;
  readonly command: string;
  readonly commandArgs: readonly string[];
  readonly commandMode: LauncherCommandMode;
}

export interface LauncherApp {
  readonly id: string;
  readonly kind: 'app';
  readonly name: string;
  readonly packageName: string;
  readonly description: string;
  readonly command: string;
  readonly commandArgs: readonly string[];
  readonly commandMode: LauncherCommandMode;
  readonly href: string;
  readonly port: number;
  readonly lane: string;
  readonly tags: readonly string[];
  readonly canRun: boolean;
}

export interface LauncherTask {
  readonly id: string;
  readonly kind: 'task';
  readonly name: string;
  readonly description: string;
  readonly command: string;
  readonly commandArgs: readonly string[];
  readonly commandMode: LauncherCommandMode;
  readonly lane: string;
  readonly tags: readonly string[];
}

export const launcherApps: readonly LauncherApp[] = [
  {
    id: 'ui-auto',
    kind: 'app',
    name: 'UI Auto',
    packageName: '@dgig/ui-auto',
    description: 'Automation-facing surface for shared UI patterns and workflow orchestration.',
    command: 'pnpm dev:ui-auto',
    commandArgs: ['dev:ui-auto'],
    commandMode: 'persistent',
    href: 'http://localhost:3000',
    port: 3000,
    lane: 'Automation',
    tags: ['ui', 'automation', 'design system'],
    canRun: true,
  },
  {
    id: 'crm',
    kind: 'app',
    name: 'CRM',
    packageName: '@dgig/crm',
    description: 'Operator workspace for pipeline views, account timelines, and internal actions.',
    command: 'pnpm dev:crm',
    commandArgs: ['dev:crm'],
    commandMode: 'persistent',
    href: 'http://localhost:4000',
    port: 4000,
    lane: 'Sales',
    tags: ['crm', 'accounts', 'pipeline'],
    canRun: true,
  },
  {
    id: 'landing-pages',
    kind: 'app',
    name: 'Landing Pages',
    packageName: '@dgig/landing-pages',
    description: 'Campaign and acquisition surfaces for rapid iteration on marketing entry points.',
    command: 'pnpm dev:landing-pages',
    commandArgs: ['dev:landing-pages'],
    commandMode: 'persistent',
    href: 'http://localhost:5000',
    port: 5000,
    lane: 'Growth',
    tags: ['marketing', 'campaigns', 'landing'],
    canRun: true,
  },
  {
    id: 'tools',
    kind: 'app',
    name: 'Tools',
    packageName: '@dgig/tools',
    description: 'Internal utility station for operator tooling and cross-workspace helpers.',
    command: 'pnpm dev:tools',
    commandArgs: ['dev:tools'],
    commandMode: 'persistent',
    href: 'http://localhost:6000',
    port: 6000,
    lane: 'Operations',
    tags: ['tools', 'utilities', 'ops'],
    canRun: true,
  },
  {
    id: 'client-center',
    kind: 'app',
    name: 'Client Center',
    packageName: '@dgig/client-center',
    description: 'Client-facing service surface with shared branding, content, and support flows.',
    command: 'pnpm dev:client-center',
    commandArgs: ['dev:client-center'],
    commandMode: 'persistent',
    href: 'http://localhost:7000',
    port: 7000,
    lane: 'Client',
    tags: ['client', 'support', 'portal'],
    canRun: true,
  },
];

export const launcherTasks: readonly LauncherTask[] = [
  {
    id: 'install',
    kind: 'task',
    name: 'Install Workspace',
    description: 'Sync workspace dependencies, link packages, and refresh Git hooks.',
    command: 'pnpm install',
    commandArgs: ['install'],
    commandMode: 'oneshot',
    lane: 'Bootstrap',
    tags: ['install', 'dependencies', 'setup'],
  },
  {
    id: 'build',
    kind: 'task',
    name: 'Build All',
    description: 'Build every workspace package and app from the monorepo root.',
    command: 'pnpm build',
    commandArgs: ['build'],
    commandMode: 'oneshot',
    lane: 'Delivery',
    tags: ['build', 'ci', 'release'],
  },
  {
    id: 'lint',
    kind: 'task',
    name: 'Lint Workspace',
    description: 'Run root ESLint with cache enabled and fail on warnings.',
    command: 'pnpm lint',
    commandArgs: ['lint'],
    commandMode: 'oneshot',
    lane: 'Quality',
    tags: ['lint', 'eslint', 'quality'],
  },
  {
    id: 'typecheck',
    kind: 'task',
    name: 'Typecheck',
    description: 'Run strict TypeScript checks across apps, configs, and shared packages.',
    command: 'pnpm typecheck',
    commandArgs: ['typecheck'],
    commandMode: 'oneshot',
    lane: 'Quality',
    tags: ['typescript', 'types', 'validation'],
  },
  {
    id: 'format',
    kind: 'task',
    name: 'Format',
    description: 'Normalize code style across the monorepo with the shared Prettier config.',
    command: 'pnpm format',
    commandArgs: ['format'],
    commandMode: 'oneshot',
    lane: 'Quality',
    tags: ['prettier', 'formatting', 'style'],
  },
  {
    id: 'clean',
    kind: 'task',
    name: 'Clean Artifacts',
    description: 'Remove local build output and repo-level cache files before a fresh cycle.',
    command: 'pnpm clean',
    commandArgs: ['clean'],
    commandMode: 'oneshot',
    lane: 'Maintenance',
    tags: ['cleanup', 'cache', 'maintenance'],
  },
];

export const launcherCommandEntries: readonly LauncherCommandEntry[] = [
  ...launcherApps,
  ...launcherTasks,
];
