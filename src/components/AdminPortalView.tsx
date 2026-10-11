import React, { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Pill,
  FileText,
  ChartLineUp,
  Truck,
  ShieldCheck,
  Check,
  Clock,
  User,
  Plus,
  Minus,
  MagnifyingGlass,
  ArrowRight,
  ArrowLeft,
  House,
  Buildings,
  Thermometer,
  Snowflake,
  Warning,
  ArrowsLeftRight,
  FloppyDisk,
  CheckCircle,
  X,
  PhoneCall,
  MapPin,
  Tag,
  Archive,
  ArrowCounterClockwise,
  ClockCountdown,
  ShieldWarning,
  CalendarBlank,
  Export,
  Info,
  List,
  SidebarSimple,
  CaretDown,
  CaretDoubleLeft,
  CaretDoubleRight,
  SignOut,
  IdentificationCard,
  UserCircle,
} from '@phosphor-icons/react';
import { ColdChainMonitorView } from './ColdChainMonitorView';
import {
  ColdChainBatchItem,
  loadColdBatches,
  ColdStorageUnit,
  loadColdStorageUnits,
} from '../data/coldChainData';
import {
  AdminStaffUser,
  ADMIN_STAFF_MEMBERS,
  InventoryItem,
  PrescriptionDocket,
  DisposalLogEntry,
  loadInventory,
  saveInventory,
  loadDisposalLogs,
  saveDisposalLogs,
  loadPrescriptionDockets,
  savePrescriptionDockets,
  getDaysUntilExpiry,
  getExpiryAlertTier,
  getExpiryTierMeta,
  ExpiryAlertTier,
} from '../data/backendAdminData';
import { RecentOrderItem, OrderStage } from '../data/patientProfileData';
import { SITE_IDENTITY } from '../data/pharmacyData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  AnalyticsTimeRange,
  MONTHLY_REVENUE_SERIES,
  THIRTY_DAYS_SERIES,
  TOP_CATEGORIES_DATA,
  HOURLY_ORDER_DISTRIBUTION,
  getMetricsForTimeRange,
} from '../data/pharmacyAnalyticsData';

interface AdminPortalViewProps {
  onBackToStorefront: () => void;
  orders: RecentOrderItem[];
  onUpdateOrderStage: (orderId: string, newStage: OrderStage, note?: string) => void;
  onOpenTrackModal?: (orderId: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onBackToStorefront,
  orders,
  onUpdateOrderStage,
  onOpenTrackModal,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'alerts' | 'cold-chain' | 'prescriptions' | 'analytics'>('orders');
  const [currentStaff, setCurrentStaff] = useState<AdminStaffUser>(ADMIN_STAFF_MEMBERS[0]);
  const [inventory, setInventory] = useState<InventoryItem[]>(loadInventory);
  const [disposalLogs, setDisposalLogs] = useState<DisposalLogEntry[]>(loadDisposalLogs);
  const [rxDockets, setRxDockets] = useState<PrescriptionDocket[]>(loadPrescriptionDockets);
  const [coldBatches, setColdBatches] = useState<ColdChainBatchItem[]>(loadColdBatches);
  const [storageUnits, setStorageUnits] = useState<ColdStorageUnit[]>(loadColdStorageUnits);

  // Search & filter states
  const [orderFilterStage, setOrderFilterStage] = useState<'all' | OrderStage>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStorageFilter, setInventoryStorageFilter] = useState<'all' | 'cold-chain' | 'ambient'>('all');
  const [rxFilterStatus, setRxFilterStatus] = useState<'all' | 'pending-review' | 'approved' | 'flagged-query'>('all');

  // Inventory Alerts Filter States
  const [alertsFilter, setAlertsFilter] = useState<'all' | 'critical' | 'urgent' | 'attention' | 'discounted' | 'quarantined' | 'audit-log'>('all');
  const [alertsSearch, setAlertsSearch] = useState('');

  // Analytics Time Range State
  const [analyticsRange, setAnalyticsRange] = useState<AnalyticsTimeRange>('12m');
  const rangeMetrics = useMemo(() => getMetricsForTimeRange(analyticsRange), [analyticsRange]);

  const revenueChartData = useMemo(() => {
    if (analyticsRange === '30d') {
      return THIRTY_DAYS_SERIES.map((d) => ({
        label: d.date,
        revenueGhs: d.revenueGhs,
        ordersCount: d.ordersCount,
      }));
    }
    if (analyticsRange === '90d') {
      return MONTHLY_REVENUE_SERIES.slice(-3).map((m) => ({
        label: m.month,
        revenueGhs: m.revenueGhs,
        ordersCount: m.ordersCount,
      }));
    }
    return MONTHLY_REVENUE_SERIES.map((m) => ({
      label: m.month,
      revenueGhs: m.revenueGhs,
      ordersCount: m.ordersCount,
    }));
  }, [analyticsRange]);

  // Quarantine Modal State
  const [quarantineModalItem, setQuarantineModalItem] = useState<InventoryItem | null>(null);
  const [quarantineReason, setQuarantineReason] = useState<string>('Imminent Shelf-Life Expiry (≤30 Days)');
  const [quarantineUnits, setQuarantineUnits] = useState<number>(0);
  const [quarantineNotes, setQuarantineNotes] = useState<string>('');

  // Interactive feedback toasts
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Collapsible Navigation & User Profile Menu States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Switch Staff Member
  const toggleStaffRole = () => {
    const nextStaff = currentStaff.id === 'staff-01' ? ADMIN_STAFF_MEMBERS[1] : ADMIN_STAFF_MEMBERS[0];
    setCurrentStaff(nextStaff);
    showNotice(`Switched active operator to ${nextStaff.name} (${nextStaff.roleTitle})`);
  };

  const handleSelectStaff = (staff: AdminStaffUser) => {
    setCurrentStaff(staff);
    setIsProfileMenuOpen(false);
    showNotice(`Active operator set to ${staff.name} (${staff.roleTitle})`);
  };

