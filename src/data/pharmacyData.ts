export interface Product {
  id: string;
  name: string;
  activeIngredients: string;
  dosage: string;
  category: string;
  classification: 'Prescription' | 'OTC' | 'Supplements';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  packSize: string;
  badge?: string;
  trending?: boolean;
  description: string;
  pharmacistAdvice: string;
  referenceBrand?: string;
  referencePrice?: number;
  image: string;
  images: string[];
}

export interface HealthBundle {
  id: string;
  tabLabel: 'For The Family' | 'For Graceful Aging' | 'Cost Conscious';
  title: string;
  subtitle: string;
  description: string;
  includedProductIds: string[];
  discountPercent: number;
  highlightText: string;
}

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
  callout?: {
    type?: 'tip' | 'warning' | 'pearl' | 'quote';
    title: string;
    text: string;
  };
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  lastUpdated?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  authorBio?: string;
  medicallyReviewedBy?: string;
  readTime: string;
  category: string;
  image: string;
  images?: string[];
  imageCaption?: string;
  summary: string;
  content: string[];
  takeaways: string[];
  tags?: string[];
  sections?: BlogSection[];
  faq?: BlogFaq[];
  relatedProductIds?: string[];
}

export const SHOP_CATEGORIES = [
  'All Products',
  'Acid Related Disorders',
  'Allergies',
  'Anti-Malarial',
  'Blood Pressure Management',
  'Bone, Muscle & Joint',
  'Cholesterol Management',
  'Cold Treatment',
  'Cough & Respiratory Discomfort',
  'Dewormer',
  'Dietary Supplement',
  'Digestion (Antacid)',
  'Hematinics (Iron Supplements)',
  'Immune System (Multivitamins)',
  'Infections',
  'Pain',
  'Skincare (triple action)',
] as const;

export type ShopCategory = typeof SHOP_CATEGORIES[number];

