export type FaqCategory = 'all' | 'licensing' | 'services' | 'delivery' | 'payments';

export interface PatientFaqItem {
  id: string;
  category: 'licensing' | 'services' | 'delivery' | 'payments';
  question: string;
  answer: string;
  highlight?: string;
  badgeText?: string;
}

export const PATIENT_FAQS: PatientFaqItem[] = [
  {
    id: 'faq-fda-license',
    category: 'licensing',
    question: 'Is Cedar Point Chemist licensed by the Pharmacy Council of Ghana and Food & Drugs Authority (FDA)?',
    answer: 'Yes. Cedar Point Chemist Ltd is fully licensed by the Pharmacy Council of Ghana (Premises License #GA-165-4626) and operates in strict accordance with the Food and Drugs Authority (FDA) Ghana standards. Our flagship retail and wholesale premises at No 5 Malm Street, Abelemkpe, Accra, are overseen full-time by registered Superintendent Pharmacists.',
    highlight: 'Premises License #GA-165 · Verified Good Pharmacy Practice (GPP)',
    badgeText: 'FDA Ghana & Pharmacy Council',
  },
  {
    id: 'faq-counterfeit-prevention',
    category: 'licensing',
    question: 'How do you guarantee that all medications are 100% genuine and safe from counterfeits?',
    answer: 'We operate a closed-loop pharmaceutical supply chain sourcing exclusively from WHO-GMP certified manufacturers and authorized brand distributors. Every incoming batch undergoes strict inspection for tamper-evident seals, hologram verification, batch numbering, and expiry validity before entering our clean dispensing rooms.',
    highlight: 'Closed-loop supply chain with batch traceability and WHO-GMP compliance',
    badgeText: 'Zero Counterfeit Guarantee',
  },
  {
    id: 'faq-prescription-verification',
    category: 'services',
    question: 'How do I submit and verify a doctor’s prescription for dispensing?',
    answer: 'You can submit your prescription digitally during checkout, upload it via our Pharmacist Consultation portal, or bring it to our Abelemkpe dispensary. Our clinical team validates the prescriber’s stamp, dosage safety, therapeutic indications, and screens for potential drug-drug interactions before releasing any prescription-only medicines (POM).',
    highlight: 'Rigorous clinical checks for patient safety and dosage validation',
    badgeText: 'Prescription Services',
  },
  {
    id: 'faq-pharmacist-consultation',
    category: 'services',
    question: 'Can I speak directly with a licensed pharmacist before or after placing an order?',
    answer: 'Always. A Superintendent Pharmacist is on duty during all operational hours (Monday–Saturday, 8:00 AM–8:00 PM). You can initiate a free clinical consultation through the Patient Profile, click the consultation button, or call our direct pharmacy line at +233 24 483 7261 for advice on dosages, missed doses, and managing side effects.',
    highlight: 'Free direct telephone and digital consultations with our clinical team',
    badgeText: 'Clinical Counseling',
  },
  {
    id: 'faq-switch-and-save',
    category: 'services',
    question: 'What are Cedar Point Chemist bioequivalent alternatives and how do they save me money?',
    answer: 'Our Switch & Save program pairs expensive originator brands with certified bioequivalent alternatives (such as Zurion, Cantab, and Hemosoft). These formulations contain identical active molecules at verified therapeutic strengths, saving patients up to 59% on maintenance therapies without compromising clinical outcomes.',
    highlight: 'Save up to 59% on chronic maintenance therapies with bioequivalent formulas',
    badgeText: 'Switch & Save',
  },
  {
    id: 'faq-delivery-zones-speed',
    category: 'delivery',
    question: 'How fast is Accra Express delivery, and what locations are covered?',
    answer: 'Orders within central Greater Accra (Abelemkpe, Dzorwulu, Airport Residential, Roman Ridge, East Legon, Cantonments, Ridge, Osu, and Achimota) are dispatched via our temperature-controlled dispatch fleet for same-day delivery, typically arriving within 1 to 3 hours. Regional and nationwide dispatches to Kumasi, Takoradi, and Tamale are coordinated through reliable courier logistics within 24–48 hours.',
    highlight: 'Same-day delivery within 1–3 hours in Greater Accra',
    badgeText: 'Express Dispatch',
  },
  {
    id: 'faq-cold-chain',
    category: 'delivery',
    question: 'How are temperature-sensitive and cold-chain medications protected during transit?',
    answer: 'Insulins, biologics, vaccines, and sensitive hematinic tonics are stored in validated pharmacy refrigerators (2°C to 8°C) equipped with automated temperature loggers. During delivery, items are packed in insulated thermal carriers with frozen gel coolant packs and temperature surveillance tags, ensuring optimal potency from dispensary shelf to your doorstep.',
    highlight: 'Validated 2°C–8°C thermal insulation with temperature logging',
    badgeText: 'Cold-Chain Assurance',
  },
  {
    id: 'faq-delivery-pricing',
    category: 'delivery',
    question: 'What are the delivery fees, and how do I qualify for Free Delivery?',
    answer: 'All orders of GHS 150.00 or more qualify for 100% Free Accra Express Delivery. For orders below this threshold, standard express courier dispatch is a flat GHS 15.00 within Greater Accra. Alternatively, you can always select free In-Store Pickup at our Abelemkpe dispensary desk.',
    highlight: 'Free Express Delivery unlocked on all orders over GHS 150.00',
    badgeText: 'Free Delivery Threshold',
  },
  {
    id: 'faq-realtime-tracking',
    category: 'delivery',
    question: 'How do I track my order once it has been placed?',
    answer: 'Every order generates a unique reference ID (e.g. CPC-8492). You can enter this ID into our "Track Order" tool at the top of the page, via your Patient Profile, or in the mobile menu to monitor the live 5-stage fulfillment progress: Order Confirmed, Clinical Review, Cold-Chain Dispensed, Courier in Transit, and Delivered.',
    highlight: 'Real-time 5-stage fulfillment telemetry from dispensary to doorstep',
    badgeText: 'Live Order Tracking',
  },
  {
    id: 'faq-payment-methods',
    category: 'payments',
    question: 'Which payment methods do you accept, and is Cash on Delivery available?',
    answer: 'We support all major Ghanaian digital payment channels including MTN Mobile Money, Telecel Cash, AT Money, and Visa/Mastercard debit cards. For patient convenience within Greater Accra, Cash on Delivery (COD) is also available with verified phone confirmation prior to rider dispatch.',
    highlight: 'MTN Mobile Money, Telecel Cash, Card, and Cash on Delivery accepted',
    badgeText: 'Payment Flexibility',
  },
  {
    id: 'faq-return-policy',
    category: 'payments',
    question: 'What is your return policy regarding pharmaceutical products?',
    answer: 'In compliance with Pharmacy Council regulations and patient safety standards, dispensed prescription medicines cannot be returned once handed over, preventing potential thermal degradation or contamination. However, if an order arrives damaged or incorrect, our Superintendent Pharmacist will authorize an immediate, complimentary replacement and investigate the incident.',
    highlight: 'Strict hygiene regulations with immediate replacement for damaged deliveries',
    badgeText: 'Patient Safety & Returns',
  },
];
