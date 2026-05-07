import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('recharts', () => {
  const passthrough = ({ children }) => <div>{children}</div>

  return {
    ResponsiveContainer: passthrough,
    BarChart: passthrough,
    Bar: passthrough,
    CartesianGrid: () => null,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
    PieChart: passthrough,
    Pie: passthrough,
    Cell: () => null,
  }
})

import { Charts } from './Charts'

describe('Charts', () => {
  it('hides the dscr section when no dscr values are available', () => {
    render(
      <Charts
        properties={[
          {
            id: 'prop-1',
            property_name: 'Missing DSCR',
            market: 'Dallas, TX',
            broker_name: 'JLL',
            dscr_current: null,
          },
        ]}
      />,
    )

    expect(screen.queryByText('DSCR by Property')).not.toBeInTheDocument()
  })

  it('renders the market map companion section for known markets', () => {
    render(
      <Charts
        properties={[
          {
            id: 'prop-1',
            property_name: 'Sunset Ridge',
            market: 'Houston, TX',
            broker_name: 'JLL',
            dscr_current: 1.4,
            noi_actual: 1000000,
            physical_occupancy_pct: 95,
            expense_ratio_actual: 43,
            in_place_annual_upside: 100000,
          },
        ]}
      />,
    )

    expect(screen.getAllByText('Properties by Market').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Markets covered').length).toBeGreaterThan(0)
  })
})
