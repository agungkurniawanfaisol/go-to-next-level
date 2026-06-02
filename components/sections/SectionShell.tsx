type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-ink/8 py-20 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            {eyebrow}
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold text-ink md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-ink/70">{description}</p>
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
