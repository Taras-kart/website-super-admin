import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Transaction.css';
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
  "transaction-page": ["tsup-transaction-transaction-page"],
  "transaction-header": ["tsup-transaction-transaction-header"],
  "stats-row": ["tsup-transaction-stats-row"],
  "stat-card": ["tsup-transaction-stat-card"],
  "accent": ["tsup-transaction-accent"],
  "warn": ["tsup-transaction-warn"],
  "info": ["tsup-transaction-info"],
  "danger": ["tsup-transaction-danger"],
  "stat-title": ["tsup-transaction-stat-title"],
  "stat-value": ["tsup-transaction-stat-value"],
  "chip-bar": ["tsup-transaction-chip-bar"],
  "chip": ["tsup-transaction-chip"],
  "active": ["tsup-transaction-active"],
  "transaction-filter": ["tsup-transaction-transaction-filter"],
  "filter-grid": ["tsup-transaction-filter-grid"],
  "transaction-table": ["tsup-transaction-transaction-table"],
  "status-pill": ["tsup-transaction-status-pill"],
  "ok": ["tsup-transaction-ok"],
  "delete-btn": ["tsup-transaction-delete-btn"],
  "popup-card": ["tsup-transaction-popup-card"],
  "popup-confirm-box": ["tsup-transaction-popup-confirm-box"],
  "centered-popup": ["tsup-transaction-centered-popup"],
  "popup-actions": ["tsup-transaction-popup-actions"]
})[name] || ["tsup-transaction-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const toArray = x => Array.isArray(x) ? x : [];
const toNum = v => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const toDate = v => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.valueOf()) ? d : null;
};
const fmtINR = n => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
}).format(toNum(n));
export default function Transaction() {
  const {
    token,
    user
  } = useAuth();
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusChip, setStatusChip] = useState('All');
  const [statusSel, setStatusSel] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmt, setMinAmt] = useState('');
  const [maxAmt, setMaxAmt] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`
    } : {};
  }, [token]);
  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const res = await fetch(`${API_BASE}/api/shiprocket/warehouses`, {
          headers: authHeaders
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
  }, [authHeaders]);
  const fetchTx = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: authHeaders
      });
      const data = res.ok ? await res.json() : [];
      setRaw(toArray(data));
    } catch {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);
  useEffect(() => {
    fetchTx();
  }, [fetchTx]);
  const rows = useMemo(() => toArray(raw).map((t, idx) => {
    const id = t.id ?? t.order_id ?? t.transaction_id ?? idx + 1;
    const transactionId = t.transaction_id ?? t.order_id ?? `ORD-${id}`;
    const productName = t.productName ?? t.product_name ?? (Array.isArray(t.items) && t.items.length ? t.items[0].product_name ?? t.items[0].name ?? '' : '') ?? t.title ?? '';
    const date = t.date ?? t.created_at ?? t.createdAt ?? t.order_date ?? t.ordered_at ?? new Date().toISOString();
    const statusRaw = String(t.status ?? t.payment_status ?? 'completed').toLowerCase();
    const status = statusRaw.includes('pend') ? 'Pending' : statusRaw.includes('refund') ? 'Refunded' : statusRaw.includes('fail') || statusRaw.includes('declin') || statusRaw.includes('cancel') ? 'Failed' : 'Completed';
    const amount = toNum(t.amount ?? t.total ?? t.total_amount ?? t.grand_total ?? t.final_amount ?? 0);
    return {
      id,
      transactionId,
      productName,
      date,
      status,
      amount,
      branch_id: t.branch_id || 'WEB'
    };
  }), [raw]);
  const counts = useMemo(() => {
    const total = rows.length;
    const revenue = rows.filter(r => r.status === 'Completed').reduce((a, b) => a + b.amount, 0);
    const pending = rows.filter(r => r.status === 'Pending').length;
    const refunded = rows.filter(r => r.status === 'Refunded').length;
    const failed = rows.filter(r => r.status === 'Failed').length;
    return {
      total,
      revenue,
      pending,
      refunded,
      failed
    };
  }, [rows]);
  const filtered = useMemo(() => {
    let list = rows;
    if (selectedBranchId !== 'ALL') {
      list = list.filter(r => String(r.branch_id) === String(selectedBranchId));
    }
    if (statusChip !== 'All') list = list.filter(r => r.status === statusChip);
    if (statusSel !== 'All') list = list.filter(r => r.status === statusSel);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => r.transactionId.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q));
    }
    if (dateFrom) {
      const from = new Date(dateFrom + 'T00:00:00');
      list = list.filter(r => {
        const d = toDate(r.date);
        return d ? d >= from : true;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59');
      list = list.filter(r => {
        const d = toDate(r.date);
        return d ? d <= to : true;
      });
    }
    if (minAmt !== '') list = list.filter(r => r.amount >= toNum(minAmt));
    if (maxAmt !== '') list = list.filter(r => r.amount <= toNum(maxAmt));
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => (toDate(b.date)?.getTime() ?? 0) - (toDate(a.date)?.getTime() ?? 0));
    if (sortBy === 'amount_desc') sorted.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount_asc') sorted.sort((a, b) => a.amount - b.amount);
    if (sortBy === 'product_asc') sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    if (sortBy === 'status_asc') sorted.sort((a, b) => a.status.localeCompare(b.status));
    return sorted;
  }, [rows, statusChip, statusSel, search, dateFrom, dateTo, minAmt, maxAmt, sortBy, selectedBranchId]);
  useEffect(() => {
    setCurrentPage(1);
  }, [statusChip, statusSel, search, dateFrom, dateTo, minAmt, maxAmt, sortBy, selectedBranchId]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);
  const deleteRow = async id => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (!res.ok) throw new Error();
      setRaw(prev => prev.filter(r => (r.id ?? r.order_id ?? r.transaction_id) !== id));
      setPopupMessage('Transaction deleted');
      setTimeout(() => setPopupMessage(''), 1500);
    } catch {
      setPopupMessage('Failed to delete');
      setTimeout(() => setPopupMessage(''), 2000);
    }
  };
  const handleDeleteTransaction = id => {
    setConfirmId(id);
    setShowConfirm(true);
  };
  const exportCsv = () => {
    const headers = ['Transaction ID', 'Branch', 'Product Name', 'Date', 'Status', 'Amount'];
    const lines = [headers.join(',')].concat(filtered.map(r => [`"${r.transactionId}"`, `"${r.branch_id}"`, `"${r.productName.replace(/"/g, '""')}"`, `"${toDate(r.date)?.toISOString()?.slice(0, 19).replace('T', ' ') ?? ''}"`, `"${r.status}"`, r.amount].join(',')));
    const blob = new Blob([lines.join('\n')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return <div className={portalClass("transactions")}>
      
      
      {}
      <div style={{
      padding: '16px 24px',
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #dce3ec",
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }} className="tsup-transaction-node-0">
        <h3 style={{
        margin: 0,
        color: "#42536a"
      }} className="tsup-transaction-node-1">Select Branch Context:</h3>
        {loadingWarehouses ? <span style={{
        color: "#42536a"
      }} className="tsup-transaction-node-2">Loading branches...</span> : <select style={{
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: "#ffffff",
        color: "#42536a",
        border: '1px solid gold',
        fontSize: '14px',
        minWidth: '250px'
      }} value={selectedBranchId} onChange={e => setSelectedBranchId(e.target.value)} className="tsup-transaction-node-3">
            <option value="ALL" className="tsup-transaction-node-4">All Branches (Global View)</option>
            {warehouses.map(w => <option key={w.id} value={w.id} className="tsup-transaction-node-5">
                {w.name} ({w.city})
              </option>)}
          </select>}
      </div>

      <div className={portalClass("transaction-page")}>
        <div className={portalClass("transaction-header")}>
          <h2 className="tsup-transaction-node-6">Transaction History</h2>
          <p className="tsup-transaction-node-7">Manage and track all transactions</p>
          <div className={portalClass("stats-row")}>
            <div className={portalClass("stat-card")}>
              <div className={portalClass("stat-title")}>Total</div>
              <div className={portalClass("stat-value")}>{counts.total}</div>
            </div>
            <div className={portalClass("stat-card accent")}>
              <div className={portalClass("stat-title")}>Revenue</div>
              <div className={portalClass("stat-value")}>{fmtINR(counts.revenue)}</div>
            </div>
            <div className={portalClass("stat-card warn")}>
              <div className={portalClass("stat-title")}>Pending</div>
              <div className={portalClass("stat-value")}>{counts.pending}</div>
            </div>
            <div className={portalClass("stat-card info")}>
              <div className={portalClass("stat-title")}>Refunded</div>
              <div className={portalClass("stat-value")}>{counts.refunded}</div>
            </div>
            <div className={portalClass("stat-card danger")}>
              <div className={portalClass("stat-title")}>Failed</div>
              <div className={portalClass("stat-value")}>{counts.failed}</div>
            </div>
          </div>
        </div>

        <div className={portalClass("chip-bar")}>
          {['All', 'Completed', 'Pending', 'Refunded', 'Failed'].map(c => <button key={c} className={portalClass(`chip ${statusChip === c ? 'active' : ''}`)} onClick={() => setStatusChip(c)}>
              {c}
            </button>)}
        </div>

        <div className={portalClass("transaction-filter")}>
          <h3 className="tsup-transaction-node-8">Filter Transactions</h3>
          <div className={portalClass("filter-grid")}>
            <input type="text" placeholder="Search by ID or Product" value={search} onChange={e => setSearch(e.target.value)} className="tsup-transaction-node-9" />
            <select value={statusSel} onChange={e => setStatusSel(e.target.value)} className="tsup-transaction-node-10">
              <option value="All" className="tsup-transaction-node-11">Status: All</option>
              <option value="Completed" className="tsup-transaction-node-12">Completed</option>
              <option value="Pending" className="tsup-transaction-node-13">Pending</option>
              <option value="Refunded" className="tsup-transaction-node-14">Refunded</option>
              <option value="Failed" className="tsup-transaction-node-15">Failed</option>
            </select>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="tsup-transaction-node-16" />
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="tsup-transaction-node-17" />
            <input type="number" placeholder="Min Amount" value={minAmt} onChange={e => setMinAmt(e.target.value)} className="tsup-transaction-node-18" />
            <input type="number" placeholder="Max Amount" value={maxAmt} onChange={e => setMaxAmt(e.target.value)} className="tsup-transaction-node-19" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="tsup-transaction-node-20">
              <option value="recent" className="tsup-transaction-node-21">Sort: Recent</option>
              <option value="amount_desc" className="tsup-transaction-node-22">Amount: High → Low</option>
              <option value="amount_asc" className="tsup-transaction-node-23">Amount: Low → High</option>
              <option value="product_asc" className="tsup-transaction-node-24">Product: A → Z</option>
              <option value="status_asc" className="tsup-transaction-node-25">Status: A → Z</option>
            </select>
            <button onClick={fetchTx} className="tsup-transaction-node-26">{loading ? 'Loading...' : 'Refresh'}</button>
            <button onClick={exportCsv} className="tsup-transaction-node-27">Export CSV</button>
          </div>
        </div>

        <div className={portalClass("transaction-table")}>
          <h3 className="tsup-transaction-node-28">Transaction Details ({filtered.length})</h3>
          <table className="tsup-transaction-node-29">
            <thead className="tsup-transaction-node-30">
              <tr className="tsup-transaction-node-31">
                <th className="tsup-transaction-node-32">Transaction ID</th>
                <th className="tsup-transaction-node-33">Branch</th>
                <th className="tsup-transaction-node-34">Product Name</th>
                <th className="tsup-transaction-node-35">Date</th>
                <th className="tsup-transaction-node-36">Status</th>
                <th className="tsup-transaction-node-37">Amount</th>
                <th className="tsup-transaction-node-38">Action</th>
              </tr>
            </thead>
            <tbody className="tsup-transaction-node-39">
              {paginatedRows.map(transaction => <tr key={transaction.id} className="tsup-transaction-node-40">
                  <td className="tsup-transaction-node-41">{transaction.transactionId}</td>
                  <td className="tsup-transaction-node-42">{transaction.branch_id}</td>
                  <td className="tsup-transaction-node-43">{transaction.productName || '-'}</td>
                  <td className="tsup-transaction-node-44">{toDate(transaction.date)?.toLocaleString() || '-'}</td>
                  <td className="tsup-transaction-node-45">
                    <span className={portalClass(`status-pill ${transaction.status === 'Completed' ? 'ok' : transaction.status === 'Pending' ? 'warn' : transaction.status === 'Refunded' ? 'info' : 'danger'}`)}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="tsup-transaction-node-46">{fmtINR(transaction.amount)}</td>
                  <td className="tsup-transaction-node-47">
                    <button className={portalClass("delete-btn")} onClick={() => handleDeleteTransaction(transaction.id)}>
                      Delete
                    </button>
                  </td>
                </tr>)}
              {!paginatedRows.length && <tr className="tsup-transaction-node-48">
                  <td colSpan="7" style={{
                padding: 16,
                color: "#42536a"
              }} className="tsup-transaction-node-49">
                    No matching transactions
                  </td>
                </tr>}
            </tbody>
          </table>
          
          {}
          {totalPages > 1 && <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '16px',
          background: "#ffffff",
          marginTop: '10px'
        }} className="tsup-transaction-node-50">
              <button style={{
            padding: '8px 16px',
            background: "#ffffff",
            color: "#42536a",
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="tsup-transaction-node-51">
                Previous
              </button>
              <span style={{
            color: "#42536a",
            fontWeight: 'bold',
            alignSelf: 'center'
          }} className="tsup-transaction-node-52">Page {currentPage} of {totalPages}</span>
              <button style={{
            padding: '8px 16px',
            background: "#ffffff",
            color: "#42536a",
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="tsup-transaction-node-53">
                Next
              </button>
            </div>}
        </div>

        {popupMessage && <div className={portalClass("popup-card")}>{popupMessage}</div>}

        {showConfirm && <div className={portalClass("popup-confirm-box centered-popup")}>
            <p className="tsup-transaction-node-54">Delete this transaction permanently?</p>
            <div className={portalClass("popup-actions")}>
              <button onClick={() => {
            setShowConfirm(false);
            if (confirmId !== null) deleteRow(confirmId);
          }} className="tsup-transaction-node-55">
                Yes
              </button>
              <button onClick={() => {
            setShowConfirm(false);
            setConfirmId(null);
          }} className="tsup-transaction-node-56">
                No
              </button>
            </div>
          </div>}
      </div>
    </div>;
}
