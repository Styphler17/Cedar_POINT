export type AnalyticsTimeRange = '30d' | '90d' | '12m' | 'all-time';

export interface MonthlyRevenuePoint {
  month: string;
  revenueGhs: number;
  ordersCount: number;
  rxCount: number;
  otcCount: number;
  coldChainOrders: number;
  avgBasketGhs: number;
}

export interface DailyRevenuePoint {
  date: string;
  dayLabel: string;
  revenueGhs: number;
  ordersCount: number;
}

export interface CategorySalesPoint {
  id: string;
  name: string;
  brandLeader: string;
  revenueGhs: number;
  unitsSold: number;
  sharePercent: number;
  color: string;
  growthRatePercent: number;
}

export interface HourlyOrderPoint {
  hour: string;
  hourNumber: number;
  orders: number;
  isRushHour: boolean;
  rushLabel?: string;
  shift: 'Night' | 'Morning' | 'Afternoon' | 'Evening';
  color: string;
}

export interface TimeRangeMetrics {
  totalRevenueGhs: number;
  revenueGrowthPercent: number;
  totalOrdersCount: number;
  avgBasketGhs: number;
  coldChainSharePercent: number;
  refillRetentionRatePercent: number;
  avgDispenseMins: number;
}

// 12 Months of Ghana Pharmacy Revenue History (Nov 2025 - Oct 2026)
export const MONTHLY_REVENUE_SERIES: MonthlyRevenuePoint[] = [
  { month: 'Nov 2025', revenueGhs: 42150, ordersCount: 310, rxCount: 180, otcCount: 130, coldChainOrders: 98, avgBasketGhs: 135.97 },
  { month: 'Dec 2025', revenueGhs: 49800, ordersCount: 362, rxCount: 205, otcCount: 157, coldChainOrders: 115, avgBasketGhs: 137.57 },
  { month: 'Jan 2026', revenueGhs: 45200, ordersCount: 328, rxCount: 192, otcCount: 136, coldChainOrders: 104, avgBasketGhs: 137.80 },
  { month: 'Feb 2026', revenueGhs: 48300, ordersCount: 345, rxCount: 210, otcCount: 135, coldChainOrders: 112, avgBasketGhs: 140.00 },
  { month: 'Mar 2026', revenueGhs: 53100, ordersCount: 374, rxCount: 232, otcCount: 142, coldChainOrders: 124, avgBasketGhs: 141.98 },
  { month: 'Apr 2026', revenueGhs: 56400, ordersCount: 395, rxCount: 248, otcCount: 147, coldChainOrders: 131, avgBasketGhs: 142.78 },
  { month: 'May 2026', revenueGhs: 58900, ordersCount: 408, rxCount: 260, otcCount: 148, coldChainOrders: 136, avgBasketGhs: 144.36 },
  { month: 'Jun 2026', revenueGhs: 62450, ordersCount: 430, rxCount: 275, otcCount: 155, coldChainOrders: 144, avgBasketGhs: 145.23 },
  { month: 'Jul 2026', revenueGhs: 64800, ordersCount: 442, rxCount: 284, otcCount: 158, coldChainOrders: 148, avgBasketGhs: 146.61 },
  { month: 'Aug 2026', revenueGhs: 68150, ordersCount: 465, rxCount: 301, otcCount: 164, coldChainOrders: 156, avgBasketGhs: 146.56 },
  { month: 'Sep 2026', revenueGhs: 71900, ordersCount: 488, rxCount: 318, otcCount: 170, coldChainOrders: 164, avgBasketGhs: 147.34 },
  { month: 'Oct 2026', revenueGhs: 74650, ordersCount: 504, rxCount: 332, otcCount: 172, coldChainOrders: 171, avgBasketGhs: 148.12 },
];

