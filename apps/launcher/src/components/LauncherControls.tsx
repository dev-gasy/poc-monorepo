import type { ChangeEvent } from 'react';

import type { Scope } from '../types';
import { Icon } from './Icon';

interface ScopeOption {
  label: string;
  value: Scope;
}

interface LauncherControlsProps {
  query: string;
  scope: Scope;
  scopeCounts: Record<Scope, number>;
  scopeOptions: ScopeOption[];
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onQueryClear: () => void;
  onScopeChange: (scope: Scope) => void;
}

export function LauncherControls({
  query,
  scope,
  scopeCounts,
  scopeOptions,
  onQueryChange,
  onQueryClear,
  onScopeChange,
}: LauncherControlsProps) {
  return (
    <section className="control-strip">
      <label className="search-field" htmlFor="launcher-search">
        <span className="search-input-wrap">
          <input
            id="launcher-search"
            name="launcher-search"
            type="search"
            value={query}
            onChange={onQueryChange}
            placeholder="Search by lane, command, or package"
          />
          {query ? (
            <button
              type="button"
              className="search-clear-button"
              onClick={onQueryClear}
              aria-label="Clear launcher search"
              title="Clear search"
            >
              <Icon name="x" />
            </button>
          ) : null}
        </span>
      </label>

      <div className="scope-switch" aria-label="Launcher scope">
        {scopeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={['scope-pill', scope === option.value ? 'is-active' : ''].join(' ').trim()}
            aria-pressed={scope === option.value}
            onClick={() => onScopeChange(option.value)}
          >
            <span>{option.label}</span>
            <span className="scope-count">{scopeCounts[option.value]}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
