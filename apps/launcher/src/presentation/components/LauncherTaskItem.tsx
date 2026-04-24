import { getStatusParts, isRunningState } from '@/application/launcherView';
import type { LauncherTask } from '@/domain/launcherCatalog';
import type { CommandStatus, RunnerCommandAction } from '@/domain/launcherTypes';
import { RunToggleButton } from './ActionButtons';
import { Icon } from './Icon';
import { LauncherListItem } from './LauncherListItem';

interface LauncherTaskItemProps {
  task: LauncherTask;
  status: CommandStatus | undefined;
  isPending: boolean;
  isRunnerReady: boolean;
  onToggle: (action: RunnerCommandAction, id: string) => void;
}

export function LauncherTaskItem({
  task,
  status,
  isPending,
  isRunnerReady,
  onToggle,
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
        </>
      }
    />
  );
}
