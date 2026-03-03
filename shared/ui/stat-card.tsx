interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendColor?: 'green' | 'red';
  className?: string;
}

const trendColorClasses = {
  green: 'text-green-600',
  red: 'text-red-600',
};

export function StatCard({ label, value, trend, trendColor = 'green', className = '' }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`.trim()}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {trend ? (
        <p className={`mt-1 text-xs font-medium ${trendColorClasses[trendColor]}`}>
          {trend}
        </p>
      ) : null}
    </div>
  );
}
