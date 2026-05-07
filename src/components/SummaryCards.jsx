export function SummaryCards({ items }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.75rem] border border-xcreos-border bg-xcreos-surface px-5 py-5"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-xcreos-muted">
            {item.label}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  )
}
