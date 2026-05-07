# Multifamily Source Audit

- Rows audited: 35
- T12 files linked and found: 22
- Rent roll files linked and found: 20
- Units populated: 23
- Year built populated: 16
- Occupancy populated: 18
- NOI populated: 8
- Expense ratio populated: 7
- DSCR populated: 0
- Annual upside populated: 6

## Main Findings

- DSCR is missing across all 35 rows in the consolidated table.
- 22 properties have a linked T12 file, but only a subset produced extractable NOI.
- 20 properties have a linked rent roll file, but occupancy/upside coverage is still partial.
- Rows with `quality_notes` need extractor review before being treated as fully source-backed.

Detailed audit CSV: `C:\Users\migue\OneDrive\Documents\valoris\Research Broker ExSum\xcreos-dashboard\data-audit\multifamily_source_audit.csv`