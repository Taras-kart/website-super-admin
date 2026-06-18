import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './NavbarAdmin';
import { useAuth } from './AdminAuth';
import './Sales.css';
import './B2BOrders.css';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');

export default function B2BOrders() {
  const { token, user } = useAuth();
  const [b2bSales, setB2bSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  
  // --- NEW: BRANCH SELECTOR STATE ---
  const [warehouses, setWarehouses] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('ALL');
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);

  // --- NEW: PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // States for our simple B2B Item Popup
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
  }, [token]);

// --- ROBUST FETCH WAREHOUSES ---
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
      let arr = Array.isArray(data) ? data : (data?.data || data?.warehouses || []);
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
  const fetchB2BSales = useCallback(async () => {
    setLoading(true);
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/sales/admin`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json().catch(() => []);
      
      const filteredData = (Array.isArray(data) ? data : []).filter(
        (order) => order.payment_method === 'B2B_BULK'
      );
      
      setB2bSales(filteredData);
    } catch {
      setB2bSales([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchB2BSales();
  }, [fetchB2BSales]);

  // --- NEW: BRANCH FILTERING ---
  const branchFilteredB2BSales = useMemo(() => {
    if (selectedBranchId === 'ALL') return b2bSales;
    return b2bSales.filter(s => String(s.branch_id) === String(selectedBranchId));
  }, [b2bSales, selectedBranchId]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBranchId]);

  // --- NEW: PAGINATE ROWS ---
  const totalPages = Math.ceil(branchFilteredB2BSales.length / itemsPerPage);
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return branchFilteredB2BSales.slice(start, start + itemsPerPage);
  }, [branchFilteredB2BSales, currentPage]);

  const handleUpdateStatus = async (saleId, newStatus, newPaymentStatus) => {
    if (!window.confirm(`Are you sure you want to update this order to ${newStatus || newPaymentStatus}?`)) return;
    
    setActionLoading(saleId);
    try {
      const res = await fetch(`${API_BASE}/api/sales/web/b2b-update-status`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          sale_id: saleId,
          new_status: newStatus,
          new_payment_status: newPaymentStatus
        })
      });

      if (res.ok) {
        fetchB2BSales();
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating order');
    } finally {
      setActionLoading(null);
    }
  };

  const openOrderDetails = async (sale) => {
    setSelectedOrder(sale);
    setItemsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sales/admin/${sale.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrderItems(data.items || []);
    } catch (err) {
      setOrderItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const fmt = (n) => `₹${Number(n || 0).toFixed(2)}`;

  return (
    <div className="orders-screen">
      <Navbar />
      
      {/* --- NEW: BRANCH SELECTOR BAR --- */}
      <div style={{ padding: '16px 24px', backgroundColor: '#111', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, color: 'gold' }}>Select Branch Context:</h3>
        {loadingWarehouses ? (
          <span style={{ color: '#aaa' }}>Loading branches...</span>
        ) : (
          <select 
            style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#000', color: '#fff', border: '1px solid gold', fontSize: '14px', minWidth: '250px' }}
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
          >
            <option value="ALL">All Branches (Global View)</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.city})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="orders-layout">
        
        <div className="orders-header">
          <div className="orders-header-main">
            <h1 className="orders-header-title">Wholesale Inquiries</h1>
            <p className="orders-header-subtitle">Review, approve, and manually manage B2B bulk orders</p>
          </div>
          <div className="orders-header-actions">
            <button className="orders-btn-refresh" onClick={fetchB2BSales}>
              <span className="orders-btn-refresh-icon" />
              <span>Refresh list</span>
            </button>
          </div>
        </div>

        <div className="orders-summary-bar">
          <div className="orders-summary-section">
            <span className="orders-summary-label">Pending Inquiries</span>
            <span className="orders-summary-value">{loading ? 'Loading…' : `${branchFilteredB2BSales.filter(s => s.status === 'B2B_PENDING').length} order(s)`}</span>
          </div>
          <div className="orders-summary-section">
            <span className="orders-summary-label">Total B2B Value</span>
            <span className="orders-summary-value orders-summary-value-em">
              {fmt(branchFilteredB2BSales.reduce((acc, s) => acc + Number(s.total || s.totals?.payable || 0), 0))}
            </span>
          </div>
        </div>

        <div className="orders-table-card">
          {loading ? (
            <div className="orders-loader">
              <div className="orders-spinner" />
              <span className="orders-loader-text">Fetching wholesale orders</span>
            </div>
          ) : branchFilteredB2BSales.length === 0 ? (
            <div className="orders-empty-state">
              <div className="orders-empty-icon" />
              <h3 className="orders-empty-title">No B2B orders found</h3>
              <p className="orders-empty-text">Wholesale inquiries will appear here once placed.</p>
            </div>
          ) : (
            <div className="orders-table-scroller">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th className="orders-table-head">Order ID</th>
                    <th className="orders-table-head">Branch</th>
                    <th className="orders-table-head">Customer</th>
                    <th className="orders-table-head align-right">Amount</th>
                    <th className="orders-table-head">Status</th>
                    <th className="orders-table-head">Payment</th>
                    <th className="orders-table-head">View</th>
                    <th className="orders-table-head">Manual Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSales.map((sale) => (
                    <tr key={sale.id} className="orders-table-row">
                      <td className="orders-table-cell">
                        <span className="orders-order-id">#{sale.id.slice(0, 8)}</span>
                        <div className="orders-table-text-soft">{new Date(sale.created_at).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td className="orders-table-cell">
                        <span className="orders-table-text-main">{sale.branch_id || 'WEB'}</span>
                      </td>
                      <td className="orders-table-cell">
                        <div className="orders-table-text-main">{sale.customer_name || 'B2B User'}</div>
                        <div className="orders-table-text-soft">{sale.customer_email}</div>
                      </td>
                      <td className="orders-table-cell align-right">
                        <span className="orders-amount">{fmt(sale.total || sale.totals?.payable)}</span>
                      </td>
                      
                      <td className="orders-table-cell">
                        <span className={`orders-status-pill b2b-status-${(sale.status || '').toLowerCase()}`}>
                          {sale.status}
                        </span>
                      </td>
                      
                      <td className="orders-table-cell">
                        <span className="orders-payment-chip">
                          {sale.payment_status}
                        </span>
                      </td>

                      <td className="orders-table-cell">
                        <button className="orders-btn-small" onClick={() => openOrderDetails(sale)}>
                          View Items
                        </button>
                      </td>

                      <td className="orders-table-cell">
                        {actionLoading === sale.id ? (
                          <span className="orders-table-text-soft">Updating...</span>
                        ) : (
                          <div className="b2b-action-row">
                            {sale.status === 'B2B_PENDING' && (
                              <>
                                <button className="orders-btn-small b2b-btn-success" onClick={() => handleUpdateStatus(sale.id, 'APPROVED', null)}>Approve</button>
                                <button className="orders-btn-small b2b-btn-danger" onClick={() => handleUpdateStatus(sale.id, 'CANCELLED', 'FAILED')}>Decline</button>
                              </>
                            )}
                            
                            {sale.status === 'APPROVED' && sale.payment_status === 'PENDING' && (
                              <button className="orders-btn-small b2b-btn-success" onClick={() => handleUpdateStatus(sale.id, null, 'PAID')}>Mark Paid</button>
                            )}

                            {sale.status === 'APPROVED' && sale.payment_status === 'PAID' && (
                              <button className="orders-btn-small b2b-btn-blue" onClick={() => handleUpdateStatus(sale.id, 'DISPATCHED', null)}>Dispatch</button>
                            )}
                            
                            {sale.status === 'DISPATCHED' && (
                              <button className="orders-btn-small b2b-btn-success-solid" onClick={() => handleUpdateStatus(sale.id, 'DELIVERED', null)}>Delivered</button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* --- NEW: PAGINATION CONTROLS --- */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '16px', borderTop: '1px solid #333' }}>
                  <button 
                    style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={{ color: 'white', fontWeight: 'bold', alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
                  <button 
                    style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIMPLE B2B ITEM POPUP */}
      {selectedOrder && (
        <div className="orders-modal-backdrop" onClick={closeOrderDetails}>
          <div className="orders-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="orders-modal-header">
              <div>
                <h3 className="orders-modal-title">Bulk Request #{selectedOrder.id.slice(0,8)}</h3>
                <p className="orders-modal-subtitle">{selectedOrder.customer_name} - {selectedOrder.customer_email}</p>
              </div>
              <button className="orders-btn-small orders-btn-ghost" onClick={closeOrderDetails}>Close</button>
            </div>

            <div className="orders-items-grid" style={{ marginTop: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              {itemsLoading ? (
                <div className="orders-table-text-soft">Loading items...</div>
              ) : orderItems.length > 0 ? (
                orderItems.map((it, i) => (
                  <div className="orders-item-card" key={i}>
                    <div className="orders-item-media">
                      {it.image_url ? <img src={it.image_url} alt="product" /> : <div className="orders-item-placeholder" />}
                    </div>
                    <div className="orders-item-main">
                      <div className="orders-item-top">
                        <div className="orders-item-meta"><span className="orders-item-label">Name</span><span className="orders-item-value">{it.product_name || '-'}</span></div>
                        <div className="orders-item-meta"><span className="orders-item-label">Size/Color</span><span className="orders-item-value">{it.size || '-'} / {it.colour || '-'}</span></div>
                      </div>
                      <div className="orders-item-pricing">
                        <div className="orders-item-qty" style={{ color: '#ffd36e', fontWeight: 'bold' }}>Qty: {it.qty}</div>
                        <div className="orders-item-price">{fmt(it.price)}/ea</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="orders-table-text-soft">No items found.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}