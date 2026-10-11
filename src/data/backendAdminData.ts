import { PRODUCTS, Product } from './pharmacyData';
import { RecentOrderItem, INITIAL_RECENT_ORDERS } from './patientProfileData';

export type AdminRole = 'superintendent' | 'technician';

export interface AdminStaffUser {
  id: string;
  name: string;
  role: AdminRole;
  roleTitle: string;
  registrationNumber?: string;
  avatarInitials: string;
  department: string;
}

export const ADMIN_STAFF_MEMBERS: AdminStaffUser[] = [
  {
    id: 'staff-01',
    name: 'Pharm. Kwabena Asante, MPSGh',
    role: 'superintendent',
    roleTitle: 'Superintendent Pharmacist',
    registrationNumber: 'FDA-GA/DISP-10492',
    avatarInitials: 'KA',
    department: 'Clinical Pharmacy & Regulatory Oversight',
  },
  {
    id: 'staff-02',
    name: 'Kojo Boateng',
    role: 'technician',
    roleTitle: 'Dispensary & Dispatch Technician',
    registrationNumber: 'PCG-TECH-4821',
    avatarInitials: 'KB',
    department: 'Cold-Chain Packaging & Dispatch Logistics',
  },
];

export type ExpiryAlertTier = 'critical' | 'urgent' | 'attention' | 'safe';

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  dosage: string;
  packSize: string;
  stockCount: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  unitPriceGhs: number;
  storageRequirement: 'ambient' | 'cold-chain';
  supplier: string;
  gmpCertified: boolean;
  lastStockCheck: string;

  // Expiry Alert & Clearance Discount States
  discountPercent?: number; // 0, 20, 35, 50
  discountedPriceGhs?: number;
  discountAppliedAt?: string;
  discountAppliedBy?: string;

  // Quarantine & Removal States
  isQuarantined?: boolean;
  quarantineReason?: string;
  quarantineDate?: string;
  quarantinedBy?: string;
  quarantinedUnits?: number;
}

export interface DisposalLogEntry {
  id: string;
  inventoryItemId: string;
  productId: string;
  medicationName: string;
  batchNumber: string;
  packSize: string;
  unitsQuarantined: number;
  reason: string;
  additionalNotes?: string;
  loggedAt: string;
  authorizedStaffName: string;
  authorizedStaffRole: string;
  registrationNumber?: string;
}

export interface PrescriptionDocket {
  id: string;
  orderId?: string;
  patientName: string;
  patientPhone: string;
  patientNhis?: string;
  prescribingDoctor: string;
  clinicFacility: string;
  prescribedMedications: string[];
  diagnosisNote: string;
  submittedAt: string;
  status: 'pending-review' | 'approved' | 'flagged-query' | 'rejected';
  reviewedBy?: string;
  pharmacistComments?: string;
}

// Fixed Reference Date representing the active operational date: October 10, 2026
export const SYSTEM_REFERENCE_DATE = new Date('2026-10-10T12:00:00Z');

export function getDaysUntilExpiry(expiryDateStr: string, refDate: Date = SYSTEM_REFERENCE_DATE): number {
  try {
    const expiry = new Date(`${expiryDateStr}T12:00:00Z`);
    const diffTime = expiry.getTime() - refDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 365;
  }
}

export function getExpiryAlertTier(days: number): ExpiryAlertTier {
  if (days <= 30) return 'critical';
  if (days <= 90) return 'urgent';
  if (days <= 180) return 'attention';
  return 'safe';
}

export function getExpiryTierMeta(tier: ExpiryAlertTier) {
  switch (tier) {
    case 'critical':
      return {
        label: 'Critical (≤ 30d)',
        badgeText: 'Critical Expiry',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-600',
        description: 'Immediate clearance discounting or clinical quarantine required',
      };
    case 'urgent':
      return {
        label: 'Urgent (31 - 90d)',
        badgeText: 'Urgent (≤ 90d)',
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        description: 'Prioritize FEFO dispensing & 20%-35% short-dated discounting',
      };
    case 'attention':
      return {
        label: 'Attention (91 - 180d)',
        badgeText: 'Attention (≤ 180d)',
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500',
        description: 'Audit turnover rate and schedule promotional bundling',
      };
    case 'safe':
    default:
      return {
        label: 'Safe (> 180d)',
        badgeText: 'Shelf Stable',
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        description: 'Optimal shelf-life stability adhering to GMP standard',
      };
  }
}

