import realExecutiveSummaries from './realExecutiveSummaries.generated.json'

export const mockExecutiveSummaries = realExecutiveSummaries.map((property, index) => ({
  id: `real-${index + 1}`,
  ...property,
  created_at: '2026-05-01T12:00:00Z',
}))