export const PRODUCTS: Product[] = [
  {
    id: 'cenart-forte',
    name: 'Cenart Forte Tablets',
    activeIngredients: 'Artemether 80mg + Lumefantrine 480mg',
    dosage: '1 tablet twice daily for 3 days with meals',
    category: 'Anti-Malarial',
    classification: 'OTC',
    price: 45.0,
    originalPrice: 75.0,
    rating: 4.9,
    reviewsCount: 312,
    inStock: true,
    packSize: '6 Film-Coated Tablets (Full 3-Day Course)',
    trending: true,
    description: 'Double strength Artemether 80mg and Lumefantrine 480mg Tablets. WHO-recommended first-line Artemisinin-based Combination Therapy (ACT) for uncomplicated Plasmodium falciparum malaria in adults and adolescents.',
    pharmacistAdvice: 'Complete all 6 tablets over 3 days even if fever subsides after day 1. Take with a glass of milk or fatty meal to maximize absorption of lumefantrine.',
    referenceBrand: 'Imported Brand ACT 80/480',
    referencePrice: 92.0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'hemosoft-softgels',
    name: 'Hemosoft Softgels',
    activeIngredients: 'Ferrous Fumarate 150mg, Folic Acid 1mg, Vitamin B12 15mcg, Vitamin C 75mg, Zinc',
    dosage: '1 softgel daily after food',
    category: 'Hematinics (Iron Supplements)',
    classification: 'Supplements',
    price: 38.0,
    originalPrice: 60.0,
    rating: 4.8,
    reviewsCount: 264,
    inStock: true,
    packSize: '30 Easy-to-Swallow Softgel Capsules',
    trending: true,
    description: 'Blood forming minerals and essential vitamins formulated for rapid hemoglobin replenishment, gentle on the stomach with added vitamin C for optimal iron bioavailability.',
    pharmacistAdvice: 'Take with water or orange juice. Avoid consuming with tea, coffee, or antacids within 2 hours as they inhibit iron absorption.',
    referenceBrand: 'Imported Hematinic Tonic Capsule',
    referencePrice: 85.0,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'zurion-multivitamin',
    name: 'Zurion Daily Multivitamin',
    activeIngredients: '24 Essential Vitamins, Minerals, Zinc & Ginseng Extract',
    dosage: '1 tablet every morning with breakfast',
    category: 'Immune System (Multivitamins)',
    classification: 'Supplements',
    price: 55.0,
    originalPrice: 70.0,
    badge: '15% Off',
    rating: 5.0,
    reviewsCount: 428,
    inStock: true,
    packSize: '30 Daily Film-Coated Tablets',
    trending: true,
    description: 'Complete daily immunity, physical energy, and micronutrient support. Formulated to combat daily fatigue and maintain active cellular defense for busy Ghanaian lifestyles.',
    pharmacistAdvice: 'Ideal daily supplement for recovery, high-stress periods, and everyday vitality. Store below 25°C in a dry place.',
    referenceBrand: 'Imported Gold Multivitamin A-Z',
    referencePrice: 135.0,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'jet-2-inhaler',
    name: 'Jet 2 Nasal Inhaler',
    activeIngredients: 'Menthol 41.5%, Camphor 41.5%, Siberian Pine Needle Oil',
    dosage: 'Inhale deeply through each nostril as needed',
    category: 'Cold Treatment',
    classification: 'OTC',
    price: 22.0,
    originalPrice: 35.0,
    rating: 4.7,
    reviewsCount: 185,
    inStock: true,
    packSize: 'Pocket Inhaler Tube with Protective Cap',
    trending: true,
    description: 'Fast, refreshing cooling vapor relief for nasal congestion, stuffy nose, sinus tightness, and harmattan dust irritation.',
    pharmacistAdvice: 'Convenient pocket size. Insert tip into nostril while closing the other nostril and inhale deeply. Can be used up to 10 times daily.',
    referenceBrand: 'Imported Medicated Inhaler Stick',
    referencePrice: 48.0,
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'ultrox-10',
    name: 'Ultrox 10mg Tablets',
    activeIngredients: 'Rosuvastatin Calcium 10mg',
    dosage: '1 tablet once daily at bedtime',
    category: 'Cholesterol Management',
    classification: 'Prescription',
    price: 65.0,
    originalPrice: 110.0,
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    packSize: '28 Film-Coated Tablets (Calendar Pack)',
    description: 'High-efficacy HMG-CoA reductase inhibitor for primary hypercholesterolemia and cardiovascular risk reduction. Clinically proven to reduce LDL-C and triglycerides while elevating protective HDL.',
    pharmacistAdvice: 'Take at the same time each evening with or without meals. Routine liver function and lipid panel monitoring recommended every 6-12 months.',
    referenceBrand: 'Imported Rosuvastatin 10mg Originator',
    referencePrice: 140.0,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'cantab-16',
    name: 'Cantab 16mg Tablets',
    activeIngredients: 'Candesartan Cilexetil 16mg',
    dosage: '1 tablet once daily in the morning',
    category: 'Blood Pressure Management',
    classification: 'Prescription',
    price: 52.0,
    originalPrice: 85.0,
    rating: 4.8,
    reviewsCount: 167,
    inStock: true,
    packSize: '28 Tablets',
    description: 'Selective Angiotensin II receptor antagonist (ARB) providing smooth 24-hour blood pressure control with excellent cardiovascular and renal protection.',
    pharmacistAdvice: 'Check your blood pressure weekly and keep a written log. Avoid abrupt discontinuation. Complement with a low-sodium diet and daily walking.',
    referenceBrand: 'Imported Candesartan 16mg',
    referencePrice: 115.0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'azax-500',
    name: 'Azax 500mg Tablets',
    activeIngredients: 'Azithromycin Dihydrate 500mg',
    dosage: '1 tablet once daily for 3 consecutive days',
    category: 'Infections',
    classification: 'Prescription',
    price: 48.0,
    originalPrice: 75.0,
    rating: 4.9,
    reviewsCount: 198,
    inStock: true,
    packSize: '1 × 3 Film-Coated Tablets',
    description: 'Broad-spectrum macrolide antibiotic for upper and lower respiratory tract infections, sinusitis, throat infections, and skin infections with long-lasting tissue persistence.',
    pharmacistAdvice: 'Can be taken with or without food. Complete all 3 tablets at the exact same hour every 24 hours to prevent bacterial resistance.',
    referenceBrand: 'Imported Azithromycin 500mg',
    referencePrice: 95.0,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'flunol-150',
    name: 'Flunol 150mg Capsule',
    activeIngredients: 'Fluconazole USP 150mg',
    dosage: 'Single oral dose with water',
    category: 'Infections',
    classification: 'OTC',
    price: 35.0,
    originalPrice: 50.0,
    rating: 4.8,
    reviewsCount: 130,
    inStock: true,
    packSize: '1 Single-Dose Foil Capsule',
    description: 'Systemic antifungal agent indicated for vaginal candidiasis (thrush), dermal fungal infections, and recurrent fungal overgrowth. Rapid symptom relief within 24 hours.',
    pharmacistAdvice: 'Can be taken anytime of day with water. If symptoms persist beyond 5 days, consult our duty pharmacist at Abelemkpe.',
    referenceBrand: 'Imported Single Dose Fluconazole',
    referencePrice: 72.0,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'cedarvite-tabs',
    name: 'Cedarvite Maternal & Family Formula',
    activeIngredients: 'Folic Acid 800mcg, Elemental Iron 30mg, Calcium 200mg, Vit D3 400IU, Zinc & B-Complex',
    dosage: '1 tablet daily with a main meal',
    category: 'Immune System (Multivitamins)',
    classification: 'Supplements',
    price: 58.0,
    originalPrice: 85.0,
    rating: 4.9,
    reviewsCount: 220,
    inStock: true,
    packSize: '30 Coated Tablets',
    description: 'Targeted multivitamin and mineral formulation developed for healthy pregnancy, fetal neural tube development, maternal vitality, and everyday family immune resilience.',
    pharmacistAdvice: 'Recommended from pre-conception through postpartum breastfeeding, or as an enriched daily micronutrient multivitamin for women.',
    referenceBrand: 'Imported Prenatal Gold Complex',
    referencePrice: 120.0,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'cedar-e-400',
    name: 'Cedar-E 400 Softgels',
    activeIngredients: 'd-Alpha Tocopherol (Natural Vitamin E) 400 IU',
    dosage: '1 softgel daily after food',
    category: 'Dietary Supplement',
    classification: 'Supplements',
    price: 44.0,
    originalPrice: 65.0,
    rating: 4.8,
    reviewsCount: 174,
    inStock: true,
    packSize: '30 Amber Softgels',
    description: 'Pure lipid-soluble antioxidant softgels to protect cells from oxidative stress, support radiant skin moisture, strengthen hair follicles, and promote cardiovascular health.',
    pharmacistAdvice: 'Can also be pierced gently with a sterile pin and applied topically to dry skin patches or stretch marks at night.',
    referenceBrand: 'Imported Vitamin E 400 IU',
    referencePrice: 82.0,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'cegarlic-softgels',
    name: 'Cegarlic 1000mg Softgels',
    activeIngredients: 'Odorless Garlic Oil Extract 1000mg (standardized Allicin yield)',
    dosage: '1 to 2 softgels daily with water',
    category: 'Dietary Supplement',
    classification: 'Supplements',
    price: 39.0,
    originalPrice: 55.0,
    rating: 4.7,
    reviewsCount: 145,
    inStock: true,
    packSize: '60 Softgel Capsules',
    description: 'Deodorized high-potency garlic extract softgels to support healthy circulation, maintain normal blood lipid levels, and enhance respiratory immune defenses.',
    pharmacistAdvice: 'Enteric coated to prevent garlic breath and stomach upset while delivering active allicin directly to the small intestine.',
    referenceBrand: 'Imported Odorless Garlic 1000mg',
    referencePrice: 78.0,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'lordes-syrup',
    name: 'Lordes Syrup 100ml',
    activeIngredients: 'Desloratadine 0.5mg/ml (Sugar-Free formulation)',
    dosage: 'Adults: 10ml once daily; Children 2-5 yrs: 2.5ml once daily',
    category: 'Cough & Respiratory Discomfort',
    classification: 'OTC',
    price: 32.0,
    originalPrice: 48.0,
    rating: 4.8,
    reviewsCount: 189,
    inStock: true,
    packSize: '100ml Bottle with Calibrated Measure Cup',
    description: 'Non-drowsy second-generation antihistamine syrup for rapid relief of allergic rhinitis, sneezing, itchy runny nose, throat tickle, and acute urticaria (hives).',
    pharmacistAdvice: 'Does not cause daytime drowsiness like older antihistamines. Safe for both school-age children and working adults.',
    referenceBrand: 'Imported Desloratadine Syrup',
    referencePrice: 65.0,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'aceca-plus',
    name: 'Aceca Plus Tablets',
    activeIngredients: 'Aceclofenac 100mg + Paracetamol 500mg',
    dosage: '1 tablet twice daily after meals',
    category: 'Pain',
    classification: 'OTC',
    price: 34.0,
    originalPrice: 50.0,
    rating: 4.8,
    reviewsCount: 240,
    inStock: true,
    packSize: '2 × 10 Blister Tablets',
    description: 'Potent synergistic analgesic and anti-inflammatory formulation for osteoarthritis, rheumatoid joint pain, low backache, toothache, and postoperative pain.',
    pharmacistAdvice: 'Always take following food to protect the stomach lining. Avoid drinking alcohol while taking paracetamol-containing tablets.',
    referenceBrand: 'Imported NSAID Dual Analgesic',
    referencePrice: 70.0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'ceclav-625',
    name: 'Ceclav 625mg Tablets',
    activeIngredients: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
    dosage: '1 tablet every 12 hours with meals for 5 to 7 days',
    category: 'Infections',
    classification: 'Prescription',
    price: 68.0,
    originalPrice: 110.0,
    rating: 4.9,
    reviewsCount: 280,
    inStock: true,
    packSize: '14 Tablets (Moisture-Barrier Alu-Alu Foil)',
    description: 'Broad-spectrum beta-lactamase inhibitor antibacterial for acute bacterial sinusitis, tonsillitis, respiratory tract infections, skin infections, and dental abscesses.',
    pharmacistAdvice: 'Take right at the beginning of a meal to reduce digestive upset and optimize absorption. Complete the entire prescribed duration.',
    referenceBrand: 'Imported Co-Amoxiclav 625mg',
    referencePrice: 145.0,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'wormicel-400',
    name: 'Wormicel 400mg Chewable',
    activeIngredients: 'Albendazole USP 400mg (Orange Vanilla Flavor)',
    dosage: '1 tablet chewed thoroughly once; repeat after 6 months',
    category: 'Dewormer',
    classification: 'OTC',
    price: 18.0,
    originalPrice: 28.0,
    rating: 4.9,
    reviewsCount: 350,
    inStock: true,
    packSize: 'Single-Dose Chewable Blister',
    description: 'Single-dose broad-spectrum anthelmintic for eradication of hookworm, roundworm, pinworm, and whipworm infections in adults and children over 2 years.',
    pharmacistAdvice: 'Chew tablet thoroughly before swallowing. We advise deworming all family and household members simultaneously twice each year.',
    referenceBrand: 'Imported Single Dewormer',
    referencePrice: 38.0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'gastrocid-antacid',
    name: 'Gastrocid Mint Suspension',
    activeIngredients: 'Dried Aluminium Hydroxide 200mg, Magnesium Hydroxide 200mg, Simethicone 25mg/5ml',
    dosage: '10 to 20ml between meals and at bedtime',
    category: 'Digestion (Antacid)',
    classification: 'OTC',
    price: 26.0,
    originalPrice: 38.0,
    rating: 4.7,
    reviewsCount: 162,
    inStock: true,
    packSize: '200ml Mint Suspension Bottle',
    description: 'Fast cooling relief for heartburn, acid reflux, sour stomach, and painful trapped gas. Balanced magnesium-aluminum salts prevent constipation.',
    pharmacistAdvice: 'Shake well before using. If taking iron supplements, antibiotics, or heart medications, take them at least 2 hours apart from this antacid.',
    referenceBrand: 'Imported Mint Antacid Liquid',
    referencePrice: 52.0,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    ],
  },
  {
    id: 'dermaclear-triple',
    name: 'Dermaclear Triple Action Cream',
    activeIngredients: 'Clobetasol Propionate 0.05%, Clotrimazole 1.0%, Neomycin Sulfate 0.5%',
    dosage: 'Apply a thin film to the affected skin area twice daily',
    category: 'Skincare (triple action)',
    classification: 'OTC',
    price: 29.0,
    originalPrice: 42.0,
    rating: 4.8,
    reviewsCount: 195,
    inStock: true,
    packSize: '30g Aluminum Tube with Seal',
    description: 'Comprehensive dermatological cream providing anti-inflammatory, antifungal, and antibacterial defense for infected eczema, heat rash, athlete foot, and ringworm.',
    pharmacistAdvice: 'Clean and dry affected skin prior to gentle application. Do not use continuously for more than 14 days on delicate facial areas without physician advice.',
    referenceBrand: 'Imported Triple Dermatologic Cream',
    referencePrice: 58.0,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    ],
  },
];

