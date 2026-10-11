# Cedar Point Chemist (Abelemkpe) — Dispensary Management System (Dispensary OS)
## Comprehensive Technical Architecture & Developer Handoff Documentation

---

### 1. Executive Summary & System Overview

**Dispensary OS** is a full-stack-ready, clinical pharmacy backend management system built for **Cedar Point Chemist Ltd** (Accra, Ghana — Facility Registration: `GA-165`). The system governs outpatient and digital pharmacy dispensary operations in strict compliance with the **Ghana Pharmacy Council Act 857** and **Ghana Food and Drugs Authority (FDA) Good Distribution Practices (GDP)**.

The application bridges customer-facing storefront orders and clinical dispensary workflows through six unified operational modules:
1. **Orders Fulfillment Queue** (5-stage clinical progression with courier dispatch handover).
2. **Pharmaceutical Inventory & Batch Tracking** (FEFO batch numbers, stock count, reorder triggers, GMP certifications).
3. **Inventory Alerts & Clearance Discounting** (3 expiry alert tiers: Critical $\le$30d, Urgent $\le$90d, Attention $\le$180d; clearance sale price updates; batch quarantine with mandatory disposal audit logging).
4. **Real-Time Cold-Chain Telemetry & Excursion Watch** (continuous IoT temperature monitoring across 4 cold zones; automated thermal excursion and stockout flags; certified physical probe checks with CAPA sign-off; cold replenishment PO issuance; Ghana FDA GDP audit trail).
5. **Clinical Prescription Docket Verification** (NHIS verification, clinical contraindication checks, Superintendent Pharmacist sign-off).
6. **Pharmacy Performance Analytics** (Recharts data visualizer: monthly/quarterly revenue trends, category revenue breakdown, 24-hour dispensary rush hours distribution, cold-chain share).

---

### 2. Technology Stack & Runtime Specifications

| Category | Specification |
|---|---|
| **Framework** | React 19 (Functional components, custom hooks, typed interfaces) |
| **Language** | TypeScript 5.7+ (`tsc --noEmit` linting with strict typing) |
| **Build Tool** | Vite 6 / 8 (Fast dev server and optimized production bundling) |
| **Styling** | Tailwind CSS v4 (`@import "tailwindcss";` design token architecture) |
| **Iconography** | `@phosphor-icons/react` (Accessible SVG icons with consistent duotone/fill weights) |
| **Data Visualization** | `recharts` (Responsive SVG AreaCharts, BarCharts, and Donut PieCharts) |
| **Persistence** | Browser `localStorage` with resilient schema defaults and reactive event dispatch |

---

### 3. Repository File Structure & Architecture Map

```text
├── src/
│   ├── components/
│   │   ├── AdminPortalView.tsx         # Primary backend management shell, collapsible nav & topbar
│   │   ├── ColdChainMonitorView.tsx    # Real-time IoT chamber telemetry, alerts & GDP audit modal
│   │   ├── ShopCatalogView.tsx         # Public storefront synced with clearance prices & quarantine
│   │   ├── ProductCardVisual.tsx       # Reusable product cards displaying discounts & stock tags
│   │   ├── ProductDetailModal.tsx      # Modal showing clinical facts, batch details & stock status
│   │   ├── PrescriptionUploadModal.tsx # Prescription docket submission modal
│   │   ├── OrderTrackingModal.tsx      # Customer-facing live order delivery tracking
│   │   └── LiveSearchPopout.tsx        # Fast autocomplete product search
│   ├── data/
│   │   ├── backendAdminData.ts         # Inventory, disposal logs, staff personas, Rx dockets, expiry logic
│   │   ├── coldChainData.ts            # IoT chamber units, monitored cold batches, GDP audit logs
│   │   ├── pharmacyData.ts             # 17 core Ghanaian medications, categories, base pricing
│   │   ├── pharmacyAnalyticsData.ts    # Recharts data series (revenue, hourly rush, top categories)
│   │   └── patientProfileData.ts       # Order items, 5-stage fulfillment states, profile info
│   ├── App.tsx                         # Root app coordinator, storefront/admin view switcher
│   └── main.tsx                        # React 19 DOM bootstrap
├── package.json
└── DISPENSARY_MANAGEMENT_SYSTEM_DOCS.md # This documentation file
```

