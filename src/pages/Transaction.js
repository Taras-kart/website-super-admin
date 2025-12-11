import React, { useEffect, useMemo, useState } from 'react';
import './Transaction.css';
import Navbar from './NavbarAdmin';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');

const toArray = (x) => (Array.isArray(x) ? x : []);
const toNum = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const toDate = (v) => {
  const d = v ? new Date(v) : null;
  return d && !isNaN(d.valueOf()) ? d : null;
};
const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(toNum(n));

export default function Transaction() {
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

  const fetchTx = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      const data = res.ok ? await res.json() : [];
      setRaw(toArray(data));
    } catch {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, []);

  const rows = useMemo(
    () =>
      toArray(raw).map((t, idx) => {
        const id = t.id ?? t.order_id ?? t.transaction_id ?? idx + 1;
        const transactionId = t.transaction_id ?? t.order_id ?? `ORD-${id}`;
        const productName =
          t.productName ??
          t.product_name ??
          (Array.isArray(t.items) && t.items.length ? t.items[0].product_name ?? t.items[0].name ?? '' : '') ??
          t.title ??
          '';
        const date =
          t.date ??
          t.created_at ??
          t.createdAt ??
          t.order_date ??
          t.ordered_at ??
          new Date().toISOString();
        const statusRaw = String(t.status ?? t.payment_status ?? 'completed').toLowerCase();
        const status =
          statusRaw.includes('pend') ? 'Pending' :
          statusRaw.includes('refund') ? 'Refunded' :
          statusRaw.includes('fail') || statusRaw.includes('declin') || statusRaw.includes('cancel') ? 'Failed' :
          'Completed';
        const amount = toNum(t.amount ?? t.total ?? t.total_amount ?? t.grand_total ?? t.final_amount ?? 0);
        return { id, transactionId, productName, date, status, amount };
      }),
    [raw]
  );

  const counts = useMemo(() => {
    const total = rows.length;
    const revenue = rows.filter((r) => r.status === 'Completed').reduce((a, b) => a + b.amount, 0);
    const pending = rows.filter((r) => r.status === 'Pending').length;
    const refunded = rows.filter((r) => r.status === 'Refunded').length;
    const failed = rows.filter((r) => r.status === 'Failed').length;
    return { total, revenue, pending, refunded, failed };
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (statusChip !== 'All') list = list.filter((r) => r.status === statusChip);
    if (statusSel !== 'All') list = list.filter((r) => r.status === statusSel);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.transactionId.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q)
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom + 'T00:00:00');
      list = list.filter((r) => {
        const d = toDate(r.date);
        return d ? d >= from : true;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59');
      list = list.filter((r) => {
        const d = toDate(r.date);
        return d ? d <= to : true;
      });
    }
    if (minAmt !== '') list = list.filter((r) => r.amount >= toNum(minAmt));
    if (maxAmt !== '') list = list.filter((r) => r.amount <= toNum(maxAmt));
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => (toDate(b.date)?.getTime() ?? 0) - (toDate(a.date)?.getTime() ?? 0));
    if (sortBy === 'amount_desc') sorted.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'amount_asc') sorted.sort((a, b) => a.amount - b.amount);
    if (sortBy === 'product_asc') sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    if (sortBy === 'status_asc') sorted.sort((a, b) => a.status.localeCompare(b.status));
    return sorted;
  }, [rows, statusChip, statusSel, search, dateFrom, dateTo, minAmt, maxAmt, sortBy]);

  const deleteRow = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setRaw((prev) => prev.filter((r) => (r.id ?? r.order_id ?? r.transaction_id) !== id));
      setPopupMessage('Transaction deleted');
      setTimeout(() => setPopupMessage(''), 1500);
    } catch {
      setPopupMessage('Failed to delete');
      setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  const handleDeleteTransaction = (id) => {
    setConfirmId(id);
    setShowConfirm(true);
  };

  const exportCsv = () => {
    const headers = ['Transaction ID', 'Product Name', 'Date', 'Status', 'Amount'];
    const lines = [headers.join(',')].concat(
      filtered.map((r) =>
        [
          `"${r.transactionId}"`,
          `"${r.productName.replace(/"/g, '""')}"`,
          `"${toDate(r.date)?.toISOString()?.slice(0, 19).replace('T', ' ') ?? ''}"`,
          `"${r.status}"`,
          r.amount
        ].join(',')
      )
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions">
      <Navbar />
      <div className="transaction-page">
        <div className="transaction-header">
          <h2>Transaction History</h2>
          <p>Manage and track all transactions</p>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-title">Total</div>
              <div className="stat-value">{counts.total}</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-title">Revenue</div>
              <div className="stat-value">{fmtINR(counts.revenue)}</div>
            </div>
            <div className="stat-card warn">
              <div className="stat-title">Pending</div>
              <div className="stat-value">{counts.pending}</div>
            </div>
            <div className="stat-card info">
              <div className="stat-title">Refunded</div>
              <div className="stat-value">{counts.refunded}</div>
            </div>
            <div className="stat-card danger">
              <div className="stat-title">Failed</div>
              <div className="stat-value">{counts.failed}</div>
            </div>
          </div>
        </div>

        <div className="chip-bar">
          {['All', 'Completed', 'Pending', 'Refunded', 'Failed'].map((c) => (
            <button key={c} className={`chip ${statusChip === c ? 'active' : ''}`} onClick={() => setStatusChip(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="transaction-filter">
          <h3>Filter Transactions</h3>
          <div className="filter-grid">
            <input
              type="text"
              placeholder="Search by ID or Product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={statusSel} onChange={(e) => setStatusSel(e.target.value)}>
              <option value="All">Status: All</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            <input
              type="number"
              placeholder="Min Amount"
              value={minAmt}
              onChange={(e) => setMinAmt(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Amount"
              value={maxAmt}
              onChange={(e) => setMaxAmt(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Sort: Recent</option>
              <option value="amount_desc">Amount: High → Low</option>
              <option value="amount_asc">Amount: Low → High</option>
              <option value="product_asc">Product: A → Z</option>
              <option value="status_asc">Status: A → Z</option>
            </select>
            <button onClick={fetchTx}>{loading ? 'Loading...' : 'Refresh'}</button>
            <button onClick={exportCsv}>Export CSV</button>
          </div>
        </div>

        <div className="transaction-table">
          <h3>Transaction Details</h3>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Product Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.productName || '-'}</td>
                  <td>{toDate(transaction.date)?.toLocaleString() || '-'}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        transaction.status === 'Completed'
                          ? 'ok'
                          : transaction.status === 'Pending'
                          ? 'warn'
                          : transaction.status === 'Refunded'
                          ? 'info'
                          : 'danger'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td>{fmtINR(transaction.amount)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="6" style={{ padding: 16, color: 'gold' }}>
                    No matching transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {popupMessage && <div className="popup-card">{popupMessage}</div>}

        {showConfirm && (
          <div className="popup-confirm-box centered-popup">
            <p>Delete this transaction permanently?</p>
            <div className="popup-actions">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  if (confirmId !== null) deleteRow(confirmId);
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmId(null);
                }}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
