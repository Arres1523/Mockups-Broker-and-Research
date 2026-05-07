import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KpiCard } from './primitives/KpiCard'
import { ProgressBar } from './primitives/ProgressBar'
import { StackedBar } from './primitives/StackedBar'
import { WidgetCard } from './primitives/WidgetCard'

describe('XCreos dashboard primitives', () => {
  it('renders a reusable widget card shell', () => {
    render(
      <WidgetCard title="Pipeline funnel" action="Mock data">
        <p>Visual-only content</p>
      </WidgetCard>,
    )

    expect(screen.getByText('Pipeline funnel')).toBeInTheDocument()
    expect(screen.getByText('Mock data')).toBeInTheDocument()
    expect(screen.getByText('Visual-only content')).toBeInTheDocument()
  })

  it('renders KPI labels and tabular values', () => {
    render(<KpiCard label="Deals" value="$42.6M" helper="Weighted pipeline" />)

    expect(screen.getByText('Deals')).toBeInTheDocument()
    expect(screen.getByText('$42.6M')).toBeInTheDocument()
    expect(screen.getByText('Weighted pipeline')).toBeInTheDocument()
  })

  it('clamps progress ratios for accessible progress bars', () => {
    render(<ProgressBar ratio={1.5} ariaLabel="Confidence" />)

    expect(screen.getByRole('progressbar', { name: 'Confidence' })).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders stacked bar segments with titles', () => {
    render(
      <StackedBar
        segments={[
          { key: 'screening', widthRatio: 0.4, color: 'var(--info)', title: 'Screening' },
          { key: 'underwriting', widthRatio: 0.6, color: 'var(--copper)', title: 'Underwriting' },
        ]}
      />,
    )

    expect(screen.getByTitle('Screening')).toBeInTheDocument()
    expect(screen.getByTitle('Underwriting')).toBeInTheDocument()
  })
})