// Seed initial realistic inventory with carefully planned expiry dates across all tiers
export const INITIAL_INVENTORY: InventoryItem[] = PRODUCTS.map((prod, index) => {
  const isColdChain = prod.category.includes('Immune') || prod.name.includes('Hemosoft') || prod.category.includes('Infections');
  const baseStock = 45 + ((index * 17) % 80);
  const reorder = 20;

  const suppliers = [
    'Cedar Point Formulations Ltd (Accra)',
    'Ernest Chemists Manufacturing Ltd (Tema)',
    'Tobinco Pharmaceuticals Ltd (Spintex)',
    'Danadams Pharmaceuticals (Ghana)',
  ];

  // Specific planned expiry schedules relative to Oct 10, 2026:
  // Item 0 (Cenart Forte): Critical (16 days left - 2026-10-26)
  // Item 5 (Hemosoft): Critical (25 days left - 2026-11-04)
  // Item 1 (Cantab 16): Urgent (49 days left - 2026-11-28)
  // Item 3 (Ultrox 20): Urgent (69 days left - 2026-12-18)
  // Item 8 (Paracetamol): Urgent (87 days left - 2027-01-05)
  // Item 2 (Zurion Immune): Attention (110 days left - 2027-01-28)
  // Item 6 (Metformin): Attention (133 days left - 2027-02-20)
  // Item 9 (Amoxiclav): Attention (166 days left - 2027-03-25)
  // Others: Safe (> 200 days)
  let expiryDate = '2027-09-30';
  let discountPercent: number | undefined = undefined;
  let discountedPriceGhs: number | undefined = undefined;
  let discountAppliedAt: string | undefined = undefined;
  let discountAppliedBy: string | undefined = undefined;

  if (index === 0) {
    expiryDate = '2026-10-26'; // 16 days left (Critical)
  } else if (index === 5) {
    expiryDate = '2026-11-04'; // 25 days left (Critical)
  } else if (index === 1) {
    expiryDate = '2026-11-28'; // 49 days left (Urgent)
  } else if (index === 3) {
    expiryDate = '2026-12-18'; // 69 days left (Urgent) - Preload with 20% clearance discount
    discountPercent = 20;
    discountedPriceGhs = Number((prod.price * 0.8).toFixed(2));
    discountAppliedAt = 'Yesterday, 14:20';
    discountAppliedBy = 'Pharm. Kwabena Asante, MPSGh';
  } else if (index === 8) {
    expiryDate = '2027-01-05'; // 87 days left (Urgent)
  } else if (index === 2) {
    expiryDate = '2027-01-28'; // 110 days left (Attention)
  } else if (index === 6) {
    expiryDate = '2027-02-20'; // 133 days left (Attention)
  } else if (index === 9) {
    expiryDate = '2027-03-25'; // 166 days left (Attention)
  } else {
    const year = 2027 + (index % 2);
    const month = String(((index + 4) % 12) + 1).padStart(2, '0');
    expiryDate = `${year}-${month}-28`;
  }

  const batchMonth = ((index + 3) % 12) + 1;
  const batchNumber = `CPC-B2026${String(batchMonth).padStart(2, '0')}-${prod.id.slice(0, 4).toUpperCase()}`;

  return {
    id: `inv-${prod.id}`,
    productId: prod.id,
    name: prod.name,
    category: prod.category,
    dosage: prod.dosage,
    packSize: prod.packSize,
    stockCount: baseStock,
    reorderLevel: reorder,
    batchNumber,
    expiryDate,
    unitPriceGhs: prod.price,
    storageRequirement: isColdChain ? 'cold-chain' : 'ambient',
    supplier: suppliers[index % suppliers.length],
    gmpCertified: true,
    lastStockCheck: 'Today, 08:30 AM',
    discountPercent,
    discountedPriceGhs,
    discountAppliedAt,
    discountAppliedBy,
    isQuarantined: false,
  };
});

