export interface ColdStorageUnit {
  id: string;
  name: string;
  code: string;
  zone: string;
  type: 'refrigerator' | 'freezer' | 'transit-cooler';
  probeId: string;
  targetTemp: number; // °C
  minAllowedTemp: number; // °C
  maxAllowedTemp: number; // °C
  currentTemp: number; // °C
  currentHumidity: number; // %
  lastSync: string;
  batteryLevel: number; // %
  status: 'optimal' | 'warning' | 'excursion';
  alarmActive: boolean;
  notes?: string;
}

export interface ColdChainBatchItem {
  id: string;
  inventoryItemId: string;
  productId: string;
  medicationName: string;
  batchNumber: string;
  category: string;
  dosage: string;
  packSize: string;
  unitPriceGhs: number;
  storageUnitId: string;
  storageUnitName: string;
  currentTemp: number; // °C
  targetMinTemp: number;
  targetMaxTemp: number;
  tempStatus: 'optimal' | 'warning' | 'excursion';
  stockCount: number;
  reorderLevel: number;
  replenishmentStatus: 'adequate' | 'reorder-needed' | 'critical-depletion';
  requiresImmediateTempCheck: boolean;
  tempCheckReason?: string;
  requiresImmediateReplenishment: boolean;
  replenishmentReason?: string;
  lastTempCheckAt: string;
  lastCheckedBy?: string;
  tempHistory: Array<{ time: string; temp: number }>;
}

export interface ColdChainAuditEntry {
  id: string;
  timestamp: string;
  batchNumber: string;
  medicationName: string;
  storageUnitName: string;
  actionType: 'temp-check' | 'replenish' | 'calibration' | 'excursion-flag';
  observedTemp?: number;
  quantityAdded?: number;
  capaActionTaken: string;
  authorizedStaffName: string;
  authorizedStaffRole: string;
  registrationNumber?: string;
  gdpComplianceStatus: 'compliant' | 'corrective-active';
}

export const INITIAL_STORAGE_UNITS: ColdStorageUnit[] = [
  {
    id: 'unit-r01',
    name: 'Dispensary Main Refrigerator #R-01',
    code: 'REF-01',
    zone: 'Dispensary Clean Bench · Abelemkpe',
    type: 'refrigerator',
    probeId: 'PRB-ACCR-01',
    targetTemp: 4.0,
    minAllowedTemp: 2.0,
    maxAllowedTemp: 8.0,
    currentTemp: 3.8,
    currentHumidity: 52,
    lastSync: 'Just now',
    batteryLevel: 98,
    status: 'optimal',
    alarmActive: false,
    notes: 'WHO PQS Certified Medical Refrigerator with 12hr thermal holdover backup.',
  },
  {
    id: 'unit-fz02',
    name: 'Biologics & Vaccine Deep Freezer #FZ-02',
    code: 'FRZ-02',
    zone: 'Cold Storage Vault · Abelemkpe',
    type: 'freezer',
    probeId: 'PRB-ACCR-02',
    targetTemp: -18.0,
    minAllowedTemp: -25.0,
    maxAllowedTemp: -15.0,
    currentTemp: -19.2,
    currentHumidity: 28,
    lastSync: 'Just now',
    batteryLevel: 100,
    status: 'optimal',
    alarmActive: false,
    notes: 'Ultra-cold storage for clinical serums, biologics, and specialized reconstitutions.',
  },
  {
    id: 'unit-cv03',
    name: 'Dispatch Pre-Chill Cold Vault #CV-03',
    code: 'CV-03',
    zone: 'Courier Packaging Bay · Abelemkpe',
    type: 'refrigerator',
    probeId: 'PRB-ACCR-03',
    targetTemp: 4.0,
    minAllowedTemp: 2.0,
    maxAllowedTemp: 8.0,
    currentTemp: 8.4, // Excursion
    currentHumidity: 69,
    lastSync: '30s ago',
    batteryLevel: 92,
    status: 'excursion',
    alarmActive: true,
    notes: 'Door seal trip logged 14 mins ago. Temperature exceeding 8.0°C upper ceiling!',
  },
  {
    id: 'unit-tc04',
    name: 'Mobile Active Transit Cool-Box #TC-04',
    code: 'TRN-04',
    zone: 'En Route Courier Fleet · Airport/Dzorwulu',
    type: 'transit-cooler',
    probeId: 'PRB-TRNS-04',
    targetTemp: 4.5,
    minAllowedTemp: 2.0,
    maxAllowedTemp: 8.0,
    currentTemp: 4.1,
    currentHumidity: 56,
    lastSync: 'Just now',
    batteryLevel: 87,
    status: 'optimal',
    alarmActive: false,
    notes: 'LoRaWAN + GPS cellular telemetry attached to Accra Express motorcycle delivery box.',
  },
];