export const HEALTH_BUNDLES: HealthBundle[] = [
  {
    id: 'family-pack',
    tabLabel: 'For The Family',
    title: 'Family Health & Immunity Bundle',
    subtitle: 'Daily Micronutrients, First-Line Defense & Routine Deworming',
    description: 'A complete, ready-to-go pack designed by Cedar Point pharmacists to keep the whole household protected against common deficiencies, minor ailments, and parasites.',
    includedProductIds: ['zurion-multivitamin', 'aceca-plus', 'ceclav-625', 'wormicel-400'],
    discountPercent: 15,
    highlightText: 'Saves 15% compared to purchasing separate boxes.',
  },
  {
    id: 'graceful-aging',
    tabLabel: 'For Graceful Aging',
    title: 'Cardiovascular & Vitality Pack',
    subtitle: 'Daily Blood Flow, Hemoglobin Support & Antioxidants for 50+',
    description: 'Targeted support for adults managing blood pressure, cholesterol maintenance, joint comfort, and sustained energy with pure bioequivalent formulations.',
    includedProductIds: ['cantab-16', 'ultrox-10', 'hemosoft-softgels', 'cedar-e-400'],
    discountPercent: 18,
    highlightText: 'Saves 18% with continuous monthly refill benefits.',
  },
  {
    id: 'cost-conscious',
    tabLabel: 'Cost Conscious',
    title: 'Essential First-Aid & Malaria Pack',
    subtitle: 'High-Efficacy Everyday Essentials at Maximum Value',
    description: 'Essential Ghanaian household preparedness: WHO-approved ACT malaria treatment, fast nasal decongestant, dual-action pain relief, and family dewormer.',
    includedProductIds: ['cenart-forte', 'jet-2-inhaler', 'aceca-plus', 'wormicel-400'],
    discountPercent: 20,
    highlightText: 'Delivers up to 59% savings versus imported brand equivalents.',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'choosing-right-pharmacy',
    title: '5 Tips for Choosing the Right Pharmacy in Ghana',
    date: 'Aug 25, 2026',
    lastUpdated: 'Sep 28, 2026',
    author: 'Dr. Kwame Mensah, PharmD',
    authorRole: 'Head of Clinical Pharmacy & Patient Safety',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    authorBio: 'Dr. Kwame Mensah is a licensed Clinical Pharmacist and Member of the Pharmaceutical Society of Ghana (PSGH) with over 14 years of clinical experience specializing in pharmacotherapy, rational drug use, and cold-chain integrity across West Africa.',
    medicallyReviewedBy: 'Dr. Kwame Mensah, PharmD (PSGH Reg: #GH-PH-2041)',
    readTime: '4 min read',
    category: 'Patient Safety & Standards',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1000',
    ],
    imageCaption: 'Dispensary inspection and climate verification at Cedar Point Chemist, Abelemkpe.',
    summary: 'From Pharmacy Council registration to FDA cold-chain temperature control, learn the crucial benchmarks every patient should look for when selecting a community chemist in Ghana.',
    takeaways: [
      'Confirm visible Pharmacy Council and FDA Ghana certificates behind the counter.',
      'Ensure sensitive antibiotics and insulin are kept in temperature-logged refrigeration (<25°C).',
      'Choose a pharmacy where a licensed superintendent pharmacist is available for dosage counseling.',
      'Ask about certified bioequivalent alternatives to save up to 59% on regular medications.',
    ],
    tags: ['PatientSafety', 'PharmacyCouncil', 'ColdChain', 'AccraHealthcare', 'MedicationSafety'],
    relatedProductIds: ['cenart-forte', 'zurion-multivitamin', 'hemosoft-softgels'],
    sections: [
      {
        id: 'regulatory-licensing',
        heading: '1. Verify Regulatory Licensing & Pharmacy Council Credentials',
        paragraphs: [
          'In Ghana, any legitimate pharmacy must hold active operating licenses from both the Pharmacy Council of Ghana and the Food and Drugs Authority (FDA). These certificates must be prominently displayed near the dispensary counter.',
          'Always check that the Superintendent Pharmacist on record is physically accessible or represented by qualified dispensing personnel. Beware of unregulated chemical shops attempting to dispense prescription-only medications (POM) without clinical oversight.',
        ],
        callout: {
          type: 'pearl',
          title: 'Clinical Tip',
          text: 'At Cedar Point Chemist (No 5 Malm Street, Abelemkpe), our full Pharmacy Council registration and Good Pharmacy Practice (GPP) audit certifications are prominently exhibited at our consultation desk.',
        },
      },
      {
        id: 'cold-chain-monitoring',
        heading: '2. Cold-Chain Integrity in Tropical Climates',
        paragraphs: [
          'Our tropical climate poses unique challenges to chemical stability. High heat and ambient humidity accelerate the degradation of active pharmaceutical ingredients (APIs), rendering antibiotics, injectables, eye drops, and insulins clinically ineffective.',
          'A first-rate pharmacy invests in 24/7 continuous temperature data loggers, backup inverters/generators for uninterruptible power, and calibrated medical-grade refrigerators kept strictly between 2°C and 8°C.',
        ],
        callout: {
          type: 'warning',
          title: 'Pharmacist Warning',
          text: 'If a pharmacy feels unconditioned, humid, or lacks continuous refrigeration monitoring, sensitive biologicals and liquid pediatric syrups may lose potency before their stated expiry date.',
        },
      },
      {
        id: 'pharmacist-consultation',
        heading: '3. Dedication to Patient Counseling & Medication Reviews',
        paragraphs: [
          'A top-tier pharmacy is not just a retail checkout counter; it is your neighborhood clinical triage center. Your pharmacist should actively inquire about pre-existing conditions, concurrent medications, and food allergies before handing over any formulation.',
          'At Cedar Point Chemist, our pharmacists review potential drug interactions, provide precise dosing timetables, and advise on optimal administration—such as whether a tablet should be taken with meals or on an empty stomach.',
        ],
      },
      {
        id: 'cost-savings-bioequivalents',
        heading: '4. Bioequivalent Options & Price Transparency',
        paragraphs: [
          'Chronic medications for hypertension, diabetes, and cholesterol can place heavy financial burdens on Ghanaian households. Look for a chemist that champions price transparency and stocks FDA-verified bioequivalent alternatives.',
          'Through our Switch & Save program, we help patients safely transition to therapeutic equivalents like Cantab and Ultrox, slashing monthly refill costs by up to 59% while preserving 100% clinical efficacy.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can I verify a pharmacy license online in Ghana?',
        answer: 'Yes. You can verify registered pharmacy premises directly via the Pharmacy Council of Ghana official registry or request the premise license number at the counter.',
      },
      {
        question: 'How do I know if my medicine has degraded from heat?',
        answer: 'Signs of heat damage include discoloration, crumbling tablets, unusual odor, or cloudy precipitate in liquid solutions. When in doubt, bring your medication to our Abelemkpe dispensary for physical inspection.',
      },
    ],
    content: [
      'Your neighborhood pharmacy is the most accessible healthcare facility in your community. However, in our tropical climate, storing medicines improperly can degrade their chemical potency before the expiration date.',
      'At Cedar Point Chemist at No 5 Malm Street, Abelemkpe, all dispensary shelves and storage rooms operate under continuous climate monitoring to ensure zero loss of therapeutic efficacy.',
      'Equally important is pharmacist accessibility. A reputable chemist does not simply hand over medication; they review potential drug interactions, allergies, and verify that you understand exactly how and when each dose should be administered.',
      'Through our Switch & Save initiative, we help Ghanaian patients switch safely to FDA-approved bioequivalent brands like Zurion, Hemosoft, and Cenart Forte without compromising health outcomes.',
    ],
  },
  {
    id: 'managing-bp-naturally',
    title: 'Managing Blood Pressure Naturally & Effectively',
    date: 'Sep 02, 2026',
    lastUpdated: 'Sep 30, 2026',
    author: 'Abena Osei-Bonsu, BPharm, MPSGH',
    authorRole: 'Senior Clinical Pharmacist & Cardiovascular Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813576-963a15237b75?auto=format&fit=crop&q=80&w=300',
    authorBio: 'Abena Osei-Bonsu is a practicing Community Pharmacist with specialized training in chronic disease management and cardiovascular pharmacotherapy. She leads patient education at Cedar Point Chemist.',
    medicallyReviewedBy: 'Abena Osei-Bonsu, BPharm, MPSGH (#GH-PH-3180)',
    readTime: '5 min read',
    category: 'Cardiovascular Wellness',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000',
    ],
    imageCaption: 'Digital sphygmomanometer screening and patient consultation session.',
    summary: 'Practical dietary adaptations for Ghanaian kitchens, simple daily exercise routines, and how to maintain adherence with your blood pressure regimen.',
    takeaways: [
      'Reduce processed sodium by seasoning soups and stews with ginger, garlic, dawadawa, and fresh rosemary.',
      'Commit to 30 minutes of brisk walking 5 days a week to lower arterial resistance.',
      'Never pause prescribed antihypertensives (such as Cantab or Amlodipine) even when your blood pressure readings appear normal.',
      'Keep a weekly blood pressure log and take advantage of free screenings at Cedar Point Chemist.',
    ],
    tags: ['BloodPressure', 'HeartHealth', 'GhanaDiet', 'Hypertension', 'CardioCare'],
    relatedProductIds: ['cantab-16', 'ultrox-20', 'zurion-multivitamin'],
    sections: [
      {
        id: 'silent-killer',
        heading: 'Understanding the Silent Epidemic in West Africa',
        paragraphs: [
          'High blood pressure frequently produces zero warning signs until significant vascular remodeling has occurred. In Ghana, studies indicate that over 35% of adult urban residents have elevated readings, yet fewer than half are actively aware.',
          'Persistent high pressure strains coronary arteries, elevates stroke risk, and burdens the kidneys. The key to long-term vitality is proactive routine monitoring combined with unwavering adherence.',
        ],
      },
      {
        id: 'ghanaian-diet',
        heading: 'Rethinking Sodium in Ghanaian Cooking',
        paragraphs: [
          'Sodium is the primary dietary driver of fluid retention and arterial stiffness. In our homes, sodium is frequently concentrated in processed seasoning cubes, canned sauces, and salted fish/meat.',
          'Transitioning to wholesome natural aromatics like fermented dawadawa, freshly crushed garlic, ginger roots, African locust beans, and rosemary imbues traditional light soups and jollof with extraordinary flavor while eliminating excess sodium.',
        ],
        callout: {
          type: 'tip',
          title: 'Dietary Pearl',
          text: 'Substituting two commercial bouillon cubes with whole ground dawadawa and black pepper slashes your meal sodium content by over 800mg while boosting natural plant polyphenols.',
        },
      },
      {
        id: 'adherence-rules',
        heading: 'Why You Must Never Skip Blood Pressure Medication',
        paragraphs: [
          'The most dangerous misconception in hypertension management is assuming that normal readings mean the condition has resolved. Antihypertensives like Candesartan (Cantab) maintain vascular relaxation on a 24-hour cycle.',
          'Halting medication causes rebound vasoconstriction and dangerous blood pressure spikes that can trigger cardiovascular events. Always discuss dosage adjustments with your doctor or pharmacist.',
        ],
        callout: {
          type: 'warning',
          title: 'Medication Safety',
          text: 'Never discontinue Cantab or any antihypertensive without clinical consultation, even if your home reading is 120/80 mmHg. The medication is the reason the reading is normal.',
        },
      },
    ],
    faq: [
      {
        question: 'What time of day is best to take blood pressure medicine?',
        answer: 'Most modern once-daily ARBs like Candesartan can be taken either morning or night, but consistency at the exact same hour every day is the most critical factor.',
      },
      {
        question: 'Does Cedar Point Chemist offer free blood pressure checks?',
        answer: 'Yes! Walk into our Abelemkpe dispensary anytime during opening hours for complimentary blood pressure checks and heart health advice.',
      },
    ],
    content: [
      'High blood pressure often develops without any symptoms, earning its title as the silent killer. Fortunately, combining medical therapy with proactive lifestyle habits yields outstanding cardiovascular outcomes.',
      'In Ghanaian cooking, excess sodium frequently sneaks in through commercial bouillon cubes. Transitioning to natural aromatics like dawadawa, whole garlic, onions, and fresh peppers protects your arteries while keeping dishes flavorful.',
      'Consistency with your prescribed medication is paramount. Many patients make the mistake of stopping their treatment once their pressure stabilizes. Medications like Candesartan (Cantab) are designed to keep pressure steady every single day.',
      'Visit our dispensary at Abelemkpe anytime during operating hours for a complimentary blood pressure check and personalized medication review with our duty pharmacist.',
    ],
  },
  {
    id: 'malaria-prevention-act',
    title: 'ACT Therapy vs Incomplete Malaria Regimens',
    date: 'Sep 18, 2026',
    lastUpdated: 'Oct 02, 2026',
    author: 'Kofi Asare, Superintendent Pharmacist',
    authorRole: 'Superintendent Pharmacist & Infectious Disease Lead',
    authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    authorBio: 'Kofi Asare is a registered Superintendent Pharmacist with 16 years of community dispensary leadership, specializing in malaria epidemiology, antimicrobial stewardship, and patient compliance.',
    medicallyReviewedBy: 'Kofi Asare, BPharm, FPCPharm (#GH-PH-1892)',
    readTime: '4 min read',
    category: 'Infectious Diseases',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000',
    ],
    imageCaption: 'Laboratory analysis and ACT tablet blister verification.',
    summary: 'Why stopping your anti-malarial dose early fuels recrudescence and resistance, and how WHO Artemisinin-based combinations ensure full parasite clearance.',
    takeaways: [
      'Always complete all 6 doses of Artemether/Lumefantrine (e.g. Cenart Forte) even if fever resolves after day one.',
      'Take oral ACT formulations with a small fatty food or whole milk to enhance intestinal absorption.',
      'Test before treating: use rapid diagnostic testing (RDT) or visit a licensed laboratory before self-medicating.',
    ],
    tags: ['MalariaCare', 'ACTTherapy', 'AntimicrobialStewardship', 'CenartForte', 'InfectiousDiseases'],
    relatedProductIds: ['cenart-forte', 'zurion-multivitamin', 'jet-2-inhaler'],
    sections: [
      {
        id: 'why-complete-course',
        heading: 'The Biology of Recrudescence: Why 6 Doses Matter',
        paragraphs: [
          'Artemether delivers rapid reduction of parasite biomass within the first 24 hours, quickly lowering your fever. However, Lumefantrine has a much longer half-life and is responsible for eradicating the remaining dormant parasites.',
          'Discontinuing medication on day two because you feel better allows the remaining resilient parasites to resurface within 14 to 28 days, often developing resistant strains.',
        ],
        callout: {
          type: 'warning',
          title: 'Clinical Directives',
          text: 'Even if your chills and headaches vanish completely after the very first dose, you must finish all 6 tablets of Cenart Forte over the 3-day treatment window.',
        },
      },
      {
        id: 'absorption-secrets',
        heading: 'Maximizing Lumefantrine Bioavailability with Dietary Fats',
        paragraphs: [
          'Lumefantrine is a lipophilic compound. When swallowed on an empty stomach, systemic bioavailability is dramatically diminished.',
          'Consuming your dose with a small amount of fatty nourishment—such as a glass of full-cream milk, groundnut soup, avocado, or yogurt—increases intestinal absorption up to sixteen-fold, ensuring peak clinical efficacy.',
        ],
      },
    ],
    faq: [
      {
        question: 'Should I test for malaria before taking tablets?',
        answer: 'Yes! Always confirm parasitemia using a rapid diagnostic test (RDT) or microscopy. Treating viral fevers with antimalarials wastes money and leads to diagnostic delays.',
      },
    ],
    content: [
      'Plasmodium falciparum parasites can rebound rapidly if drug concentrations drop beneath the minimum inhibitory concentration.',
      'Many patients discontinue their tablets once fever and body aches subside on day two. This leaves partially suppressed parasites that mutate and build resistance against frontline ACTs.',
      'Cedar Point Chemist stocks strictly certified batches with batch verification and holographic security seals to shield families from counterfeits.',
    ],
  },
  {
    id: 'understanding-bioequivalents',
    title: 'Brand-Name vs Bioequivalent: Debunking the Myth',
    date: 'Sep 29, 2026',
    lastUpdated: 'Oct 05, 2026',
    author: 'Dr. Kwame Mensah, PharmD',
    authorRole: 'Head of Clinical Pharmacy & Patient Safety',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    authorBio: 'Dr. Kwame Mensah leads the Switch & Save initiative at Cedar Point Chemist, advocating for evidence-based medicine and equitable healthcare access for all Ghanaians.',
    medicallyReviewedBy: 'Dr. Kwame Mensah, PharmD (PSGH Reg: #GH-PH-2041)',
    readTime: '6 min read',
    category: 'Affordable Care',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1000',
    images: [
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000',
    ],
    imageCaption: 'Bioavailability testing documentation and certified therapeutic alternatives.',
    summary: 'How Ghanaian households can save up to 59% every month on chronic prescriptions without sacrificing active chemical bio-availability or safety.',
    takeaways: [
      'Bioequivalence requires the generic drug to deliver identical active compound blood concentrations (Cmax and AUC).',
      'FDA Ghana mandates rigorous in-vitro dissolution and clinical bioavailability verification prior to registration.',
      'Switching from originator Candesartan to Cantab, or Rosuvastatin to Ultrox, provides identical clinical efficacy at substantial cost savings.',
    ],
    tags: ['Bioequivalence', 'SwitchAndSave', 'HealthcareSavings', 'FDAGhana', 'AffordableMeds'],
    relatedProductIds: ['cantab-16', 'ultrox-20', 'zurion-multivitamin', 'hemosoft-softgels'],
    sections: [
      {
        id: 'what-is-bioequivalence',
        heading: 'What Does Bioequivalence Actually Mean in Pharmacology?',
        paragraphs: [
          'Two pharmaceutical products are bioequivalent if their rate and extent of absorption (Cmax and AUC) show no statistically significant difference when administered at the same molar dose under similar conditions.',
          'This means the active ingredient enters your bloodstream at identical speeds and therapeutic concentrations, providing the exact same clinical benefits and safety profile as the expensive originator brand.',
        ],
        callout: {
          type: 'pearl',
          title: 'Regulatory Guarantee',
          text: 'The Food and Drugs Authority (FDA) of Ghana enforces stringent comparative dissolution profile standards before approving any bioequivalent brand for sale in Ghanaian pharmacies.',
        },
      },
      {
        id: 'why-cost-difference',
        heading: 'Why Are Bioequivalents Up to 59% Cheaper?',
        paragraphs: [
          'Originator pharmaceutical manufacturers spend hundreds of millions on marketing and initial clinical trials, factoring those sunk costs into premium brand retail prices.',
          'Once initial patents expire, generic manufacturers produce the exact same molecular formulation without multi-million dollar marketing campaigns, passing immense direct savings to patients.',
        ],
      },
    ],
    faq: [
      {
        question: 'Will switching medicines give me new side effects?',
        answer: 'Because the Active Pharmaceutical Ingredient (API) and dosage are identical, therapeutic effects and known tolerances remain the same. Our pharmacists review any excipients if you have rare dye or binder sensitivities.',
      },
      {
        question: 'How do I start the Switch & Save process at Cedar Point?',
        answer: 'Simply bring your current prescription slip or existing medication box to Cedar Point Chemist at Abelemkpe. Our pharmacist will review your regimen and calculate your exact monthly savings on the spot.',
      },
    ],
    content: [
      'Healthcare expenses should never force families to choose between putting food on the table and refilling life-saving blood pressure medicines.',
      'A bioequivalent generic is not a watered-down knockoff; it contains identical Active Pharmaceutical Ingredients (API) manufactured in GMP-certified sterile facilities.',
      'Speak to our pharmacists at Abelemkpe today for a free prescription audit to identify safe generic switches for your regular prescriptions.',
    ],
  },
];

