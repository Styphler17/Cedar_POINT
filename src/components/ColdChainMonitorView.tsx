import React, { useState, useEffect, useMemo } from 'react';
import {
  Thermometer,
  Snowflake,
  Warning,
  ShieldWarning,
  ShieldCheck,
  CheckCircle,
  Package,
  ArrowClockwise,
  Broadcast,
  WifiHigh,
  BatteryCharging,
  Plus,
  Minus,
  X,
  FileText,
  Clock,
  User,
  MagnifyingGlass,
  Check,
  TrendUp,
  Truck,
  Buildings,
  Info,
} from '@phosphor-icons/react';
import {
  ColdStorageUnit,
  ColdChainBatchItem,
  ColdChainAuditEntry,
  loadColdStorageUnits,
  saveColdStorageUnits,
  loadColdBatches,
  saveColdBatches,
  loadColdAuditLogs,
  saveColdAuditLogs,
} from '../data/coldChainData';
import { AdminStaffUser, InventoryItem, saveInventory } from '../data/backendAdminData';

interface ColdChainMonitorViewProps {
  currentStaff: AdminStaffUser;
  coldBatches: ColdChainBatchItem[];
  setColdBatches: React.Dispatch<React.SetStateAction<ColdChainBatchItem[]>>;
  storageUnits: ColdStorageUnit[];
  setStorageUnits: React.Dispatch<React.SetStateAction<ColdStorageUnit[]>>;
  onUpdateInventoryStock?: (inventoryItemId: string, newStock: number) => void;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  showNotice: (msg: string) => void;
}