export const INITIAL_COLD_CHAIN_BATCHES: ColdChainBatchItem[] = [
  {
    id: 'ccb-hemo-01',
    inventoryItemId: 'inv-cedar-antacid-susp',
    productId: 'cedar-hemosoft-iron',
    medicationName: 'Hemosoft Liquid Iron Tonic & B-Complex',
    batchNumber: 'CPC-B202604-HEMO',
    category: 'Vitamins & Minerals',
    dosage: '200ml Liquid Formulation',
    packSize: '200ml Amber Bottle',
    unitPriceGhs: 45.0,
    storageUnitId: 'unit-cv03',
    storageUnitName: 'Dispatch Pre-Chill Cold Vault #CV-03',
    currentTemp: 8.4,
    targetMinTemp: 2.0,
    targetMaxTemp: 8.0,
    tempStatus: 'excursion',
    stockCount: 42,
    reorderLevel: 20,
    replenishmentStatus: 'adequate',
    requiresImmediateTempCheck: true,
    tempCheckReason: 'Chamber temperature reached 8.4°C (+0.4°C above critical threshold). Immediate probe check and chamber resealing required under Ghana FDA GDP.',
    requiresImmediateReplenishment: false,
    lastTempCheckAt: '35 mins ago',
    lastCheckedBy: 'Kojo Boateng',
    tempHistory: [
      { time: '11:00', temp: 4.2 },
      { time: '11:15', temp: 4.4 },
      { time: '11:30', temp: 5.1 },
      { time: '11:45', temp: 6.8 },
      { time: '12:00', temp: 8.4 },
    ],
  },
  {
    id: 'ccb-insu-02',
    inventoryItemId: 'inv-rapid-acting-insulin',
    productId: 'cedar-insulin-rapid',
    medicationName: 'Rapid-Acting Human Insulin Vials 100 IU/ml',
    batchNumber: 'CPC-B202602-INSU',
    category: 'Chronic Care & Diabetes',
    dosage: '100 IU/ml Injectable Solution',
    packSize: '10ml Multi-Dose Vial',
    unitPriceGhs: 120.0,
    storageUnitId: 'unit-r01',
    storageUnitName: 'Dispensary Main Refrigerator #R-01',
    currentTemp: 3.8,
    targetMinTemp: 2.0,
    targetMaxTemp: 8.0,
    tempStatus: 'optimal',
    stockCount: 7, // CRITICALLY LOW
    reorderLevel: 25,
    replenishmentStatus: 'critical-depletion',
    requiresImmediateTempCheck: false,
    requiresImmediateReplenishment: true,
    replenishmentReason: 'Critical stock depletion: Only 7 vials left on dispensary clean racks (minimum threshold is 25). Patient stockout risk is imminent.',
    lastTempCheckAt: 'Today, 08:30 AM',
    lastCheckedBy: 'Pharm. Kwabena Asante, MPSGh',
    tempHistory: [
      { time: '11:00', temp: 3.7 },
      { time: '11:15', temp: 3.8 },
      { time: '11:30', temp: 3.8 },
      { time: '11:45', temp: 3.9 },
      { time: '12:00', temp: 3.8 },
    ],
  },
  {
    id: 'ccb-amox-03',
    inventoryItemId: 'inv-cedar-amoxicillin-500',
    productId: 'cedar-amox-susp',
    medicationName: 'Amoxiclav Pediatric Oral Suspension 156mg/5ml',
    batchNumber: 'CPC-B202603-AMOX',
    category: 'Infections & Antibiotics',
    dosage: '156.25mg/5ml Powder for Reconstitution',
    packSize: '100ml Reconstitutable Bottle',
    unitPriceGhs: 55.0,
    storageUnitId: 'unit-r01',
    storageUnitName: 'Dispensary Main Refrigerator #R-01',
    currentTemp: 4.1,
    targetMinTemp: 2.0,
    targetMaxTemp: 8.0,
    tempStatus: 'optimal',
    stockCount: 14, // LOW STOCK
    reorderLevel: 20,
    replenishmentStatus: 'reorder-needed',
    requiresImmediateTempCheck: false,
    requiresImmediateReplenishment: true,
    replenishmentReason: 'Buffer stock depleted to 14 units (reorder level: 20). High pediatric demand across Accra clinics.',
    lastTempCheckAt: 'Today, 09:15 AM',
    lastCheckedBy: 'Pharm. Kwabena Asante, MPSGh',
    tempHistory: [
      { time: '11:00', temp: 4.0 },
      { time: '11:15', temp: 4.1 },
      { time: '11:30', temp: 4.2 },
      { time: '11:45', temp: 4.0 },
      { time: '12:00', temp: 4.1 },
    ],
  },
  {
    id: 'ccb-zur-04',
    inventoryItemId: 'inv-zurion-immunity-syrup',
    productId: 'zurion-immunity-syrup',
    medicationName: 'Zurion Immune Zinc + Vitamin C Syrups',
    batchNumber: 'CPC-B202605-ZUR',
    category: 'Immune & Wellness',
    dosage: 'Zinc 15mg + Vit C 500mg/10ml',
    packSize: '150ml Amber Bottle',
    unitPriceGhs: 35.0,
    storageUnitId: 'unit-r01',
    storageUnitName: 'Dispensary Main Refrigerator #R-01',
    currentTemp: 3.9,
    targetMinTemp: 2.0,
    targetMaxTemp: 8.0,
    tempStatus: 'optimal',
    stockCount: 56,
    reorderLevel: 20,
    replenishmentStatus: 'adequate',
    requiresImmediateTempCheck: false,
    requiresImmediateReplenishment: false,
    lastTempCheckAt: 'Today, 08:30 AM',
    lastCheckedBy: 'Kojo Boateng',
    tempHistory: [
      { time: '11:00', temp: 3.9 },
      { time: '11:15', temp: 3.9 },
      { time: '11:30', temp: 4.0 },
      { time: '11:45', temp: 3.8 },
      { time: '12:00', temp: 3.9 },
    ],
  },
  {
    id: 'ccb-vax-05',
    inventoryItemId: 'inv-hepatitis-b-biologics',
    productId: 'cedar-hepb-vax',
    medicationName: 'Recombinant Hepatitis B Vaccine Ampoules 20mcg',
    batchNumber: 'CPC-B202606-VAX',
    category: 'Biologics & Vaccines',
    dosage: '20mcg/1ml Single-Dose Suspension',
    packSize: 'Pack of 5 Vials',
    unitPriceGhs: 190.0,
    storageUnitId: 'unit-fz02',
    storageUnitName: 'Biologics & Vaccine Deep Freezer #FZ-02',
    currentTemp: -19.2,
    targetMinTemp: -25.0,
    targetMaxTemp: -15.0,
    tempStatus: 'optimal',
    stockCount: 32,
    reorderLevel: 15,
    replenishmentStatus: 'adequate',
    requiresImmediateTempCheck: false,
    requiresImmediateReplenishment: false,
    lastTempCheckAt: 'Today, 07:45 AM',
    lastCheckedBy: 'Pharm. Kwabena Asante, MPSGh',
    tempHistory: [
      { time: '11:00', temp: -19.5 },
      { time: '11:15', temp: -19.3 },
      { time: '11:30', temp: -19.1 },
      { time: '11:45', temp: -19.4 },
      { time: '12:00', temp: -19.2 },
    ],
  },
  {
    id: 'ccb-trns-06',
    inventoryItemId: 'inv-cenart-forte-transit',
    productId: 'cedar-cenart-forte',
    medicationName: 'Cenart Forte Anti-Malarial Emergency Dispatch Ampoules',
    batchNumber: 'CPC-B202601-CEN',
    category: 'Prescription & Acute Care',
    dosage: 'Artemether 80mg / Lumefantrine 480mg',
    packSize: 'Sterile Pack of 6',
    unitPriceGhs: 55.0,
    storageUnitId: 'unit-tc04',
    storageUnitName: 'Mobile Active Transit Cool-Box #TC-04',
    currentTemp: 4.1,
    targetMinTemp: 2.0,
    targetMaxTemp: 8.0,
    tempStatus: 'optimal',
    stockCount: 22,
    reorderLevel: 10,
    replenishmentStatus: 'adequate',
    requiresImmediateTempCheck: false,
    requiresImmediateReplenishment: false,
    lastTempCheckAt: '12 mins ago (GPS Telemetry Auto-Ping)',
    lastCheckedBy: 'Automated LoRaWAN Sensor',
    tempHistory: [
      { time: '11:00', temp: 3.9 },
      { time: '11:15', temp: 4.0 },
      { time: '11:30', temp: 4.3 },
      { time: '11:45', temp: 4.2 },
      { time: '12:00', temp: 4.1 },
    ],
  },
];

