import { Icon } from './Icon';

function getToggleLabel(isPending: boolean, isRunning: boolean, noun: string): string {
  if (isPending) {
    return isRunning ? `Stopping ${noun}...` : `Starting ${noun}...`;
  }

  return isRunning ? `Stop ${noun}` : `Start ${noun}`;
}

export function RunToggleButton({
  noun,
  name,
  isRunning,
  isPending,
  disabled,
  onClick,
}: {
  noun: 'app' | 'task';
  name: string;
  isRunning: boolean;
  isPending: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`row-action-button ${isRunning ? 'is-danger' : 'is-success'}`}
      onClick={onClick}
      disabled={disabled}
      title={`${isRunning ? 'Stop' : 'Start'} ${name}`}
    >
      <Icon name={isRunning ? 'stop' : 'play'} />
      {getToggleLabel(isPending, isRunning, noun)}
    </button>
  );
}

export function CopyCommandButton({
  name,
  isCopied,
  onClick,
}: {
  name: string;
  isCopied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="row-icon-button"
      onClick={onClick}
      aria-label={isCopied ? 'Copied!' : `Copy ${name} command`}
      title={`Copy ${name} command`}
    >
      <Icon name={isCopied ? 'check' : 'copy'} />
    </button>
  );
}

export function KillPortButton({
  name,
  port,
  disabled,
  onClick,
}: {
  name: string;
  port: number;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="row-icon-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Kill processes using port ${port} for ${name}`}
      title={`Kill port ${port}`}
    >
      <Icon name="trash" />
    </button>
  );
}
