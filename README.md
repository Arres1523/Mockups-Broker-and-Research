# Xcreos Multifamily Dashboard

Professional read-only dashboard for reviewing multifamily opportunities from broker executive summaries.

## Stack
- React + Vite
- Tailwind CSS v4
- Supabase
- PostgreSQL
- Recharts
- Vercel

## Features
- Xcreos dark financial dashboard layout with sidebar
- Summary KPI cards
- Property search, filters, and sorting
- Property table and opportunity cards
- Frontend `investment_score` from `0` to `100`
- Demo fallback when Supabase env vars are missing, the query fails, or the table is empty
- Loading and empty states

## Project Structure
```text
src/
  components/
    Charts.jsx
    Filters.jsx
    Hero.jsx
    PropertyCard.jsx
    PropertyTable.jsx
    Sidebar.jsx
    SummaryCards.jsx
  data/
    mockExecutiveSummaries.js
  lib/
    dataService.js
    supabaseClient.js
  test/
    fixtures.js
    setup.js
  utils/
    aggregations.js
    calculateInvestmentScore.js
    filterProperties.js
    formatters.js
  App.jsx
  main.jsx
scripts/
  load_executive_summaries.py
supabase/
  executive_summaries.sql
```

## Run Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env vars:
   ```bash
   copy .env.example .env.local
   ```
3. Add your Supabase values to `.env.local`:
   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open the local URL shown by Vite.

If env vars are missing, the app still loads with demo data.

## Tests and Build
```bash
npm test
npm run build
```

## Supabase Setup
1. Create a new Supabase project.
2. Open the SQL Editor.
3. Run [`supabase/executive_summaries.sql`](./supabase/executive_summaries.sql).
4. Copy the project URL and anon key into `.env.local`.

### Table Schema
The SQL file creates:
- `public.executive_summaries`
- RLS enabled
- public `select` policy only
- indexes for market, broker, year, NOI, DSCR, and occupancy

## Load Data Into Supabase
Expected columns:

```text
property_name
market
broker_name
units
year_built
physical_occupancy_pct
noi_actual
expense_ratio_actual
dscr_current
in_place_annual_upside
```

Numeric cleanup expectations:
- Remove `$`
- Remove `%`
- Remove commas
- Keep plain numeric values only

### Option 1: Manual CSV Upload
1. Open `Table Editor` in Supabase.
2. Select `executive_summaries`.
3. Use `Insert` or `Import data from CSV`.
4. Map the headers to the columns above.

### Option 2: Direct SQL Inserts
Run inserts in the SQL Editor:

```sql
insert into public.executive_summaries (
  property_name,
  market,
  broker_name,
  units,
  year_built,
  physical_occupancy_pct,
  noi_actual,
  expense_ratio_actual,
  dscr_current,
  in_place_annual_upside
)
values
  ('Sample Asset', 'Dallas, TX', 'JLL', 220, 1998, 96, 1450000, 41, 1.62, 380000);
```

### Option 3: Optional Python Loader
API mode uploads directly to Supabase and requires a local-only service role key.

CSV upload:
```bash
set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
python scripts/load_executive_summaries.py data.csv
```

Excel upload:
```bash
pip install openpyxl
set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
python scripts/load_executive_summaries.py data.xlsx
```

Generate SQL instead of calling the API:
```bash
python scripts/load_executive_summaries.py data.csv --mode sql --output seed.sql
```

Never expose the service role key in the frontend.

## Deploy to Vercel
1. Create a GitHub repository.
2. Push this project folder to GitHub.
3. Import the repository in Vercel.
4. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

Vercel will build the Vite app automatically and redeploy on every push.

## GitHub Push Flow
```bash
git init
git add .
git commit -m "feat: add xcreos multifamily dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

## Notes
- `investment_score` is computed in the frontend from the filtered dataset.
- The UI stays usable even if Supabase is not configured yet.
- The current MVP is intentionally public read-only with no auth.
