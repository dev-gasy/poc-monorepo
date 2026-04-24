import type { LauncherTask } from '../data';
import { getStatusParts, isRunningState } from '../services/launcherView';
import type { CommandStatus } from '../types';
import { CopyCommandButton, RunToggleButton } from './ActionButtons';
import { Icon } from './Icon';
import { LauncherListItem } from './LauncherListItem';

interface LauncherTaskItemProps {
  task: LauncherTask;
  status: CommandStatus | undefined;
  isPending: boolean;
  isCopied: boolean;
  isRunnerReady: boolean;
  onToggle: (action: 'run' | 'stop', id: string) => void;
  onCopy: (id: string, command: string) => void;
}

export function LauncherTaskItem({
  task,
  status,
  isPending,
  isCopied,
  isRunnerReady,
  onToggle,
  onCopy,
}: LauncherTaskItemProps) {
  const isRunning = isRunningState(status?.state);
  const isDisabled = !isRunnerReady || isPending;

  return (
    <LauncherListItem
      id={task.id}
      lane={task.lane}
      description={task.description}
      status={status}
      statusParts={getStatusParts(status)}
      title={task.name}
      content={
        <p className="row-summary row-command">
          <Icon name="terminal" />
          <code>{task.command}</code>
        </p>
      }
      actions={
        <>
          <RunToggleButton
            noun="task"
            name={task.name}
            isRunning={isRunning}
            isPending={isPending}
            disabled={isDisabled}
            onClick={() => onToggle(isRunning ? 'stop' : 'run', task.id)}
          />

          <CopyCommandButton
            name={task.name}
            isCopied={isCopied}
            onClick={() => onCopy(task.id, task.command)}
          />
        </>
      }
    />
  );
}
