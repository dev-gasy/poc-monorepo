export function LaneHeader({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle: string;
  count: number;
}) {
  return (
    <div className="lane-header">
      <div>
        <p>{title}</p>
        <h2>{subtitle}</h2>
      </div>
      <span className="count-pill">{count}</span>
    </div>
  );
}
