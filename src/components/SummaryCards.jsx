export function SummaryCards({ items }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.75rem] border border-[#171717] bg-[linear-gradient(180deg,rgba(12,12,12,0.98),rgba(7,7,7,0.98))] px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.24)]"
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
