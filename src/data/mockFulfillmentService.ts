export type OrderFulfillmentStage =
  | 'received'
  | 'review'
  | 'dispensed'
  | 'transit'
  | 'delivered';

export interface FulfillmentStep {
  id: string;
  stepNumber: number;
  label: string;
  subtitle: string;
  timestamp: string;
  location: string;
  status: 'completed' | 'current' | 'upcoming';
  pharmacistNote?: string;
}

export interface TrackedOrder {
  orderId: string;
  currentStage: OrderFulfillmentStage;
  statusHeadline: string;
  statusDetail: string;
  placedAt: string;
  estimatedDelivery: string;
  destinationArea: string;
  destinationAddress: string;
  recipientName: string;
  superintendentPharmacist: string;
  pharmacistRegistration: string;
  coldChainRequired: boolean;
  coldChainTemperature?: string;
  courierService: string;
  courierRiderName?: string;
  itemsSummary: string[];
  totalAmountGhs: number;
  steps: FulfillmentStep[];
}

export const PRESET_TRACKING_ORDERS: Record<string, TrackedOrder> = {
  'CPC-8492': {
    orderId: 'CPC-8492',
    currentStage: 'transit',
    statusHeadline: 'Out for Accra Express Delivery',
    statusDetail: 'Medications dispatched in temperature-regulated insulated carrier. Courier is en route.',
    placedAt: 'Today, 10:15 AM',
    estimatedDelivery: 'Today by 2:30 PM (Est. 45 mins remaining)',
    destinationArea: 'Airport Residential / Dzorwulu, Accra',
    destinationAddress: 'Plot 14, Senchi Street, Airport Residential, Accra',
    recipientName: 'Dr. Evans Mensah',
    superintendentPharmacist: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistRegistration: 'FDA-GA/DISP-10492',
    coldChainRequired: true,
    coldChainTemperature: '4.2°C (Cold-chain secure)',
    courierService: 'Cedar Point Express Courier #04',
    courierRiderName: 'Kojo Boateng (Dispatch Rider)',
    itemsSummary: [
      'Cantab 16mg Tablets (Candesartan) - 2 Packs',
      'Hemosoft Softgels Iron Tonic - 1 Bottle',
    ],
    totalAmountGhs: 145.0,
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: 'Order Confirmed & Logged',
        subtitle: 'Digital invoice generated and inventory locked at dispensary',
        timestamp: '10:15 AM',
        location: 'Cedar Point Chemist - Abelemkpe Hub',
        status: 'completed',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: 'Clinical Pharmacist Review',
        subtitle: 'Dosage validation and drug interaction safety check passed',
        timestamp: '10:42 AM',
        location: 'Dispensary Consultation Desk',
        status: 'completed',
        pharmacistNote: 'Dosage verification complete. Approved by Pharm. K. Asante.',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: 'Cold-Chain Dispensed & Sealed',
        subtitle: 'Packed with tamper-evident security seal and temperature log tag',
        timestamp: '11:30 AM',
        location: 'Cedar Point Clean Dispensing Room',
        status: 'completed',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        label: 'Accra Express Dispatch in Transit',
        subtitle: 'Handed to certified rider in temperature-insulated cold pack',
        timestamp: '12:05 PM',
        location: 'Achimota - Dzorwulu Corridor en route',
        status: 'current',
      },
      {
        id: 'step-5',
        stepNumber: 5,
        label: 'Delivered & Signed',
        subtitle: 'Patient identity verification and delivery handover sign-off',
        timestamp: 'Pending arrival',
        location: 'Airport Residential, Accra',
        status: 'upcoming',
      },
    ],
  },

  'CPC-6120': {
    orderId: 'CPC-6120',
    currentStage: 'review',
    statusHeadline: 'Pharmacist Prescription & Batch Verification',
    statusDetail: 'Superintendent Pharmacist on duty is conducting clinical validation and batch screening.',
    placedAt: 'Today, 11:40 AM',
    estimatedDelivery: 'Today by 4:00 PM',
    destinationArea: 'East Legon, Accra',
    destinationAddress: 'A&C Mall Enclave, Boundary Road, East Legon',
    recipientName: 'Abena Osei-Tutu',
    superintendentPharmacist: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistRegistration: 'FDA-GA/DISP-10492',
    coldChainRequired: false,
    courierService: 'Cedar Point Express Logistics',
    itemsSummary: [
      'Cenart Forte 80/480mg Tablets (Artemether/Lumefantrine) - 1 Pack',
      'Zurion Immunity Zinc + Vitamin C Syrups - 2 Bottles',
    ],
    totalAmountGhs: 110.0,
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: 'Order Confirmed & Logged',
        subtitle: 'Mobile Money payment verified and digital docket printed',
        timestamp: '11:40 AM',
        location: 'Cedar Point Chemist - Abelemkpe Hub',
        status: 'completed',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: 'Clinical Pharmacist Review',
        subtitle: 'Verifying drug batch authenticity and FDA regulatory compliance',
        timestamp: '11:55 AM',
        location: 'Dispensary Verification Counter',
        status: 'current',
        pharmacistNote: 'Reviewing therapeutic dosage. Superintendent inspection underway.',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: 'Cold-Chain Dispensed & Sealed',
        subtitle: 'Patient advisory card enclosed and tamper seal applied',
        timestamp: 'Queued next',
        location: 'Cedar Point Clean Dispensing Room',
        status: 'upcoming',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        label: 'Accra Express Dispatch in Transit',
        subtitle: 'Rider dispatch assignment and GPS tracking activation',
        timestamp: 'Scheduled for 1:15 PM',
        location: 'Abelemkpe Dispatch Dock',
        status: 'upcoming',
      },
      {
        id: 'step-5',
        stepNumber: 5,
        label: 'Delivered & Signed',
        subtitle: 'Recipient confirmation and patient wellness receipt',
        timestamp: 'Est. 4:00 PM',
        location: 'East Legon, Accra',
        status: 'upcoming',
      },
    ],
  },

  'CPC-4389': {
    orderId: 'CPC-4389',
    currentStage: 'dispensed',
    statusHeadline: 'Dispensed & Tamper-Proof Packaged',
    statusDetail: 'Prescriptions filled, verified, and sealed in dispensary cold-storage awaiting rider pickup.',
    placedAt: 'Today, 09:30 AM',
    estimatedDelivery: 'Today by 1:45 PM',
    destinationArea: 'Cantonments, Accra',
    destinationAddress: 'Embassy Gardens, Cantonments, Accra',
    recipientName: 'Kofi Annan Jr.',
    superintendentPharmacist: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistRegistration: 'FDA-GA/DISP-10492',
    coldChainRequired: true,
    coldChainTemperature: '3.8°C (Insulated pack)',
    courierService: 'Cedar Point Express Fleet',
    itemsSummary: [
      'Ultrox 20mg Tablets (Rosuvastatin) - 3 Packs',
      'Zurion Daily Antioxidant Softgels - 1 Bottle',
    ],
    totalAmountGhs: 195.0,
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: 'Order Confirmed & Logged',
        subtitle: 'Order recorded with registered pharmacy receipt',
        timestamp: '09:30 AM',
        location: 'Cedar Point Chemist - Abelemkpe Hub',
        status: 'completed',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: 'Clinical Pharmacist Review',
        subtitle: 'Clinical approval granted by Superintendent Pharmacist',
        timestamp: '09:50 AM',
        location: 'Dispensary Verification Counter',
        status: 'completed',
        pharmacistNote: 'Batch expiry verified (EXP: 11/2027). Safe for dispensing.',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: 'Cold-Chain Dispensed & Sealed',
        subtitle: 'Sealed with tamper-evident strip & temperature surveillance tag',
        timestamp: '10:40 AM',
        location: 'Cedar Point Clean Dispensing Room',
        status: 'completed',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        label: 'Accra Express Dispatch in Transit',
        subtitle: 'Awaiting rider collection at Abelemkpe dispatch bay',
        timestamp: 'Rider arriving in 10 mins',
        location: 'Abelemkpe Dispatch Dock',
        status: 'current',
      },
      {
        id: 'step-5',
        stepNumber: 5,
        label: 'Delivered & Signed',
        subtitle: 'Contactless or signed receipt at recipient location',
        timestamp: 'Est. 1:45 PM',
        location: 'Cantonments, Accra',
        status: 'upcoming',
      },
    ],
  },

  'CPC-9201': {
    orderId: 'CPC-9201',
    currentStage: 'delivered',
    statusHeadline: 'Successfully Delivered & Verified',
    statusDetail: 'Delivered to recipient with verified signature. Thank you for trusting Cedar Point Chemist.',
    placedAt: 'Yesterday, 02:15 PM',
    estimatedDelivery: 'Delivered Yesterday at 5:10 PM',
    destinationArea: 'Roman Ridge, Accra',
    destinationAddress: 'Roman Ridge Shopping Complex Enclave, Accra',
    recipientName: 'Akosua Mensah-Bonsu',
    superintendentPharmacist: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistRegistration: 'FDA-GA/DISP-10492',
    coldChainRequired: false,
    courierService: 'Cedar Point Express Courier #02',
    courierRiderName: 'Emmanuel Ofori',
    itemsSummary: [
      'Hemosoft Softgels Iron Tonic - 2 Bottles',
      'Cantab 8mg Tablets - 1 Pack',
    ],
    totalAmountGhs: 125.0,
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: 'Order Confirmed & Logged',
        subtitle: 'Payment processed and prescription cataloged',
        timestamp: 'Yesterday, 2:15 PM',
        location: 'Cedar Point Chemist - Abelemkpe Hub',
        status: 'completed',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: 'Clinical Pharmacist Review',
        subtitle: 'Clinical verification and patient record check completed',
        timestamp: 'Yesterday, 2:38 PM',
        location: 'Dispensary Verification Counter',
        status: 'completed',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: 'Cold-Chain Dispensed & Sealed',
        subtitle: 'Dispensary packaging completed with patient dosage label',
        timestamp: 'Yesterday, 3:10 PM',
        location: 'Cedar Point Clean Dispensing Room',
        status: 'completed',
      },
      {
        id: 'step-4',
        stepNumber: 4,
        label: 'Accra Express Dispatch in Transit',
        subtitle: 'Dispatched via Roman Ridge express route',
        timestamp: 'Yesterday, 3:45 PM',
        location: 'Roman Ridge, Accra',
        status: 'completed',
      },
      {
        id: 'step-5',
        stepNumber: 5,
        label: 'Delivered & Signed',
        subtitle: 'Medication received and delivery docket signed',
        timestamp: 'Yesterday, 5:10 PM',
        location: 'Roman Ridge, Accra',
        status: 'completed',
        pharmacistNote: 'Order fulfilled successfully. Follow-up consultation available via dispensary line.',
      },
    ],
  },
};