export const INITIAL_DISPOSAL_LOGS: DisposalLogEntry[] = [
  {
    id: 'DISP-2026-001',
    inventoryItemId: 'inv-cedar-antacid-susp',
    productId: 'cedar-antacid-susp',
    medicationName: 'Cedar Gel Antacid Suspension 200ml',
    batchNumber: 'CPC-B202511-CEDA',
    packSize: '200ml Amber Bottle',
    unitsQuarantined: 14,
    reason: 'Imminent Shelf-Life Expiry (≤30 Days)',
    additionalNotes: 'Batch reached 2 weeks to stated expiry. Removed from public dispensary racks per FDA GDP guidelines.',
    loggedAt: 'Oct 04, 2026 · 11:30 AM',
    authorizedStaffName: 'Pharm. Kwabena Asante, MPSGh',
    authorizedStaffRole: 'Superintendent Pharmacist',
    registrationNumber: 'FDA-GA/DISP-10492',
  },
  {
    id: 'DISP-2026-002',
    inventoryItemId: 'inv-cold-chain-insulin-vial',
    productId: 'insulin-rapid',
    medicationName: 'Insulin Rapid Acting Vials 100IU/ml',
    batchNumber: 'CPC-B202602-INSU',
    packSize: '10ml Vial (Cold-Chain)',
    unitsQuarantined: 6,
    reason: 'Suspected Cold-Chain Thermal Excursion',
    additionalNotes: 'Data logger flagged secondary cooler transient temperature of 14°C for 5 hours during heavy traffic transit. Quarantined for potency validation.',
    loggedAt: 'Sep 28, 2026 · 03:45 PM',
    authorizedStaffName: 'Kojo Boateng',
    authorizedStaffRole: 'Dispensary & Dispatch Technician',
    registrationNumber: 'PCG-TECH-4821',
  },
];

export const INITIAL_PRESCRIPTIONS_DOCKETS: PrescriptionDocket[] = [
  {
    id: 'RXD-701',
    orderId: 'CPC-8492',
    patientName: 'Dr. Evans Mensah',
    patientPhone: '+233 24 483 7261',
    patientNhis: 'NHIS-GA-09248102',
    prescribingDoctor: 'Dr. Kwame Boateng, FWACP',
    clinicFacility: 'Korle Bu Medical Directorate, Accra',
    prescribedMedications: [
      'Cantab 16mg Tablets (Candesartan) - 1 daily PO',
      'Hemosoft Softgels Iron Tonic - 1 BD after meals',
    ],
    diagnosisNote: 'Essential Hypertension Stage 1 & mild secondary microcytic anemia.',
    submittedAt: 'Today, 10:10 AM',
    status: 'approved',
    reviewedBy: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistComments: 'Renal panel reviewed. Dosing appropriate. Approved for dispensing.',
  },
  {
    id: 'RXD-702',
    orderId: 'CPC-6120',
    patientName: 'Abena Osei-Tutu',
    patientPhone: '+233 20 891 4452',
    patientNhis: 'NHIS-GA-11048821',
    prescribingDoctor: 'Dr. Marian Addo, MBChB',
    clinicFacility: 'Nyaho Medical Centre, Airport Residential',
    prescribedMedications: [
      'Cenart Forte 80/480mg Tablets - 1 BD x 3 days with fatty meal',
      'Zurion Immunity Zinc + Vitamin C Syrups - 10ml daily',
    ],
    diagnosisNote: 'Uncomplicated Plasmodium falciparum malaria with acute fatigue.',
    submittedAt: 'Today, 11:35 AM',
    status: 'pending-review',
    pharmacistComments: 'Awaiting Superintendent sign-off. Patient warned to take with milk/food.',
  },
  {
    id: 'RXD-703',
    orderId: 'CPC-4389',
    patientName: 'Kofi Annan Jr.',
    patientPhone: '+233 27 554 1900',
    patientNhis: 'NHIS-GA-08392117',
    prescribingDoctor: 'Dr. S. K. Quaye, Specialist Physician',
    clinicFacility: 'Trust Hospital, Osu Accra',
    prescribedMedications: [
      'Ultrox 20mg Tablets (Rosuvastatin) - 1 at bedtime',
      'Zurion Daily Antioxidant Softgels - 1 daily',
    ],
    diagnosisNote: 'Hypercholesterolemia with elevated LDL (4.6 mmol/L).',
    submittedAt: 'Yesterday, 09:20 AM',
    status: 'approved',
    reviewedBy: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistComments: 'Baseline liver enzymes satisfactory. Approved with lifestyle advice.',
  },
  {
    id: 'RXD-704',
    patientName: 'Yaw Boateng Darko',
    patientPhone: '+233 24 112 8840',
    prescribingDoctor: 'Dr. Angela Tetteh',
    clinicFacility: 'Ridge Regional Hospital, Accra',
    prescribedMedications: [
      'Cantab 32mg High Strength Tablets - 1 daily',
      'Potassium Sparing Diuretic Adjunct',
    ],
    diagnosisNote: 'Refractory Hypertension.',
    submittedAt: 'Yesterday, 04:15 PM',
    status: 'flagged-query',
    reviewedBy: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistComments: 'Querying prescriber regarding recent serum potassium before dispensing high-dose candesartan.',
  },
];

