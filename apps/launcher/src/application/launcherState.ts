import type { CommandStatus, RunnerAvailability, Scope } from '@/domain/launcherTypes';

export interface RunnerState {
  availability: RunnerAvailability;
  statusById: Record<string, CommandStatus>;
  pendingIds: Set<string>;
}

export type RunnerAction =
  | { type: 'STATUSES_LOADED'; payload: Record<string, CommandStatus> }
  | { type: 'RUNNER_UNAVAILABLE' }
  | { type: 'PENDING_START'; id: string }
  | { type: 'PENDING_END'; id: string }
  | { type: 'STATUS_UPDATED'; id: string; status: CommandStatus };

export interface UiState {
  scope: Scope;
  query: string;
}

export type UiAction =
  | { type: 'SET_SCOPE'; scope: Scope }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'CLEAR_QUERY' };

export const initialRunnerState: RunnerState = {
  availability: 'checking',
  statusById: {},
  pendingIds: new Set<string>(),
};

export const initialUiState: UiState = {
  scope: 'all',
  query: '',
};

export function runnerReducer(state: RunnerState, action: RunnerAction): RunnerState {
  switch (action.type) {
    case 'STATUSES_LOADED':
      return { ...state, availability: 'ready', statusById: action.payload };

    case 'RUNNER_UNAVAILABLE':
      return { ...state, availability: 'unavailable' };

    case 'PENDING_START': {
      const next = new Set(state.pendingIds);
      next.add(action.id);
      return { ...state, pendingIds: next };
    }

    case 'PENDING_END': {
      const next = new Set(state.pendingIds);
      next.delete(action.id);
      return { ...state, pendingIds: next };
    }

    case 'STATUS_UPDATED':
      return {
        ...state,
        availability: 'ready',
        statusById: { ...state.statusById, [action.id]: action.status },
      };

    default:
      return state;
  }
}

export function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case 'SET_SCOPE':
      return { ...state, scope: action.scope };
    case 'SET_QUERY':
      return { ...state, query: action.query };
    case 'CLEAR_QUERY':
      return { ...state, query: '' };
    default:
      return state;
  }
}
