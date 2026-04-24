import { Icon } from './Icon';

function getToggleLabel(isPending: boolean, isRunning: boolean, noun: string): string {
  if (isPending) {
    return isRunning ? `Stopping ${noun}...` : `Starting ${noun}...`;
  }

  return isRunning ? 'Stop' : 'Run';
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
      title={`${isRunning ? 'Stop' : 'Run'} ${name}`}
    >
      <Icon name={isRunning ? 'stop' : 'play'} />
      {getToggleLabel(isPending, isRunning, noun)}
    </button>
  );
}