const INVENTORY_STORAGE_KEY = 'cedar_point_inventory_v3';
const DISPOSAL_LOGS_KEY = 'cedar_point_disposal_logs_v1';
const PRESCRIPTIONS_DOCKETS_KEY = 'cedar_point_rx_dockets_v1';

export function loadInventory(): InventoryItem[] {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return INITIAL_INVENTORY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INVENTORY;
  } catch {
    return INITIAL_INVENTORY;
  }
}

export function saveInventory(items: InventoryItem[]): void {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
    // Trigger window event so storefront components can reactively update
    window.dispatchEvent(new CustomEvent('cedar-point-inventory-updated', { detail: items }));
  } catch {
    // ignore
  }
}

export function loadDisposalLogs(): DisposalLogEntry[] {
  try {
    const raw = localStorage.getItem(DISPOSAL_LOGS_KEY);
    if (!raw) return INITIAL_DISPOSAL_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DISPOSAL_LOGS;
  } catch {
    return INITIAL_DISPOSAL_LOGS;
  }
}

export function saveDisposalLogs(logs: DisposalLogEntry[]): void {
  try {
    localStorage.setItem(DISPOSAL_LOGS_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function loadPrescriptionDockets(): PrescriptionDocket[] {
  try {
    const raw = localStorage.getItem(PRESCRIPTIONS_DOCKETS_KEY);
    if (!raw) return INITIAL_PRESCRIPTIONS_DOCKETS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRESCRIPTIONS_DOCKETS;
  } catch {
    return INITIAL_PRESCRIPTIONS_DOCKETS;
  }
}

export function savePrescriptionDockets(dockets: PrescriptionDocket[]): void {
  try {
    localStorage.setItem(PRESCRIPTIONS_DOCKETS_KEY, JSON.stringify(dockets));
  } catch {
    // ignore
  }
}

/**
 * Returns merged storefront products reflecting real-time inventory discounts and quarantine status.
 */
export function getStorefrontProducts(inventoryList?: InventoryItem[]): Product[] {
  const currentInv = inventoryList || loadInventory();
  const invMap = new Map<string, InventoryItem>();
  currentInv.forEach((item) => invMap.set(item.productId, item));

  return PRODUCTS.map((prod) => {
    const inv = invMap.get(prod.id);
    if (!inv) return prod;

    const isQuarantined = Boolean(inv.isQuarantined);
    const hasDiscount = Boolean(inv.discountPercent && inv.discountPercent > 0 && inv.discountedPriceGhs);

    return {
      ...prod,
      price: hasDiscount ? inv.discountedPriceGhs! : prod.price,
      originalPrice: hasDiscount ? prod.price : prod.originalPrice,
      inStock: isQuarantined ? false : prod.inStock,
      badge: isQuarantined
        ? 'Batch Quarantined'
        : hasDiscount
        ? `Clearance ${inv.discountPercent}% Off`
        : prod.badge,
    };
  });
}
