# Launcher Architecture

## Purpose

- Keep the launcher app easy to extend without mixing UI, workflow state, and browser/HTTP IO.
- Make command runner dependencies explicit through typed ports.

## Scope

- Applies to `apps/launcher/src`.
- Covers launcher catalog types, runner status contracts, UI state, runner workflows, browser adapters, and presentation components.

## Non-goals

- No command runner protocol change.
- No visual redesign.
- No persistence or network endpoint changes outside the existing launcher plugin routes.

## Boundaries and Dependency Direction

- `domain/`: launcher entities and runner contracts.
- `ports/`: application-facing gateway interfaces.
- `application/`: reducers, view helpers, and React workflow hooks.
- `infra/`: browser clipboard and HTTP runner gateway implementations.
- `presentation/`: React components with rendering-only responsibilities.
- Direction: `presentation -> application -> ports -> domain`, with `infra -> ports`.

## Implementation Plan

1. Move reusable launcher contracts into `domain/`.
2. Move state reducers and workflow hooks into `application/`.
3. Isolate HTTP runner calls behind `LauncherRunnerGateway`.
4. Move React display components into `presentation/`.
5. Keep `App.tsx` as the composition root for theme and screen assembly.

## Why

- The launcher already has IO, state transitions, and rendering in one app surface.
- Ports and adapters keep HTTP details out of workflow hooks.
- Neverthrow models runner workflows as `ResultAsync<Value, Error>` instead of throwing across the boundary.
- Readonly domain contracts prevent accidental mutation of catalog and status data.

## External Impacts

- Existing `/__launcher/commands` endpoints are unchanged.
- Vite aliases and package scripts are unchanged.
- Component CSS class names are unchanged.

## Expected Results

- Runner commands remain behaviorally equivalent.
- UI components depend on typed props instead of infra modules.
- Runner failures are represented as typed errors at the application boundary.
- Future launcher features can be added inside a clear layer without broad import churn.
