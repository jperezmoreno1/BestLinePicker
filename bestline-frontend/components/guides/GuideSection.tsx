import { ReactNode } from "react";
import { theme } from "@/styles/theme";

interface GuideSectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function GuideSection({
  id,
  title,
  description,
  children,
}: GuideSectionProps) {
  return (
    <section id={id} className={theme.card}>
      <div className={theme.cardHeader}>
        <div>
          <h2 className={theme.cardTitle}>{title}</h2>
          {description ? (
            <p className={theme.cardSubtitle}>{description}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}