export const INITIAL_COLD_CHAIN_AUDIT_LOGS: ColdChainAuditEntry[] = [
  {
    id: 'CC-AUD-010',
    timestamp: 'Today · 11:48 AM',
    batchNumber: 'CPC-B202604-HEMO',
    medicationName: 'Hemosoft Liquid Iron Tonic & B-Complex',
    storageUnitName: 'Dispatch Pre-Chill Cold Vault #CV-03',
    actionType: 'excursion-flag',
    observedTemp: 8.4,
    capaActionTaken: 'System auto-flagged chamber temperature spike above 8.0°C upper limit. Siren audio muted; alert sent to Dispensary Supervisor.',
    authorizedStaffName: 'Dispensary Telemetry Watchdog',
    authorizedStaffRole: 'Automated GDP Compliance Daemon',
    gdpComplianceStatus: 'corrective-active',
  },
  {
    id: 'CC-AUD-009',
    timestamp: 'Today · 08:30 AM',
    batchNumber: 'CPC-B202602-INSU',
    medicationName: 'Rapid-Acting Human Insulin Vials 100 IU/ml',
    storageUnitName: 'Dispensary Main Refrigerator #R-01',
    actionType: 'temp-check',
    observedTemp: 3.8,
    capaActionTaken: 'Daily morning clinical verification with calibrated NIST mercury reference thermometer. Zero drift observed; gaskets wiped with isopropyl alcohol.',
    authorizedStaffName: 'Pharm. Kwabena Asante, MPSGh',
    authorizedStaffRole: 'Superintendent Pharmacist',
    registrationNumber: 'FDA-GA/DISP-10492',
    gdpComplianceStatus: 'compliant',
  },
  {
    id: 'CC-AUD-008',
    timestamp: 'Yesterday · 04:10 PM',
    batchNumber: 'CPC-B202606-VAX',
    medicationName: 'Recombinant Hepatitis B Vaccine Ampoules 20mcg',
    storageUnitName: 'Biologics & Vaccine Deep Freezer #FZ-02',
    actionType: 'temp-check',
    observedTemp: -19.4,
    capaActionTaken: 'Biologics weekly frost inspection. Dual digital data loggers in perfect synchronization with backup sensor.',
    authorizedStaffName: 'Kojo Boateng',
    authorizedStaffRole: 'Dispensary & Dispatch Technician',
    registrationNumber: 'PCG-TECH-4821',
    gdpComplianceStatus: 'compliant',
  },
  {
    id: 'CC-AUD-007',
    timestamp: 'Oct 08, 2026 · 02:20 PM',
    batchNumber: 'CPC-B202605-ZUR',
    medicationName: 'Zurion Immune Zinc + Vitamin C Syrups',
    storageUnitName: 'Dispensary Main Refrigerator #R-01',
    actionType: 'replenish',
    quantityAdded: 40,
    capaActionTaken: 'Received cold transport shipment from Cedar Point Formulations Tema depot in validated PCM thermal container. Initial receiving temp: 3.4°C.',
    authorizedStaffName: 'Pharm. Kwabena Asante, MPSGh',
    authorizedStaffRole: 'Superintendent Pharmacist',
    registrationNumber: 'FDA-GA/DISP-10492',
    gdpComplianceStatus: 'compliant',
  },
];