---

### 4. Operational Modules Specification

#### 4.1 Module 1: Orders Fulfillment Queue
- **Component**: `AdminPortalView.tsx` (Tab: `'orders'`)
- **Pipeline Stages**:
  1. `received`: Order placed by patient or clinical facility.
  2. `review`: Clinical review of medication regimen by dispensing staff.
  3. `dispensed`: Items picked from racks, counted, packaged in tamper-evident envelopes.
  4. `transit`: Handed over to Accra Express courier riders with cold-pack shippers if cold-chain.
  5. `delivered`: Delivered to patient residence (Dzorwulu, Airport Residential, Osu, Cantonments, etc.).
- **Staff Controls**:
  - One-click stage advancement button (`Advance Stage`).
  - Order search by ID, patient name, delivery area, or medication.
  - Stage filter dropdown (`all`, `review`, `dispensed`, `transit`, `delivered`).
  - Customer tracking modal integration (`onOpenTrackModal`).

#### 4.2 Module 2: Pharmaceutical Inventory & Batches
- **Data Source**: `src/data/backendAdminData.ts`
- **Model (`InventoryItem`)**:
  ```typescript
  export interface InventoryItem {
    id: string;
    productId: string;
    name: string;
    category: string;
    dosage: string;
    packSize: string;
    stockCount: number;
    reorderLevel: number;
    batchNumber: string;       // e.g., 'CPC-B202604-HEMO'
    expiryDate: string;        // 'YYYY-MM-DD'
    unitPriceGhs: number;
    storageRequirement: 'ambient' | 'cold-chain';
    supplier: string;
    gmpCertified: boolean;
    lastStockCheck: string;
    discountPercent?: number;  // 20, 35, 50
    discountedPriceGhs?: number;
    isQuarantined?: boolean;
    quarantineReason?: string;
  }
  ```
- **Staff Controls**:
  - Incremental physical stock count steppers (`+5`, `-5`, `+10`, `-10`).
  - Search by medication name, batch number, or active pharmaceutical ingredient.
  - Storage filter: Ambient vs Cold-Chain items.

#### 4.3 Module 3: Inventory Alerts & Expiry Control
- **Expiry Alert Tiers**:
  Calculated relative to system reference date:
  - **Critical (≤ 30 Days)**: Imminent expiry. Requires clearance pricing or clinical quarantine.
  - **Urgent (31 – 90 Days)**: Short shelf-life remaining. Prioritize First-Expired, First-Out (FEFO) dispensing.
  - **Attention (91 – 180 Days)**: Promotional bundling and rotation advised.
  - **Safe (> 180 Days)**: Full GMP stability.
- **Clearance Sale Discounting**:
  - Preset options: **20%**, **35%**, **50%**, or **Clear Discount**.
  - Automatically updates storefront prices via `getStorefrontProducts()`, displaying original crossed-out prices and clearance discount badges.
- **Batch Quarantine & Removal**:
  - Opens modal capturing:
    * Mandatory Disposal Reason (`Imminent Shelf-Life Expiry`, `Thermal Excursion`, `Seal Failure`, `Ghana FDA Hold`).
    * Unit count to withdraw from dispensary racks.
    * Real-time financial exposure calculation (GHS).
    * Clinical justification commentary.
    * Authorizing Pharmacist signature and registration number.
  - Appends an immutable record to `DisposalLogEntry[]` and immediately marks the batch as out-of-stock on the public storefront.

