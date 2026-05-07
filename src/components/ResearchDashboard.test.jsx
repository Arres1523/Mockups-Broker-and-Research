import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResearchDashboard } from './ResearchDashboard'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null,
}))

function buildRows() {
  return Array.from({ length: 12 }, (_, index) => {
    const score = 30 + index * 4

    return {
      zip: String(90000 + index),
      city: `City ${index}`,
      state: index % 2 === 0 ? 'TX' : 'NY',
      metro: index % 2 === 0 ? 'Dallas-Fort Worth-Arlington, TX' : 'New York-Newark-Jersey City, NY-NJ-PA',
      county: `County ${index}`,
      price: 300000 + index * 10000,
      rent: 1600 + index * 25,
      rentYield: 0.05 + index * 0.001,
      appreciation1Y: 0.01 + index * 0.001,
      appreciation3Y: 0.04 + index * 0.002,
      hudRent: 1500,
      rentGap: index * 10,
      score,
      stability: 0.7,
      balancedScore: score - 2,
    }
  })
}

afterEach(() => {
  cleanup()
})

describe('ResearchDashboard', () => {
  it('renders summary cards and the ZIP table', () => {
    render(<ResearchDashboard dataRows={buildRows()} />)

    expect(screen.getByText('Market Research Intelligence')).toBeInTheDocument()
    expect(screen.getByText('ZIP-level underwriting view')).toBeInTheDocument()
    expect(screen.getByText('Median Yield')).toBeInTheDocument()
  })

  it('defaults the research table to highest Score first', () => {
    render(<ResearchDashboard dataRows={buildRows()} />)

    const rows = screen.getAllByTestId('research-table-row')
    expect(rows[0]).toHaveTextContent('90011')
  })

  it('switches the research table between Top 5, Top 10, and All', async () => {
    const user = userEvent.setup()

    render(<ResearchDashboard dataRows={buildRows()} />)

    expect(screen.getAllByTestId('research-table-row')).toHaveLength(10)

    await user.click(screen.getByRole('button', { name: 'Top 5' }))
    expect(screen.getAllByTestId('research-table-row')).toHaveLength(5)

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByTestId('research-table-row')).toHaveLength(12)
  })
})
