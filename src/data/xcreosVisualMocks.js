export const dashboardKpis = [
  { label: 'Pipeline value', value: '$42.6M', helper: 'Across 18 active deals' },
  { label: 'Weighted NOI', value: '$3.84M', helper: '+6.8% vs prior screen' },
  { label: 'Avg. DSCR', value: '1.42x', helper: 'Stabilized case' },
  { label: 'IC ready', value: '7', helper: 'Deals with complete pack' },
  { label: 'Close risk', value: 'Low', helper: '2 items past due' },
]

export const pipelineStages = [
  { key: 'sourcing', label: 'Sourcing', count: 24, value: '$88.2M', widthRatio: 0.28, color: 'var(--stage-1)' },
  { key: 'screening', label: 'Screening', count: 14, value: '$51.8M', widthRatio: 0.22, color: 'var(--stage-2)' },
  { key: 'underwriting', label: 'Underwriting', count: 9, value: '$32.4M', widthRatio: 0.26, color: 'var(--stage-3)' },
  { key: 'committee', label: 'IC', count: 5, value: '$18.1M', widthRatio: 0.15, color: 'var(--stage-4)' },
  { key: 'contract', label: 'Contract', count: 2, value: '$8.7M', widthRatio: 0.09, color: 'var(--stage-5)' },
]

export const activeDeals = [
  { name: 'Oakwood Apartments', market: 'Austin, TX', sponsor: 'Northline Capital', progress: 0.86, status: 'IC prep' },
  { name: 'Maple Grove', market: 'Raleigh, NC', sponsor: 'Cobalt Partners', progress: 0.68, status: 'Debt quotes' },
  { name: 'River Park', market: 'Tampa, FL', sponsor: 'Havenstone', progress: 0.51, status: 'Model review' },
  { name: 'Sunset Ridge', market: 'Phoenix, AZ', sponsor: 'Copper Trail', progress: 0.38, status: 'Screening' },
]

export const activityItems = [
  { title: 'Rent roll normalized', detail: 'Oakwood Apartments', time: '12 min ago' },
  { title: 'Debt quote added', detail: 'Maple Grove refinance case', time: '42 min ago' },
  { title: 'IC memo exported', detail: 'River Park v3 underwriting', time: '2 hr ago' },
  { title: 'Broker note captured', detail: 'Sunset Ridge tour feedback', time: 'Yesterday' },
]

export const upcomingItems = [
  { date: 'Thu', title: 'Lender call', detail: 'Oakwood debt sizing' },
  { date: 'Fri', title: 'Investment committee', detail: 'River Park review' },
  { date: 'Mon', title: 'Broker follow-up', detail: 'Phoenix pipeline' },
]

export const sourcingPulse = [
  { market: 'Austin', deals: 12, hitRate: 0.34 },
  { market: 'Raleigh', deals: 9, hitRate: 0.28 },
  { market: 'Tampa', deals: 8, hitRate: 0.23 },
  { market: 'Phoenix', deals: 7, hitRate: 0.19 },
]

export const dashboardRows = [
  { property: 'Oakwood Apartments', stage: 'IC prep', market: 'Austin, TX', units: 184, noi: '$1.42M', dscr: '1.55x', score: 91 },
  { property: 'Maple Grove', stage: 'Debt quotes', market: 'Raleigh, NC', units: 132, noi: '$940K', dscr: '1.38x', score: 84 },
  { property: 'River Park', stage: 'Model review', market: 'Tampa, FL', units: 208, noi: '$1.18M', dscr: '1.31x', score: 78 },
  { property: 'Sunset Ridge', stage: 'Screening', market: 'Phoenix, AZ', units: 96, noi: '$610K', dscr: '1.22x', score: 69 },
]
