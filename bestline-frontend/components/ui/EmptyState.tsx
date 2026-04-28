interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm text-stone-500">{message}</p>
    </div>
  );
}