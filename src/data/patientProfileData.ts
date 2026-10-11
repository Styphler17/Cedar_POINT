export type OrderStage = 'received' | 'review' | 'dispensed' | 'transit' | 'delivered';

export interface RecentOrderItem {
  orderId: string;
  createdAt: string;
  stage: OrderStage;
  statusLabel: string;
  itemsSummary: string[];
  totalAmountGhs: number;
  destinationArea: string;
  deliveryMethod: 'Accra Express Courier' | 'Abelemkpe Pickup';
  canTrack: boolean;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  primaryAddress: string;
  area: string;
  nhisNumber?: string;
  knownAllergies: string;
  bloodGroup?: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribingDoctor: string;
  issuedDate: string;
  nextRefillDate: string;
  daysRemaining: number;
  refillStatus: 'due-soon' | 'active' | 'ready-to-fill';
}

export const INITIAL_PATIENT_PROFILE: PatientProfile = {
  id: 'CPC-PT-88204',
  fullName: 'Dr. Evans Mensah',
  phone: '+233 24 483 7261',
  email: 'e.mensah@ghanahospital.org',
  primaryAddress: 'Plot 14, Senchi Street, Airport Residential',
  area: 'Airport Residential / Dzorwulu, Accra',
  nhisNumber: 'NHIS-GA-09248102',
  knownAllergies: 'No known penicillin or sulfa drug allergies',
  bloodGroup: 'O+',
};

export const INITIAL_RECENT_ORDERS: RecentOrderItem[] = [
  {
    orderId: 'CPC-8492',
    createdAt: 'Today, 10:15 AM',
    stage: 'transit',
    statusLabel: 'Out for Accra Express Delivery',
    itemsSummary: [
      'Cantab 16mg Tablets (Candesartan) - 2 Packs',
      'Hemosoft Softgels Iron Tonic - 1 Bottle',
    ],
    totalAmountGhs: 145.0,
    destinationArea: 'Airport Residential, Accra',
    deliveryMethod: 'Accra Express Courier',
    canTrack: true,
  },
  {
    orderId: 'CPC-6120',
    createdAt: 'Today, 11:40 AM',
    stage: 'review',
    statusLabel: 'Pharmacist Clinical Review',
    itemsSummary: [
      'Cenart Forte 80/480mg Tablets (Artemether/Lumefantrine) - 1 Pack',
      'Zurion Immunity Zinc + Vitamin C Syrups - 2 Bottles',
    ],
    totalAmountGhs: 110.0,
    destinationArea: 'East Legon, Accra',
    deliveryMethod: 'Accra Express Courier',
    canTrack: true,
  },
  {
    orderId: 'CPC-4389',
    createdAt: 'Yesterday, 09:30 AM',
    stage: 'dispensed',
    statusLabel: 'Dispensed & Cold-Chain Packed',
    itemsSummary: [
      'Ultrox 20mg Tablets (Rosuvastatin) - 3 Packs',
      'Zurion Daily Antioxidant Softgels - 1 Bottle',
    ],
    totalAmountGhs: 195.0,
    destinationArea: 'Cantonments, Accra',
    deliveryMethod: 'Accra Express Courier',
    canTrack: true,
  },
  {
    orderId: 'CPC-9201',
    createdAt: 'Oct 8, 02:15 PM',
    stage: 'delivered',
    statusLabel: 'Delivered & Signed',
    itemsSummary: [
      'Hemosoft Softgels Iron Tonic - 2 Bottles',
      'Cantab 8mg Tablets - 1 Pack',
    ],
    totalAmountGhs: 125.0,
    destinationArea: 'Roman Ridge, Accra',
    deliveryMethod: 'Accra Express Courier',
    canTrack: true,
  },
];

export const INITIAL_PRESCRIPTIONS: PrescriptionItem[] = [
  {
    id: 'rx-1',
    medicationName: 'Cantab 16mg (Candesartan Cilexetil)',
    dosage: '16mg once daily in the morning',
    frequency: 'Chronic Blood Pressure Maintenance',
    prescribingDoctor: 'Dr. Kwame Boateng, MBChB, FWACP (Korle Bu)',
    issuedDate: 'Sept 15, 2026',
    nextRefillDate: 'Oct 20, 2026',
    daysRemaining: 10,
    refillStatus: 'due-soon',
  },
  {
    id: 'rx-2',
    medicationName: 'Hemosoft Hematinic Softgels',
    dosage: '1 softgel twice daily after meals',
    frequency: 'Iron Deficiency & Red Blood Cell Support',
    prescribingDoctor: 'Pharm. Kwabena Asante, MPSGh (Cedar Point)',
    issuedDate: 'Oct 1, 2026',
    nextRefillDate: 'Nov 1, 2026',
    daysRemaining: 22,
    refillStatus: 'active',
  },
  {
    id: 'rx-3',
    medicationName: 'Zurion Vitality Zinc & Vitamin C',
    dosage: '1 tablet daily with breakfast',
    frequency: 'Immune Resilience Maintenance',
    prescribingDoctor: 'Superintendent Pharmacist Protocol',
    issuedDate: 'Oct 5, 2026',
    nextRefillDate: 'Nov 5, 2026',
    daysRemaining: 26,
    refillStatus: 'active',
  },
];

const ORDERS_STORAGE_KEY = 'cedar_point_recent_orders_v1';
const PROFILE_STORAGE_KEY = 'cedar_point_patient_profile_v1';

export function loadUserOrders(): RecentOrderItem[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return INITIAL_RECENT_ORDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RECENT_ORDERS;
  } catch {
    return INITIAL_RECENT_ORDERS;
  }
}

export function saveUserOrders(orders: RecentOrderItem[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore local storage errors
  }
}

export function loadPatientProfile(): PatientProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return INITIAL_PATIENT_PROFILE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PATIENT_PROFILE;
  }
}

export function savePatientProfile(profile: PatientProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore local storage errors
  }
}
