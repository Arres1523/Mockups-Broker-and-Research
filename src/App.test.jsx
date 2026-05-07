import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  window.location.hash = ''
})

describe('App visual shell', () => {
  it('renders the XCreos-style website hero with mock dashboard preview', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /underwrite multifamily deals/i })).toBeInTheDocument()
    expect(screen.getByText('Oakwood Apartments')).toBeInTheDocument()
    expect(screen.getByText('Financial Analysis')).toBeInTheDocument()
  })

  it('opens the mock portfolio workspace without fetching backend data', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: /open mock workspace/i }))

    expect(screen.getByRole('complementary', { name: /workspace navigation/i })).toBeInTheDocument()
    expect(screen.getByTestId('app-top-bar')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /portfolio dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('Pipeline funnel')).toBeInTheDocument()
    expect(screen.getByText('Active underwriting')).toBeInTheDocument()
  })
})