// Last 30 Days (Sample aggregated weekly/daily for 30d filter)
export const THIRTY_DAYS_SERIES: DailyRevenuePoint[] = [
  { date: 'Sep 11', dayLabel: 'Wk 1', revenueGhs: 2420, ordersCount: 17 },
  { date: 'Sep 13', dayLabel: 'Wk 1', revenueGhs: 2610, ordersCount: 18 },
  { date: 'Sep 15', dayLabel: 'Wk 1', revenueGhs: 2850, ordersCount: 20 },
  { date: 'Sep 17', dayLabel: 'Wk 2', revenueGhs: 2390, ordersCount: 16 },
  { date: 'Sep 19', dayLabel: 'Wk 2', revenueGhs: 2720, ordersCount: 19 },
  { date: 'Sep 21', dayLabel: 'Wk 2', revenueGhs: 3010, ordersCount: 21 },
  { date: 'Sep 23', dayLabel: 'Wk 2', revenueGhs: 2890, ordersCount: 20 },
  { date: 'Sep 25', dayLabel: 'Wk 3', revenueGhs: 2950, ordersCount: 21 },
  { date: 'Sep 27', dayLabel: 'Wk 3', revenueGhs: 3120, ordersCount: 22 },
  { date: 'Sep 29', dayLabel: 'Wk 3', revenueGhs: 3240, ordersCount: 23 },
  { date: 'Oct 01', dayLabel: 'Wk 4', revenueGhs: 3410, ordersCount: 24 },
  { date: 'Oct 03', dayLabel: 'Wk 4', revenueGhs: 3380, ordersCount: 23 },
  { date: 'Oct 05', dayLabel: 'Wk 4', revenueGhs: 3590, ordersCount: 25 },
  { date: 'Oct 07', dayLabel: 'Wk 4', revenueGhs: 3680, ordersCount: 26 },
  { date: 'Oct 09', dayLabel: 'Wk 4', revenueGhs: 3750, ordersCount: 26 },
  { date: 'Oct 10', dayLabel: 'Today', revenueGhs: 3820, ordersCount: 27 },
];

// Top-Selling Therapeutic Categories
export const TOP_CATEGORIES_DATA: CategorySalesPoint[] = [
  {
    id: 'cat-cardio',
    name: 'Cardiovascular & BP',
    brandLeader: 'Cantab (Candesartan)',
    revenueGhs: 24800,
    unitsSold: 380,
    sharePercent: 33.2,
    color: '#007A33', // Cedar Point Emerald
    growthRatePercent: 18.4,
  },
  {
    id: 'cat-iron',
    name: 'Hematinics & Iron Tonics',
    brandLeader: 'Hemosoft Softgels',
    revenueGhs: 19200,
    unitsSold: 320,
    sharePercent: 25.7,
    color: '#0284C7', // Sky Blue
    growthRatePercent: 14.1,
  },
  {
    id: 'cat-immune',
    name: 'Immune & Micronutrients',
    brandLeader: 'Zurion Zinc + Vit C',
    revenueGhs: 14100,
    unitsSold: 285,
    sharePercent: 18.9,
    color: '#D97706', // Amber
    growthRatePercent: 21.0,
  },
  {
    id: 'cat-malaria',
    name: 'Anti-Malarial Therapy',
    brandLeader: 'Cenart Forte 80/480mg',
    revenueGhs: 8900,
    unitsSold: 140,
    sharePercent: 11.9,
    color: '#E11D48', // Rose Red
    growthRatePercent: -2.3,
  },
  {
    id: 'cat-lipids',
    name: 'Lipid Lowering / Statins',
    brandLeader: 'Ultrox (Rosuvastatin)',
    revenueGhs: 4850,
    unitsSold: 92,
    sharePercent: 6.5,
    color: '#7C3AED', // Violet
    growthRatePercent: 12.8,
  },
  {
    id: 'cat-antiinfective',
    name: 'Broad-Spectrum Antibiotics',
    brandLeader: 'Amoxiclav 625mg',
    revenueGhs: 2800,
    unitsSold: 58,
    sharePercent: 3.8,
    color: '#64748B', // Slate
    growthRatePercent: 8.5,
  },
];

