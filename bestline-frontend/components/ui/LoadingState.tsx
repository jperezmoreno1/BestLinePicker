interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-medium text-stone-600">{message}</p>
    </div>
  );
}