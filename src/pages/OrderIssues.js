import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './OrderIssues.css';
import OrderCancelPopup from './OrderCancelPopup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AdminAuth';
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
  "oi-screen": ["tsup-orderissues-oi-screen"],
  "oi-layout": ["tsup-orderissues-oi-layout"],
  "oi-header": ["tsup-orderissues-oi-header"],
  "oi-header-main": ["tsup-orderissues-oi-header-main"],
  "oi-title": ["tsup-orderissues-oi-title"],
  "oi-subtitle": ["tsup-orderissues-oi-subtitle"],
  "oi-header-actions": ["tsup-orderissues-oi-header-actions"],
  "oi-refresh-btn": ["tsup-orderissues-oi-refresh-btn"],
  "oi-refresh-dot": ["tsup-orderissues-oi-refresh-dot"],
  "oi-tabs": ["tsup-orderissues-oi-tabs"],
  "oi-tab": ["tsup-orderissues-oi-tab"],
  "oi-tab-active": ["tsup-orderissues-oi-tab-active"],
  "oi-summary": ["tsup-orderissues-oi-summary"],
  "oi-summary-card": ["tsup-orderissues-oi-summary-card"],
  "oi-summary-label": ["tsup-orderissues-oi-summary-label"],
  "oi-summary-value": ["tsup-orderissues-oi-summary-value"],
  "oi-summary-note": ["tsup-orderissues-oi-summary-note"],
  "oi-filters": ["tsup-orderissues-oi-filters"],
  "oi-filter-group": ["tsup-orderissues-oi-filter-group"],
  "oi-filter-label": ["tsup-orderissues-oi-filter-label"],
  "oi-filter-select": ["tsup-orderissues-oi-filter-select"],
  "oi-filter-search": ["tsup-orderissues-oi-filter-search"],
  "oi-filter-search-wrap": ["tsup-orderissues-oi-filter-search-wrap"],
  "oi-filter-search-icon": ["tsup-orderissues-oi-filter-search-icon"],
  "oi-filter-input": ["tsup-orderissues-oi-filter-input"],
  "oi-filter-helper": ["tsup-orderissues-oi-filter-helper"],
  "oi-table-card": ["tsup-orderissues-oi-table-card"],
  "oi-loader": ["tsup-orderissues-oi-loader"],
  "oi-spinner": ["tsup-orderissues-oi-spinner"],
  "oi-loader-text": ["tsup-orderissues-oi-loader-text"],
  "oi-empty": ["tsup-orderissues-oi-empty"],
  "oi-empty-inline": ["tsup-orderissues-oi-empty-inline"],
  "oi-empty-icon": ["tsup-orderissues-oi-empty-icon"],
  "oi-empty-title": ["tsup-orderissues-oi-empty-title"],
  "oi-empty-text": ["tsup-orderissues-oi-empty-text"],
  "oi-table-scroller": ["tsup-orderissues-oi-table-scroller"],
  "oi-table": ["tsup-orderissues-oi-table"],
  "oi-th": ["tsup-orderissues-oi-th"],
  "oi-tr": ["tsup-orderissues-oi-tr"],
  "oi-td": ["tsup-orderissues-oi-td"],
  "oi-pill-id": ["tsup-orderissues-oi-pill-id"],
  "oi-muted": ["tsup-orderissues-oi-muted"],
  "oi-strong": ["tsup-orderissues-oi-strong"],
  "oi-text": ["tsup-orderissues-oi-text"],
  "oi-amount": ["tsup-orderissues-oi-amount"],
  "oi-chip": ["tsup-orderissues-oi-chip"],
  "oi-chip-cod": ["tsup-orderissues-oi-chip-cod"],
  "oi-chip-prepaid": ["tsup-orderissues-oi-chip-prepaid"],
  "oi-chip-other": ["tsup-orderissues-oi-chip-other"],
  "oi-notes": ["tsup-orderissues-oi-notes"],
  "oi-notes-origin": ["tsup-orderissues-oi-notes-origin"],
  "oi-notes-reason": ["tsup-orderissues-oi-notes-reason"],
  "oi-open-card": ["tsup-orderissues-oi-open-card"],
  "oi-open-header": ["tsup-orderissues-oi-open-header"],
  "oi-open-title": ["tsup-orderissues-oi-open-title"],
  "oi-open-text": ["tsup-orderissues-oi-open-text"],
  "oi-open-status": ["tsup-orderissues-oi-open-status"],
  "oi-cancel-btn": ["tsup-orderissues-oi-cancel-btn"],
  "oi-placeholder-card": ["tsup-orderissues-oi-placeholder-card"],
  "oi-placeholder-title": ["tsup-orderissues-oi-placeholder-title"],
  "oi-placeholder-text": ["tsup-orderissues-oi-placeholder-text"]
})[name] || ["tsup-orderissues-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
function statusText(s) {
  return String(s || '').toUpperCase();
}
function getPayable(s) {
  if (s && s.totals && s.totals.payable != null) return Number(s.totals.payable);
  if (s && s.total != null) return Number(s.total);
  if (Array.isArray(s?.items) && s.items.length) {
    return s.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
  }
  return 0;
}
function getCustomerLabel(s) {
  const name = s?.customer_name && String(s.customer_name).trim();
  if (name) return name;
  if (s?.branch_id) return `Branch #${s.branch_id}`;
  return '-';
}
function getPaymentType(s) {
  const raw = statusText(s?.payment_status || 'COD');
  if (raw.includes('COD')) return 'COD';
  if (raw.includes('PREPAID') || raw.includes('ONLINE') || raw.includes('PAID')) return 'PREPAID';
  return 'OTHER';
}
function fmtAmount(n) {
  return `₹${Number(n || 0).toFixed(2)}`;
}
function refundStatusLabel(r) {
  const ref = statusText(r.refund_status || '');
  const st = statusText(r.status || '');
  if (ref === 'REFUNDED') return 'Refund completed';
  if (ref === 'PENDING_REFUND') return 'Refund approved';
  if (st === 'REQUESTED') return 'Pending review';
  if (st === 'APPROVED') return 'Approved';
  if (st === 'REJECTED') return 'Rejected';
  return ref || st || '-';
}
export default function OrderIssues() {
  const navigate = useNavigate();
  const {
    token, user
  } = useAuth();
  const selectedBranchId = user?.branch_id || 'ALL';
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cancellations');
  const [q, setQ] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSale, setPopupSale] = useState(null);
  const [popupSubmitting, setPopupSubmitting] = useState(false);
  const [cancelBusyId, setCancelBusyId] = useState(null);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [returnsError, setReturnsError] = useState('');
  const [returnsList, setReturnsList] = useState([]);
  const [returnsLoaded, setReturnsLoaded] = useState(false);
  const [refundsLoading, setRefundsLoading] = useState(false);
  const [refundsError, setRefundsError] = useState('');
  const [refundsList, setRefundsList] = useState([]);
  const [refundsLoaded, setRefundsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, q, paymentFilter, selectedBranchId]);
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`
    } : {};
  }, [token]);
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
  const branchFilteredSales = useMemo(() => {
    if (selectedBranchId === 'ALL') return sales;
    return sales.filter(s => String(s.branch_id) === String(selectedBranchId));
  }, [sales, selectedBranchId]);
  const cancelledOrders = useMemo(() => branchFilteredSales.filter(s => statusText(s.status) === 'CANCELLED'), [branchFilteredSales]);
  const filteredOrders = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return branchFilteredSales.filter(s => {
      const payType = getPaymentType(s);
      const okPayment = paymentFilter === 'ALL' ? true : payType === paymentFilter;
      const hay = [s.id, getCustomerLabel(s), s.customer_email, s.customer_mobile, s.status, s.payment_status].join(' ').toLowerCase();
      const okQ = ql ? hay.includes(ql) : true;
      return okPayment && okQ;
    });
  }, [branchFilteredSales, paymentFilter, q]);
  const totalCancellationsPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedCancellations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);
  const summary = useMemo(() => {
    const total = cancelledOrders.length;
    const cod = cancelledOrders.filter(s => getPaymentType(s) === 'COD').length;
    const prepaid = cancelledOrders.filter(s => getPaymentType(s) === 'PREPAID').length;
    const totalAmount = cancelledOrders.reduce((acc, s) => acc + getPayable(s), 0);
    return {
      total,
      cod,
      prepaid,
      totalAmount
    };
  }, [cancelledOrders]);
  const openCancelPopupForSale = sale => {
    if (!sale) return;
    setPopupSale(sale);
    setPopupOpen(true);
  };
  const closeCancelPopup = () => {
    setPopupOpen(false);
    setPopupSale(null);
    setPopupSubmitting(false);
    setCancelBusyId(null);
  };
  const handleAdminConfirmCancel = async reasonText => {
    if (!popupSale) return;
    setPopupSubmitting(true);
    setCancelBusyId(popupSale.id);
    const payType = getPaymentType(popupSale);
    try {
      await fetch(`${API_BASE}/api/orders/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          sale_id: popupSale.id,
          payment_type: payType,
          reason: reasonText,
          source: 'admin'
        })
      });
      const trimmedReason = reasonText && reasonText.trim() ? reasonText.trim() : '';
      const nowIso = new Date().toISOString();
      setSales(prev => prev.map(s => s.id === popupSale.id ? {
        ...s,
        status: 'CANCELLED',
        updated_at: nowIso,
        cancellation_source: 'admin',
        cancellation_reason: trimmedReason || s.cancellation_reason,
        cancellation_created_at: nowIso
      } : s));
      closeCancelPopup();
    } catch {
      setPopupSubmitting(false);
      setCancelBusyId(null);
    }
  };
  const fetchReturns = useCallback(async () => {
    setReturnsLoading(true);
    setReturnsError('');
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/returns/admin`, {
        headers: authHeaders
      });
      if (!res.ok) throw new Error('Unable to load returns');
      const data = await res.json();
      setReturnsList(Array.isArray(data.rows || data) ? data.rows || data : []);
      setReturnsLoaded(true);
    } catch (e) {
      setReturnsError(e.message || 'Could not load returns');
      setReturnsList([]);
    } finally {
      setReturnsLoading(false);
    }
  }, [token, authHeaders]);
  const fetchRefunds = useCallback(async () => {
    setRefundsLoading(true);
    setRefundsError('');
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/returns/admin/refunds`, {
        headers: authHeaders
      });
      if (!res.ok) throw new Error('Unable to load refunds');
      const data = await res.json();
      setRefundsList(Array.isArray(data.rows || data) ? data.rows || data : []);
      setRefundsLoaded(true);
    } catch (e) {
      setRefundsError(e.message || 'Could not load refunds');
      setRefundsList([]);
    } finally {
      setRefundsLoading(false);
    }
  }, [token, authHeaders]);
  useEffect(() => {
    if (activeTab === 'returns' && !returnsLoaded && !returnsLoading) {
      fetchReturns();
    }
    if (activeTab === 'refunds' && !refundsLoaded && !refundsLoading) {
      fetchRefunds();
    }
  }, [activeTab, returnsLoaded, returnsLoading, refundsLoaded, refundsLoading, fetchReturns, fetchRefunds]);
  const filteredReturns = useMemo(() => {
    if (selectedBranchId === 'ALL') return returnsList;
    return returnsList.filter(r => {
      const bId = r.branch_id || r.sale?.branch_id || r.sale_branch_id;
      if (!bId) return true;
      return String(bId) === String(selectedBranchId);
    });
  }, [returnsList, selectedBranchId]);
  const totalReturnsPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const paginatedReturns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReturns.slice(start, start + itemsPerPage);
  }, [filteredReturns, currentPage]);
  const filteredRefunds = useMemo(() => {
    if (selectedBranchId === 'ALL') return refundsList;
    return refundsList.filter(r => {
      const bId = r.branch_id || r.sale?.branch_id || r.sale_branch_id;
      if (!bId) return true;
      return String(bId) === String(selectedBranchId);
    });
  }, [refundsList, selectedBranchId]);
  const totalRefundsPages = Math.ceil(filteredRefunds.length / itemsPerPage);
  const paginatedRefunds = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRefunds.slice(start, start + itemsPerPage);
  }, [filteredRefunds, currentPage]);
  return <div className={portalClass("oi-screen")}>
      
      
      <div className={portalClass("oi-layout")}>
        <header className={portalClass("oi-header")}>
          <div className={portalClass("oi-header-main")}>
            <h1 className={portalClass("oi-title")}>Cancel / Return / Refund Center</h1>
            <p className={portalClass("oi-subtitle")}>
              See all order problems in one place and keep customers informed.
            </p>
          </div>
          <div className={portalClass("oi-header-actions")}>
            <button className={portalClass("oi-refresh-btn")} onClick={() => {
            fetchSales();
            if (activeTab === 'returns') fetchReturns();
            if (activeTab === 'refunds') fetchRefunds();
          }}>
              <span className={portalClass("oi-refresh-dot")} />
              <span className="tsup-orderissues-node-6">Refresh data</span>
            </button>
          </div>
        </header>

        <div className={portalClass("oi-tabs")}>
          <button className={portalClass(`oi-tab ${activeTab === 'cancellations' ? 'oi-tab-active' : ''}`)} onClick={() => setActiveTab('cancellations')}>
            Cancellations
          </button>
          <button className={portalClass(`oi-tab ${activeTab === 'returns' ? 'oi-tab-active' : ''}`)} onClick={() => setActiveTab('returns')}>
            Returns
          </button>
          <button className={portalClass(`oi-tab ${activeTab === 'refunds' ? 'oi-tab-active' : ''}`)} onClick={() => setActiveTab('refunds')}>
            Refunds
          </button>
        </div>

        {activeTab === 'cancellations' && <>
            <section className={portalClass("oi-summary")}>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>Cancelled orders</div>
                <div className={portalClass("oi-summary-value")}>{summary.total}</div>
                <div className={portalClass("oi-summary-note")}>Across all payment types</div>
              </div>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>COD cancellations</div>
                <div className={portalClass("oi-summary-value")}>{summary.cod}</div>
                <div className={portalClass("oi-summary-note")}>Useful for courier follow up</div>
              </div>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>Prepaid cancellations</div>
                <div className={portalClass("oi-summary-value")}>{summary.prepaid}</div>
                <div className={portalClass("oi-summary-note")}>Needs refund handling</div>
              </div>
              <div className={portalClass("oi-summary-card")}>
                <div className={portalClass("oi-summary-label")}>Cancelled order value</div>
                <div className={portalClass("oi-summary-value")}>{fmtAmount(summary.totalAmount)}</div>
                <div className={portalClass("oi-summary-note")}>Total of cancelled orders</div>
              </div>
            </section>

            <section className={portalClass("oi-filters")}>
              <div className={portalClass("oi-filter-group")}>
                <label className={portalClass("oi-filter-label")}>Payment type</label>
                <select className={portalClass("oi-filter-select")} value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)}>
                  <option value="ALL" className="tsup-orderissues-node-7">All</option>
                  <option value="COD" className="tsup-orderissues-node-8">COD</option>
                  <option value="PREPAID" className="tsup-orderissues-node-9">Prepaid</option>
                  <option value="OTHER" className="tsup-orderissues-node-10">Other</option>
                </select>
              </div>
              <div className={portalClass("oi-filter-group oi-filter-search")}>
                <label className={portalClass("oi-filter-label")}>Search</label>
                <div className={portalClass("oi-filter-search-wrap")}>
                  <span className={portalClass("oi-filter-search-icon")} />
                  <input className={portalClass("oi-filter-input")} placeholder="Search by order id, name, email or mobile" value={q} onChange={e => setQ(e.target.value)} />
                </div>
              </div>
              <div className={portalClass("oi-filter-helper")}>
                Use this view to see cancelled orders, who cancelled them, and cancel new orders
                when needed.
              </div>
            </section>

            <section className={portalClass("oi-table-card")}>
              {loading ? <div className={portalClass("oi-loader")}>
                  <div className={portalClass("oi-spinner")} />
                  <span className={portalClass("oi-loader-text")}>Loading orders</span>
                </div> : filteredOrders.length === 0 ? <div className={portalClass("oi-empty")}>
                  <div className={portalClass("oi-empty-icon")} />
                  <h3 className={portalClass("oi-empty-title")}>No orders found</h3>
                  <p className={portalClass("oi-empty-text")}>
                    When an order is cancelled, it will show up here with who cancelled and the
                    reason.
                  </p>
                </div> : <div className={portalClass("oi-table-scroller")}>
                  <table className={portalClass("oi-table")}>
                    <thead className="tsup-orderissues-node-11">
                      <tr className="tsup-orderissues-node-12">
                        <th className={portalClass("oi-th")}>Order</th>
                        <th className={portalClass("oi-th")}>Placed on</th>
                        <th className={portalClass("oi-th")}>Status</th>
                        <th className={portalClass("oi-th")}>Payment</th>
                        <th className={portalClass("oi-th")}>Customer</th>
                        <th className={portalClass("oi-th")}>Mobile</th>
                        <th className={portalClass("oi-th")}>Email</th>
                        <th className={portalClass("oi-th")}>Amount</th>
                        <th className={portalClass("oi-th")}>Cancel / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="tsup-orderissues-node-13">
                      {paginatedCancellations.map(s => {
                  const payType = getPaymentType(s);
                  const orderStatus = statusText(s.status);
                  const isCancelled = orderStatus === 'CANCELLED';
                  const cancelledAt = s.cancellation_created_at || s.updated_at || s.created_at;
                  const cancelledTime = cancelledAt ? new Date(cancelledAt).toLocaleString() : '-';
                  const reason = s.cancellation_reason || s.cancellation_notes || s.cancellation_comment || '';
                  const originRaw = s.cancellation_source || s.cancelled_by || '';
                  const originLower = String(originRaw || '').toLowerCase();
                  let originLabel = 'Cancelled';
                  if (isCancelled) {
                    if (originLower.includes('admin')) {
                      originLabel = 'Cancelled by you';
                    } else if (originLower.includes('user') || originLower.includes('customer') || originLower.includes('web')) {
                      originLabel = 'Cancelled by the user';
                    } else if (originLower.includes('system') || originLower.includes('auto')) {
                      originLabel = 'Cancelled automatically';
                    } else if (!originLower) {
                      originLabel = 'Cancelled';
                    } else {
                      originLabel = `Cancelled (${originRaw})`;
                    }
                  }
                  const isBusy = cancelBusyId === s.id && popupSubmitting;
                  const canCancelNow = !isCancelled && !orderStatus.includes('DELIVERED') && !orderStatus.includes('RTO');
                  return <tr key={s.id} className={portalClass("oi-tr")}>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-pill-id")}>#{s.id}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-muted")}>
                                {s.created_at ? new Date(s.created_at).toLocaleString() : '-'}
                              </span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-status-text")}>{orderStatus || '-'}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass(`oi-chip oi-chip-${payType.toLowerCase()}`)}>
                                {payType}
                              </span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-strong")}>{getCustomerLabel(s)}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-text")}>{s.customer_mobile || '-'}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-muted")}>{s.customer_email || '-'}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              <span className={portalClass("oi-amount")}>{fmtAmount(getPayable(s))}</span>
                            </td>
                            <td className={portalClass("oi-td")}>
                              {isCancelled ? <div className={portalClass("oi-notes")}>
                                  <div className={portalClass("oi-notes-origin")}>
                                    {originLabel} · {cancelledTime}
                                  </div>
                                  <div className={portalClass("oi-notes-reason")}>
                                    {reason ? reason : 'No reason captured'}
                                  </div>
                                </div> : <button className={portalClass("oi-cancel-btn")} disabled={isBusy || !canCancelNow} onClick={() => openCancelPopupForSale(s)}>
                                  {isBusy ? 'Cancelling…' : 'Cancel order'}
                                </button>}
                            </td>
                          </tr>;
                })}
                    </tbody>
                  </table>
                  
                  {totalCancellationsPages > 1 && <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              padding: '16px',
              borderTop: '1px solid #333'
            }} className="tsup-orderissues-node-14">
                      <button className={portalClass("oi-refresh-btn")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        Previous
                      </button>
                      <span style={{
                color: "#42536a",
                fontWeight: 'bold',
                alignSelf: 'center'
              }} className="tsup-orderissues-node-15">Page {currentPage} of {totalCancellationsPages}</span>
                      <button className={portalClass("oi-refresh-btn")} onClick={() => setCurrentPage(p => Math.min(totalCancellationsPages, p + 1))} disabled={currentPage === totalCancellationsPages}>
                        Next
                      </button>
                    </div>}

                </div>}
            </section>
          </>}

        {activeTab === 'returns' && <section className={portalClass("oi-table-card")}>
            {returnsLoading ? <div className={portalClass("oi-loader")}>
                <div className={portalClass("oi-spinner")} />
                <span className={portalClass("oi-loader-text")}>Loading returns</span>
              </div> : returnsError ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>Could not load returns</h3>
                <p className={portalClass("oi-empty-text")}>{returnsError}</p>
                <button className={portalClass("oi-refresh-btn")} onClick={fetchReturns}>
                  <span className={portalClass("oi-refresh-dot")} />
                  <span className="tsup-orderissues-node-16">Retry</span>
                </button>
              </div> : filteredReturns.length === 0 ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>No return requests yet</h3>
                <p className={portalClass("oi-empty-text")}>
                  When customers raise a return or replacement request, it will show up here.
                </p>
              </div> : <div className={portalClass("oi-table-scroller")}>
                <table className={portalClass("oi-table")}>
                  <thead className="tsup-orderissues-node-17">
                    <tr className="tsup-orderissues-node-18">
                      <th className={portalClass("oi-th")}>Request</th>
                      <th className={portalClass("oi-th")}>Order</th>
                      <th className={portalClass("oi-th")}>Created</th>
                      <th className={portalClass("oi-th")}>Type</th>
                      <th className={portalClass("oi-th")}>Status</th>
                      <th className={portalClass("oi-th")}>Customer</th>
                      <th className={portalClass("oi-th")}>Mobile</th>
                      <th className={portalClass("oi-th")}>Email</th>
                      <th className={portalClass("oi-th")}>Amount</th>
                      <th className={portalClass("oi-th")}>Reason</th>
                      <th className={portalClass("oi-th")}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="tsup-orderissues-node-19">
                    {paginatedReturns.map(r => {
                const createdAt = r.created_at ? new Date(r.created_at).toLocaleString() : '-';
                const status = statusText(r.status || '');
                const type = statusText(r.type || '');
                const amount = r.sale_totals && r.sale_totals.payable != null ? Number(r.sale_totals.payable) : r.amount || 0;
                return <tr key={r.id} className={portalClass("oi-tr")}>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>RR#{String(r.id).slice(0, 8)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>#{r.sale_id}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-muted")}>{createdAt}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-status-text")}>{type || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-status-text")}>{status || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-strong")}>{r.customer_name || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.customer_mobile || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-muted")}>{r.customer_email || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-amount")}>{fmtAmount(amount)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>
                              {r.reason || r.reason_code || 'Not specified'}
                            </span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <button className={portalClass("oi-cancel-btn")} onClick={() => navigate(`/returns/${r.id}`)}>
                              Review
                            </button>
                          </td>
                        </tr>;
              })}
                  </tbody>
                </table>
                
                {totalReturnsPages > 1 && <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            padding: '16px',
            borderTop: '1px solid #333'
          }} className="tsup-orderissues-node-20">
                    <button className={portalClass("oi-refresh-btn")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span style={{
              color: "#42536a",
              fontWeight: 'bold',
              alignSelf: 'center'
            }} className="tsup-orderissues-node-21">Page {currentPage} of {totalReturnsPages}</span>
                    <button className={portalClass("oi-refresh-btn")} onClick={() => setCurrentPage(p => Math.min(totalReturnsPages, p + 1))} disabled={currentPage === totalReturnsPages}>
                      Next
                    </button>
                  </div>}
              </div>}
          </section>}

        {activeTab === 'refunds' && <section className={portalClass("oi-table-card")}>
            {refundsLoading ? <div className={portalClass("oi-loader")}>
                <div className={portalClass("oi-spinner")} />
                <span className={portalClass("oi-loader-text")}>Loading refunds</span>
              </div> : refundsError ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>Could not load refunds</h3>
                <p className={portalClass("oi-empty-text")}>{refundsError}</p>
                <button className={portalClass("oi-refresh-btn")} onClick={fetchRefunds}>
                  <span className={portalClass("oi-refresh-dot")} />
                  <span className="tsup-orderissues-node-22">Retry</span>
                </button>
              </div> : filteredRefunds.length === 0 ? <div className={portalClass("oi-empty")}>
                <div className={portalClass("oi-empty-icon")} />
                <h3 className={portalClass("oi-empty-title")}>No refunds logged yet</h3>
                <p className={portalClass("oi-empty-text")}>
                  When refunds are initiated, they will show up here with amount and status.
                </p>
              </div> : <div className={portalClass("oi-table-scroller")}>
                <table className={portalClass("oi-table")}>
                  <thead className="tsup-orderissues-node-23">
                    <tr className="tsup-orderissues-node-24">
                      <th className={portalClass("oi-th")}>Refund</th>
                      <th className={portalClass("oi-th")}>Order</th>
                      <th className={portalClass("oi-th")}>Request</th>
                      <th className={portalClass("oi-th")}>Amount</th>
                      <th className={portalClass("oi-th")}>Mode</th>
                      <th className={portalClass("oi-th")}>Status</th>
                      <th className={portalClass("oi-th")}>Initiated by</th>
                      <th className={portalClass("oi-th")}>Created</th>
                      <th className={portalClass("oi-th")}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="tsup-orderissues-node-25">
                    {paginatedRefunds.map(r => {
                const createdAt = r.created_at ? new Date(r.created_at).toLocaleString() : '-';
                return <tr key={r.id} className={portalClass("oi-tr")}>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>RF#{String(r.id).slice(0, 8)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-pill-id")}>#{r.sale_id}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>
                              {r.return_request_id ? String(r.return_request_id).slice(0, 8) : '-'}
                            </span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-amount")}>{fmtAmount(r.amount)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.mode || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-status-text")}>{refundStatusLabel(r)}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.initiated_by || '-'}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-muted")}>{createdAt}</span>
                          </td>
                          <td className={portalClass("oi-td")}>
                            <span className={portalClass("oi-text")}>{r.remarks || '-'}</span>
                          </td>
                        </tr>;
              })}
                  </tbody>
                </table>
                
                {totalRefundsPages > 1 && <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            padding: '16px',
            borderTop: '1px solid #333'
          }} className="tsup-orderissues-node-26">
                    <button className={portalClass("oi-refresh-btn")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span style={{
              color: "#42536a",
              fontWeight: 'bold',
              alignSelf: 'center'
            }} className="tsup-orderissues-node-27">Page {currentPage} of {totalRefundsPages}</span>
                    <button className={portalClass("oi-refresh-btn")} onClick={() => setCurrentPage(p => Math.min(totalRefundsPages, p + 1))} disabled={currentPage === totalRefundsPages}>
                      Next
                    </button>
                  </div>}
              </div>}
          </section>}
      </div>

      <OrderCancelPopup open={popupOpen} sale={popupSale} onClose={closeCancelPopup} onConfirm={handleAdminConfirmCancel} isSubmitting={popupSubmitting} />
    </div>;
}
