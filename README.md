# dGig Frontend Workspace

Domain-oriented pnpm + Vite monorepo for multiple React applications with shared configs, shared libs, and package buckets for business verticals.

## Workspace

```text
.
├── apps/
│   ├── client-center/
│   ├── crm/
│   ├── launcher/
│   ├── landing-pages/
│   ├── tools/
│   └── ui-auto/
├── configs/
│   ├── eslint/
│   ├── monorepo/
│   ├── prettier/
│   ├── typescript/
│   └── vite/
├── libs/
│   └── utils/
├── packages/
│   ├── ccc/
│   ├── common/
│   │   └── ui/
│   ├── digital/
│   ├── hubs/
│   └── landing-pages/
├── eslint.config.mjs
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Commands

```bash
pnpm install
pnpm dev
pnpm dev:launcher
pnpm dev:crm
pnpm dev:landing-pages
pnpm dev:tools
pnpm dev:client-center
pnpm build
pnpm lint
pnpm lint:fix
pnpm typecheck
pnpm format
pnpm format:check
pnpm clean
```

## Code Quality

- ESLint is shared through `@dgig/eslint-config` and applied from the root `eslint.config.mjs`.
- Prettier is shared through `@dgig/prettier-config` and applied from the root `.prettierrc.mjs`.
- Lefthook installs automatically on `pnpm install` through the root `prepare` script.
- `pre-commit` only touches staged files: Prettier rewrites supported files first, then ESLint fixes staged JavaScript and TypeScript files.
- Use `lefthook-local.yml` for machine-specific hook overrides; it is ignored by Git.

## Monorepo Runtime Config

Shared runtime config lives in `@dgig/monorepo-config` and is driven by one root `.env` contract:

```bash
VITE_ENDPOINT_URL=http://localhost:4000
VITE_BRAND=dgig
VITE_LANGUAGE=en
```

- `VITE_ENDPOINT_URL`: absolute backend base URL used across apps
- `VITE_BRAND`: `dgig`, `tpic`, or `cibc`
- `VITE_LANGUAGE`: `en` or `fr`

Use `.env.example` as the starting point for local setup.

## Why This Structure

- `configs/*` are first-class workspace packages, so configuration is versioned and structured like the rest of the monorepo instead of living as loose files.
- `libs/` holds internal shared code such as `@dgig/utils`, which keeps app code lean and reuse obvious.
- `packages/common/*` contains reusable publishable-style packages such as `@dgig/ui`, while the other package buckets stay ready for domain-specific modules.
- `apps/*` gives each product surface an isolated Vite app with consistent tooling, clean package boundaries, and independent local dev entry points.
- `apps/launcher` acts as a workspace control room for opening apps, copying task commands, and keeping common workflows in one place.
- Shared workspace packages are still linked through pnpm, while Vite resolves them to source during local dev for fast startup and HMR.
