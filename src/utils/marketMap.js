const MARKET_COORDINATES = {
  'APOPKA, FL': { longitude: -81.53, latitude: 28.68, state: 'FL' },
  'ARLINGTON, TX': { longitude: -97.11, latitude: 32.74, state: 'TX' },
  'BROOKLYN, NY': { longitude: -73.94, latitude: 40.68, state: 'NY' },
  'CHARLOTTE, NC': { longitude: -80.84, latitude: 35.23, state: 'NC' },
  'CHINO HILLS, CA': { longitude: -117.73, latitude: 33.99, state: 'CA' },
  'DENVER, CO': { longitude: -104.99, latitude: 39.74, state: 'CO' },
  'DURHAM, NC': { longitude: -78.9, latitude: 35.99, state: 'NC' },
  'EL MONTE, CA': { longitude: -118.03, latitude: 34.07, state: 'CA' },
  'EL PASO, TX': { longitude: -106.49, latitude: 31.76, state: 'TX' },
  'GREELEY, CO': { longitude: -104.71, latitude: 40.42, state: 'CO' },
  'HAZELWOOD, MO': { longitude: -90.37, latitude: 38.77, state: 'MO' },
  'HOUSTON, TX': { longitude: -95.37, latitude: 29.76, state: 'TX' },
  'LITTLE RIVER, SC': { longitude: -78.61, latitude: 33.87, state: 'SC' },
  'LOS ANGELES, CA': { longitude: -118.24, latitude: 34.05, state: 'CA' },
  'LOUISVILLE, KY': { longitude: -85.76, latitude: 38.25, state: 'KY' },
  'MCALLEN, TX': { longitude: -98.23, latitude: 26.2, state: 'TX' },
  'PEARLAND, TX': { longitude: -95.29, latitude: 29.56, state: 'TX' },
  'PHILADELPHIA, PA': { longitude: -75.17, latitude: 39.95, state: 'PA' },
  'PHOENIX, AZ': { longitude: -112.07, latitude: 33.45, state: 'AZ' },
  'ROCK ISLAND, IL': { longitude: -90.58, latitude: 41.51, state: 'IL' },
  'SAN ANTONIO, TX': { longitude: -98.49, latitude: 29.42, state: 'TX' },
  'SAN DIEGO, CA': { longitude: -117.16, latitude: 32.72, state: 'CA' },
  'ST. LOUIS, MO': { longitude: -90.2, latitude: 38.63, state: 'MO' },
  'STATE MCHENRY, IL': { longitude: -88.27, latitude: 42.33, state: 'IL' },
  'STATE MUNDELEIN, IL': { longitude: -88.0, latitude: 42.26, state: 'IL' },
}

const STATE_COORDINATES = {
  AZ: { longitude: -111.93, latitude: 34.05 },
  CA: { longitude: -119.42, latitude: 36.78 },
  CO: { longitude: -105.78, latitude: 39.55 },
  FL: { longitude: -81.52, latitude: 27.66 },
  IL: { longitude: -89.4, latitude: 40.63 },
  KY: { longitude: -84.27, latitude: 37.84 },
  MO: { longitude: -92.6, latitude: 38.57 },
  NC: { longitude: -79.02, latitude: 35.76 },
  NY: { longitude: -75.0, latitude: 43.0 },
  PA: { longitude: -77.19, latitude: 41.2 },
  SC: { longitude: -81.16, latitude: 33.84 },
  TX: { longitude: -99.9, latitude: 31.97 },
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
        longitude: position.longitude,
        latitude: position.latitude,
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.count - left.count || left.market.localeCompare(right.market))
}
