import React, { useEffect, useMemo, useState } from 'react';
import './Sales.css';
import Navbar from './NavbarAdmin';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
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
  const status =
    (lastTrack && lastTrack.current_status) ||
    core.current_status ||
    core.status ||
    '';
  const eddRaw =
    (lastTrack && lastTrack.edd) ||
    core.edd ||
    null;
  const lastEventRaw =
    (lastTrack && (lastTrack.date || lastTrack.pickup_date)) ||
    core.updated_time_stamp ||
    core.last_status_time ||
    null;
  const edd = eddRaw ? new Date(eddRaw) : null;
  const lastEvent = lastEventRaw ? new Date(lastEventRaw) : null;
  return {
    status,
    eddText: edd && !Number.isNaN(edd.getTime())
      ? edd.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' })
      : null,
    lastEventText: lastEvent && !Number.isNaN(lastEvent.getTime())
      ? lastEvent.toLocaleString('en-IN')
      : null,
    core
  };
}

function buildExpectedDeliveryText(trackingSnapshot, sale, latestShipment) {
  if (trackingSnapshot && trackingSnapshot.eddText) return trackingSnapshot.eddText;
  const baseRaw =
    (latestShipment && (latestShipment.pickup_date || latestShipment.created_at)) ||
    (sale && (sale.updated_at || sale.created_at)) ||
    null;
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
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('ALL');
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sales/web`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getPayable = (s) => {
    if (s && s.totals && s.totals.payable != null) return Number(s.totals.payable);
    if (s && s.total != null) return Number(s.total);
    if (Array.isArray(s?.items) && s.items.length) {
      return s.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
    }
    return 0;
  };

  const getCustomerLabel = (s) => {
    const name = s?.customer_name && String(s.customer_name).trim();
    if (name) return name;
    if (s?.branch_id) return `Branch #${s.branch_id}`;
    return '-';
  };

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null;
    const toTs = to ? new Date(to + 'T23:59:59').getTime() : null;
    return sales.filter((s) => {
      const okStatus = status === 'ALL' ? true : String(s.status || '').toUpperCase() === status;
      const created = s.created_at ? new Date(s.created_at).getTime() : null;
      const okFrom = fromTs ? (created ? created >= fromTs : true) : true;
      const okTo = toTs ? (created ? created <= toTs : true) : true;
      const t = s.totals || {};
      const hay = [
        s.id,
        getCustomerLabel(s),
        s.customer_email,
        s.customer_mobile,
        s.status,
        s.payment_status,
        t?.payable,
        getPayable(s)
      ]
        .join(' ')
        .toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okStatus && okFrom && okTo && okQ;
    });
  }, [sales, status, q, from, to]);

  const grand = useMemo(() => {
    return filtered.reduce((acc, s) => acc + getPayable(s), 0);
  }, [filtered]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const [saleRes, shRes] = await Promise.all([
        fetch(`${API_BASE}/api/sales/web/${id}`),
        fetch(`${API_BASE}/api/shipments/by-sale/${id}`)
      ]);
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
          const trRes = await fetch(
            `${API_BASE}/api/shiprocket/track/${encodeURIComponent(trackOrderId)}`
          );
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
  };

  const fmt = (n) => `₹${Number(n || 0).toFixed(2)}`;

  const detailSale = detail?.sale || null;
  const detailItems = detail?.items || [];
  const detailShipments = detail?.shipments || [];
  const detailLatestShipment =
    detail?.latestShipment ||
    (detailShipments.length ? detailShipments[detailShipments.length - 1] : null);
  const detailTrackingSnapshot =
    detail?.trackingSnapshot ||
    {
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
  const detailPlacedText = detailSale?.created_at
    ? new Date(detailSale.created_at).toLocaleString()
    : '-';
  const detailExpectedDelivery = detailSale
    ? buildExpectedDeliveryText(detailTrackingSnapshot, detailSale, detailLatestShipment)
    : '-';
  let detailEffectiveBase = detailSale
    ? Math.max(
        computeStepFromLocal(detailLocalOrderStatus),
        detailShiprocketStep
      )
    : 0;
  if (
    !detailIsCancelled &&
    detailExpectedDelivery &&
    detailExpectedDelivery !== '-' &&
    detailEffectiveBase < 3
  ) {
    detailEffectiveBase = 3;
  }
  const detailEffectiveStepIndex = detailEffectiveBase;
  const detailLastUpdateTime = (() => {
    if (!detail) return '-';
    if (detailTrackingSnapshot.lastEventText) return detailTrackingSnapshot.lastEventText;
    const fallbackTime =
      detailLatestShipment?.updated_at ||
      detailLatestShipment?.created_at ||
      detailSale?.updated_at ||
      detailSale?.created_at;
    if (!fallbackTime) return '-';
    const t = new Date(fallbackTime);
    if (Number.isNaN(t.getTime())) return '-';
    return t.toLocaleString('en-IN');
  })();

  return (
    <div className="orders-screen">
      <Navbar />
      <div className="orders-layout">
        <div className="orders-header">
          <div className="orders-header-main">
            <h1 className="orders-header-title">Orders</h1>
            <p className="orders-header-subtitle">
              Track, review and manage every purchase in one place
            </p>
          </div>
          <div className="orders-header-actions">
            <button className="orders-btn-refresh" onClick={fetchSales}>
              <span className="orders-btn-refresh-icon" />
              <span>Refresh list</span>
            </button>
          </div>
        </div>

        <div className="orders-filters-card">
          <div className="orders-filters-top">
            <span className="orders-filters-title">Filters</span>
            <span className="orders-filters-subtitle">
              Refine by status, date range or customer details
            </span>
          </div>
          <div className="orders-filters-grid">
            <div className="orders-filter-group">
              <label className="orders-filter-label">Status</label>
              <select
                className="orders-filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="orders-filter-group orders-filter-group-wide">
              <label className="orders-filter-label">Search</label>
              <div className="orders-filter-search-wrap">
                <span className="orders-filter-search-icon" />
                <input
                  className="orders-filter-input"
                  placeholder="Search by order id, name, email or mobile"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="orders-filter-group">
              <label className="orders-filter-label">From</label>
              <input
                className="orders-filter-input"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="orders-filter-group">
              <label className="orders-filter-label">To</label>
              <input
                className="orders-filter-input"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="orders-summary-bar">
          <div className="orders-summary-section">
            <span className="orders-summary-label">Orders</span>
            <span className="orders-summary-value">
              {loading ? 'Loading…' : `${filtered.length} order${filtered.length === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="orders-summary-section">
            <span className="orders-summary-label">Total payable</span>
            <span className="orders-summary-value orders-summary-value-em">
              {fmt(grand)}
            </span>
          </div>
        </div>

        <div className="orders-table-card">
          {loading ? (
            <div className="orders-loader">
              <div className="orders-spinner" />
              <span className="orders-loader-text">Fetching latest orders</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="orders-empty-state">
              <div className="orders-empty-icon" />
              <h3 className="orders-empty-title">No orders found</h3>
              <p className="orders-empty-text">
                Try adjusting your filters or clearing the search to see more orders.
              </p>
            </div>
          ) : (
            <div className="orders-table-scroller">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th className="orders-table-head">Order</th>
                    <th className="orders-table-head">Placed at</th>
                    <th className="orders-table-head">Status</th>
                    <th className="orders-table-head">Progress</th>
                    <th className="orders-table-head">Payment</th>
                    <th className="orders-table-head">Customer</th>
                    <th className="orders-table-head">Mobile</th>
                    <th className="orders-table-head">Email</th>
                    <th className="orders-table-head align-right">Payable</th>
                    <th className="orders-table-head align-right" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const localStatus = statusText(s.status || 'PLACED');
                    const isCancelledRow = localStatus === 'CANCELLED';
                    const localStep = computeStepFromLocal(localStatus);
                    return (
                      <tr key={s.id} className="orders-table-row">
                        <td className="orders-table-cell">
                          <span className="orders-order-id">#{s.id}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-soft">
                            {s.created_at ? new Date(s.created_at).toLocaleString() : '-'}
                          </span>
                        </td>
                        <td className="orders-table-cell">
                          <span
                            className={`orders-status-pill orders-status-${String(
                              s.status || ''
                            ).toLowerCase()}`}
                          >
                            {localStatus || '-'}
                          </span>
                        </td>
                        <td className="orders-table-cell">
                          <div className="orders-progress">
                            <div className="orders-progress-track">
                              {ORDER_STEPS.map((step, index) => {
                                const state = isCancelledRow
                                  ? 'cancelled'
                                  : index < localStep
                                  ? 'done'
                                  : index === localStep
                                  ? 'active'
                                  : 'upcoming';
                                return (
                                  <span
                                    key={step}
                                    className={`orders-progress-dot orders-progress-dot-${state}`}
                                  />
                                );
                              })}
                            </div>
                            <div className="orders-progress-text">
                              {isCancelledRow
                                ? 'Cancelled'
                                : `${ORDER_STEPS[localStep]} • Step ${localStep + 1} of ${
                                    ORDER_STEPS.length
                                  }`}
                            </div>
                          </div>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-payment-chip">
                            {String(s.payment_status || 'COD').toUpperCase()}
                          </span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-main">{getCustomerLabel(s)}</span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-main">
                            {s.customer_mobile || '-'}
                          </span>
                        </td>
                        <td className="orders-table-cell">
                          <span className="orders-table-text-soft">
                            {s.customer_email || '-'}
                          </span>
                        </td>
                        <td className="orders-table-cell align-right">
                          <span className="orders-amount">{fmt(getPayable(s))}</span>
                        </td>
                        <td className="orders-table-cell align-right">
                          <button
                            className="orders-btn-small"
                            onClick={() => openDetail(s.id)}
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detailLoading && (
        <div className="orders-modal-backdrop">
          <div className="orders-modal orders-modal-center">
            <div className="orders-loader">
              <div className="orders-spinner" />
              <span className="orders-loader-text">Loading order details</span>
            </div>
          </div>
        </div>
      )}

      {detail && !detailLoading && (
        <div className="orders-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="orders-modal orders-modal-detail" onClick={(e) => e.stopPropagation()}>
            <div className="orders-modal-header">
              <div>
                <h3 className="orders-modal-title">Order #{detailSale?.id}</h3>
                <p className="orders-modal-subtitle">
                  Placed on {detailPlacedText}
                </p>
              </div>
              <div className="orders-modal-header-actions">
                <span
                  className={`orders-status-pill orders-status-${String(
                    detailSale?.status || ''
                  ).toLowerCase()} orders-status-pill-lg`}
                >
                  {detailLocalOrderStatus || '-'}
                </span>
                <button
                  className="orders-btn-small orders-btn-ghost"
                  onClick={() => setDetail(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="orders-meta-grid">
              <div className="orders-meta-item">
                <div className="orders-meta-label">Payment</div>
                <div className="orders-meta-value">
                  {String(detailSale?.payment_status || 'COD').toUpperCase()}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Customer</div>
                <div className="orders-meta-value">
                  {getCustomerLabel(detailSale)}
                  {detailSale?.customer_mobile ? ` · ${detailSale?.customer_mobile}` : ''}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Email</div>
                <div className="orders-meta-value">
                  {detailSale?.customer_email || '-'}
                </div>
              </div>
              <div className="orders-meta-item">
                <div className="orders-meta-label">Amount payable</div>
                <div className="orders-meta-value orders-meta-value-strong">
                  {fmt(detailSale?.totals?.payable ?? detailSale?.total)}
                </div>
              </div>
            </div>

            <div className="orders-progress-card">
              <div className="orders-progress-header">
                <div className="orders-progress-header-main">
                  <div className="orders-progress-title">Fulfilment progress</div>
                  <div className="orders-progress-header-sub">
                    Live view of where this order is in the journey
                  </div>
                </div>
                <div className="orders-progress-status-pill">
                  {detailIsCancelled
                    ? 'Order cancelled'
                    : detailEffectiveStepIndex === ORDER_STEPS.length - 1
                    ? 'Delivered to customer'
                    : `Currently ${ORDER_STEPS[detailEffectiveStepIndex].toLowerCase()}`}
                </div>
              </div>
              <div
                className={`orders-timeline ${
                  detailIsCancelled ? 'orders-timeline-cancelled' : ''
                }`}
              >
                <div className="orders-timeline-line" />
                <div className="orders-timeline-steps">
                  {ORDER_STEPS.map((step, index) => {
                    const stepState =
                      detailIsCancelled && step !== 'PLACED'
                        ? 'upcoming'
                        : index < detailEffectiveStepIndex
                        ? 'done'
                        : index === detailEffectiveStepIndex
                        ? 'active'
                        : 'upcoming';
                    return (
                      <div className="orders-timeline-step" key={step}>
                        <div
                          className={`orders-timeline-dot orders-timeline-dot-${stepState}`}
                        />
                        <div className="orders-timeline-label">{step}</div>
                        <div className="orders-timeline-caption">
                          {step === 'PLACED' && 'Order captured in the system'}
                          {step === 'CONFIRMED' && 'Details verified by the team'}
                          {step === 'PACKED' && 'Items packed and ready to ship'}
                          {step === 'SHIPPED' && 'With the courier for delivery'}
                          {step === 'DELIVERED' && 'Delivered to the customer'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="orders-progress-footer">
                <div className="orders-progress-meta">
                  <span className="orders-progress-meta-label">AWB</span>
                  <span className="orders-progress-meta-value">
                    {detailLatestShipment?.awb || '-'}
                  </span>
                </div>
                <div className="orders-progress-meta">
                  <span className="orders-progress-meta-label">Expected delivery</span>
                  <span className="orders-progress-meta-value">
                    {detailExpectedDelivery}
                  </span>
                </div>
                <div className="orders-progress-meta">
                  <span className="orders-progress-meta-label">Last update</span>
                  <span className="orders-progress-meta-value">
                    {detailLastUpdateTime}
                  </span>
                </div>
              </div>
            </div>

            {detailSale?.shipping_address && (
              <div className="orders-shipping-card">
                <div className="orders-shipping-header">
                  <h4 className="orders-shipping-title">Shipping address</h4>
                  <span className="orders-shipping-tag">Delivery</span>
                </div>
                <div className="orders-shipping-body">
                  <p>{detailSale.shipping_address.line1}</p>
                  {detailSale.shipping_address.line2 && (
                    <p>{detailSale.shipping_address.line2}</p>
                  )}
                  <p>
                    {detailSale.shipping_address.city},{' '}
                    {detailSale.shipping_address.state} -{' '}
                    {detailSale.shipping_address.pincode}
                  </p>
                </div>
              </div>
            )}

            <div className="orders-items-header">
              <div>
                <p className="orders-items-title">Items in this order</p>
                <p className="orders-items-subtitle">
                  {Array.isArray(detailItems) ? detailItems.length : 0} item
                  {Array.isArray(detailItems) && detailItems.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="orders-items-grid">
              {Array.isArray(detailItems) && detailItems.length > 0 ? (
                detailItems.map((it, i) => (
                  <div className="orders-item-card" key={`${it.variant_id}-${i}`}>
                    <div className="orders-item-media">
                      {it.image_url ? (
                        <img src={it.image_url} alt="" />
                      ) : (
                        <div className="orders-item-placeholder" />
                      )}
                    </div>
                    <div className="orders-item-main">
                      <div className="orders-item-top">
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Variant</span>
                          <span className="orders-item-value">#{it.variant_id}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Size</span>
                          <span className="orders-item-value">{it.size || '-'}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">Colour</span>
                          <span className="orders-item-value">{it.colour || '-'}</span>
                        </div>
                        <div className="orders-item-meta">
                          <span className="orders-item-label">EAN</span>
                          <span className="orders-item-value orders-text-soft">
                            {it.ean_code || '-'}
                          </span>
                        </div>
                      </div>
                      <div className="orders-item-pricing">
                        <div className="orders-item-qty">x{it.qty}</div>
                        <div className="orders-item-price">{fmt(it.price)}</div>
                        {it.mrp != null && Number(it.mrp) > 0 ? (
                          <div className="orders-item-mrp">MRP {fmt(it.mrp)}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="orders-empty-inline">No items in this order</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