// 24-Hour Peak Order Distribution
export const HOURLY_ORDER_DISTRIBUTION: HourlyOrderPoint[] = [
  { hour: '00:00', hourNumber: 0, orders: 2, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '01:00', hourNumber: 1, orders: 1, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '02:00', hourNumber: 2, orders: 1, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '03:00', hourNumber: 3, orders: 1, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '04:00', hourNumber: 4, orders: 2, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '05:00', hourNumber: 5, orders: 4, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '06:00', hourNumber: 6, orders: 8, isRushHour: false, shift: 'Morning', color: '#64748B' },
  { hour: '07:00', hourNumber: 7, orders: 15, isRushHour: false, shift: 'Morning', color: '#64748B' },
  { hour: '08:00', hourNumber: 8, orders: 28, isRushHour: false, shift: 'Morning', color: '#64748B' },
  { hour: '09:00', hourNumber: 9, orders: 46, isRushHour: true, rushLabel: 'Morning Doctor Consult Rush', shift: 'Morning', color: '#D97706' },
  { hour: '10:00', hourNumber: 10, orders: 54, isRushHour: true, rushLabel: 'Peak Outpatient Clinic Volume', shift: 'Morning', color: '#B45309' },
  { hour: '11:00', hourNumber: 11, orders: 49, isRushHour: true, rushLabel: 'Late Morning Dispensary Rush', shift: 'Morning', color: '#D97706' },
  { hour: '12:00', hourNumber: 12, orders: 36, isRushHour: false, shift: 'Afternoon', color: '#64748B' },
  { hour: '13:00', hourNumber: 13, orders: 31, isRushHour: false, shift: 'Afternoon', color: '#64748B' },
  { hour: '14:00', hourNumber: 14, orders: 29, isRushHour: false, shift: 'Afternoon', color: '#64748B' },
  { hour: '15:00', hourNumber: 15, orders: 38, isRushHour: false, shift: 'Afternoon', color: '#64748B' },
  { hour: '16:00', hourNumber: 16, orders: 58, isRushHour: true, rushLabel: 'Accra Commute & Refill Peak', shift: 'Evening', color: '#007A33' },
  { hour: '17:00', hourNumber: 17, orders: 64, isRushHour: true, rushLabel: 'Max Daily Courier Dispatch', shift: 'Evening', color: '#005B26' },
  { hour: '18:00', hourNumber: 18, orders: 52, isRushHour: true, rushLabel: 'Evening Outpatient Collection', shift: 'Evening', color: '#007A33' },
  { hour: '19:00', hourNumber: 19, orders: 35, isRushHour: false, shift: 'Evening', color: '#64748B' },
  { hour: '20:00', hourNumber: 20, orders: 22, isRushHour: false, shift: 'Evening', color: '#64748B' },
  { hour: '21:00', hourNumber: 21, orders: 14, isRushHour: false, shift: 'Evening', color: '#94A3B8' },
  { hour: '22:00', hourNumber: 22, orders: 8, isRushHour: false, shift: 'Night', color: '#94A3B8' },
  { hour: '23:00', hourNumber: 23, orders: 4, isRushHour: false, shift: 'Night', color: '#94A3B8' },
];

export function getMetricsForTimeRange(range: AnalyticsTimeRange): TimeRangeMetrics {
  switch (range) {
    case '30d':
      return {
        totalRevenueGhs: 46880,
        revenueGrowthPercent: 14.8,
        totalOrdersCount: 326,
        avgBasketGhs: 143.80,
        coldChainSharePercent: 34.2,
        refillRetentionRatePercent: 88.5,
        avgDispenseMins: 32,
      };
    case '90d':
      return {
        totalRevenueGhs: 214700,
        revenueGrowthPercent: 12.3,
        totalOrdersCount: 1457,
        avgBasketGhs: 147.35,
        coldChainSharePercent: 33.8,
        refillRetentionRatePercent: 86.4,
        avgDispenseMins: 35,
      };
    case '12m':
      return {
        totalRevenueGhs: 695850,
        revenueGrowthPercent: 22.4,
        totalOrdersCount: 4755,
        avgBasketGhs: 146.34,
        coldChainSharePercent: 32.6,
        refillRetentionRatePercent: 84.8,
        avgDispenseMins: 38,
      };
    case 'all-time':
    default:
      return {
        totalRevenueGhs: 1240500,
        revenueGrowthPercent: 28.5,
        totalOrdersCount: 8620,
        avgBasketGhs: 143.91,
        coldChainSharePercent: 31.9,
        refillRetentionRatePercent: 82.7,
        avgDispenseMins: 40,
      };
  }
}
