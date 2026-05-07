import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  normalizeResearchRows,
  normalizeZillowMetadata,
} from '../src/utils/marketResearchData.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultDatasetPath =
  'C:\\Users\\migue\\OneDrive\\Documents\\valoris\\Back\\output_Master\\Score\\dataset_clean.csv'
const defaultZillowPath =
  'C:\\Users\\migue\\OneDrive\\Documents\\valoris\\Back\\Zillow\\Home Values\\Zip_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv'
const outputPath = resolve(projectRoot, 'src/data/marketResearch.generated.json')

function parseDelimitedLine(line, delimiter) {
  const cells = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    const nextCharacter = line[index + 1]

    if (character === '"' && nextCharacter === '"') {
      cell += '"'
      index += 1
      continue
    }

    if (character === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (character === delimiter && !inQuotes) {
      cells.push(cell)
      cell = ''
      continue
    }

    cell += character
  }

  cells.push(cell)
  return cells
}

function parseDelimitedFile(filePath, delimiter) {
  const lines = readFileSync(filePath, 'utf8')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter(Boolean)
  const headers = parseDelimitedLine(lines[0], delimiter).map((header) => header.trim())

  return lines.slice(1).map((line) => {
    const values = parseDelimitedLine(line, delimiter)

    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? ''
      return row
    }, {})
  })
}

const datasetPath = process.env.MARKET_RESEARCH_CSV || defaultDatasetPath
const zillowPath = process.env.ZILLOW_ZIP_METADATA_CSV || defaultZillowPath
const researchRows = parseDelimitedFile(datasetPath, ';')
const zillowRows = parseDelimitedFile(zillowPath, ',')
const metadataByZip = normalizeZillowMetadata(zillowRows)
const rows = normalizeResearchRows(researchRows, metadataByZip)
const metadataMatches = rows.filter((row) => row.city !== 'Unknown' && row.state !== 'Unknown').length

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: {
        dataset: datasetPath,
        zillowMetadata: zillowPath,
      },
      rowCount: rows.length,
      metadataMatches,
      rows,
    },
    null,
    2,
  )}\n`,
)

console.log(`Generated ${rows.length} market research rows at ${outputPath}`)
console.log(`Joined Zillow metadata for ${metadataMatches} rows`)
