import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}