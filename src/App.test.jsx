import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { sampleProperties } from './test/fixtures'

vi.mock('./lib/dataService', () => ({
  loadExecutiveSummaries: vi.fn(),
}))

vi.mock('./components/Charts', () => ({
  Charts: () => <div>Charts</div>,
}))

import { loadExecutiveSummaries } from './lib/dataService'
import App from './App'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('App', () => {
  it('renders the dashboard hero, summary metrics, and demo fallback banner', async () => {
    loadExecutiveSummaries.mockResolvedValue({
      properties: sampleProperties,
      source: 'mock',
      reason: 'missing-env',
      error: null,
    })

    render(<App />)

    expect(
      await screen.findByText('Multifamily Investment Intelligence Dashboard'),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByText('Demo portfolio active').length).toBeGreaterThan(0)
    })

    expect(screen.getByText('Total Properties')).toBeInTheDocument()
    expect(screen.getAllByText('3').length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText('Search property')).toBeInTheDocument()
  })

  it('limits property cards with Top 5, Top 10, and All controls', async () => {
    const user = userEvent.setup()
    const properties = Array.from({ length: 12 }, (_, index) => ({
      ...sampleProperties[index % sampleProperties.length],
      id: `property-${index + 1}`,
      property_name: `Property ${index + 1}`,
      noi_actual: 1000000 - index * 1000,
    }))

    loadExecutiveSummaries.mockResolvedValue({
      properties,
      source: 'supabase',
      reason: 'live',
      error: null,
    })

    render(<App />)

    await screen.findByText('Multifamily Investment Intelligence Dashboard')

    await waitFor(() => {
      expect(screen.getAllByTestId('property-card')).toHaveLength(10)
    })

    await user.click(screen.getByRole('button', { name: 'Top 5' }))
    expect(screen.getAllByTestId('property-card')).toHaveLength(5)

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByTestId('property-card')).toHaveLength(12)
  })
})