export const PHARMACY_GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/5DErP9pjaGrx3LzF7';

export const PHARMACY_STREET_VIEW_URL =
  'https://www.google.com/maps/place/CEDAR+POINT+CHEMIST+LTD/@5.6652802,-0.1301678,42a,75y,82.74h,78.43t/data=!3m7!1e1!3m5!1sKxttc3LOVaWwBGdliGPe6Q!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D11.566457767502769%26panoid%3DKxttc3LOVaWwBGdliGPe6Q%26yaw%3D82.74210999454326!7i13312!8i6656!4m14!1m7!3m6!1s0xfdf836a908d712d:0xab252d655575d1b1!2sCEDAR+POINT+CHEMIST+LTD!8m2!3d5.6652926!4d-0.129974!16s%2Fg%2F11f3g4bjwz!3m5!1s0xfdf836a908d712d:0xab252d655575d1b1!8m2!3d5.6652926!4d-0.129974!16s%2Fg%2F11f3g4bjwz?entry=ttu&g_ep=EgoyMDI2MTAwNS4wIKXMDSoASAFQAw%3D%3D';

export const PHARMACY_STREET_VIEW_THUMBNAIL_URL =
  'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=11.566457767502769&panoid=Kxttc3LOVaWwBGdliGPe6Q&yaw=82.74210999454326';

