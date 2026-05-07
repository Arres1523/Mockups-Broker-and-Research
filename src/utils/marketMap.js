const MARKET_COORDINATES = {
  'APOPKA, FL': { x: 82.5, y: 72.5, state: 'FL' },
  'ARLINGTON, TX': { x: 47.5, y: 63.5, state: 'TX' },
  'BROOKLYN, NY': { x: 86.2, y: 33.4, state: 'NY' },
  'CHARLOTTE, NC': { x: 78.4, y: 52.4, state: 'NC' },
  'CHINO HILLS, CA': { x: 17.2, y: 60.4, state: 'CA' },
  'DENVER, CO': { x: 38.2, y: 41.2, state: 'CO' },
  'DURHAM, NC': { x: 80.4, y: 47.3, state: 'NC' },
  'EL MONTE, CA': { x: 15.6, y: 60.8, state: 'CA' },
  'EL PASO, TX': { x: 29.8, y: 63.4, state: 'TX' },
  'GREELEY, CO': { x: 37.2, y: 37.8, state: 'CO' },
  'HAZELWOOD, MO': { x: 57.6, y: 44.3, state: 'MO' },
  'HOUSTON, TX': { x: 49.6, y: 70.6, state: 'TX' },
  'LITTLE RIVER, SC': { x: 81.6, y: 56.1, state: 'SC' },
  'LOS ANGELES, CA': { x: 14.7, y: 61.2, state: 'CA' },
  'LOUISVILLE, KY': { x: 65.2, y: 45.1, state: 'KY' },
  'MCALLEN, TX': { x: 44.8, y: 79.6, state: 'TX' },
  'PEARLAND, TX': { x: 49.8, y: 71.5, state: 'TX' },
  'PHILADELPHIA, PA': { x: 84.2, y: 37.4, state: 'PA' },
  'PHOENIX, AZ': { x: 24.7, y: 57.8, state: 'AZ' },
  'ROCK ISLAND, IL': { x: 59.1, y: 39.3, state: 'IL' },
  'SAN ANTONIO, TX': { x: 45.7, y: 71.4, state: 'TX' },
  'SAN DIEGO, CA': { x: 15.1, y: 67.7, state: 'CA' },
  'ST. LOUIS, MO': { x: 58.6, y: 44.9, state: 'MO' },
  'STATE MCHENRY, IL': { x: 61.6, y: 34.6, state: 'IL' },
  'STATE MUNDELEIN, IL': { x: 62.1, y: 34.4, state: 'IL' },
}

const STATE_COORDINATES = {
  AZ: { x: 24.7, y: 57.8 },
  CA: { x: 15.2, y: 61.8 },
  CO: { x: 38.0, y: 40.1 },
  FL: { x: 82.5, y: 72.5 },
  IL: { x: 61.3, y: 36.6 },
  KY: { x: 65.2, y: 45.1 },
  MO: { x: 58.4, y: 44.5 },
  NC: { x: 79.3, y: 50.1 },
  NY: { x: 86.2, y: 33.4 },
  PA: { x: 84.2, y: 37.4 },
  SC: { x: 81.6, y: 56.1 },
  TX: { x: 46.7, y: 69.1 },
}

function normalizeMarket(market) {
  return String(market || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase()
}

function getStateFromMarket(market) {
  const parts = normalizeMarket(market).split(',')
  return parts[1]?.trim() || null
}

export function buildMarketMapPoints(properties) {
  const counts = properties.reduce((accumulator, property) => {
    const market = normalizeMarket(property.market)

    if (!market) {
      return accumulator
    }

    accumulator[market] = (accumulator[market] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(counts)
    .map(([market, count]) => {
      const exact = MARKET_COORDINATES[market]
      const state = exact?.state || getStateFromMarket(market)
      const fallback = state ? STATE_COORDINATES[state] : null
      const position = exact || fallback

      if (!position) {
        return null
      }

      return {
        market,
        count,
        state,
        x: position.x,
        y: position.y,
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.count - left.count || left.market.localeCompare(right.market))
}
