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
  it('shows an explicit empty state when a comparison series has no values', () => {
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

    expect(screen.getByText('DSCR by Property')).toBeInTheDocument()
    expect(
      screen.getByText('No DSCR values were extracted from the current source files.'),
    ).toBeInTheDocument()
  })
})