#### 4.4 Module 4: Real-Time Cold-Chain Telemetry & GDP Excursion Watch
- **Component**: `src/components/ColdChainMonitorView.tsx`
- **Monitored Chambers & Wireless IoT Probes**:
  1. *Dispensary Main Refrigerator #R-01* (`PRB-ACCR-01`, Spec: 2.0°C – 8.0°C, Target: 4.0°C)
  2. *Biologics & Vaccine Deep Freezer #FZ-02* (`PRB-ACCR-02`, Spec: -25.0°C – -15.0°C, Target: -18.0°C)
  3. *Dispatch Pre-Chill Cold Vault #CV-03* (`PRB-ACCR-03`, Spec: 2.0°C – 8.0°C, Initial status: Excursion 8.4°C)
  4. *Mobile Active Transit Cool-Box #TC-04* (`PRB-TRNS-04`, LoRaWAN + GPS courier fleet tracker)
- **Live IoT Simulation Engine**:
  - Polling interval (3.5 seconds) simulating sensor micro-fluctuations (±0.05°C – 0.1°C).
  - Telemetry heartbeat counter and live connectivity pulse.
  - Controls: Pause/Resume Polling, Ping Probes, Trigger Excursion Test, Calibrate Baseline.
- **Proactive Flags**:
  - **Immediate Temperature Check**: Triggered if a batch experiences thermal excursion.
    - Modal logs: Observed secondary reference thermometer reading (°C), Corrective Action (CAPA checklist), clinical commentary, and Pharmacist sign-off.
    - Clears alert and logs to the Ghana FDA GDP Compliance Ledger.
  - **Immediate Replenishment**: Triggered if cold stock falls below minimum safety stock (`stockCount <= reorderLevel`).
    - Modal logs: Reorder units stepper, validated cold-chain supplier selection, and validated cold packaging shipper method.
    - Restocks units in cold inventory and synchronizes with main inventory.

#### 4.5 Module 5: Clinical Prescriptions Verification
- **Data Source**: `src/data/backendAdminData.ts` (`INITIAL_PRESCRIPTIONS_DOCKETS`)
- **Docket Statuses**:
  - `pending-review`: Awaiting Superintendent Pharmacist clinical evaluation.
  - `approved`: Validated for dispensing with dosing commentary.
  - `flagged-query`: Held for prescriber dosage clarification.
  - `rejected`: Incompatible or invalid prescription.

#### 4.6 Module 6: Pharmacy Performance Analytics
- **Component**: `AdminPortalView.tsx` (Tab: `'analytics'`)
- **Visualizations (Recharts)**:
  - **Revenue & Orders Area Chart**: Toggleable time ranges (`30d`, `90d`, `12m`, `all`). Displays gross revenue in GHS and total order counts.
  - **Top Medication Categories Donut Chart**: Proportional revenue by category (Cardiology, Malaria, Antibiotics, Diabetes, OTC).
  - **24-Hour Dispensary Rush Distribution Bar Chart**: Color-coded bars highlighting Morning Outpatient Rush (10:00 AM) and Evening Courier Dispatch Peak (17:00 PM).
  - **Clinical Telemetry Benchmarks**: Mean cold storage temperature, bioequivalent adoption rate, and courier transit velocity.

---

### 5. UI Layout, Collapsible Sidebar & User Profile Dropdown

#### 5.1 Collapsible Responsive Sidebar
- **States**: `isSidebarCollapsed` (desktop rail toggle), `isMobileSidebarOpen` (mobile drawer).
- **Desktop Behavior**:
  - Expanded: `w-64` with full menu labels, badges, and Abelemkpe facility indicator.
  - Collapsed: `w-20` (icon-only rail) with centered Phosphor icons, floating alert notification dots, and tooltips.
  - Toggle triggers: Header toggle button and keyboard shortcut (`Ctrl+B` or `Cmd+B`).
- **Mobile Behavior**:
  - Hidden by default on `< lg`.
  - Hamburger menu in the topbar slides in a `w-72` drawer with a dark backdrop overlay (`bg-slate-950/70`).
  - Selecting any menu tab or tapping the backdrop automatically closes the drawer.

#### 5.2 Top Operational Bar & User Profile Dropdown
- **Header Structure**:
  - Left: Mobile hamburger button (`List`), Desktop sidebar collapse button (`SidebarSimple`), breadcrumb path.
  - Right: Cold-Chain urgent alert quick-jump pill, live dispensary online badge, and **User Profile Dropdown**.