export const ColdChainMonitorView: React.FC<ColdChainMonitorViewProps> = ({
  currentStaff,
  coldBatches,
  setColdBatches,
  storageUnits,
  setStorageUnits,
  inventory,
  setInventory,
  showNotice,
}) => {
  const [auditLogs, setAuditLogs] = useState<ColdChainAuditEntry[]>(loadColdAuditLogs);

  // Live IoT Telemetry Simulator
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState(true);
  const [telemetryPulseCount, setTelemetryPulseCount] = useState(0);

  // Filters & Tabs
  const [activeSubView, setActiveSubView] = useState<'monitor' | 'audit-log'>('monitor');
  const [batchFilter, setBatchFilter] = useState<'all' | 'temp-check' | 'replenish' | 'optimal'>('all');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [batchSearchQuery, setBatchSearchQuery] = useState('');

  // Modals
  const [tempCheckBatch, setTempCheckBatch] = useState<ColdChainBatchItem | null>(null);
  const [replenishBatch, setReplenishBatch] = useState<ColdChainBatchItem | null>(null);
  const [historyBatch, setHistoryBatch] = useState<ColdChainBatchItem | null>(null);

  // Form states for Temperature Check Modal
  const [checkVerifiedTemp, setCheckVerifiedTemp] = useState<number>(3.8);
  const [checkCapaAction, setCheckCapaAction] = useState<string>('Resealed chamber door gasket and verified compressor latch');
  const [checkNotes, setCheckNotes] = useState<string>('');

  // Form states for Replenish Modal
  const [replenishUnitsToAdd, setReplenishUnitsToAdd] = useState<number>(30);
  const [replenishSupplier, setReplenishSupplier] = useState<string>('Cedar Point Formulations Cold Depot (Accra)');
  const [replenishTransportMethod, setReplenishTransportMethod] = useState<string>('Pre-Conditioned PCM Shipper (2°C – 8°C Validated)');

  // Simulated Real-Time Sensor Heartbeat
  useEffect(() => {
    if (!isLiveTelemetryActive) return;

    const interval = setInterval(() => {
      setTelemetryPulseCount((prev) => prev + 1);

      // Micro-jitter simulation for live probes (±0.05°C to 0.1°C)
      setStorageUnits((prevUnits) => {
        const nextUnits = prevUnits.map((u) => {
          // If unit is in excursion, leave elevated until checked
          if (u.status === 'excursion') {
            const jitter = (Math.random() - 0.48) * 0.1;
            const newT = Number((u.currentTemp + jitter).toFixed(1));
            return { ...u, currentTemp: newT, lastSync: 'Just now' };
          }
          // Normal unit fluctuations around target
          const drift = (Math.random() - 0.5) * 0.08;
          let newTemp = Number((u.currentTemp + drift).toFixed(1));
          // keep within safe bounds unless triggered
          if (u.type === 'freezer') {
            newTemp = Math.max(-21.0, Math.min(-17.5, newTemp));
          } else {
            newTemp = Math.max(3.0, Math.min(5.2, newTemp));
          }
          return {
            ...u,
            currentTemp: newTemp,
            lastSync: 'Just now',
          };
        });

        // Synchronize batch temperatures with their parent unit
        setColdBatches((prevBatches) => {
          const unitMap = new Map<string, ColdStorageUnit>();
          nextUnits.forEach((u) => unitMap.set(u.id, u));

          return prevBatches.map((b) => {
            const parentUnit = unitMap.get(b.storageUnitId);
            if (!parentUnit) return b;

            const latestTemp = parentUnit.currentTemp;
            const isExcursion = latestTemp > b.targetMaxTemp || latestTemp < b.targetMinTemp;

            return {
              ...b,
              currentTemp: latestTemp,
              tempStatus: isExcursion ? ('excursion' as const) : ('optimal' as const),
              requiresImmediateTempCheck: isExcursion || b.requiresImmediateTempCheck,
            };
          });
        });

        return nextUnits;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveTelemetryActive, setStorageUnits, setColdBatches]);

  // Key KPI Aggregations
  const totalBatches = coldBatches.length;
  const tempCheckNeededBatches = useMemo(
    () => coldBatches.filter((b) => b.requiresImmediateTempCheck),
    [coldBatches]
  );
  const replenishNeededBatches = useMemo(
    () => coldBatches.filter((b) => b.requiresImmediateReplenishment),
    [coldBatches]
  );
  const totalAlertBatchesCount = useMemo(() => {
    return coldBatches.filter((b) => b.requiresImmediateTempCheck || b.requiresImmediateReplenishment).length;
  }, [coldBatches]);

  const excursionUnits = useMemo(
    () => storageUnits.filter((u) => u.status === 'excursion'),
    [storageUnits]
  );

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return coldBatches.filter((batch) => {
      // Filter by alert category
      if (batchFilter === 'temp-check' && !batch.requiresImmediateTempCheck) return false;
      if (batchFilter === 'replenish' && !batch.requiresImmediateReplenishment) return false;
      if (batchFilter === 'optimal' && (batch.requiresImmediateTempCheck || batch.requiresImmediateReplenishment)) return false;

      // Filter by storage unit
      if (selectedUnitFilter !== 'all' && batch.storageUnitId !== selectedUnitFilter) return false;

      // Filter by search query
      if (batchSearchQuery.trim()) {
        const q = batchSearchQuery.toLowerCase().trim();
        const match =
          batch.medicationName.toLowerCase().includes(q) ||
          batch.batchNumber.toLowerCase().includes(q) ||
          batch.category.toLowerCase().includes(q) ||
          batch.storageUnitName.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [coldBatches, batchFilter, selectedUnitFilter, batchSearchQuery]);

  // Action: Force Sensor Ping
  const handlePingSensors = () => {
    const updated = storageUnits.map((u) => ({
      ...u,
      lastSync: 'Just now (Forced Poll)',
    }));
    setStorageUnits(updated);
    saveColdStorageUnits(updated);
    showNotice('All 4 wireless IoT cold-chain telemetry probes pinged and refreshed');
  };

  // Action: Simulate Excursion (for training & regulatory demo)
  const handleSimulateExcursion = () => {
    const updatedUnits = storageUnits.map((u) => {
      if (u.id === 'unit-cv03') {
        return {
          ...u,
          currentTemp: 9.1,
          status: 'excursion' as const,
          alarmActive: true,
          lastSync: 'Just now (Excursion Event)',
          notes: 'SIMULATED EXCURSION: Chamber door seal failure test in progress.',
        };
      }
      return u;
    });
    setStorageUnits(updatedUnits);
    saveColdStorageUnits(updatedUnits);

    const updatedBatches = coldBatches.map((b) => {
      if (b.storageUnitId === 'unit-cv03') {
        return {
          ...b,
          currentTemp: 9.1,
          tempStatus: 'excursion' as const,
          requiresImmediateTempCheck: true,
          tempCheckReason: 'Chamber temperature breached 9.1°C! Immediate physical check and cold recovery protocol triggered.',
        };
      }
      return b;
    });
    setColdBatches(updatedBatches);
    saveColdBatches(updatedBatches);

    showNotice('Simulated thermal excursion triggered on Pre-Chill Cold Vault #CV-03 (9.1°C)');
  };

  // Action: Calibrate & Reset All Units to Nominal
  const handleResetToNominal = () => {
    const resetUnits: ColdStorageUnit[] = storageUnits.map((u) => ({
      ...u,
      currentTemp: u.targetTemp,
      status: 'optimal' as const,
      alarmActive: false,
      lastSync: 'Just now (Calibrated)',
      notes: undefined,
    }));
    setStorageUnits(resetUnits);
    saveColdStorageUnits(resetUnits);

    const resetBatches = coldBatches.map((b) => ({
      ...b,
      currentTemp: b.storageUnitId === 'unit-fz02' ? -18.5 : 4.0,
      tempStatus: 'optimal' as const,
      requiresImmediateTempCheck: false,
      tempCheckReason: undefined,
    }));
    setColdBatches(resetBatches);
    saveColdBatches(resetBatches);

    showNotice('All cold-chain probes calibrated and normalized to baseline target temperature');
  };

  // Open Temperature Check Modal
  const handleOpenTempCheckModal = (batch: ColdChainBatchItem) => {
    setTempCheckBatch(batch);
    setCheckVerifiedTemp(batch.targetMinTemp + 1.8);
    setCheckNotes('');
  };

  // Submit Temperature Check
  const handleSubmitTempCheck = () => {
    if (!tempCheckBatch) return;

    const nominalTemp = Number(checkVerifiedTemp) || 3.9;

    // 1. Update the Batch
    const updatedBatches = coldBatches.map((b) => {
      if (b.id === tempCheckBatch.id) {
        return {
          ...b,
          currentTemp: nominalTemp,
          tempStatus: 'optimal' as const,
          requiresImmediateTempCheck: false,
          tempCheckReason: undefined,
          lastTempCheckAt: 'Just now',
          lastCheckedBy: currentStaff.name,
          tempHistory: [
            ...b.tempHistory.slice(1),
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), temp: nominalTemp },
          ],
        };
      }
      return b;
    });
    setColdBatches(updatedBatches);
    saveColdBatches(updatedBatches);

    // 2. Normalize parent unit if all batches in unit are resolved
    const updatedUnits = storageUnits.map((u) => {
      if (u.id === tempCheckBatch.storageUnitId) {
        return {
          ...u,
          currentTemp: nominalTemp,
          status: 'optimal' as const,
          alarmActive: false,
          lastSync: 'Just now (Physical Check Logged)',
          notes: `Verified by ${currentStaff.name}. Chamber sealed.`,
        };
      }
      return u;
    });
    setStorageUnits(updatedUnits);
    saveColdStorageUnits(updatedUnits);

    // 3. Create GDP Audit Log Entry
    const newAudit: ColdChainAuditEntry = {
      id: `CC-AUD-${Date.now().toString().slice(-4)}`,
      timestamp: 'Today · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      batchNumber: tempCheckBatch.batchNumber,
      medicationName: tempCheckBatch.medicationName,
      storageUnitName: tempCheckBatch.storageUnitName,
      actionType: 'temp-check',
      observedTemp: nominalTemp,
      capaActionTaken: `${checkCapaAction}. ${checkNotes ? `Notes: ${checkNotes}` : ''}`.trim(),
      authorizedStaffName: currentStaff.name,
      authorizedStaffRole: currentStaff.roleTitle,
      registrationNumber: currentStaff.registrationNumber,
      gdpComplianceStatus: 'compliant',
    };
    const updatedAudit = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveColdAuditLogs(updatedAudit);

    showNotice(`Temperature check logged for ${tempCheckBatch.batchNumber} (${nominalTemp}°C). Batch cleared!`);
    setTempCheckBatch(null);
  };

  // Open Replenishment Modal
  const handleOpenReplenishModal = (batch: ColdChainBatchItem) => {
    setReplenishBatch(batch);
    const deficit = Math.max(25, batch.reorderLevel * 2 - batch.stockCount);
    setReplenishUnitsToAdd(deficit);
  };

  // Submit Replenishment PO
  const handleSubmitReplenish = () => {
    if (!replenishBatch) return;

    const unitsAdded = Number(replenishUnitsToAdd) || 30;
    const newStockCount = replenishBatch.stockCount + unitsAdded;

    // 1. Update Cold-Chain Batch
    const updatedBatches = coldBatches.map((b) => {
      if (b.id === replenishBatch.id) {
        return {
          ...b,
          stockCount: newStockCount,
          replenishmentStatus: 'adequate' as const,
          requiresImmediateReplenishment: false,
          replenishmentReason: undefined,
        };
      }
      return b;
    });
    setColdBatches(updatedBatches);
    saveColdBatches(updatedBatches);

    // 2. Synchronize main inventory in backendAdminData
    setInventory((prev) => {
      const updatedInv = prev.map((item) => {
        if (item.id === replenishBatch.inventoryItemId || item.productId === replenishBatch.productId) {
          return {
            ...item,
            stockCount: item.stockCount + unitsAdded,
            lastStockCheck: 'Just now (Cold-Chain Restock)',
          };
        }
        return item;
      });
      saveInventory(updatedInv);
      return updatedInv;
    });

    // 3. Create GDP Audit Log Entry
    const newAudit: ColdChainAuditEntry = {
      id: `CC-AUD-${Date.now().toString().slice(-4)}`,
      timestamp: 'Today · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      batchNumber: replenishBatch.batchNumber,
      medicationName: replenishBatch.medicationName,
      storageUnitName: replenishBatch.storageUnitName,
      actionType: 'replenish',
      quantityAdded: unitsAdded,
      capaActionTaken: `Replenished +${unitsAdded} units via ${replenishSupplier}. Transport: ${replenishTransportMethod}. Buffer stock restored.`,
      authorizedStaffName: currentStaff.name,
      authorizedStaffRole: currentStaff.roleTitle,
      registrationNumber: currentStaff.registrationNumber,
      gdpComplianceStatus: 'compliant',
    };
    const updatedAudit = [newAudit, ...auditLogs];
    setAuditLogs(updatedAudit);
    saveColdAuditLogs(updatedAudit);

    showNotice(`Replenished +${unitsAdded} units of ${replenishBatch.medicationName}. Total stock: ${newStockCount}`);
    setReplenishBatch(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner & Real-Time Telemetry Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono text-[11px] font-bold flex items-center gap-1.5">
                <Snowflake size={13} className="animate-spin text-sky-400" style={{ animationDuration: '6s' }} />
                <span>Cold-Chain Telemetry System</span>
              </span>

              {/* Real-time Heartbeat indicator */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-medium border border-slate-700">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLiveTelemetryActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                  }`}
                />
                <span className="text-slate-300">
                  {isLiveTelemetryActive ? 'Live IoT Stream Connected' : 'Stream Paused'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">({telemetryPulseCount} ticks)</span>
              </div>

              <span className="text-[11px] text-emerald-400 font-mono hidden md:inline">
                Ghana FDA GDP Certified · WHO PQS E006
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
              Real-Time Cold Storage & Excursion Watch
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Continuous 24/7 digital temperature monitoring across dispensary refrigerators, biologics freezers, and active courier cool-boxes. Proactively flags thermal excursions and depleted batches before patient safety is compromised.
            </p>
          </div>

          {/* Quick Real-Time Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsLiveTelemetryActive(!isLiveTelemetryActive)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isLiveTelemetryActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Pause or resume simulated real-time IoT wireless stream"
            >
              <Broadcast size={15} />
              <span>{isLiveTelemetryActive ? 'Pause IoT Polling' : 'Resume Live Polling'}</span>
            </button>

            <button
              type="button"
              onClick={handlePingSensors}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Ping all 4 wireless digital probes immediately"
            >
              <ArrowClockwise size={14} />
              <span className="hidden sm:inline">Ping Probes</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateExcursion}
              className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Simulate temperature excursion on Pre-Chill Vault for training & GDP audit testing"
            >
              <Warning size={14} weight="bold" />
              <span>Simulate Excursion</span>
            </button>

            <button
              type="button"
              onClick={handleResetToNominal}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Normalize all temperature sensors to nominal baseline"
            >
              <span>Calibrate Baseline</span>
            </button>
          </div>
        </div>

        {/* Real-Time Telemetry KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Cold Batches Tracked
            </div>
            <div className="font-heading font-black text-xl text-white mt-1 tabular-nums">
              {totalBatches} <span className="text-xs font-normal text-slate-400">Batches</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Across 4 storage chambers
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all ${
              tempCheckNeededBatches.length > 0
                ? 'bg-rose-950/40 border-rose-700/80 text-rose-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider flex items-center justify-between">
              <span>Immediate Temp Check</span>
              {tempCheckNeededBatches.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div
              className={`font-heading font-black text-xl mt-1 tabular-nums ${
                tempCheckNeededBatches.length > 0 ? 'text-rose-400' : 'text-white'
              }`}
            >
              {tempCheckNeededBatches.length} <span className="text-xs font-normal">Batches</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {tempCheckNeededBatches.length > 0 ? 'Requires immediate probe check' : 'All probes in safe zone'}
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border transition-all ${
              replenishNeededBatches.length > 0
                ? 'bg-amber-950/40 border-amber-700/80 text-amber-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider flex items-center justify-between">
              <span>Immediate Replenish</span>
              {replenishNeededBatches.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </div>
            <div
              className={`font-heading font-black text-xl mt-1 tabular-nums ${
                replenishNeededBatches.length > 0 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {replenishNeededBatches.length} <span className="text-xs font-normal">Batches</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {replenishNeededBatches.length > 0 ? 'Stock depleted below minimum' : 'Adequate buffer on racks'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Mean Dispensary Temp
            </div>
            <div className="font-heading font-black text-xl text-sky-400 mt-1 tabular-nums">
              3.9°C <span className="text-xs font-normal text-slate-400">(2°C – 8°C Spec)</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
              <CheckCircle size={11} weight="fill" />
              <span>Compliant with GDP Guidelines</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Critical Action Required Alert Callout Banner (if any batches flagged) */}
      {totalAlertBatchesCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm animate-in slide-in-from-top duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Warning size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-amber-950">
                  Cold-Chain Action Required: {totalAlertBatchesCount} Batch{totalAlertBatchesCount > 1 ? 'es' : ''} Flagged
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  {tempCheckNeededBatches.length > 0 && (
                    <span className="font-bold text-rose-700 mr-2">
                      • {tempCheckNeededBatches.length} batch(es) breach thermal safety ceiling (immediate physical check required).
                    </span>
                  )}
                  {replenishNeededBatches.length > 0 && (
                    <span className="text-amber-900">
                      • {replenishNeededBatches.length} batch(es) depleted below critical safety threshold (immediate replenishment required).
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {tempCheckNeededBatches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBatchFilter('temp-check')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Review Temp Excursions ({tempCheckNeededBatches.length})
                </button>
              )}
              {replenishNeededBatches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setBatchFilter('replenish')}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Review Restock Batches ({replenishNeededBatches.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Storage Units Real-Time Telemetry Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-sm text-slate-800 flex items-center gap-2">
            <Buildings size={16} className="text-[#007A33]" />
            <span>Monitored Storage Chambers & Active Fleet Coolers</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">4 Active IoT Probes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {storageUnits.map((unit) => {
            const isExcursion = unit.status === 'excursion';
            const isFreezer = unit.type === 'freezer';

            return (
              <div
                key={unit.id}
                className={`p-4 rounded-2xl bg-white border transition-all shadow-xs relative ${
                  isExcursion
                    ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 block">
                      {unit.code} · {unit.probeId}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-0.5 line-clamp-1" title={unit.name}>
                      {unit.name}
                    </h4>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{unit.zone}</div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0 ${
                      isExcursion
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isExcursion ? 'EXCURSION' : 'NORMAL'}
                  </span>
                </div>

                {/* Main Temperature Display */}
                <div className="my-3 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`font-heading font-black text-2xl tracking-tight tabular-nums ${
                        isExcursion
                          ? 'text-rose-600'
                          : isFreezer
                          ? 'text-indigo-600'
                          : 'text-[#007A33]'
                      }`}
                    >
                      {unit.currentTemp.toFixed(1)}°C
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (Target: {unit.targetTemp}°C)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Range: {unit.minAllowedTemp}° to {unit.maxAllowedTemp}°C
                    </span>
                  </div>
                </div>

                {/* Temperature Range Mini Indicator Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isExcursion
                        ? 'bg-rose-500'
                        : isFreezer
                        ? 'bg-indigo-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: isFreezer
                        ? `${Math.max(10, Math.min(100, ((unit.currentTemp - (-25)) / (10)) * 100))}%`
                        : `${Math.max(10, Math.min(100, ((unit.currentTemp - 2) / 6) * 100))}%`,
                    }}
                  />
                </div>

                {/* Telemetry metadata footer */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div className="flex items-center gap-1">
                    <WifiHigh size={12} className="text-slate-400" />
                    <span>{unit.currentHumidity}% RH</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BatteryCharging size={12} className="text-emerald-600" />
                    <span>{unit.batteryLevel}%</span>
                  </div>
                  <div className="text-slate-400">{unit.lastSync}</div>
                </div>

                {unit.notes && (
                  <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200 leading-tight">
                    {unit.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Sub-Navigation (Monitor View vs GDP Compliance Audit Log) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveSubView('monitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'monitor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monitored Batches ({coldBatches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('audit-log')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'audit-log'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cold-Chain GDP Audit Log ({auditLogs.length})
          </button>
        </div>

        {activeSubView === 'monitor' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by flag */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBatchFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  batchFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All ({coldBatches.length})
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('temp-check')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  batchFilter === 'temp-check'
                    ? 'bg-rose-600 text-white'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <span>Requires Temp Check</span>
                {tempCheckNeededBatches.length > 0 && (
                  <span className="font-mono text-[10px] bg-white text-rose-700 px-1 rounded-full font-bold">
                    {tempCheckNeededBatches.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('replenish')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  batchFilter === 'replenish'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <span>Requires Replenishment</span>
                {replenishNeededBatches.length > 0 && (
                  <span className="font-mono text-[10px] bg-white text-amber-700 px-1 rounded-full font-bold">
                    {replenishNeededBatches.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('optimal')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  batchFilter === 'optimal'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                Optimal
              </button>
            </div>

            {/* Filter by storage unit dropdown */}
            <select
              value={selectedUnitFilter}
              onChange={(e) => setSelectedUnitFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 focus:outline-hidden focus:border-[#007A33] cursor-pointer"
            >
              <option value="all">All Storage Chambers</option>
              {storageUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code}: {u.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 5. Monitored Batches Tab */}
      {activeSubView === 'monitor' && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={batchSearchQuery}
              onChange={(e) => setBatchSearchQuery(e.target.value)}
              placeholder="Filter by medicine, batch code, or chamber..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007A33]"
            />
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Batches List Cards */}
          <div className="space-y-3">
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => {
                const isTempAlert = batch.requiresImmediateTempCheck;
                const isReplenishAlert = batch.requiresImmediateReplenishment;
                const isCriticalStock = batch.stockCount <= 10;

                return (
                  <div
                    key={batch.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all shadow-xs ${
                      isTempAlert
                        ? 'border-rose-300 ring-2 ring-rose-500/20'
                        : isReplenishAlert
                        ? 'border-amber-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Medication details & Chamber */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {batch.batchNumber}
                          </span>

                          <span className="text-[11px] font-semibold text-slate-500">
                            {batch.category}
                          </span>

                          {/* Location Badge */}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                            {batch.storageUnitName}
                          </span>

                          {/* Critical Flags */}
                          {isTempAlert && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse flex items-center gap-1">
                              <Warning size={12} weight="bold" />
                              <span>CRITICAL: Immediate Temp Check Required</span>
                            </span>
                          )}

                          {isReplenishAlert && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1">
                              <Package size={12} weight="bold" />
                              <span>URGENT: Immediate Replenishment Required</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-base text-slate-900 truncate">
                          {batch.medicationName}
                        </h4>

                        <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                          <span>{batch.dosage}</span>
                          <span>•</span>
                          <span>{batch.packSize}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-700">GHS {batch.unitPriceGhs.toFixed(2)}/unit</span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-400">
                            Last checked: {batch.lastTempCheckAt} {batch.lastCheckedBy && `by ${batch.lastCheckedBy}`}
                          </span>
                        </div>

                        {/* Callout Rationale for Alert */}
                        {isTempAlert && batch.tempCheckReason && (
                          <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                            <Warning size={16} className="text-rose-600 shrink-0 mt-0.5" weight="fill" />
                            <div>
                              <strong>Excursion Breach: </strong> {batch.tempCheckReason}
                            </div>
                          </div>
                        )}

                        {isReplenishAlert && batch.replenishmentReason && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                            <Package size={16} className="text-amber-600 shrink-0 mt-0.5" weight="fill" />
                            <div>
                              <strong>Stock Depletion Alert: </strong> {batch.replenishmentReason}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Live Telemetry Gauges & Direct Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Live Temp Badge */}
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Live Probe Temp
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span
                              className={`font-heading font-black text-xl tabular-nums ${
                                isTempAlert
                                  ? 'text-rose-600'
                                  : batch.storageUnitId === 'unit-fz02'
                                  ? 'text-indigo-600'
                                  : 'text-[#007A33]'
                              }`}
                            >
                              {batch.currentTemp.toFixed(1)}°C
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (Target: {batch.targetMinTemp}° to {batch.targetMaxTemp}°C)
                            </span>
                          </div>
                          <span
                            className={`inline-block font-mono text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              isTempAlert
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isTempAlert ? 'EXCURSION SPIKE' : 'WITHIN SPEC'}
                          </span>
                        </div>

                        {/* Stock Level Gauge */}
                        <div className="text-left sm:text-right min-w-[110px]">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Dispensary Stock
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span
                              className={`font-heading font-black text-xl tabular-nums ${
                                isCriticalStock ? 'text-rose-600' : isReplenishAlert ? 'text-amber-600' : 'text-slate-900'
                              }`}
                            >
                              {batch.stockCount}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              / {batch.reorderLevel} min
                            </span>
                          </div>

                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full ${
                                isCriticalStock ? 'bg-rose-500' : isReplenishAlert ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (batch.stockCount / (batch.reorderLevel * 2)) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                          {/* 1. Immediate Temperature Check CTA */}
                          <button
                            type="button"
                            onClick={() => handleOpenTempCheckModal(batch)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                              isTempAlert
                                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="Perform certified physical temperature check and log CAPA resolution"
                          >
                            <Thermometer size={14} weight="bold" />
                            <span>{isTempAlert ? 'Perform Temp Check' : 'Verify Temp'}</span>
                          </button>

                          {/* 2. Immediate Replenishment CTA */}
                          <button
                            type="button"
                            onClick={() => handleOpenReplenishModal(batch)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                              isReplenishAlert
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title="Issue rapid cold-chain replenishment purchase order"
                          >
                            <Package size={14} weight="bold" />
                            <span>{isReplenishAlert ? 'Replenish Batch' : 'Restock Units'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" weight="fill" />
                <h4 className="font-bold text-sm text-slate-800">No Batches Matching Filter</h4>
                <p className="text-xs text-slate-400 mt-1">
                  All cold-chain pharmaceutical batches in this category are operating within GDP standards.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. GDP Compliance Audit Log Tab */}
      {activeSubView === 'audit-log' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Ghana FDA GDP Cold-Chain Verification Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Tamper-evident audit trail of physical temperature audits, excursions, calibrations, and restocks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                GDP Compliant · {auditLogs.length} Records
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Log ID / Time</th>
                  <th className="py-3 px-4">Medication & Batch</th>
                  <th className="py-3 px-4">Storage Unit</th>
                  <th className="py-3 px-4">Action & Verified Metric</th>
                  <th className="py-3 px-4">CAPA Audit Details</th>
                  <th className="py-3 px-4">Authorized Personnel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.id}</div>
                      <div className="text-slate-400 text-[10px]">{log.timestamp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.medicationName}</div>
                      <div className="font-mono text-[10px] text-slate-500">{log.batchNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {log.storageUnitName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.actionType === 'temp-check' && (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Thermometer size={12} />
                          <span>{log.observedTemp?.toFixed(1)}°C Verified</span>
                        </span>
                      )}
                      {log.actionType === 'replenish' && (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Package size={12} />
                          <span>+{log.quantityAdded} Restocked</span>
                        </span>
                      )}
                      {log.actionType === 'excursion-flag' && (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <Warning size={12} />
                          <span>{log.observedTemp?.toFixed(1)}°C Excursion</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600">
                      {log.capaActionTaken}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                      <div className="font-semibold text-slate-900">{log.authorizedStaffName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {log.registrationNumber || log.authorizedStaffRole}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 1: IMMEDIATE TEMPERATURE CHECK & CAPA SIGN-OFF */}
      {/* ========================================================== */}
      {tempCheckBatch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Thermometer size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-rose-950">
                    Perform Immediate Temperature Check
                  </h3>
                  <p className="text-xs text-rose-800">
                    Ghana FDA GDP mandatory physical audit & CAPA sign-off.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTempCheckBatch(null)}
                className="text-rose-500 hover:text-rose-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {tempCheckBatch.batchNumber}
                  </span>
                  <span className="font-bold text-rose-600 font-mono">
                    Spike: {tempCheckBatch.currentTemp.toFixed(1)}°C
                  </span>
                </div>
                <div className="font-bold text-slate-800">{tempCheckBatch.medicationName}</div>
                <div className="text-[11px] text-slate-500">
                  Storage: {tempCheckBatch.storageUnitName} · Allowed: {tempCheckBatch.targetMinTemp}° to {tempCheckBatch.targetMaxTemp}°C
                </div>
              </div>

              {/* Observed Physical Probe Temp */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Observed Physical Secondary Probe Temperature (°C):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={checkVerifiedTemp}
                    onChange={(e) => setCheckVerifiedTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A33] font-mono font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-xs">
                    °C
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Read from calibrated reference mercury/alcohol or NIST digital check thermometer.
                </div>
              </div>

              {/* CAPA Action Taken Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Corrective & Preventive Action (CAPA):
                </label>
                <select
                  value={checkCapaAction}
                  onChange={(e) => setCheckCapaAction(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A33] font-medium cursor-pointer"
                >
                  <option value="Resealed chamber door gasket and verified compressor latch">
                    Resealed chamber door gasket and verified compressor latch
                  </option>
                  <option value="Relocated batch to Backup Refrigerator #R-01 clean racks">
                    Relocated batch to Backup Refrigerator #R-01 clean racks
                  </option>
                  <option value="Renewed frozen phase change PCM cooling packs">
                    Renewed frozen phase change PCM cooling packs
                  </option>
                  <option value="Recalibrated digital telemetry probe against secondary NIST sensor">
                    Recalibrated digital telemetry probe against secondary NIST sensor
                  </option>
                  <option value="Confirmed brief air transient during courier loading; core product stable">
                    Confirmed brief air transient during courier loading; core product stable
                  </option>
                </select>
              </div>

              {/* Pharmacist Clinical Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Clinical Audit Notes & Visual Formulation Integrity Check:
                </label>
                <textarea
                  rows={2}
                  value={checkNotes}
                  onChange={(e) => setCheckNotes(e.target.value)}
                  placeholder="e.g., Checked suspension clarity; zero precipitation or phase separation observed. Core vial temperature stabilized at 3.8°C..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#007A33]"
                />
              </div>

              {/* Staff Sign-off */}
              <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#007A33]" />
                  <span>
                    Auditor Signature: <strong className="text-slate-900">{currentStaff.name}</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {currentStaff.registrationNumber || currentStaff.roleTitle}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTempCheckBatch(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitTempCheck}
                className="px-4 py-2 rounded-xl bg-[#007A33] hover:bg-[#006028] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} weight="bold" />
                <span>Submit Verification & Clear Excursion</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: IMMEDIATE REPLENISHMENT PURCHASE ORDER */}
      {/* ========================================================== */}
      {replenishBatch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-amber-50 border-b border-amber-100 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Package size={20} weight="bold" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-amber-950">
                    Immediate Cold-Chain Batch Replenishment
                  </h3>
                  <p className="text-xs text-amber-800">
                    Rapid restock PO with certified cold transport handover.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplenishBatch(null)}
                className="text-amber-500 hover:text-amber-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {replenishBatch.batchNumber}
                  </span>
                  <span className="font-bold text-amber-700 font-mono">
                    Current: {replenishBatch.stockCount} / {replenishBatch.reorderLevel} min
                  </span>
                </div>
                <div className="font-bold text-slate-800">{replenishBatch.medicationName}</div>
                <div className="text-[11px] text-slate-500">
                  {replenishBatch.dosage} · {replenishBatch.packSize} · Destination: {replenishBatch.storageUnitName}
                </div>
              </div>

              {/* Units to Replenish */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Replenishment Quantity (Units to Add):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplenishUnitsToAdd((prev) => Math.max(10, prev - 10))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer font-bold"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min={5}
                    value={replenishUnitsToAdd}
                    onChange={(e) => setReplenishUnitsToAdd(Number(e.target.value))}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A33] font-mono font-bold text-center"
                  />
                  <button
                    type="button"
                    onClick={() => setReplenishUnitsToAdd((prev) => prev + 10)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer font-bold"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-[10px] text-slate-400">
                  New stock after replenishment: <strong>{replenishBatch.stockCount + replenishUnitsToAdd} units</strong>
                </div>
              </div>

              {/* Cold-Chain Supplier */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Cold-Chain Supplier Source:
                </label>
                <select
                  value={replenishSupplier}
                  onChange={(e) => setReplenishSupplier(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A33] font-medium cursor-pointer"
                >
                  <option value="Cedar Point Formulations Cold Depot (Accra)">
                    Cedar Point Formulations Cold Depot (Accra)
                  </option>
                  <option value="Ernest Chemists Cold-Chain Logistics (Tema)">
                    Ernest Chemists Cold-Chain Logistics (Tema)
                  </option>
                  <option value="Tobinco Pharmaceuticals Cold Storage (Spintex)">
                    Tobinco Pharmaceuticals Cold Storage (Spintex)
                  </option>
                  <option value="Danadams Biologics Division (Ghana)">
                    Danadams Biologics Division (Ghana)
                  </option>
                </select>
              </div>

              {/* Validated Cold Packaging Method */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  Validated Cold Transport Specification:
                </label>
                <select
                  value={replenishTransportMethod}
                  onChange={(e) => setReplenishTransportMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-[#007A33] font-medium cursor-pointer"
                >
                  <option value="Pre-Conditioned PCM Shipper (2°C – 8°C Validated · 48hr Holdover)">
                    Pre-Conditioned PCM Shipper (2°C – 8°C Validated · 48hr Holdover)
                  </option>
                  <option value="Active Refrigerated Sprinter Van with Continuous Probe Logging">
                    Active Refrigerated Sprinter Van with Continuous Probe Logging
                  </option>
                  <option value="Dry Shipper Liquid Nitrogen Vapor (-150°C Biologics Transit)">
                    Dry Shipper Liquid Nitrogen Vapor (-150°C Biologics Transit)
                  </option>
                </select>
              </div>

              {/* Authorizing Personnel */}
              <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center justify-between border border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#007A33]" />
                  <span>
                    Receiving Pharmacist: <strong className="text-slate-900">{currentStaff.name}</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {currentStaff.registrationNumber || currentStaff.roleTitle}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setReplenishBatch(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReplenish}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Package size={14} weight="bold" />
                <span>Receive & Replenish +{replenishUnitsToAdd} Units</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