export const PHARMACY_STREET_VIEW_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!4v1710000000000!6m8!1m7!1sKxttc3LOVaWwBGdliGPe6Q!2m2!1d5.6652802!2d-0.1301678!3f82.74210999454326!4f11.566457767502769!5f0.7820865974627469';

export const PHARMACY_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.2785461245084!2d-0.1325489241517448!3d5.665292594318044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf836a908d712d%3A0xab252d655575d1b1!2sCEDAR%20POINT%20CHEMIST%20LTD!5e0!3m2!1sen!2sgh!4v1710000000000!5m2!1sen!2sgh';

export const SITE_IDENTITY = {
  name: 'Cedar Point Chemist',
  tagline: 'Passion for Quality Products & Services',
  subheadline: 'Redefining the standard of healthcare through trust, care, and consistency. Quality in every dose, passion in every service.',
  heroImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=1200',
  contact: {
    phone: '+233-302-737-720',
    email: 'inquiries@cedarpointchemist.com',
    address: 'No 5 Malm Street, Abelemkpe Accra, GA-165-4626',
    mapsUrl: 'https://maps.app.goo.gl/5DErP9pjaGrx3LzF7',
    hours: 'Mon – Sat: 7:30 AM – 9:00 PM · Sun: 9:00 AM – 6:00 PM',
  },
  socials: ['Facebook', 'Twitter', 'Youtube'],
  stats: [
    { value: '30+', label: 'Years of Expertise' },
    { value: '500+', label: 'Products Available' },
    { value: '1M+', label: 'Happy Patients' },
  ],
  trustIndicators: [
    { title: '#1 Recommended', description: 'Pharmacist-backed solutions for your health.' },
    { title: 'FDA Approved', description: 'Meeting the highest safety and quality standards.' },
    { title: 'Global Expertise', description: 'Grounded in decades of pharmaceutical research.' },
  ],
};
