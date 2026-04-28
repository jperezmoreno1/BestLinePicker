interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}