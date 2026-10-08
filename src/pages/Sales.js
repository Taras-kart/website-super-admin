import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Sales.css';
import { useAuth } from './AdminAuth';
import OrderDetailPopup from './OrderDetailPopup';
const portalClass = value => String(value || '').split(/\s+/).filter(Boolean).flatMap(name => ({
  "ops-main": ["tsup-operations-ops-main"],
  "ops-heading": ["tsup-operations-ops-heading"],
  "ops-panel": ["tsup-operations-ops-panel"],
  "ops-actions": ["tsup-operations-ops-actions"],
  "ops-row-actions": ["tsup-operations-ops-row-actions"],
  "ops-primary": ["tsup-operations-ops-primary"],
  "ops-metrics": ["tsup-operations-ops-metrics"],
  "ops-quick": ["tsup-operations-ops-quick"],
  "ops-table-wrap": ["tsup-operations-ops-table-wrap"],
  "ops-badge": ["tsup-operations-ops-badge"],
  "ops-toolbar": ["tsup-operations-ops-toolbar"],
  "ops-dates": ["tsup-operations-ops-dates"],
  "ops-pagination": ["tsup-operations-ops-pagination"],
  "ops-alert": ["tsup-operations-ops-alert"],
  "ops-success": ["tsup-operations-ops-success"],
  "ops-empty": ["tsup-operations-ops-empty"],
  "ops-overlay": ["tsup-operations-ops-overlay"],
  "ops-modal": ["tsup-operations-ops-modal"],
  "ops-form": ["tsup-operations-ops-form"],
  "ops-form-grid": ["tsup-operations-ops-form-grid"],
  "ops-nav": ["tsup-operations-ops-nav"],
  "ops-nav-top": ["tsup-operations-ops-nav-top"],
  "ops-brand": ["tsup-operations-ops-brand"],
  "ops-nav-controls": ["tsup-operations-ops-nav-controls"],
  "ops-nav-links": ["tsup-operations-ops-nav-links"],
  "ops-mobile-toggle": ["tsup-operations-ops-mobile-toggle"],
  "ops-pos-grid": ["tsup-operations-ops-pos-grid"],
  "ops-pos-total": ["tsup-operations-ops-pos-total"],
  "ops-pos-qty": ["tsup-operations-ops-pos-qty"],
  "ops-danger": ["tsup-operations-ops-danger"],
  "ops-password": ["tsup-operations-ops-password"],
  "orders-screen": ["tsup-sales-orders-screen"],
  "orders-layout": ["tsup-sales-orders-layout"],
  "orders-header": ["tsup-sales-orders-header"],
  "orders-header-main": ["tsup-sales-orders-header-main"],
  "orders-header-title": ["tsup-sales-orders-header-title"],
  "orders-header-subtitle": ["tsup-sales-orders-header-subtitle"],
  "orders-header-actions": ["tsup-sales-orders-header-actions"],
  "orders-btn-refresh": ["tsup-sales-orders-btn-refresh"],
  "orders-btn-refresh-icon": ["tsup-sales-orders-btn-refresh-icon"],
  "orders-filters-card": ["tsup-sales-orders-filters-card"],
  "orders-filters-top": ["tsup-sales-orders-filters-top"],
  "orders-filters-title": ["tsup-sales-orders-filters-title"],
  "orders-filters-subtitle": ["tsup-sales-orders-filters-subtitle"],
  "orders-filters-grid": ["tsup-sales-orders-filters-grid"],
  "orders-filter-group": ["tsup-sales-orders-filter-group"],
  "orders-filter-group-wide": ["tsup-sales-orders-filter-group-wide"],
  "orders-filter-label": ["tsup-sales-orders-filter-label"],
  "orders-filter-select": ["tsup-sales-orders-filter-select"],
  "orders-filter-input": ["tsup-sales-orders-filter-input"],
  "orders-filter-search-wrap": ["tsup-sales-orders-filter-search-wrap"],
  "orders-filter-search-icon": ["tsup-sales-orders-filter-search-icon"],
  "orders-summary-bar": ["tsup-sales-orders-summary-bar"],
  "orders-summary-section": ["tsup-sales-orders-summary-section"],
  "orders-summary-label": ["tsup-sales-orders-summary-label"],
  "orders-summary-value": ["tsup-sales-orders-summary-value"],
  "orders-summary-value-em": ["tsup-sales-orders-summary-value-em"],
  "orders-table-card": ["tsup-sales-orders-table-card"],
  "orders-table-scroller": ["tsup-sales-orders-table-scroller"],
  "orders-table": ["tsup-sales-orders-table"],
  "orders-table-head": ["tsup-sales-orders-table-head"],
  "align-right": ["tsup-sales-align-right"],
  "orders-table-row": ["tsup-sales-orders-table-row"],
  "orders-table-cell": ["tsup-sales-orders-table-cell"],
  "orders-table-text-main": ["tsup-sales-orders-table-text-main"],
  "orders-table-text-soft": ["tsup-sales-orders-table-text-soft"],
  "orders-order-id": ["tsup-sales-orders-order-id"],
  "orders-amount": ["tsup-sales-orders-amount"],
  "orders-status-pill": ["tsup-sales-orders-status-pill"],
  "orders-status-pill-lg": ["tsup-sales-orders-status-pill-lg"],
  "orders-status-placed": ["tsup-sales-orders-status-placed"],
  "orders-status-confirmed": ["tsup-sales-orders-status-confirmed"],
  "orders-status-packed": ["tsup-sales-orders-status-packed"],
  "orders-status-shipped": ["tsup-sales-orders-status-shipped"],
  "orders-status-cancelled": ["tsup-sales-orders-status-cancelled"],
  "orders-payment-chip": ["tsup-sales-orders-payment-chip"],
  "orders-btn-small": ["tsup-sales-orders-btn-small"],
  "orders-btn-ghost": ["tsup-sales-orders-btn-ghost"],
  "orders-loader": ["tsup-sales-orders-loader"],
  "orders-loader-text": ["tsup-sales-orders-loader-text"],
  "orders-spinner": ["tsup-sales-orders-spinner"],
  "orders-empty-state": ["tsup-sales-orders-empty-state"],
  "orders-empty-icon": ["tsup-sales-orders-empty-icon"],
  "orders-empty-title": ["tsup-sales-orders-empty-title"],
  "orders-empty-text": ["tsup-sales-orders-empty-text"],
  "orders-empty-inline": ["tsup-sales-orders-empty-inline"],
  "orders-modal-backdrop": ["tsup-sales-orders-modal-backdrop"],
  "orders-modal": ["tsup-sales-orders-modal"],
  "orders-modal-center": ["tsup-sales-orders-modal-center"],
  "orders-modal-detail": ["tsup-sales-orders-modal-detail"],
  "orders-modal-header": ["tsup-sales-orders-modal-header"],
  "orders-modal-title": ["tsup-sales-orders-modal-title"],
  "orders-modal-subtitle": ["tsup-sales-orders-modal-subtitle"],
  "orders-modal-header-actions": ["tsup-sales-orders-modal-header-actions"],
  "orders-meta-grid": ["tsup-sales-orders-meta-grid"],
  "orders-meta-item": ["tsup-sales-orders-meta-item"],
  "orders-meta-label": ["tsup-sales-orders-meta-label"],
  "orders-meta-value": ["tsup-sales-orders-meta-value"],
  "orders-meta-value-strong": ["tsup-sales-orders-meta-value-strong"],
  "orders-progress-card": ["tsup-sales-orders-progress-card"],
  "orders-progress-header": ["tsup-sales-orders-progress-header"],
  "orders-progress-header-main": ["tsup-sales-orders-progress-header-main"],
  "orders-progress-title": ["tsup-sales-orders-progress-title"],
  "orders-progress-header-sub": ["tsup-sales-orders-progress-header-sub"],
  "orders-progress-status-pill": ["tsup-sales-orders-progress-status-pill"],
  "orders-timeline": ["tsup-sales-orders-timeline"],
  "orders-timeline-line": ["tsup-sales-orders-timeline-line"],
  "orders-timeline-cancelled": ["tsup-sales-orders-timeline-cancelled"],
  "orders-timeline-steps": ["tsup-sales-orders-timeline-steps"],
  "orders-timeline-step": ["tsup-sales-orders-timeline-step"],
  "orders-timeline-dot": ["tsup-sales-orders-timeline-dot"],
  "orders-timeline-dot-done": ["tsup-sales-orders-timeline-dot-done"],
  "orders-timeline-dot-active": ["tsup-sales-orders-timeline-dot-active"],
  "orders-timeline-dot-upcoming": ["tsup-sales-orders-timeline-dot-upcoming"],
  "orders-timeline-label": ["tsup-sales-orders-timeline-label"],
  "orders-timeline-caption": ["tsup-sales-orders-timeline-caption"],
  "orders-progress-footer": ["tsup-sales-orders-progress-footer"],
  "orders-progress-meta": ["tsup-sales-orders-progress-meta"],
  "orders-progress-meta-label": ["tsup-sales-orders-progress-meta-label"],
  "orders-progress-meta-value": ["tsup-sales-orders-progress-meta-value"],
  "orders-shipping-card": ["tsup-sales-orders-shipping-card"],
  "orders-shipping-header": ["tsup-sales-orders-shipping-header"],
  "orders-shipping-title": ["tsup-sales-orders-shipping-title"],
  "orders-shipping-tag": ["tsup-sales-orders-shipping-tag"],
  "orders-shipping-body": ["tsup-sales-orders-shipping-body"],
  "orders-items-header": ["tsup-sales-orders-items-header"],
  "orders-items-title": ["tsup-sales-orders-items-title"],
  "orders-items-subtitle": ["tsup-sales-orders-items-subtitle"],
  "orders-items-grid": ["tsup-sales-orders-items-grid"],
  "orders-item-card": ["tsup-sales-orders-item-card"],
  "orders-item-media": ["tsup-sales-orders-item-media"],
  "orders-item-placeholder": ["tsup-sales-orders-item-placeholder"],
  "orders-item-main": ["tsup-sales-orders-item-main"],
  "orders-item-top": ["tsup-sales-orders-item-top"],
  "orders-item-meta": ["tsup-sales-orders-item-meta"],
  "orders-item-label": ["tsup-sales-orders-item-label"],
  "orders-item-value": ["tsup-sales-orders-item-value"],
  "orders-item-pricing": ["tsup-sales-orders-item-pricing"],
  "orders-item-qty": ["tsup-sales-orders-item-qty"],
  "orders-item-price": ["tsup-sales-orders-item-price"],
  "orders-item-mrp": ["tsup-sales-orders-item-mrp"],
  "orders-text-soft": ["tsup-sales-orders-text-soft"],
  "orders-progress": ["tsup-sales-orders-progress"],
  "orders-progress-track": ["tsup-sales-orders-progress-track"],
  "orders-progress-dot": ["tsup-sales-orders-progress-dot"],
  "orders-progress-dot-done": ["tsup-sales-orders-progress-dot-done"],
  "orders-progress-dot-active": ["tsup-sales-orders-progress-dot-active"],
  "orders-progress-dot-upcoming": ["tsup-sales-orders-progress-dot-upcoming"],
  "orders-progress-dot-cancelled": ["tsup-sales-orders-progress-dot-cancelled"],
  "orders-progress-text": ["tsup-sales-orders-progress-text"]
})[name] || ["tsup-sales-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const STATUSES = ['ALL', 'PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'CANCELLED'];
const ORDER_STEPS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];
function statusText(s) {
  return String(s || '').toUpperCase();
}
function computeStepFromLocal(orderStatus) {
  const idx = ORDER_STEPS.indexOf(orderStatus || 'PLACED');
  if (idx === -1) return 0;
  return idx;
}
function computeStepFromShiprocket(srStatus) {
  const s = statusText(srStatus);
  if (!s) return 0;
  if (s.includes('DELIVERED')) return 4;
  if (s.includes('OUT FOR DELIVERY') || s.includes('OUT_FOR_DELIVERY')) return 3;
  if (s.includes('PICKED') || s.includes('DISPATCH') || s.includes('IN TRANSIT') || s.includes('SHIPPED')) return 3;
  if (s.includes('PACKED')) return 2;
  if (s.includes('CONFIRMED') || s.includes('PROCESSING') || s.includes('ACCEPTED')) return 1;
  return 0;
}
function extractTrackingCore(raw) {
  if (!raw) return null;
  let core = raw;
  if (Array.isArray(core) && core.length) {
    const first = core[0];
    if (first && typeof first === 'object') {
      const key = Object.keys(first)[0];
      if (key && first[key] && first[key].tracking_data) {
        core = first[key].tracking_data;
      }
    }
  } else if (core.tracking_data) {
    core = core.tracking_data;
  }
  if (!core || typeof core !== 'object') return null;
  return core;
}
function buildTrackingSnapshot(raw) {
  const core = extractTrackingCore(raw);
  if (!core) {
    return {
      status: '',
      eddText: null,
      lastEventText: null,
      core: null
    };
  }
  const tracks = Array.isArray(core.shipment_track) ? core.shipment_track : [];
  const lastTrack = tracks.length ? tracks[tracks.length - 1] : null;
  const status = (lastTrack && lastTrack.current_status) || core.current_status || core.status || '';
  const eddRaw = (lastTrack && lastTrack.edd) || core.edd || null;
  const lastEventRaw = (lastTrack && (lastTrack.date || lastTrack.pickup_date)) || core.updated_time_stamp || core.last_status_time || null;
  const edd = eddRaw ? new Date(eddRaw) : null;
  const lastEvent = lastEventRaw ? new Date(lastEventRaw) : null;
  return {
    status,
    eddText: edd && !Number.isNaN(edd.getTime()) ? edd.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }) : null,
    lastEventText: lastEvent && !Number.isNaN(lastEvent.getTime()) ? lastEvent.toLocaleString('en-IN') : null,
    core
  };
}
function buildExpectedDeliveryText(trackingSnapshot, sale, latestShipment) {
  if (trackingSnapshot && trackingSnapshot.eddText) return trackingSnapshot.eddText;
  const baseRaw = (latestShipment && (latestShipment.pickup_date || latestShipment.created_at)) || (sale && (sale.updated_at || sale.created_at)) || null;
  if (!baseRaw) return '-';
  const base = new Date(baseRaw);
  if (Number.isNaN(base.getTime())) return '-';
  base.setDate(base.getDate() + 5);
  return base.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
}
export default function Sales() {
  const {
    token,
    user
  } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`
    } : {};
  }, [token]);
  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const token = localStorage.getItem("auth_token") || localStorage.getItem("admin_token") || "";
        const res = await fetch(`${API_BASE}/api/shiprocket/warehouses`, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });
        if (!res.ok) {
          console.warn("Backend failed to fetch warehouses:", res.status);
          setWarehouses([]);
          return;
        }
        const data = await res.json();
        let arr = Array.isArray(data) ? data : data?.data || data?.warehouses || [];
        setWarehouses(arr);
      } catch (err) {
        console.error('Failed to load warehouses', err);
        setWarehouses([]);
      } finally {
        setLoadingWarehouses(false);
      }
    };
    fetchWarehouses();
  }, []);
  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/sales/admin`, {
        headers: authHeaders
      });
      const data = await res.json().catch(() => []);
      setSales(Array.isArray(data) ? data : []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders]);
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);
  const getPayable = useCallback(s => {
    if (s && s.totals && s.totals.payable != null) return Number(s.totals.payable);
    if (s && s.total != null) return Number(s.total);
    if (Array.isArray(s?.items) && s.items.length) {
      return s.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
    }
    return 0;
  }, []);
  const getCustomerLabel = useCallback(s => {
    const name = s?.customer_name && String(s.customer_name).trim();
    if (name) return name;
    if (s?.branch_id) return `Branch #${s.branch_id}`;
    return '-';
  }, []);
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null;
    const toTs = to ? new Date(to + 'T23:59:59').getTime() : null;
    return sales.filter(s => {
      const okBranch = selectedBranchId === 'ALL' || String(s.branch_id) === String(selectedBranchId);
      const okStatus = status === 'ALL' ? true : String(s.status || '').toUpperCase() === status;
      const created = s.created_at ? new Date(s.created_at).getTime() : null;
      const okFrom = fromTs ? created ? created >= fromTs : true : true;
      const okTo = toTs ? created ? created <= toTs : true : true;
      const t = s.totals || {};
      const hay = [s.id, getCustomerLabel(s), s.customer_email, s.customer_mobile, s.status, s.payment_status, t?.payable, getPayable(s)].join(' ').toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okBranch && okStatus && okFrom && okTo && okQ;
    });
  }, [sales, status, q, from, to, selectedBranchId, getCustomerLabel, getPayable]);
  const grand = useMemo(() => {
    return filtered.reduce((acc, s) => acc + getPayable(s), 0);
  }, [filtered, getPayable]);
  const openDetail = useCallback(async id => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const [saleRes, shRes] = await Promise.all([fetch(`${API_BASE}/api/sales/admin/${id}`, {
        headers: authHeaders
      }), fetch(`${API_BASE}/api/shipments/by-sale/${id}`, {
        headers: authHeaders
      })]);
      const saleJson = await saleRes.json().catch(() => null);
      const shJson = await shRes.json().catch(() => []);
      const sale = saleJson && saleJson.sale ? saleJson.sale : saleJson;
      const items = Array.isArray(saleJson?.items) ? saleJson.items : [];
      const shipments = Array.isArray(shJson) ? shJson : [];
      const latestShipment = shipments.length ? shipments[shipments.length - 1] : null;
      let trackingRaw = null;
      const trackOrderId = latestShipment?.shiprocket_order_id || latestShipment?.awb || '';
      if (trackOrderId) {
        try {
          const trRes = await fetch(`${API_BASE}/api/shiprocket/track/${encodeURIComponent(trackOrderId)}`);
          const trJson = await trRes.json().catch(() => null);
          if (trRes.ok && trJson) trackingRaw = trJson;
        } catch {
          trackingRaw = null;
        }
      }
      const trackingSnapshot = buildTrackingSnapshot(trackingRaw);
      setDetail({
        sale,
        items,
        shipments,
        trackingSnapshot,
        latestShipment
      });
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, [authHeaders]);
  const fmt = n => `₹${Number(n || 0).toFixed(2)}`;
  const detailSale = detail?.sale || null;
  const detailItems = detail?.items || [];
  const detailShipments = detail?.shipments || [];
  const detailLatestShipment = detail?.latestShipment || (detailShipments.length ? detailShipments[detailShipments.length - 1] : null);
  const detailTrackingSnapshot = detail?.trackingSnapshot || {
    status: '',
    eddText: null,
    lastEventText: null,
    core: null
  };
  const detailLocalOrderStatus = detailSale ? statusText(detailSale.status || 'PLACED') : '';
  const detailIsCancelled = detailLocalOrderStatus === 'CANCELLED';
  const detailShiprocketStatus = statusText(detailTrackingSnapshot.status);
  let detailShiprocketStep = computeStepFromShiprocket(detailShiprocketStatus);
  if (!detailIsCancelled && detailTrackingSnapshot.eddText && detailShiprocketStep < 3) {
    detailShiprocketStep = 3;
  }
  const detailPlacedText = detailSale?.created_at ? new Date(detailSale.created_at).toLocaleString() : '-';
  const detailExpectedDelivery = detailSale ? buildExpectedDeliveryText(detailTrackingSnapshot, detailSale, detailLatestShipment) : '-';
  let detailEffectiveBase = detailSale ? Math.max(computeStepFromLocal(detailLocalOrderStatus), detailShiprocketStep) : 0;
  if (!detailIsCancelled && detailExpectedDelivery && detailExpectedDelivery !== '-' && detailEffectiveBase < 3) {
    detailEffectiveBase = 3;
  }
  const detailEffectiveStepIndex = detailEffectiveBase;
  const detailLastUpdateTime = (() => {
    if (!detail) return '-';
    if (detailTrackingSnapshot.lastEventText) return detailTrackingSnapshot.lastEventText;
    const fallbackTime = detailLatestShipment?.updated_at || detailLatestShipment?.created_at || detailSale?.updated_at || detailSale?.created_at;
    if (!fallbackTime) return '-';
    const t = new Date(fallbackTime);
    if (Number.isNaN(t.getTime())) return '-';
    return t.toLocaleString('en-IN');
  })();
  return <div className={portalClass("orders-screen")}>
      

      {}
      <div style={{
      padding: '16px 24px',
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #dce3ec",
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }} className="tsup-sales-node-0">
        <h3 style={{
        margin: 0,
        color: "#42536a"
      }} className="tsup-sales-node-1">Select Branch Context:</h3>
        {loadingWarehouses ? <span style={{
        color: "#42536a"
      }} className="tsup-sales-node-2">Loading branches...</span> : <select style={{
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: "#ffffff",
        color: "#42536a",
        border: '1px solid gold',
        fontSize: '14px',
        minWidth: '250px'
      }} value={selectedBranchId} onChange={e => setSelectedBranchId(e.target.value)} className="tsup-sales-node-3">
            <option value="ALL" className="tsup-sales-node-4">All Branches (Global View)</option>
            {warehouses.map(w => <option key={w.id} value={w.id} className="tsup-sales-node-5">
                {w.name} ({w.city})
              </option>)}
          </select>}
      </div>

      <div className={portalClass("orders-layout")}>
        <div className={portalClass("orders-header")}>
          <div className={portalClass("orders-header-main")}>
            <h1 className={portalClass("orders-header-title")}>Orders</h1>
            <p className={portalClass("orders-header-subtitle")}>
              Track, review and manage every purchase in one place
            </p>
          </div>
          <div className={portalClass("orders-header-actions")}>
            <button className={portalClass("orders-btn-refresh")} onClick={fetchSales}>
              <span className={portalClass("orders-btn-refresh-icon")} />
              <span className="tsup-sales-node-6">Refresh list</span>
            </button>
          </div>
        </div>

        <div className={portalClass("orders-filters-card")}>
          <div className={portalClass("orders-filters-top")}>
            <span className={portalClass("orders-filters-title")}>Filters</span>
            <span className={portalClass("orders-filters-subtitle")}>
              Refine by status, date range or customer details
            </span>
          </div>
          <div className={portalClass("orders-filters-grid")}>
            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>Status</label>
              <select className={portalClass("orders-filter-select")} value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s} className="tsup-sales-node-7">
                    {s}
                  </option>)}
              </select>
            </div>
            <div className={portalClass("orders-filter-group orders-filter-group-wide")}>
              <label className={portalClass("orders-filter-label")}>Search</label>
              <div className={portalClass("orders-filter-search-wrap")}>
                <span className={portalClass("orders-filter-search-icon")} />
                <input className={portalClass("orders-filter-input")} placeholder="Search by order id, name, email or mobile" value={q} onChange={e => setQ(e.target.value)} />
              </div>
            </div>
            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>From</label>
              <input className={portalClass("orders-filter-input")} type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className={portalClass("orders-filter-group")}>
              <label className={portalClass("orders-filter-label")}>To</label>
              <input className={portalClass("orders-filter-input")} type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
          </div>
        </div>

        <div className={portalClass("orders-summary-bar")}>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Orders</span>
            <span className={portalClass("orders-summary-value")}>
              {loading ? 'Loading…' : `${filtered.length} order${filtered.length === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Total payable</span>
            <span className={portalClass("orders-summary-value orders-summary-value-em")}>
              {fmt(grand)}
            </span>
          </div>
        </div>

        <div className={portalClass("orders-table-card")}>
          {loading ? <div className={portalClass("orders-loader")}>
              <div className={portalClass("orders-spinner")} />
              <span className={portalClass("orders-loader-text")}>Fetching latest orders</span>
            </div> : filtered.length === 0 ? <div className={portalClass("orders-empty-state")}>
              <div className={portalClass("orders-empty-icon")} />
              <h3 className={portalClass("orders-empty-title")}>No orders found</h3>
              <p className={portalClass("orders-empty-text")}>
                Try adjusting your filters or clearing the search to see more orders.
              </p>
            </div> : <div className={portalClass("orders-table-scroller")}>
              <table className={portalClass("orders-table")}>
                <thead className="tsup-sales-node-8">
                  <tr className="tsup-sales-node-9">
                    <th className={portalClass("orders-table-head")}>Order</th>
                    <th className={portalClass("orders-table-head")}>Branch</th>
                    <th className={portalClass("orders-table-head")}>Placed at</th>
                    <th className={portalClass("orders-table-head")}>Status</th>
                    <th className={portalClass("orders-table-head")}>Progress</th>
                    <th className={portalClass("orders-table-head")}>Payment</th>
                    <th className={portalClass("orders-table-head")}>Customer</th>
                    <th className={portalClass("orders-table-head")}>Mobile</th>
                    <th className={portalClass("orders-table-head align-right")}>Payable</th>
                    <th className={portalClass("orders-table-head align-right")} />
                  </tr>
                </thead>
                <tbody className="tsup-sales-node-10">
                  {filtered.map(s => {
                const localStatus = statusText(s.status || 'PLACED');
                const isCancelledRow = localStatus === 'CANCELLED';
                const localStep = computeStepFromLocal(localStatus);
                return <tr key={s.id} className={portalClass("orders-table-row")}>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-order-id")}>#{s.id}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-main")}>{s.branch_id || 'WEB'}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-soft")}>
                            {s.created_at ? new Date(s.created_at).toLocaleString() : '-'}
                          </span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass(`orders-status-pill orders-status-${String(s.status || '').toLowerCase()}`)}>
                            {localStatus || '-'}
                          </span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <div className={portalClass("orders-progress")}>
                            <div className={portalClass("orders-progress-track")}>
                              {ORDER_STEPS.map((step, index) => {
                          const state = isCancelledRow ? 'cancelled' : index < localStep ? 'done' : index === localStep ? 'active' : 'upcoming';
                          return <span key={step} className={portalClass(`orders-progress-dot orders-progress-dot-${state}`)} />;
                        })}
                            </div>
                            <div className={portalClass("orders-progress-text")}>
                              {isCancelledRow ? 'Cancelled' : `${ORDER_STEPS[localStep]} • Step ${localStep + 1} of ${ORDER_STEPS.length}`}
                            </div>
                          </div>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-payment-chip")}>
                            {String(s.payment_status || 'COD').toUpperCase()}
                          </span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-main")}>{getCustomerLabel(s)}</span>
                        </td>
                        <td className={portalClass("orders-table-cell")}>
                          <span className={portalClass("orders-table-text-main")}>
                            {s.customer_mobile || '-'}
                          </span>
                        </td>
                        <td className={portalClass("orders-table-cell align-right")}>
                          <span className={portalClass("orders-amount")}>{fmt(getPayable(s))}</span>
                        </td>
                        <td className={portalClass("orders-table-cell align-right")}>
                          <button className={portalClass("orders-btn-small")} onClick={() => openDetail(s.id)}>
                            View details
                          </button>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>}
        </div>
      </div>

      {detailLoading && <div className={portalClass("orders-modal-backdrop")}>
          <div className={portalClass("orders-modal orders-modal-center")}>
            <div className={portalClass("orders-loader")}>
              <div className={portalClass("orders-spinner")} />
              <span className={portalClass("orders-loader-text")}>Loading order details</span>
            </div>
          </div>
        </div>}

      {detail && !detailLoading && <div className={portalClass("orders-modal-backdrop")} onClick={() => setDetail(null)}>
          <div className={portalClass("orders-modal orders-modal-detail")} onClick={e => e.stopPropagation()}>
            <div className={portalClass("orders-modal-header")}>
              <div className="tsup-sales-node-11">
                <h3 className={portalClass("orders-modal-title")}>Order #{detailSale?.id}</h3>
                <p className={portalClass("orders-modal-subtitle")}>
                  Placed on {detailPlacedText}
                </p>
              </div>
              <div className={portalClass("orders-modal-header-actions")}>
                <span className={portalClass(`orders-status-pill orders-status-${String(detailSale?.status || '').toLowerCase()} orders-status-pill-lg`)}>
                  {detailLocalOrderStatus || '-'}
                </span>
                <button className={portalClass("orders-btn-small orders-btn-ghost")} onClick={() => setDetail(null)}>
                  Close
                </button>
              </div>
            </div>

            <div className={portalClass("orders-meta-grid")}>
              <div className={portalClass("orders-meta-item")}>
                <div className={portalClass("orders-meta-label")}>Payment</div>
                <div className={portalClass("orders-meta-value")}>
                  {String(detailSale?.payment_status || 'COD').toUpperCase()}
                </div>
              </div>
              <div className={portalClass("orders-meta-item")}>
                <div className={portalClass("orders-meta-label")}>Customer</div>
                <div className={portalClass("orders-meta-value")}>
                  {getCustomerLabel(detailSale)}
                  {detailSale?.customer_mobile ? ` · ${detailSale?.customer_mobile}` : ''}
                </div>
              </div>
              <div className={portalClass("orders-meta-item")}>
                <div className={portalClass("orders-meta-label")}>Email</div>
                <div className={portalClass("orders-meta-value")}>
                  {detailSale?.customer_email || '-'}
                </div>
              </div>
              <div className={portalClass("orders-meta-item")}>
                <div className={portalClass("orders-meta-label")}>Amount payable</div>
                <div className={portalClass("orders-meta-value orders-meta-value-strong")}>
                  {fmt(detailSale?.totals?.payable ?? detailSale?.total)}
                </div>
              </div>
            </div>

            <div className={portalClass("orders-progress-card")}>
              <div className={portalClass("orders-progress-header")}>
                <div className={portalClass("orders-progress-header-main")}>
                  <div className={portalClass("orders-progress-title")}>Fulfilment progress</div>
                  <div className={portalClass("orders-progress-header-sub")}>
                    Live view of where this order is in the journey
                  </div>
                </div>
                <div className={portalClass("orders-progress-status-pill")}>
                  {detailIsCancelled ? 'Order cancelled' : detailEffectiveStepIndex === ORDER_STEPS.length - 1 ? 'Delivered to customer' : `Currently ${ORDER_STEPS[detailEffectiveStepIndex].toLowerCase()}`}
                </div>
              </div>
              <div className={portalClass(`orders-timeline ${detailIsCancelled ? 'orders-timeline-cancelled' : ''}`)}>
                <div className={portalClass("orders-timeline-line")} />
                <div className={portalClass("orders-timeline-steps")}>
                  {ORDER_STEPS.map((step, index) => {
                const stepState = detailIsCancelled && step !== 'PLACED' ? 'upcoming' : index < detailEffectiveStepIndex ? 'done' : index === detailEffectiveStepIndex ? 'active' : 'upcoming';
                return <div className={portalClass("orders-timeline-step")} key={step}>
                        <div className={portalClass(`orders-timeline-dot orders-timeline-dot-${stepState}`)} />
                        <div className={portalClass("orders-timeline-label")}>{step}</div>
                        <div className={portalClass("orders-timeline-caption")}>
                          {step === 'PLACED' && 'Order captured in the system'}
                          {step === 'CONFIRMED' && 'Details verified by the team'}
                          {step === 'PACKED' && 'Items packed and ready to ship'}
                          {step === 'SHIPPED' && 'With the courier for delivery'}
                          {step === 'DELIVERED' && 'Delivered to the customer'}
                        </div>
                      </div>;
              })}
                </div>
              </div>
              <div className={portalClass("orders-progress-footer")}>
                <div className={portalClass("orders-progress-meta")}>
                  <span className={portalClass("orders-progress-meta-label")}>AWB</span>
                  <span className={portalClass("orders-progress-meta-value")}>
                    {detailLatestShipment?.awb || '-'}
                  </span>
                </div>
                <div className={portalClass("orders-progress-meta")}>
                  <span className={portalClass("orders-progress-meta-label")}>Expected delivery</span>
                  <span className={portalClass("orders-progress-meta-value")}>
                    {detailExpectedDelivery}
                  </span>
                </div>
                <div className={portalClass("orders-progress-meta")}>
                  <span className={portalClass("orders-progress-meta-label")}>Last update</span>
                  <span className={portalClass("orders-progress-meta-value")}>
                    {detailLastUpdateTime}
                  </span>
                </div>
              </div>
            </div>

            {detailSale?.shipping_address && <div className={portalClass("orders-shipping-card")}>
                <div className={portalClass("orders-shipping-header")}>
                  <h4 className={portalClass("orders-shipping-title")}>Shipping address</h4>
                  <span className={portalClass("orders-shipping-tag")}>Delivery</span>
                </div>
                <div className={portalClass("orders-shipping-body")}>
                  <p className="tsup-sales-node-12">{detailSale.shipping_address.line1}</p>
                  {detailSale.shipping_address.line2 && <p className="tsup-sales-node-13">{detailSale.shipping_address.line2}</p>}
                  <p className="tsup-sales-node-14">
                    {detailSale.shipping_address.city},{' '}
                    {detailSale.shipping_address.state} -{' '}
                    {detailSale.shipping_address.pincode}
                  </p>
                </div>
              </div>}

            <div className={portalClass("orders-items-header")}>
              <div className="tsup-sales-node-15">
                <p className={portalClass("orders-items-title")}>Items in this order</p>
                <p className={portalClass("orders-items-subtitle")}>
                  {Array.isArray(detailItems) ? detailItems.length : 0} item
                  {Array.isArray(detailItems) && detailItems.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className={portalClass("orders-items-grid")}>
              {Array.isArray(detailItems) && detailItems.length > 0 ? detailItems.map((it, i) => <div className={portalClass("orders-item-card")} key={`${it.variant_id}-${i}`}>
                    <div className={portalClass("orders-item-media")}>
                      {it.image_url ? <img src={it.image_url} alt="" className="tsup-sales-node-16" /> : <div className={portalClass("orders-item-placeholder")} />}
                    </div>
                    <div className={portalClass("orders-item-main")}>
                      <div className={portalClass("orders-item-top")}>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>Variant</span>
                          <span className={portalClass("orders-item-value")}>#{it.variant_id}</span>
                        </div>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>Size</span>
                          <span className={portalClass("orders-item-value")}>{it.size || '-'}</span>
                        </div>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>Colour</span>
                          <span className={portalClass("orders-item-value")}>{it.colour || '-'}</span>
                        </div>
                        <div className={portalClass("orders-item-meta")}>
                          <span className={portalClass("orders-item-label")}>EAN</span>
                          <span className={portalClass("orders-item-value orders-text-soft")}>
                            {it.ean_code || '-'}
                          </span>
                        </div>
                      </div>
                      <div className={portalClass("orders-item-pricing")}>
                        <div className={portalClass("orders-item-qty")}>x{it.qty}</div>
                        <div className={portalClass("orders-item-price")}>{fmt(it.price)}</div>
                        {it.mrp != null && Number(it.mrp) > 0 ? <div className={portalClass("orders-item-mrp")}>MRP {fmt(it.mrp)}</div> : null}
                      </div>
                    </div>
                  </div>) : <div className={portalClass("orders-empty-inline")}>No items in this order</div>}
            </div>
          </div>
        </div>}
    </div>;
}