const STORAGE_UNITS_KEY = 'cedar_point_cold_storage_units_v1';
const COLD_BATCHES_KEY = 'cedar_point_cold_batches_v1';
const COLD_AUDIT_KEY = 'cedar_point_cold_audit_v1';

export function loadColdStorageUnits(): ColdStorageUnit[] {
  try {
    const raw = localStorage.getItem(STORAGE_UNITS_KEY);
    if (!raw) return INITIAL_STORAGE_UNITS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STORAGE_UNITS;
  } catch {
    return INITIAL_STORAGE_UNITS;
  }
}

export function saveColdStorageUnits(units: ColdStorageUnit[]): void {
  try {
    localStorage.setItem(STORAGE_UNITS_KEY, JSON.stringify(units));
  } catch {
    // ignore
  }
}

export function loadColdBatches(): ColdChainBatchItem[] {
  try {
    const raw = localStorage.getItem(COLD_BATCHES_KEY);
    if (!raw) return INITIAL_COLD_CHAIN_BATCHES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COLD_CHAIN_BATCHES;
  } catch {
    return INITIAL_COLD_CHAIN_BATCHES;
  }
}

export function saveColdBatches(batches: ColdChainBatchItem[]): void {
  try {
    localStorage.setItem(COLD_BATCHES_KEY, JSON.stringify(batches));
  } catch {
    // ignore
  }
}

export function loadColdAuditLogs(): ColdChainAuditEntry[] {
  try {
    const raw = localStorage.getItem(COLD_AUDIT_KEY);
    if (!raw) return INITIAL_COLD_CHAIN_AUDIT_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COLD_CHAIN_AUDIT_LOGS;
  } catch {
    return INITIAL_COLD_CHAIN_AUDIT_LOGS;
  }
}

export function saveColdAuditLogs(logs: ColdChainAuditEntry[]): void {
  try {
    localStorage.setItem(COLD_AUDIT_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}
