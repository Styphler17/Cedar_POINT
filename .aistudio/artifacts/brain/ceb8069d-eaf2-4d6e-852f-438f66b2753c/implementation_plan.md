# Implementation Plan: AdminPortal Analytics Module with Recharts

Transform the placeholder analytics in the Cedar Point Chemist `AdminPortalView` into an interactive, clinical-grade analytics suite powered by `recharts`. The module provides actionable business and clinical insights for superintendent pharmacists and dispensary dispatch managers.

---

## 1. User Requirements & Clarifications

Based on stakeholder feedback:
1. **Time Range Filtering**:
   - Quick toggles: **30 Days**, **90 Days**, **12 Months**, and **All-Time**, dynamically updating charts, averages, and volume totals.
2. **Peak Order Times Visualization**:
   - A **24-hour distribution bar chart** highlighting clinical rush hours (morning doctor outpatient peak 09:00–11:30 and post-work evening peak 16:00–18:30) to guide staff rota and Accra Express dispatch rider scheduling.
3. **Top-Selling Categories**:
   - A **donut/pie chart** and comparative breakdown by therapeutic formulary (Hypertension, Hematinics, Immune/Zinc, Anti-Malarials, Cholesterol, Antibiotics) displaying revenue contribution and units dispensed.
4. **Clinical & Operational Pharmacy Metrics**:
   - Prominently feature **Average Prescription Basket Size (GHS)**, **Cold-Chain Volume Share (%)**, **Refill Retention Rate**, and **Total Dispensed Units** alongside gross revenue.

---

## 2. Proposed Architecture & Dependencies

### A. Dependencies
- Install `recharts` via `install_applet_package`.

### B. Data Model (`src/data/pharmacyAnalyticsData.ts`)
Create a dedicated clinical analytics data module providing realistic Ghana pharmacy operational data:
- **Monthly Revenue Series**:
  - 12 consecutive months (e.g., Nov 2025 to Oct 2026).
  - Metrics per month: `month`, `revenueGhs`, `ordersCount`, `rxCount`, `otcCount`, `coldChainCount`, `avgBasketGhs`.
- **Timeframe Aggregations**:
  - Filter logic for `30d`, `90d`, `12m`, and `all-time` with period-over-period percentage delta calculations.
- **Top Therapeutic Categories**:
  - Categories: *Cardiovascular (Cantab)*, *Hematinics & Iron (Hemosoft)*, *Immune & Micronutrients (Zurion)*, *Anti-Malarials (Cenart Forte)*, *Lipid Regulators (Ultrox)*, *Anti-Infectives (Amoxiclav)*.
  - Metrics: `name`, `revenueGhs`, `unitsSold`, `percentage`, `color`, `growthRate`.
- **24-Hour Peak Order Distribution**:
  - 24 entries (`00:00` through `23:00`).
  - Metrics: `hour`, `orders`, `rxProportion`, `isRushHour: boolean`, `shift: 'Morning' | 'Afternoon' | 'Evening' | 'Night'`.
- **Clinical Telemetry Benchmarks**:
  - Cold-chain compliance percentage, temperature excursion count (0), average dispense turnaround time, and repeat prescription adherence.

---

## 3. UI/UX Design & Components

### A. Analytics Header & Controls
- **Title & Status**: "Pharmacy Telemetry & Revenue Analytics" with a live indicator: `Real-time synchronization with Abelemkpe POS & Accra Courier Dispatch`.
- **Time Range Switcher**: Tab pills for `30 Days`, `90 Days`, `12 Months`, and `All-Time`.
- **Export Action**: Quick action to download an executive summary or GDP review report.

### B. KPI Metrics Banner (4 Cards)
1. **Total Gross Revenue**: Formatted in GHS with percentage trend (+14.2% vs previous period).
2. **Average Prescription Basket**: Average order value (e.g. GHS 142.50) with breakdown of POM vs OTC items.
3. **Cold-Chain Volume Share**: Percentage of fulfilled orders requiring strict 2°C–8°C insulated transport (e.g. 32.4%).
4. **Dispensary Turnaround & Refills**: Average time to verify and dispense (e.g. 34 mins) and patient refill retention.

### C. Visualizations (Recharts)
1. **Monthly Revenue & Order Volume Trends**:
   - `ResponsiveContainer` wrapping an `AreaChart` with subtle gradient fills (`#007A33` forest green and `#0284C7` sky blue).
   - Tooltip customized with currency format (GHS), item counts, and dates.
   - Dual Y-axes for revenue (GHS) and order volume.
2. **Top-Selling Categories (Donut & Ranked Ledger)**:
   - `PieChart` with `Cell` colors matching brand standards.
   - Interactive hover state and center label showing total therapeutic volume.
   - Side-by-side ranked progress bars showing exact GHS revenue and units.
3. **24-Hour Peak Order Times (Dispensary Rush Hours)**:
   - `BarChart` displaying orders per hour.
   - Differentiated bar colors: Golden amber for morning rush (09:00–12:00) and forest green for evening commute peak (16:00–19:00).
   - Accompanying staffing recommendation banner (e.g. "Optimal shift overlap: Deploy 2 dispensary technicians between 16:00–18:30").

---

## 4. Verification & Testing Steps

1. **Dependency Installation**: Ensure `recharts` compiles without React 19 peer-dependency conflicts.
2. **Time Range Toggles**: Verify switching between 30 Days, 90 Days, 12 Months, and All-Time immediately recalculates KPIs and chart scales.
3. **Recharts Responsiveness**: Test chart scaling on mobile screens and large desktop viewports (`ResponsiveContainer`).
4. **TypeScript & Linter Checks**: Run `lint_applet` and `compile_applet` to confirm clean typing and zero compilation errors.
5. **Interactive Tooltips**: Confirm hovering over chart data points displays clean tooltips formatted with GHS currency and clinical labels.