- **User Profile Menu**:
  - Button displays avatar circle with staff initials (`KA` in emerald or `KB` in sky-blue) and online indicator dot, staff name, and role chip (`Pharmacist` / `Technician`).
  - Clicking opens a rich popover card containing:
    1. Large staff avatar, full name, role title, department, and registration number.
    2. **Operational Persona Switcher**: Seamlessly toggle between:
       - **Pharm. Kwabena Asante, MPSGh**: Superintendent Pharmacist (Full clinical prescription sign-off, expiry discounting & GDP quarantine authority).
       - **Kojo Boateng**: Dispensary & Dispatch Technician (Cold-chain packaging, dispensing fulfillment, stage dispatch progression).
    3. Terminal and shift information (GA-165 Abelemkpe Clean Bench, Morning & Outpatient Peak Shift).
    4. Quick actions: Switch persona, Return to Public Storefront, Close menu.
  - Dismisses automatically on outside click or pressing the `Escape` key.

---

### 6. Data Storage & LocalStorage Keys

All state is persisted in standard browser `localStorage` and falls back gracefully to realistic seed data:

| LocalStorage Key | Data Interface | Description |
|---|---|---|
| `cedar_point_inventory_v3` | `InventoryItem[]` | Primary pharmaceutical inventory, stock counts, batch numbers, discount tags, quarantine status. |
| `cedar_point_disposal_logs_v1` | `DisposalLogEntry[]` | Immutable audit ledger of withdrawn batches under FDA GDP standards. |
| `cedar_point_rx_dockets_v1` | `PrescriptionDocket[]` | Clinical prescription verifications, doctor details, and pharmacist notes. |
| `cedar_point_cold_storage_units_v1` | `ColdStorageUnit[]` | Cold-chain storage chambers, target temperatures, min/max allowed specs, probe IDs. |
| `cedar_point_cold_batches_v1` | `ColdChainBatchItem[]` | Monitored cold batches, live probe temperatures, excursion check flags, replenishment flags. |
| `cedar_point_cold_audit_v1` | `ColdChainAuditEntry[]` | GDP audit log entries for temperature checks, calibrations, excursions, and PO restocks. |
| `cedar_point_user_orders_v2` | `RecentOrderItem[]` | Customer orders and 5-stage fulfillment progress. |

---

### 7. Developer Extension & Maintenance Guide

#### Adding a New Cold-Chain Storage Chamber
1. Open `src/data/coldChainData.ts`.
2. Append a new object to `INITIAL_STORAGE_UNITS`:
   ```typescript
   {
     id: 'unit-new-05',
     name: 'Secondary Quarantine Refrigerator #R-05',
     code: 'REF-05',
     zone: 'Dispensary Vault · Abelemkpe',
     type: 'refrigerator',
     probeId: 'PRB-ACCR-05',
     targetTemp: 4.0,
     minAllowedTemp: 2.0,
     maxAllowedTemp: 8.0,
     currentTemp: 4.2,
     currentHumidity: 50,
     lastSync: 'Just now',
     batteryLevel: 95,
     status: 'optimal',
     alarmActive: false
   }
   ```
3. The real-time telemetry loop and storage grid will automatically discover and monitor the new chamber.

#### Extending Expiry Alert Rules
- Alert tier calculation resides in `src/data/backendAdminData.ts`:
  ```typescript
  export function getExpiryAlertTier(days: number): ExpiryAlertTier {
    if (days <= 30) return 'critical';
    if (days <= 90) return 'urgent';
    if (days <= 180) return 'attention';
    return 'safe';
  }
  ```
- To adjust thresholds (e.g. changing Critical to 45 days), modify this function and update `getExpiryTierMeta()`.

#### Verifying Build & Lint
Run standard checks from the project root:
```bash
# Verify TypeScript types and syntax
npm run lint

# Verify full production build
npm run build
```

---

*Authored for Cedar Point Chemist Dispensary Engineering Team.*  
*Facility: GA-165, Abelemkpe Dispensary Directorate, Accra, Ghana.*
