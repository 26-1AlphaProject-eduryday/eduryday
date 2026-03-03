type ProgressColor = 'gray' | 'blue' | 'green';

interface ProgressBarProps {
  value: number;
  color?: ProgressColor;
  className?: string;
}

const colorClasses: Record<ProgressColor, string> = {
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};

export function ProgressBar({ value, color = 'gray', className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`.trim()}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorClasses[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