/**
 * Generates a realistic, deterministic simulated order for any custom order ID (e.g. from cart checkout)
 */
export function generateDeterministicOrder(cleanId: string): TrackedOrder {
  // Hash characters to pick a deterministic scenario
  let hash = 0;
  for (let i = 0; i < cleanId.length; i++) {
    hash = (hash * 31 + cleanId.charCodeAt(i)) >>> 0;
  }

  const stages: OrderFulfillmentStage[] = ['review', 'dispensed', 'transit', 'delivered'];
  const stage = stages[hash % stages.length];

  const destinations = [
    { area: 'Abelemkpe, Accra', address: 'No 12 Forest Avenue, Abelemkpe' },
    { area: 'Dzorwulu, Accra', address: 'Blohum Street, Near Dzorwulu Junction' },
    { area: 'Airport Residential, Accra', address: 'Senchi Street, Airport Residential' },
    { area: 'East Legon, Accra', address: 'American House area, East Legon' },
    { area: 'Achimota, Accra', address: 'Golf Hills Enclave, Achimota' },
  ];
  const dest = destinations[hash % destinations.length];

  const medications = [
    ['Cantab 16mg Blood Pressure Tablets', 'Hemosoft Iron Tonic Softgels'],
    ['Cenart Forte Antimalarial 80/480mg', 'Zurion Vitamin C & Zinc Syrups'],
    ['Ultrox 20mg Cholesterol Tablets', 'Hemosoft Blood Booster Formula'],
    ['Prescription Refill Maintenance Pack', 'Essential Wellness Multivitamins'],
  ];
  const items = medications[hash % medications.length];

  const riders = ['Kojo Boateng', 'Emmanuel Ofori', 'Sampson Darko', 'Felix Addo'];
  const rider = riders[hash % riders.length];

  const stepStatus = (stepIdx: number): 'completed' | 'current' | 'upcoming' => {
    const stageIdxMap: Record<OrderFulfillmentStage, number> = {
      received: 0,
      review: 1,
      dispensed: 2,
      transit: 3,
      delivered: 4,
    };
    const currentIdx = stageIdxMap[stage];
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const headlines: Record<OrderFulfillmentStage, { title: string; desc: string }> = {
    received: {
      title: 'Order Confirmed & Pending Verification',
      desc: 'Medications received into fulfillment queue at Cedar Point Chemist.',
    },
    review: {
      title: 'Pharmacist Prescription Verification',
      desc: 'Superintendent Pharmacist Pharm. K. Asante is reviewing therapeutic dosage and safety.',
    },
    dispensed: {
      title: 'Dispensed & Tamper-Evident Packaged',
      desc: 'Prescription sealed in temperature-controlled packaging ready for dispatch.',
    },
    transit: {
      title: 'Out for Accra Express Delivery',
      desc: `Dispatched with Cedar Point courier rider (${rider}). In transit to ${dest.area}.`,
    },
    delivered: {
      title: 'Successfully Delivered to Recipient',
      desc: `Medication handover verified and delivered to ${dest.address}.`,
    },
  };

  return {
    orderId: cleanId,
    currentStage: stage,
    statusHeadline: headlines[stage].title,
    statusDetail: headlines[stage].desc,
    placedAt: 'Today, 09:45 AM',
    estimatedDelivery: stage === 'delivered' ? 'Delivered Earlier Today' : 'Today between 1:30 PM - 3:00 PM',
    destinationArea: dest.area,
    destinationAddress: dest.address,
    recipientName: 'Valued Pharmacy Patient',
    superintendentPharmacist: 'Pharm. Kwabena Asante, MPSGh',
    pharmacistRegistration: 'FDA-GA/DISP-10492',
    coldChainRequired: hash % 2 === 0,
    coldChainTemperature: hash % 2 === 0 ? '4.5°C (Cold-chain secure)' : undefined,
    courierService: 'Cedar Point Express Pharmacy Fleet',
    courierRiderName: rider,
    itemsSummary: items,
    totalAmountGhs: 120.0 + (hash % 85),
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: 'Order Confirmed & Logged',
        subtitle: 'Digital invoice cataloged at Abelemkpe dispensary desk',
        timestamp: '09:45 AM',
        location: 'Cedar Point Chemist - Abelemkpe Hub',
        status: stepStatus(0),
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: 'Clinical Pharmacist Review',
        subtitle: 'Prescription verification and pharmaceutical safety protocol passed',
        timestamp: '10:15 AM',
        location: 'Dispensary Verification Counter',
        status: stepStatus(1),
        pharmacistNote: 'Batch inspection passed. Approved for dispensing.',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: 'Cold-Chain Dispensed & Sealed',
        subtitle: 'Dispensed with dosage instructions and tamper-evident seal',
        timestamp: '10:50 AM',
        location: 'Cedar Point Clean Dispensing Room',
        status: stepStatus(2),
      },
      {
        id: 'step-4',
        stepNumber: 4,
        label: 'Accra Express Dispatch in Transit',
        subtitle: `Courier rider on transit along ${dest.area} delivery route`,
        timestamp: stage === 'transit' || stage === 'delivered' ? '11:30 AM' : 'Scheduled shortly',
        location: `${dest.area} Corridor`,
        status: stepStatus(3),
      },
      {
        id: 'step-5',
        stepNumber: 5,
        label: 'Delivered & Signed',
        subtitle: 'Handover complete with patient verification',
        timestamp: stage === 'delivered' ? '12:45 PM' : 'Est. by 3:00 PM',
        location: dest.address,
        status: stepStatus(4),
      },
    ],
  };
}

/**
 * Asynchronously fetches order tracking simulation
 */
export async function fetchOrderTracking(rawOrderId: string): Promise<TrackedOrder | null> {
  const clean = rawOrderId.trim().toUpperCase();
  if (!clean) return null;

  // Add realistic micro-delay for authentic lookup feel
  await new Promise((resolve) => setTimeout(resolve, 380));

  // Check preset first
  if (PRESET_TRACKING_ORDERS[clean]) {
    return PRESET_TRACKING_ORDERS[clean];
  }

  // Also support partial without 'CPC-' prefix (e.g. '8492' -> 'CPC-8492')
  const formattedWithPrefix = clean.startsWith('CPC-') ? clean : `CPC-${clean}`;
  if (PRESET_TRACKING_ORDERS[formattedWithPrefix]) {
    return PRESET_TRACKING_ORDERS[formattedWithPrefix];
  }

  // Dynamic fallback generator
  return generateDeterministicOrder(formattedWithPrefix);
}