  // Stock Adjustment
  const handleAdjustStock = (itemId: string, delta: number) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          const newCount = Math.max(0, item.stockCount + delta);
          return {
            ...item,
            stockCount: newCount,
            lastStockCheck: 'Just now',
          };
        }
        return item;
      });
      saveInventory(updated);
      return updated;
    });
    showNotice(`Updated inventory count (${delta > 0 ? `+${delta}` : delta})`);
  };

  // Sale-Discounting Action
  const handleApplyDiscount = (itemId: string, percent: number | null) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          if (percent === null || percent === 0) {
            const { discountPercent, discountedPriceGhs, discountAppliedAt, discountAppliedBy, ...rest } = item;
            return {
              ...rest,
              lastStockCheck: 'Just now',
            };
          } else {
            const discountedPrice = Number((item.unitPriceGhs * (1 - percent / 100)).toFixed(2));
            return {
              ...item,
              discountPercent: percent,
              discountedPriceGhs: discountedPrice,
              discountAppliedAt: 'Just now',
              discountAppliedBy: currentStaff.name,
              lastStockCheck: 'Just now',
            };
          }
        }
        return item;
      });
      saveInventory(updated);
      return updated;
    });

    const targetItem = inventory.find((i) => i.id === itemId);
    if (percent) {
      const newPrice = targetItem ? (targetItem.unitPriceGhs * (1 - percent / 100)).toFixed(2) : '0.00';
      showNotice(`Applied ${percent}% clearance discount to ${targetItem?.name || 'batch'} (GHS ${newPrice}) · Live in Shop`);
    } else {
      showNotice(`Restored standard regular price for ${targetItem?.name || 'batch'}`);
    }
  };

  // Open Quarantine Modal
  const openQuarantineModal = (item: InventoryItem) => {
    setQuarantineModalItem(item);
    setQuarantineReason('Imminent Shelf-Life Expiry (≤30 Days)');
    setQuarantineUnits(item.stockCount);
    setQuarantineNotes('');
  };

  // Confirm Quarantine & Removal Action
  const handleConfirmQuarantine = () => {
    if (!quarantineModalItem) return;

    const target = quarantineModalItem;
    const units = Math.max(1, Math.min(target.stockCount, quarantineUnits || target.stockCount));

    // Update inventory item
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === target.id) {
          return {
            ...item,
            isQuarantined: true,
            quarantineReason: quarantineReason,
            quarantineDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quarantinedBy: currentStaff.name,
            quarantinedUnits: units,
            lastStockCheck: 'Just now (Quarantined)',
          };
        }
        return item;
      });
      saveInventory(updated);
      return updated;
    });

    // Create immutable disposal log entry
    const newLog: DisposalLogEntry = {
      id: `DISP-${new Date().getFullYear()}-${String(disposalLogs.length + 1).padStart(3, '0')}`,
      inventoryItemId: target.id,
      productId: target.productId,
      medicationName: target.name,
      batchNumber: target.batchNumber,
      packSize: target.packSize,
      unitsQuarantined: units,
      reason: quarantineReason,
      additionalNotes: quarantineNotes.trim() || undefined,
      loggedAt: 'Today · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorizedStaffName: currentStaff.name,
      authorizedStaffRole: currentStaff.roleTitle,
      registrationNumber: currentStaff.registrationNumber,
    };

    const updatedLogs = [newLog, ...disposalLogs];
    setDisposalLogs(updatedLogs);
    saveDisposalLogs(updatedLogs);

    showNotice(`Batch ${target.batchNumber} quarantined & withdrawn from storefront by ${currentStaff.name}`);
    setQuarantineModalItem(null);
  };

  // Release Quarantine Action
  const handleReleaseQuarantine = (itemId: string) => {
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            isQuarantined: false,
            quarantineReason: undefined,
            quarantineDate: undefined,
            quarantinedBy: undefined,
            quarantinedUnits: undefined,
            lastStockCheck: 'Just now (Released from Quarantine)',
          };
        }
        return item;
      });
      saveInventory(updated);
      return updated;
    });

    const target = inventory.find((i) => i.id === itemId);
    showNotice(`Batch ${target?.batchNumber || ''} restored to active storefront inventory`);
  };

  // Approve Prescription Docket
  const handleApprovePrescription = (docketId: string) => {
    setRxDockets((prev) => {
      const updated = prev.map((doc) => {
        if (doc.id === docketId) {
          return {
            ...doc,
            status: 'approved' as const,
            reviewedBy: currentStaff.name,
            pharmacistComments: `Clinically verified by ${currentStaff.name}. Safe for dispensing.`,
          };
        }
        return doc;
      });
      savePrescriptionDockets(updated);
      return updated;
    });
    showNotice(`Prescription ${docketId} approved by ${currentStaff.name}`);
  };

  // Flag Prescription Docket
  const handleFlagPrescription = (docketId: string) => {
    setRxDockets((prev) => {
      const updated = prev.map((doc) => {
        if (doc.id === docketId) {
          return {
            ...doc,
            status: 'flagged-query' as const,
            reviewedBy: currentStaff.name,
            pharmacistComments: `Flagged by ${currentStaff.name} for dosage clarification with prescriber.`,
          };
        }
        return doc;
      });
      savePrescriptionDockets(updated);
      return updated;
    });
    showNotice(`Prescription ${docketId} flagged for clinical inquiry`);
  };

  // Advance Order Stage Handler
  const handleAdvanceStage = (orderId: string, currentStage: OrderStage) => {
    const stageFlow: Record<OrderStage, OrderStage> = {
      received: 'review',
      review: 'dispensed',
      dispensed: 'transit',
      transit: 'delivered',
      delivered: 'delivered',
    };

    const nextStage = stageFlow[currentStage];
    if (nextStage !== currentStage) {
      const notes: Record<OrderStage, string> = {
        received: 'Logged into fulfillment queue.',
        review: `Clinical review completed by ${currentStaff.name}.`,
        dispensed: 'Cold-chain packaged and sealed at Abelemkpe clean room.',
        transit: 'Handed to Accra Express dispatch rider.',
        delivered: 'Delivered to recipient with patient sign-off.',
      };
      onUpdateOrderStage(orderId, nextStage, notes[nextStage]);
      showNotice(`Order ${orderId} moved to stage: ${nextStage.toUpperCase()}`);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStage = orderFilterStage === 'all' || o.stage === orderFilterStage;
      const query = orderSearch.toLowerCase().trim();
      const matchesQuery =
        !query ||
        o.orderId.toLowerCase().includes(query) ||
        o.destinationArea.toLowerCase().includes(query) ||
        o.itemsSummary.some((item) => item.toLowerCase().includes(query));
      return matchesStage && matchesQuery;
    });
  }, [orders, orderFilterStage, orderSearch]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesStorage =
        inventoryStorageFilter === 'all' || item.storageRequirement === inventoryStorageFilter;
      const query = inventorySearch.toLowerCase().trim();
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query);
      return matchesStorage && matchesQuery;
    });
  }, [inventory, inventoryStorageFilter, inventorySearch]);

  // Expiry Calculations & Filtered Alerts
  const inventoryWithAlerts = useMemo(() => {
    return inventory.map((item) => {
      const days = getDaysUntilExpiry(item.expiryDate);
      const tier = getExpiryAlertTier(days);
      const meta = getExpiryTierMeta(tier);
      return {
        ...item,
        daysRemaining: days,
        alertTier: tier,
        alertMeta: meta,
      };
    });
  }, [inventory]);

  const criticalCount = useMemo(
    () => inventoryWithAlerts.filter((i) => i.alertTier === 'critical' && !i.isQuarantined).length,
    [inventoryWithAlerts]
  );
  const urgentCount = useMemo(
    () => inventoryWithAlerts.filter((i) => i.alertTier === 'urgent' && !i.isQuarantined).length,
    [inventoryWithAlerts]
  );
  const attentionCount = useMemo(
    () => inventoryWithAlerts.filter((i) => i.alertTier === 'attention' && !i.isQuarantined).length,
    [inventoryWithAlerts]
  );
  const quarantinedCount = useMemo(
    () => inventoryWithAlerts.filter((i) => i.isQuarantined).length,
    [inventoryWithAlerts]
  );
  const discountedCount = useMemo(
    () => inventoryWithAlerts.filter((i) => Boolean(i.discountPercent && i.discountPercent > 0)).length,
    [inventoryWithAlerts]
  );
  const totalImpendingAlerts = criticalCount + urgentCount;

  // Filtered Items for Alerts Tab
  const filteredAlertItems = useMemo(() => {
    return inventoryWithAlerts.filter((item) => {
      // Tab filter
      if (alertsFilter === 'critical' && (item.alertTier !== 'critical' || item.isQuarantined)) return false;
      if (alertsFilter === 'urgent' && (item.alertTier !== 'urgent' || item.isQuarantined)) return false;
      if (alertsFilter === 'attention' && (item.alertTier !== 'attention' || item.isQuarantined)) return false;
      if (alertsFilter === 'discounted' && (!item.discountPercent || item.isQuarantined)) return false;
      if (alertsFilter === 'quarantined' && !item.isQuarantined) return false;
      if (alertsFilter === 'all') {
        // Show all items with alerts (critical, urgent, attention) or discounted or quarantined
        const hasAlert = item.alertTier !== 'safe' || item.isQuarantined || Boolean(item.discountPercent);
        if (!hasAlert) return false;
      }

      // Search query
      const query = alertsSearch.toLowerCase().trim();
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.batchNumber.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query)
      );
    });
  }, [inventoryWithAlerts, alertsFilter, alertsSearch]);

  // Filtered Prescriptions
  const filteredRx = useMemo(() => {
    return rxDockets.filter((rx) => {
      return rxFilterStatus === 'all' || rx.status === rxFilterStatus;
    });
  }, [rxDockets, rxFilterStatus]);

  // Aggregate Analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmountGhs, 0);
  const lowStockCount = inventory.filter((i) => i.stockCount <= i.reorderLevel).length;
  const pendingRxCount = rxDockets.filter((r) => r.status === 'pending-review').length;
  const inTransitOrderCount = orders.filter((o) => o.stage === 'transit').length;

  // Cold-Chain Telemetry Alert Counts
  const coldChainTempCheckCount = useMemo(
    () => coldBatches.filter((b) => b.requiresImmediateTempCheck).length,
    [coldBatches]
  );
  const coldChainReplenishCount = useMemo(
    () => coldBatches.filter((b) => b.requiresImmediateReplenishment).length,
    [coldBatches]
  );
  const totalColdChainAlerts = coldChainTempCheckCount + coldChainReplenishCount;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#1E293B] flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 1. Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static bg-[#0F172A] text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 ${
          isMobileSidebarOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
          {/* Admin Header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#007A33] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  CPC
                </div>
                <div className="min-w-0">
                  <h1 className="font-heading text-sm font-bold text-white tracking-tight leading-tight truncate">
                    Dispensary OS
                  </h1>
                  <div className="text-[10px] text-emerald-400 font-mono truncate">
                    Cedar Point Chemist
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div
                  className="w-8 h-8 rounded-lg bg-[#007A33] text-white flex items-center justify-center font-bold text-xs shadow-xs"
                  title="Cedar Point Chemist Dispensary OS"
                >
                  CPC
                </div>
              </div>
            )}

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Desktop collapse toggle */}
            {!isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer shrink-0 transition-colors"
                title="Collapse sidebar (Ctrl+B)"
              >
                <CaretDoubleLeft size={16} />
              </button>
            )}
          </div>

          {/* Clean Facility Status Indicator */}
          {!isSidebarCollapsed ? (
            <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Abelemkpe Dispensary</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                Dispensary Terminal · GA-165
              </div>
            </div>
          ) : (
            <div className="my-3 flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                title="Expand sidebar (Ctrl+B)"
              >
                <CaretDoubleRight size={14} />
              </button>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Abelemkpe Dispensary Active" />
            </div>
          )}

          {/* Nav Menu */}
          <nav className="p-2.5 space-y-1 text-xs font-semibold flex-1">
            {/* Orders Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
                setIsMobileSidebarOpen(false);
              }}
              title="Orders Queue"
              className={`w-full py-2.5 rounded-xl transition-all cursor-pointer flex items-center ${
                !isSidebarCollapsed ? 'px-3 justify-between' : 'justify-center px-0 relative'
              } ${
                activeTab === 'orders'
                  ? 'bg-[#007A33] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck size={18} aria-hidden="true" />
                {!isSidebarCollapsed && <span>Orders Queue</span>}
              </div>
              {!isSidebarCollapsed ? (
                <span className="font-mono text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded text-white tabular-nums">
                  {orders.length}
                </span>
              ) : (
                orders.length > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                )
              )}
            </button>

            {/* Inventory Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('inventory');
                setIsMobileSidebarOpen(false);
              }}
              title="Inventory & Batches"
              className={`w-full py-2.5 rounded-xl transition-all cursor-pointer flex items-center ${
                !isSidebarCollapsed ? 'px-3 justify-between' : 'justify-center px-0 relative'
              } ${
                activeTab === 'inventory'
                  ? 'bg-[#007A33] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package size={18} aria-hidden="true" />
                {!isSidebarCollapsed && <span>Inventory & Batches</span>}
              </div>
              {!isSidebarCollapsed ? (
                lowStockCount > 0 && (
                  <span className="font-mono text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded tabular-nums font-bold">
                    {lowStockCount} Low
                  </span>
                )
              ) : (
                lowStockCount > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
                )
              )}
            </button>

            {/* Inventory Alerts Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('alerts');
                setIsMobileSidebarOpen(false);
              }}
              title="Inventory Alerts"
              className={`w-full py-2.5 rounded-xl transition-all cursor-pointer flex items-center ${
                !isSidebarCollapsed ? 'px-3 justify-between' : 'justify-center px-0 relative'
              } ${
                activeTab === 'alerts'
                  ? 'bg-[#007A33] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Warning
                  size={18}
                  className={criticalCount > 0 ? 'text-rose-400' : 'text-amber-400'}
                  weight={activeTab === 'alerts' ? 'fill' : 'bold'}
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && <span>Inventory Alerts</span>}
              </div>
              {!isSidebarCollapsed ? (
                totalImpendingAlerts > 0 && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums font-bold ${
                      criticalCount > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {totalImpendingAlerts} Due
                  </span>
                )
              ) : (
                totalImpendingAlerts > 0 && (
                  <span className={`absolute top-1 right-2 w-2 h-2 rounded-full ${criticalCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                )
              )}
            </button>

            {/* Cold-Chain Monitor Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('cold-chain');
                setIsMobileSidebarOpen(false);
              }}
              title="Cold-Chain Monitor"
              className={`w-full py-2.5 rounded-xl transition-all cursor-pointer flex items-center ${
                !isSidebarCollapsed ? 'px-3 justify-between' : 'justify-center px-0 relative'
              } ${
                activeTab === 'cold-chain'
                  ? 'bg-[#007A33] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Snowflake
                  size={18}
                  className={coldChainTempCheckCount > 0 ? 'text-rose-400 animate-spin' : 'text-sky-400'}
                  weight={activeTab === 'cold-chain' ? 'fill' : 'bold'}
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && <span>Cold-Chain Monitor</span>}
              </div>
              {!isSidebarCollapsed ? (
                totalColdChainAlerts > 0 ? (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded tabular-nums font-bold ${
                      coldChainTempCheckCount > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {totalColdChainAlerts} Due
                  </span>
                ) : (
                  <span className="font-mono text-[9px] bg-sky-950/60 text-sky-400 border border-sky-800/60 px-1 py-0.5 rounded">
                    Live IoT
                  </span>
                )
              ) : (
                totalColdChainAlerts > 0 && (
                  <span className={`absolute top-1 right-2 w-2 h-2 rounded-full ${coldChainTempCheckCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                )
              )}
            </button>

            {/* Prescriptions Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('prescriptions');
                setIsMobileSidebarOpen(false);
              }}
              title="Clinical Prescriptions"
              className={`w-full py-2.5 rounded-xl transition-all cursor-pointer flex items-center ${
                !isSidebarCollapsed ? 'px-3 justify-between' : 'justify-center px-0 relative'
              } ${
                activeTab === 'prescriptions'
                  ? 'bg-[#007A33] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={18} aria-hidden="true" />
                {!isSidebarCollapsed && <span>Clinical Prescriptions</span>}
              </div>
              {!isSidebarCollapsed ? (
                pendingRxCount > 0 && (
                  <span className="font-mono text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded tabular-nums font-bold">
                    {pendingRxCount} Due
                  </span>
                )
              ) : (
                pendingRxCount > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-blue-400" />
                )
              )}
            </button>

            {/* Analytics Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('analytics');
                setIsMobileSidebarOpen(false);
              }}
              title="Pharmacy Analytics"
              className={`w-full py-2.5 rounded-xl transition-all cursor-pointer flex items-center ${
                !isSidebarCollapsed ? 'px-3 justify-between' : 'justify-center px-0 relative'
              } ${
                activeTab === 'analytics'
                  ? 'bg-[#007A33] text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ChartLineUp size={18} aria-hidden="true" />
                {!isSidebarCollapsed && <span>Pharmacy Analytics</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] text-emerald-400 font-mono">Live</span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 shrink-0">
          <button
            type="button"
            onClick={onBackToStorefront}
            title="Return to Public Storefront"
            className={`w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              !isSidebarCollapsed ? 'px-3' : 'px-0'
            }`}
          >
            <House size={16} aria-hidden="true" />
            {!isSidebarCollapsed && <span>Return to Storefront</span>}
          </button>
          {!isSidebarCollapsed && (
            <div className="text-[10px] text-slate-500 text-center truncate">
              Cedar Point Chemist Ltd · GA-165
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile Menu Toggle + Desktop Collapse Button + Breadcrumbs */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile drawer toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0 transition-colors"
              title="Open Navigation Menu"
            >
              <List size={20} />
            </button>

            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            >
              <SidebarSimple size={16} />
              <span className="hidden xl:inline">{isSidebarCollapsed ? 'Expand' : 'Collapse'}</span>
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-1.5 text-xs truncate">
              <span className="text-slate-400 hidden sm:inline">Dispensary</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-bold text-slate-900 truncate">
                {activeTab === 'orders' && 'Orders Fulfillment Queue'}
                {activeTab === 'inventory' && 'Pharmaceutical Inventory & Batch Tracking'}
                {activeTab === 'alerts' && 'Inventory Alerts & Expiry Watch'}
                {activeTab === 'cold-chain' && 'Real-Time Cold-Chain Telemetry'}
                {activeTab === 'prescriptions' && 'Clinical Prescription Verification'}
                {activeTab === 'analytics' && 'Pharmacy Performance Metrics'}
              </span>
            </div>
          </div>

          {/* Right: Quick Alert Pills + Online Status + User Profile Menu */}
          <div className="flex items-center gap-2.5 shrink-0 relative">
            {/* Cold-Chain Quick Alert Pill */}
            {totalColdChainAlerts > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('cold-chain')}
                className={`hidden md:flex px-2.5 py-1.5 rounded-lg text-xs font-bold items-center gap-1.5 cursor-pointer shadow-2xs border transition-all ${
                  coldChainTempCheckCount > 0
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse hover:bg-rose-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title="Review Cold-Chain alert batches immediately"
              >
                <Snowflake size={14} className={coldChainTempCheckCount > 0 ? 'text-rose-600' : 'text-amber-600'} />
                <span>Cold-Chain: {totalColdChainAlerts} Due</span>
              </button>
            )}

            {/* Dispensary Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[11px]">Online (UTC+0)</span>
            </div>

            {/* User Profile Menu with Avatar & Rich Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isProfileMenuOpen
                    ? 'bg-slate-100 border-[#007A33] ring-2 ring-[#007A33]/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Avatar with Status Ring */}
                <div className="relative">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                      currentStaff.role === 'superintendent' ? 'bg-[#007A33]' : 'bg-sky-700'
                    }`}
                  >
                    {currentStaff.avatarInitials}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                {/* Name & Role chip */}
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-xs text-slate-900 leading-tight flex items-center gap-1.5">
                    <span className="max-w-[130px] lg:max-w-[160px] truncate">{currentStaff.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <span className="font-semibold text-emerald-700">
                      {currentStaff.role === 'superintendent' ? 'Pharmacist' : 'Technician'}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-400">
                      {currentStaff.role === 'superintendent' ? 'MPSGh' : 'Tech'}
                    </span>
                  </div>
                </div>

                <CaretDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180 text-slate-700' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-4 animate-in zoom-in-95 duration-150">
                    {/* User Header Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0 ${
                          currentStaff.role === 'superintendent' ? 'bg-[#007A33]' : 'bg-sky-700'
                        }`}
                      >
                        {currentStaff.avatarInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {currentStaff.name}
                        </div>
                        <div className="text-xs font-semibold text-emerald-800">
                          {currentStaff.roleTitle}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                          {currentStaff.registrationNumber || 'Staff ID: ' + currentStaff.id}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          {currentStaff.department}
                        </div>
                      </div>
                    </div>

                    {/* Operational Persona Switcher */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Switch Operational Persona</span>
                        <span className="text-[10px] text-slate-400 font-normal">Role-Based Access</span>
                      </div>

                      <div className="space-y-2">
                        {ADMIN_STAFF_MEMBERS.map((staff) => {
                          const isSelected = staff.id === currentStaff.id;
                          return (
                            <button
                              key={staff.id}
                              type="button"
                              onClick={() => handleSelectStaff(staff)}
                              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-50/80 border-[#007A33] ring-1 ring-[#007A33]'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                                    staff.role === 'superintendent' ? 'bg-[#007A33]' : 'bg-sky-700'
                                  }`}
                                >
                                  {staff.avatarInitials}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-xs text-slate-900 truncate">
                                    {staff.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {staff.roleTitle}
                                  </div>
                                </div>
                              </div>

                              {isSelected ? (
                                <span className="p-1 rounded-full bg-[#007A33] text-white shrink-0 shadow-2xs">
                                  <Check size={12} weight="bold" />
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-slate-400 shrink-0 hover:text-slate-700">
                                  Select
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Terminal & Shift Info */}
                    <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 space-y-1 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Dispensary Terminal:</span>
                        <span className="font-mono text-slate-900">Abelemkpe Clean Bench</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Operational Shift:</span>
                        <span className="text-slate-900">Morning & Peak Outpatient</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700">Standards:</span>
                        <span className="text-emerald-800 font-semibold">Ghana FDA GDP & Act 857</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onBackToStorefront();
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <SignOut size={14} />
                        <span>Storefront</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Global Toast Notice */}
        {actionNotice && (
          <div className="sticky top-14 z-40 mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between shadow-lg border border-slate-700 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" weight="fill" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* ========================================================== */}
          {/* MODULE 1: ORDERS QUEUE */}
          {/* ========================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                    Active Orders & Clinical Dispensary Queue
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live patient orders, stage progression control, and cold-chain dispatch handover.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filter Stage:</span>
                  <select
                    value={orderFilterStage}
                    onChange={(e) => setOrderFilterStage(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 focus:outline-hidden focus:border-[#007A33] cursor-pointer"
                  >
                    <option value="all">All Stages ({orders.length})</option>
                    <option value="review">Clinical Review</option>
                    <option value="dispensed">Dispensed & Packed</option>
                    <option value="transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Search */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order ID, patient area, or medicine..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007A33]"
                />
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const isReview = order.stage === 'review';
                    const isDispensed = order.stage === 'dispensed';
                    const isTransit = order.stage === 'transit';
                    const isDelivered = order.stage === 'delivered';

                    return (
                      <div
                        key={order.orderId}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-slate-900">
                              {order.orderId}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-500">{order.createdAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                                isDelivered
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : isTransit
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : isDispensed
                                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isDelivered
                                    ? 'bg-emerald-600'
                                    : isTransit
                                    ? 'bg-blue-600'
                                    : isDispensed
                                    ? 'bg-teal-600'
                                    : 'bg-amber-500'
                                }`}
                              />
                              <span>{order.statusLabel}</span>
                            </div>

                            {onOpenTrackModal && (
                              <button
                                type="button"
                                onClick={() => onOpenTrackModal(order.orderId)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                              >
                                View Tracking
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Order Middle Details */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                          <div className="md:col-span-6 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Prescription Formulations
                            </span>
                            <div className="space-y-1">
                              {order.itemsSummary.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 font-medium text-slate-800">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-3 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Delivery Location
                            </span>
                            <div className="font-semibold text-slate-800">{order.destinationArea}</div>
                            <div className="text-[11px] text-slate-500">Accra Dispatch Network</div>
                          </div>

                          <div className="md:col-span-3 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Total Invoice
                            </span>
                            <div className="font-heading font-bold text-base text-emerald-800 tabular-nums">
                              GHS {order.totalAmountGhs.toFixed(2)}
                            </div>
                            <div className="text-[11px] text-slate-500">Payment Confirmed</div>
                          </div>
                        </div>

                        {/* Action Control Row */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <ShieldCheck size={16} className="text-[#007A33]" />
                            <span>
                              Dispensary Action Queue · Authorized by <span className="font-semibold text-slate-900">{currentStaff.name}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isDelivered ? (
                              <button
                                type="button"
                                onClick={() => handleAdvanceStage(order.orderId, order.stage)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <span>Advance to</span>
                                <span className="underline">
                                  {isReview && 'Dispensing'}
                                  {isDispensed && 'Courier In Transit'}
                                  {isTransit && 'Delivered'}
                                </span>
                                <ArrowRight size={14} />
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                                <CheckCircle size={16} weight="fill" className="text-[#007A33]" />
                                <span>Order Fulfilled</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
                    <p className="text-sm font-bold text-slate-700">No orders match filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderFilterStage('all');
                        setOrderSearch('');
                      }}
                      className="text-xs font-bold text-[#007A33] hover:underline cursor-pointer"
                    >
                      Clear search filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* MODULE 2: INVENTORY & BATCH CONTROL */}
          {/* ========================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                    Pharmaceutical Inventory & Batch Tracking
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time stock ledger across all 17 registered formulations, batch numbers, and cold-chain compliance.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('alerts')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Warning size={14} weight="bold" />
                    <span>View Expiry Alerts ({totalImpendingAlerts})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInventoryStorageFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      inventoryStorageFilter === 'all'
                        ? 'bg-[#007A33] text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    All Storage
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryStorageFilter('cold-chain')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                      inventoryStorageFilter === 'cold-chain'
                        ? 'bg-[#007A33] text-white'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Thermometer size={14} />
                    <span>Cold-Chain Only</span>
                  </button>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Formulations</span>
                  <div className="font-heading text-xl font-black text-slate-900">{inventory.length} SKUs</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stock Count</span>
                  <div className="font-heading text-xl font-black text-emerald-800 tabular-nums">
                    {inventory.reduce((sum, i) => sum + i.stockCount, 0)} Units
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</span>
                  <div className="font-heading text-xl font-black text-amber-600 tabular-nums">
                    {lowStockCount} Items
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Impending Expiries</span>
                  <div className="font-heading text-xl font-black text-rose-700 tabular-nums">
                    {totalImpendingAlerts} Batches
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search medicine name, batch number, or supplier..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007A33]"
                />
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {/* High-Density Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Medication & Dosage</th>
                      <th className="py-3 px-4">Batch Number</th>
                      <th className="py-3 px-4">Expiry Date</th>
                      <th className="py-3 px-4">Expiry Watch</th>
                      <th className="py-3 px-4">Current Stock</th>
                      <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((item) => {
                      const isLowStock = item.stockCount <= item.reorderLevel;
                      const daysRemaining = getDaysUntilExpiry(item.expiryDate);
                      const tier = getExpiryAlertTier(daysRemaining);
                      const meta = getExpiryTierMeta(tier);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{item.name}</span>
                              {item.isQuarantined && (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  Quarantined
                                </span>
                              )}
                              {item.discountPercent && !item.isQuarantined && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {item.discountPercent}% Off
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.category} · {item.dosage} · {item.packSize}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-800 text-[11px]">
                            {item.batchNumber}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                            {item.expiryDate}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${meta.bg} ${meta.text} ${meta.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                              <span>{daysRemaining > 0 ? `${daysRemaining}d remaining` : 'Expired'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono font-bold text-sm tabular-nums ${
                                  isLowStock ? 'text-amber-700' : 'text-slate-900'
                                }`}
                              >
                                {item.stockCount}
                              </span>
                              {isLowStock && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                                  Low
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(item.id, -1)}
                                className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                                title="Dispense 1 unit"
                              >
                                <Minus size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAdjustStock(item.id, 5)}
                                className="px-2 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#007A33] font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                                title="Add 5 units from shipment"
                              >
                                <Plus size={12} />
                                <span>+5</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* MODULE 3: INVENTORY ALERTS & EXPIRY CONTROL (NEW) */}
          {/* ========================================================== */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                      Inventory Alerts & Expiry Watch
                    </h2>
                    <span className="text-[11px] font-bold bg-emerald-100 text-[#007A33] px-2 py-0.5 rounded-full border border-emerald-200">
                      Ghana FDA GDP Standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous shelf-life telemetry across 3 regulated tiers. Apply clearance discounting (20%, 35%, 50%) or quarantine high-risk batches.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      showNotice('Simulating GDP Quality Audit Report export. Generated PDF archive logged for superintendent review.');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Export size={14} />
                    <span>Export Audit PDF</span>
                  </button>
                </div>
              </div>

              {/* 4 Summary Cards (Tiers & Containment) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                {/* Critical Tier */}
                <div
                  onClick={() => setAlertsFilter('critical')}
                  className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
                    alertsFilter === 'critical' ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                      Critical Tier
                    </span>
                    <span className="font-mono text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                      ≤ 30 Days
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-rose-700 tabular-nums mt-2">
                    {criticalCount} Batches
                  </div>
                  <p className="text-[11px] text-rose-600/80 mt-1">
                    Immediate 50% clearance or quarantine disposal required.
                  </p>
                </div>

                {/* Urgent Tier */}
                <div
                  onClick={() => setAlertsFilter('urgent')}
                  className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
                    alertsFilter === 'urgent' ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Urgent Tier
                    </span>
                    <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                      31–90 Days
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-amber-700 tabular-nums mt-2">
                    {urgentCount} Batches
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-1">
                    Prioritize FEFO dispensing & 20%–35% promotional clearance.
                  </p>
                </div>

                {/* Attention Tier */}
                <div
                  onClick={() => setAlertsFilter('attention')}
                  className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
                    alertsFilter === 'attention' ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-slate-200 hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Attention Tier
                    </span>
                    <span className="font-mono text-[10px] text-yellow-800 bg-yellow-50 px-1.5 py-0.5 rounded font-bold">
                      91–180 Days
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-yellow-800 tabular-nums mt-2">
                    {attentionCount} Batches
                  </div>
                  <p className="text-[11px] text-yellow-700/80 mt-1">
                    Audit turnover velocity & schedule hospital bundled kits.
                  </p>
                </div>

                {/* Quarantined Batches */}
                <div
                  onClick={() => setAlertsFilter('quarantined')}
                  className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
                    alertsFilter === 'quarantined' ? 'border-slate-800 ring-2 ring-slate-300' : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                      <Archive size={12} />
                      Quarantined
                    </span>
                    <span className="font-mono text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                      Locked
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-slate-800 tabular-nums mt-2">
                    {quarantinedCount} Batches
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Withdrawn from storefront and isolated in secure holding.
                  </p>
                </div>
              </div>

              {/* Filter Tabs & Search Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setAlertsFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                      alertsFilter === 'all'
                        ? 'bg-[#007A33] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Watch Items ({criticalCount + urgentCount + attentionCount + quarantinedCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertsFilter('critical')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                      alertsFilter === 'critical'
                        ? 'bg-rose-700 text-white shadow-xs'
                        : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    Critical ({criticalCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertsFilter('urgent')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                      alertsFilter === 'urgent'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-white border border-amber-200 text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    Urgent ({urgentCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertsFilter('attention')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                      alertsFilter === 'attention'
                        ? 'bg-yellow-700 text-white shadow-xs'
                        : 'bg-white border border-yellow-200 text-yellow-800 hover:bg-yellow-50'
                    }`}
                  >
                    Attention ({attentionCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertsFilter('discounted')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                      alertsFilter === 'discounted'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    Active Discounts ({discountedCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertsFilter('quarantined')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
                      alertsFilter === 'quarantined'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Quarantined ({quarantinedCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertsFilter('audit-log')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                      alertsFilter === 'audit-log'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Archive size={14} />
                    <span>Disposal Audit Log ({disposalLogs.length})</span>
                  </button>
                </div>

                {alertsFilter !== 'audit-log' && (
                  <div className="relative max-w-xs w-full">
                    <input
                      type="text"
                      value={alertsSearch}
                      onChange={(e) => setAlertsSearch(e.target.value)}
                      placeholder="Search alerting batch or drug..."
                      className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007A33]"
                    />
                    <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                )}
              </div>

              {/* VIEW A: AUDIT LOG TABLE */}
              {alertsFilter === 'audit-log' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs flex items-center justify-between border border-slate-800">
                    <div className="flex items-center gap-3">
                      <Archive size={20} className="text-emerald-400" />
                      <div>
                        <div className="font-bold text-white text-sm">Ghana FDA Regulatory Disposal & Quarantine Audit Trail</div>
                        <div className="text-[11px] text-slate-400">
                          Permanent, tamper-evident log of all withdrawn batches pursuant to Part 7 of the Public Health Act 851.
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 bg-slate-800 px-2 py-1 rounded">
                      GDP-VERIFIED
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Log ID & Date</th>
                          <th className="py-3 px-4">Medication & Pack</th>
                          <th className="py-3 px-4">Batch Number</th>
                          <th className="py-3 px-4">Units</th>
                          <th className="py-3 px-4">Reason for Removal</th>
                          <th className="py-3 px-4">Authorized By</th>
                          <th className="py-3 px-4">Clinical Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-normal">
                        {disposalLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-mono font-bold text-slate-900 text-[11px]">{log.id}</div>
                              <div className="text-[10px] text-slate-500">{log.loggedAt}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{log.medicationName}</div>
                              <div className="text-[11px] text-slate-500">{log.packSize}</div>
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-slate-800 text-[11px]">
                              {log.batchNumber}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-rose-700">
                              {log.unitsQuarantined} Units
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                {log.reason}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{log.authorizedStaffName}</div>
                              <div className="text-[10px] text-slate-500 font-mono">
                                {log.registrationNumber || log.authorizedStaffRole}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600">
                              {log.additionalNotes ? (
                                <span className="italic">"{log.additionalNotes}"</span>
                              ) : (
                                <span className="text-slate-400">None logged</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* VIEW B: ACTIVE ALERTS CARDS & MANAGEMENT */
                <div className="space-y-4">
                  {filteredAlertItems.length > 0 ? (
                    filteredAlertItems.map((item) => {
                      const isQuarantined = Boolean(item.isQuarantined);
                      const hasDiscount = Boolean(item.discountPercent && item.discountPercent > 0);
                      const currentEffectivePrice = item.discountedPriceGhs || item.unitPriceGhs;
                      const financialExposure = (item.stockCount * item.unitPriceGhs).toFixed(2);

                      return (
                        <div
                          key={item.id}
                          className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all space-y-4 shadow-2xs ${
                            isQuarantined
                              ? 'border-slate-300 bg-slate-50/50'
                              : item.alertTier === 'critical'
                              ? 'border-rose-200 hover:border-rose-300'
                              : item.alertTier === 'urgent'
                              ? 'border-amber-200 hover:border-amber-300'
                              : 'border-slate-200'
                          }`}
                        >
                          {/* Alert Top Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Expiry Tier Pill */}
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.alertMeta.bg} ${item.alertMeta.text} ${item.alertMeta.border}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${item.alertMeta.dot} ${item.alertTier === 'critical' ? 'animate-pulse' : ''}`} />
                                <span>{item.alertMeta.badgeText}</span>
                                <span className="text-slate-400">·</span>
                                <span className="font-mono">
                                  {item.daysRemaining > 0 ? `${item.daysRemaining} days left` : 'Expired'}
                                </span>
                              </span>

                              {/* Storage Type */}
                              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                {item.storageRequirement === 'cold-chain' ? (
                                  <>
                                    <Thermometer size={12} className="text-sky-600" />
                                    <span className="text-sky-800 font-semibold">Cold-Chain (2°C–8°C)</span>
                                  </>
                                ) : (
                                  <span>Ambient</span>
                                )}
                              </span>

                              {/* Quarantined Pill */}
                              {isQuarantined && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
                                  <Archive size={12} />
                                  <span>Withdrawn from Storefront</span>
                                </span>
                              )}

                              {/* Live Discount Pill */}
                              {hasDiscount && !isQuarantined && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                                  <Tag size={12} />
                                  <span>Live Shop Clearance: {item.discountPercent}% Off</span>
                                </span>
                              )}
                            </div>

                            <div className="font-mono text-xs text-slate-500 flex items-center gap-1.5">
                              <CalendarBlank size={14} className="text-slate-400" />
                              <span>Stated Expiry: <strong className="text-slate-800">{item.expiryDate}</strong></span>
                            </div>
                          </div>

                          {/* Alert Middle Info */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                            <div className="md:col-span-5 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Medication & Manufacturer
                              </span>
                              <div className="font-heading font-bold text-base text-slate-900 leading-tight">
                                {item.name}
                              </div>
                              <div className="text-slate-500 text-[11px]">
                                {item.category} · {item.dosage} · {item.packSize}
                              </div>
                              <div className="text-slate-500 text-[11px] pt-1">
                                Supplied by <strong className="text-slate-700">{item.supplier}</strong>
                              </div>
                            </div>

                            <div className="md:col-span-3 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Batch Details
                              </span>
                              <div className="font-mono font-semibold text-slate-800 text-[11px]">
                                {item.batchNumber}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                GMP Certified: <span className="text-emerald-700 font-semibold">FDA Audited</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Last verified: {item.lastStockCheck}
                              </div>
                            </div>

                            <div className="md:col-span-4 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Current Stock & Exposure
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="font-heading font-black text-xl text-slate-900 tabular-nums">
                                  {item.stockCount} Units
                                </span>
                                <span className="text-slate-500 text-[11px]">
                                  (GHS {financialExposure} value)
                                </span>
                              </div>

                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="text-[11px] text-slate-500">Base Retail:</span>
                                <span className={`font-semibold tabular-nums ${hasDiscount ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                  GHS {item.unitPriceGhs.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                  <span className="font-bold text-emerald-700 font-mono tabular-nums">
                                    → GHS {item.discountedPriceGhs?.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quarantined Notice Banner if quarantined */}
                          {isQuarantined && (
                            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex flex-wrap items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                                  <Warning size={15} weight="fill" className="text-rose-600" />
                                  <span>Quarantine Disposal Hold: "{item.quarantineReason}"</span>
                                </div>
                                <div className="text-[11px] text-rose-700">
                                  Authorized by <strong>{item.quarantinedBy || currentStaff.name}</strong> on {item.quarantineDate || 'today'}. Patient storefront orders disabled for this batch.
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleReleaseQuarantine(item.id)}
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-100 text-rose-800 font-bold border border-rose-300 text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              >
                                <ArrowCounterClockwise size={13} />
                                <span>Release Quarantine</span>
                              </button>
                            </div>
                          )}

                          {/* Action Control Panel */}
                          {!isQuarantined && (
                            <div className="pt-3 border-t border-slate-100 bg-slate-50/70 p-3 sm:p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* 1. Clearance Sale-Discounting Actions */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                  <Tag size={15} className="text-[#007A33]" />
                                  <span>Storefront Sale-Discounting (Clearance):</span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  {([20, 35, 50] as const).map((pct) => {
                                    const isCurrent = item.discountPercent === pct;
                                    const previewPrice = (item.unitPriceGhs * (1 - pct / 100)).toFixed(2);

                                    return (
                                      <button
                                        key={pct}
                                        type="button"
                                        onClick={() => handleApplyDiscount(item.id, pct)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                                          isCurrent
                                            ? 'bg-[#007A33] text-white ring-2 ring-emerald-300'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-[#007A33]'
                                        }`}
                                      >
                                        <span>{pct}% Off</span>
                                        <span className="font-mono text-[10px] opacity-80">(GHS {previewPrice})</span>
                                      </button>
                                    );
                                  })}

                                  {hasDiscount && (
                                    <button
                                      type="button"
                                      onClick={() => handleApplyDiscount(item.id, null)}
                                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 bg-white border border-slate-200 hover:border-rose-300 cursor-pointer transition-colors"
                                    >
                                      Reset Regular Price
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* 2. Quarantine & Removal Action */}
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => openQuarantineModal(item)}
                                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <Warning size={14} weight="bold" />
                                  <span>Quarantine Batch & Withdraw</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-10 text-center rounded-2xl bg-white border border-slate-200 space-y-2">
                      <CheckCircle size={28} className="text-emerald-600 mx-auto" />
                      <div className="font-heading font-bold text-slate-800 text-base">
                        No batches match the selected alert filter.
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        All registered pharmaceutical batches in this category satisfy good shelf-life stability standards.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAlertsFilter('all');
                          setAlertsSearch('');
                        }}
                        className="text-xs font-bold text-[#007A33] hover:underline cursor-pointer pt-1 inline-block"
                      >
                        Reset filters to view all watch items
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* MODULE 4: CLINICAL PRESCRIPTIONS AUDIT */}
          {/* ========================================================== */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                    Clinical Prescription Audit & Dockets
                  </h2>
                  <p className="text-xs text-slate-500">
                    Legally required validation of doctor prescriptions prior to dispensing maintenance POM medicines.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5">
                  {(['all', 'pending-review', 'approved', 'flagged-query'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setRxFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                        rxFilterStatus === st
                          ? 'bg-[#007A33] text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {st === 'all' && 'All Dockets'}
                      {st === 'pending-review' && 'Pending Review'}
                      {st === 'approved' && 'Approved'}
                      {st === 'flagged-query' && 'Flagged Query'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dockets Cards List */}
              <div className="space-y-4">
                {filteredRx.map((docket) => {
                  const isApproved = docket.status === 'approved';
                  const isPending = docket.status === 'pending-review';
                  const isFlagged = docket.status === 'flagged-query';

                  return (
                    <div
                      key={docket.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-slate-900">{docket.id}</span>
                          {docket.orderId && (
                            <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              Order #{docket.orderId}
                            </span>
                          )}
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{docket.submittedAt}</span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isPending
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isApproved && 'Approved for Dispense'}
                          {isPending && 'Pending Pharmacist Review'}
                          {isFlagged && 'Clinical Query Raised'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Patient Identification
                          </span>
                          <div className="font-bold text-slate-900 text-sm">{docket.patientName}</div>
                          <div className="text-slate-500">{docket.patientPhone}</div>
                          {docket.patientNhis && (
                            <div className="font-mono text-[11px] text-emerald-800 font-medium">
                              NHIS Card: {docket.patientNhis}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Prescribing Clinician & Hospital
                          </span>
                          <div className="font-semibold text-slate-800">{docket.prescribingDoctor}</div>
                          <div className="text-slate-500">{docket.clinicFacility}</div>
                          <div className="text-[11px] text-slate-600 italic">"{docket.diagnosisNote}"</div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Formulations & Dosage Regimen
                        </span>
                        <div className="space-y-1">
                          {docket.prescribedMedications.map((med, idx) => (
                            <div key={idx} className="flex items-center gap-2 font-medium text-slate-800">
                              <Pill size={14} className="text-[#007A33]" />
                              <span>{med}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pharmacist Note / Action Row */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-slate-600 max-w-md">
                          {docket.pharmacistComments ? (
                            <span className="italic">"{docket.pharmacistComments}"</span>
                          ) : (
                            <span className="text-slate-400">Awaiting superintendent inspection notes...</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!isApproved && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleFlagPrescription(docket.id)}
                                className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                              >
                                Flag Query
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApprovePrescription(docket.id)}
                                className="px-4 py-1.5 rounded-xl bg-[#007A33] hover:bg-[#005A25] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                              >
                                <Check size={14} weight="bold" />
                                <span>Approve for Dispensing</span>
                              </button>
                            </>
                          )}
                          {isApproved && (
                            <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle size={16} weight="fill" className="text-[#007A33]" />
                              <span>Approved by {docket.reviewedBy || currentStaff.name}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* MODULE 5: PHARMACY PERFORMANCE ANALYTICS (RECHARTS) */}
          {/* ========================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Operational Header & Time Range Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                      Dispensary Operations & Revenue Telemetry
                    </h2>
                    <span className="text-[11px] font-bold bg-emerald-100 text-[#007A33] px-2 py-0.5 rounded-full border border-emerald-200">
                      Live Telemetry (UTC+0)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time operational intelligence across Abelemkpe formulary revenue, therapeutic category share, and clinical rush hours.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Time Range Switcher */}
                  <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs font-semibold">
                    {(
                      [
                        { id: '30d', label: '30 Days' },
                        { id: '90d', label: '90 Days' },
                        { id: '12m', label: '12 Months' },
                        { id: 'all-time', label: 'All-Time' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setAnalyticsRange(tab.id);
                          showNotice(`Analytics timeframe filtered to: ${tab.label}`);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          analyticsRange === tab.id
                            ? 'bg-[#007A33] text-white shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showNotice('Executive Dispensary Telemetry report exported. PDF archived for Superintendent audit.');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Export size={14} />
                    <span>Export Telemetry</span>
                  </button>
                </div>
              </div>

              {/* 4 Enhanced KPI Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* 1. Gross Revenue */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Gross Dispensary Revenue
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +{rangeMetrics.revenueGrowthPercent}% YoY
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-emerald-800 tabular-nums">
                    GHS {rangeMetrics.totalRevenueGhs.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {rangeMetrics.totalOrdersCount.toLocaleString()} verified prescription orders
                  </div>
                </div>

                {/* 2. Average Prescription Basket */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Avg Prescription Basket
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      POM + OTC
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-slate-900 tabular-nums">
                    GHS {rangeMetrics.avgBasketGhs.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Average transaction value per patient consult
                  </div>
                </div>

                {/* 3. Cold-Chain Volume Share */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cold-Chain Volume Share
                    </span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
                      <Thermometer size={12} />
                      2°C–8°C
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-sky-700 tabular-nums">
                    {rangeMetrics.coldChainSharePercent}%
                  </div>
                  <div className="text-[11px] text-sky-600 font-medium">
                    100% Validated (0 thermal excursions)
                  </div>
                </div>

                {/* 4. Refill Retention & Turnaround */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Refill Retention & SLA
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      &lt;1hr SLA
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-black text-slate-900 tabular-nums">
                    {rangeMetrics.refillRetentionRatePercent}%
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Average dispense turnaround: <strong className="text-slate-800">{rangeMetrics.avgDispenseMins} mins</strong>
                  </div>
                </div>
              </div>

              {/* CHART 1: MONTHLY REVENUE & ORDER TRAJECTORY (AREA CHART) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <ChartLineUp size={18} className="text-[#007A33]" />
                      <span>Formulary Revenue & Dispensing Volume Trajectory</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dual-axis trajectory tracking gross dispensary billings (GHS) against total patient fulfillment volume.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-[#007A33]">
                      <span className="w-3 h-3 rounded-sm bg-[#007A33]" />
                      <span>Revenue (GHS)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sky-600">
                      <span className="w-3 h-3 rounded-sm bg-sky-500" />
                      <span>Fulfillment Orders</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-80 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueChartData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#007A33" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#007A33" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284C7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0284C7" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="#94A3B8"
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#007A33"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `GHS ${(val / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#0284C7"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `${val}`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const rev = payload[0]?.value as number;
                            const ord = payload[1]?.value as number;
                            return (
                              <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                                <div className="font-bold text-slate-300 pb-1 border-b border-slate-700 text-[11px]">
                                  {label}
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-emerald-400 font-semibold">Gross Revenue:</span>
                                  <span className="font-mono font-bold">GHS {rev?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-sky-300 font-semibold">Orders:</span>
                                  <span className="font-mono font-bold">{ord} orders</span>
                                </div>
                                {rev && ord ? (
                                  <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                                    <span>Avg Basket:</span>
                                    <span className="font-mono">GHS {(rev / ord).toFixed(2)}</span>
                                  </div>
                                ) : null}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenueGhs"
                        name="Gross Revenue (GHS)"
                        stroke="#007A33"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#revenueGrad)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="ordersCount"
                        name="Fulfillment Orders"
                        stroke="#0284C7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#ordersGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2-COLUMN SECTION: CATEGORY DISTRIBUTION & 24-HOUR PEAK TIMES */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Column A: Top-Selling Therapeutic Categories (Donut & Ranked List) */}
                <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                          Top Therapeutic Categories
                        </h3>
                        <p className="text-xs text-slate-500">
                          Formulary distribution by GHS billings & volume.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        6 Categories
                      </span>
                    </div>

                    {/* Donut Chart */}
                    <div className="w-full h-52 flex items-center justify-center relative my-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={TOP_CATEGORIES_DATA}
                            dataKey="sharePercent"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                          >
                            {TOP_CATEGORIES_DATA.map((entry) => (
                              <Cell key={entry.id} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload as any;
                                return (
                                  <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs space-y-0.5 border border-slate-700">
                                    <div className="font-bold text-slate-200">{data.name}</div>
                                    <div className="text-[11px] text-slate-400">Leader: {data.brandLeader}</div>
                                    <div className="font-mono text-emerald-400 font-bold pt-1">
                                      GHS {data.revenueGhs.toLocaleString()} ({data.sharePercent}%)
                                    </div>
                                    <div className="text-[10px] text-slate-400">{data.unitsSold} units dispensed</div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Donut Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Share</span>
                        <span className="font-heading font-black text-sm text-slate-900">Cantab 33%</span>
                      </div>
                    </div>
                  </div>

                  {/* Ranked Breakdown List */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                    {TOP_CATEGORIES_DATA.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                            <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
                            <span className="text-[10px] text-slate-400 truncate hidden sm:inline">({cat.brandLeader})</span>
                          </div>
                          <div className="font-mono text-slate-900 font-bold tabular-nums shrink-0">
                            GHS {cat.revenueGhs.toLocaleString()} <span className="text-slate-400 text-[10px]">({cat.sharePercent}%)</span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.sharePercent}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column B: 24-Hour Peak Order Times (Recharts BarChart) */}
                <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                          <Clock size={18} className="text-[#007A33]" />
                          <span>24-Hour Peak Order Times & Clinical Rush Hours</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Hourly prescription submission curve to guide dispensary technician rota and Accra courier rider standby.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-amber-700">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]" />
                          <span>Morning Consult Rush (09-11h)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#007A33]">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[#007A33]" />
                          <span>Evening Courier Rush (16-18h)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="w-full h-64 pt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={HOURLY_ORDER_DISTRIBUTION}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis
                            dataKey="hour"
                            stroke="#94A3B8"
                            fontSize={10}
                            interval={1}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="#64748B"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${val}`}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload as any;
                                return (
                                  <div className="p-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
                                    <div className="font-bold text-slate-200 text-sm">{data.hour} Window</div>
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-slate-400">Order Volume:</span>
                                      <span className="font-mono font-bold text-emerald-400">{data.orders} Orders</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-[11px]">
                                      <span className="text-slate-400">Staff Shift:</span>
                                      <span className="font-semibold">{data.shift} Shift</span>
                                    </div>
                                    {data.isRushHour && (
                                      <div className="pt-1 mt-1 border-t border-slate-700 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                                        <span>★ {data.rushLabel}</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                            {HOURLY_ORDER_DISTRIBUTION.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.hourNumber >= 9 && entry.hourNumber <= 11
                                    ? '#D97706' // Morning Rush: Amber
                                    : entry.hourNumber >= 16 && entry.hourNumber <= 18
                                    ? '#007A33' // Evening Rush: Forest Green
                                    : '#94A3B8' // Regular: Slate
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Staffing Guidance Operational Callouts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Morning Rush Peak (09:00 – 11:30)</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Outpatient doctor consultations peak at <strong>10:00 AM (54 orders)</strong>. Recommended rota: Maintain 2 validating pharmacists at Abelemkpe clean bench.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                      <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#007A33]" />
                        <span>Evening Dispatch Peak (16:00 – 18:30)</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Accra transit courier load peaks at <strong>17:00 PM (64 orders)</strong>. Recommended rota: Have 3 Accra Express dispatch riders on standby with cooler packs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLINICAL TELEMETRY BENCHMARKS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cold Storage Monitoring
                  </span>
                  <div className="font-heading font-black text-lg text-sky-700">
                    2.8°C Continuous Mean
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Insulated medical cooler boxes checked before every dispatch handover.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Bioequivalent Switch & Save
                  </span>
                  <div className="font-heading font-black text-lg text-emerald-800">
                    38.5% Patient Opt-In
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Patients saved an estimated <strong>GHS 48,200</strong> choosing verified bioequivalents.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Accra Dispatch Velocity
                  </span>
                  <div className="font-heading font-black text-lg text-slate-900">
                    28 Mins Fastest Transit
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Abelemkpe to Airport Residential / Dzorwulu corridor express delivery.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* MODULE 6: REAL-TIME COLD-CHAIN TELEMETRY MONITOR */}
          {/* ========================================================== */}
          {activeTab === 'cold-chain' && (
            <ColdChainMonitorView
              currentStaff={currentStaff}
              coldBatches={coldBatches}
              setColdBatches={setColdBatches}
              storageUnits={storageUnits}
              setStorageUnits={setStorageUnits}
              inventory={inventory}
              setInventory={setInventory}
              showNotice={showNotice}
            />
          )}
        </div>
      </main>

      {/* ========================================================== */}
      {/* MODAL: QUARANTINE & DISPOSAL AUDIT LOGGING */}
      {/* ========================================================== */}
      {quarantineModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Warning size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-rose-950">
                    Quarantine Batch & Withdraw from Shop
                  </h3>
                  <p className="text-xs text-rose-800">
                    Clinical isolation under Ghana FDA GDP & Pharmacy Council standards.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuarantineModalItem(null)}
                className="text-rose-500 hover:text-rose-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Target Medication Details */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-sm text-slate-900">{quarantineModalItem.name}</div>
                <div className="flex flex-wrap items-center gap-3 text-slate-600 font-mono text-[11px]">
                  <span>Batch: <strong>{quarantineModalItem.batchNumber}</strong></span>
                  <span>·</span>
                  <span>Expiry: <strong>{quarantineModalItem.expiryDate}</strong></span>
                  <span>·</span>
                  <span>Stock: <strong>{quarantineModalItem.stockCount} Units</strong></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {quarantineModalItem.packSize} · {quarantineModalItem.category}
                </div>
              </div>

              {/* Disposal Reason Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Mandatory Clinical Disposal Reason:
                </label>
                <select
                  value={quarantineReason}
                  onChange={(e) => setQuarantineReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500 font-medium cursor-pointer"
                >
                  <option value="Imminent Shelf-Life Expiry (≤30 Days)">
                    Imminent Shelf-Life Expiry (≤30 Days)
                  </option>
                  <option value="Suspected Cold-Chain Thermal Excursion">
                    Suspected Cold-Chain Thermal Excursion
                  </option>
                  <option value="Packaging Compromise / Seal Failure">
                    Packaging Compromise / Seal Failure
                  </option>
                  <option value="Ghana FDA Regulatory Batch Hold">
                    Ghana FDA Regulatory Batch Hold
                  </option>
                  <option value="Manufacturer Precautionary Recall">
                    Manufacturer Precautionary Recall
                  </option>
                  <option value="Clinical Quality Audit Isolation">
                    Clinical Quality Audit Isolation
                  </option>
                </select>
              </div>

              {/* Unit Count to Quarantine */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Units to Withdraw:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={quarantineModalItem.stockCount}
                    value={quarantineUnits}
                    onChange={(e) => setQuarantineUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-rose-500 font-mono font-bold"
                  />
                  <div className="text-[10px] text-slate-400">
                    Max: {quarantineModalItem.stockCount} units
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Financial Exposure:
                  </label>
                  <div className="px-3 py-2 bg-slate-100 rounded-xl font-mono font-bold text-slate-800 text-xs">
                    GHS {(quarantineUnits * quarantineModalItem.unitPriceGhs).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    At standard retail unit price
                  </div>
                </div>
              </div>

              {/* Clinical Commentary Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Pharmacist Clinical Justification / Log Commentary:
                </label>
                <textarea
                  rows={2}
                  value={quarantineNotes}
                  onChange={(e) => setQuarantineNotes(e.target.value)}
                  placeholder="e.g., Temperature excursion logged on fridge 2; batch held pending high-performance liquid chromatography assay..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Authorizing Staff Attestation */}
              <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#007A33]" />
                  <span>
                    Authorizing Signature: <strong className="text-slate-900">{currentStaff.name}</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {currentStaff.registrationNumber || currentStaff.roleTitle}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setQuarantineModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmQuarantine}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Warning size={14} weight="bold" />
                <span>Confirm Quarantine & Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
