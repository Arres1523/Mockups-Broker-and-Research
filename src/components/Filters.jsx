const sortOptions = [
  { value: 'noi_actual', label: 'NOI' },
  { value: 'dscr_current', label: 'DSCR' },
  { value: 'physical_occupancy_pct', label: 'Occupancy' },
  { value: 'in_place_annual_upside', label: 'Annual Upside' },
]

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-xcreos-muted">
      {label}
      {children}
    </label>
  )
}

function inputClassName() {
  return 'h-10 rounded-md border border-xcreos-border bg-[#090909] px-3 text-sm text-white outline-none transition placeholder:text-[#5f6670] focus:border-xcreos-primary focus:bg-black'
}

export function Filters({ filters, markets, brokers, onChange, onReset }) {
  return (
    <section className="rounded-md border border-xcreos-border bg-xcreos-surface p-5 shadow-none">
      <div className="flex flex-col gap-4 border-b border-xcreos-border pb-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-xcreos-muted">
            Search and filter
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">Refine the property set</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-xcreos-border bg-[#090909] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:border-xcreos-primary hover:text-xcreos-primary"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Property Search">
          <input
            className={inputClassName()}
            placeholder="Search property"
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </Field>

        <Field label="Market">
          <select
            className={inputClassName()}
            value={filters.market}
            onChange={(event) => onChange('market', event.target.value)}
          >
            {markets.map((market) => (
              <option key={market} value={market}>
                {market}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Broker">
          <select
            className={inputClassName()}
            value={filters.broker}
            onChange={(event) => onChange('broker', event.target.value)}
          >
            {brokers.map((broker) => (
              <option key={broker} value={broker}>
                {broker}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sort Metric">
          <select
            className={inputClassName()}
            value={filters.sortBy}
            onChange={(event) => onChange('sortBy', event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Occupancy Min %">
          <input
            className={inputClassName()}
            type="number"
            min="0"
            max="100"
            value={filters.occupancyMin}
            onChange={(event) => onChange('occupancyMin', event.target.value)}
          />
        </Field>

        <Field label="Occupancy Max %">
          <input
            className={inputClassName()}
            type="number"
            min="0"
            max="100"
            value={filters.occupancyMax}
            onChange={(event) => onChange('occupancyMax', event.target.value)}
          />
        </Field>

        <Field label="DSCR Min">
          <input
            className={inputClassName()}
            type="number"
            min="0"
            step="0.01"
            value={filters.dscrMin}
            onChange={(event) => onChange('dscrMin', event.target.value)}
          />
        </Field>

        <Field label="DSCR Max">
          <input
            className={inputClassName()}
            type="number"
            min="0"
            step="0.01"
            value={filters.dscrMax}
            onChange={(event) => onChange('dscrMax', event.target.value)}
          />
        </Field>

        <Field label="Year Built Min">
          <input
            className={inputClassName()}
            type="number"
            min="1900"
            max="2100"
            value={filters.yearBuiltMin}
            onChange={(event) => onChange('yearBuiltMin', event.target.value)}
          />
        </Field>

        <Field label="Year Built Max">
          <input
            className={inputClassName()}
            type="number"
            min="1900"
            max="2100"
            value={filters.yearBuiltMax}
            onChange={(event) => onChange('yearBuiltMax', event.target.value)}
          />
        </Field>

        <Field label="Sort Direction">
          <select
            className={inputClassName()}
            value={filters.sortDirection}
            onChange={(event) => onChange('sortDirection', event.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </Field>
      </div>
    </section>
  )
}
