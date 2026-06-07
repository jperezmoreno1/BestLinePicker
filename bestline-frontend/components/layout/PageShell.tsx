import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-14">{children}</main>
    </div>
  );
}