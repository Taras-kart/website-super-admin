import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AdminAuth';
import './Sales.css';
import './B2BOrders.css';
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
  "orders-btn-small": ["tsup-sales-orders-btn-small", "tsup-b2borders-orders-btn-small"],
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
  "orders-progress-text": ["tsup-sales-orders-progress-text"],
  "b2b-status-b2b_pending": ["tsup-b2borders-b2b-status-b2b_pending"],
  "b2b-status-approved": ["tsup-b2borders-b2b-status-approved"],
  "b2b-status-dispatched": ["tsup-b2borders-b2b-status-dispatched"],
  "b2b-status-delivered": ["tsup-b2borders-b2b-status-delivered"],
  "b2b-status-cancelled": ["tsup-b2borders-b2b-status-cancelled"],
  "b2b-action-row": ["tsup-b2borders-b2b-action-row"],
  "b2b-btn-danger": ["tsup-b2borders-b2b-btn-danger"],
  "b2b-btn-success": ["tsup-b2borders-b2b-btn-success"],
  "b2b-btn-blue": ["tsup-b2borders-b2b-btn-blue"],
  "b2b-btn-success-solid": ["tsup-b2borders-b2b-btn-success-solid"]
})[name] || ["tsup-b2borders-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
export default function B2BOrders() {
  const {
    token, user
  } = useAuth();
  const [b2bSales, setB2bSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const selectedBranchId = user?.branch_id || 'ALL';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const authHeaders = useMemo(() => {
    return token ? {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {};
  }, [token]);
  const fetchB2BSales = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      if (!token) return;
      const res = await fetch(`${API_BASE}/api/sales/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.message || 'Unable to load wholesale orders.');
      const filteredData = (Array.isArray(data) ? data : []).filter(order => order.payment_method === 'B2B_BULK');
      setB2bSales(filteredData);
    } catch (error) {
      setLoadError(error.message);
      setB2bSales([]);
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    fetchB2BSales();
  }, [fetchB2BSales]);
  const branchFilteredB2BSales = useMemo(() => {
    if (selectedBranchId === 'ALL') return b2bSales;
    return b2bSales.filter(s => String(s.branch_id) === String(selectedBranchId));
  }, [b2bSales, selectedBranchId]);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBranchId]);
  const totalPages = Math.max(1, Math.ceil(branchFilteredB2BSales.length / itemsPerPage));
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
  const openOrderDetails = async sale => {
    setSelectedOrder(sale);
    setItemsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sales/admin/${sale.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  const fmt = n => `₹${Number(n || 0).toFixed(2)}`;
  return <div className={portalClass("orders-screen")}>
      
      
      {}
      <div className={portalClass("orders-layout")}>
        {loadError && <div role="alert" className={portalClass("ops-alert")}>{loadError}</div>}
        
        <div className={portalClass("orders-header")}>
          <div className={portalClass("orders-header-main")}>
            <h1 className={portalClass("orders-header-title")}>Wholesale Inquiries</h1>
            <p className={portalClass("orders-header-subtitle")}>Review, approve, and manually manage B2B bulk orders</p>
          </div>
          <div className={portalClass("orders-header-actions")}>
            <button className={portalClass("orders-btn-refresh")} onClick={fetchB2BSales}>
              <span className={portalClass("orders-btn-refresh-icon")} />
              <span className="tsup-b2borders-node-6">Refresh list</span>
            </button>
          </div>
        </div>

        <div className={portalClass("orders-summary-bar")}>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Pending Inquiries</span>
            <span className={portalClass("orders-summary-value")}>{loading ? 'Loading…' : `${branchFilteredB2BSales.filter(s => s.status === 'B2B_PENDING').length} order(s)`}</span>
          </div>
          <div className={portalClass("orders-summary-section")}>
            <span className={portalClass("orders-summary-label")}>Total B2B Value</span>
            <span className={portalClass("orders-summary-value orders-summary-value-em")}>
              {fmt(branchFilteredB2BSales.reduce((acc, s) => acc + Number(s.total || s.totals?.payable || 0), 0))}
            </span>
          </div>
        </div>

        <div className={portalClass("orders-table-card")}>
          {loading ? <div className={portalClass("orders-loader")}>
              <div className={portalClass("orders-spinner")} />
              <span className={portalClass("orders-loader-text")}>Fetching wholesale orders</span>
            </div> : branchFilteredB2BSales.length === 0 ? <div className={portalClass("orders-empty-state")}>
              <div className={portalClass("orders-empty-icon")} />
              <h3 className={portalClass("orders-empty-title")}>No B2B orders found</h3>
              <p className={portalClass("orders-empty-text")}>Wholesale inquiries will appear here once placed.</p>
            </div> : <div className={portalClass("orders-table-scroller")}>
              <table className={portalClass("orders-table")}>
                <thead className="tsup-b2borders-node-7">
                  <tr className="tsup-b2borders-node-8">
                    <th className={portalClass("orders-table-head")}>Order ID</th>
                    <th className={portalClass("orders-table-head")}>Branch</th>
                    <th className={portalClass("orders-table-head")}>Customer</th>
                    <th className={portalClass("orders-table-head align-right")}>Amount</th>
                    <th className={portalClass("orders-table-head")}>Status</th>
                    <th className={portalClass("orders-table-head")}>Payment</th>
                    <th className={portalClass("orders-table-head")}>View</th>
                    <th className={portalClass("orders-table-head")}>Manual Actions</th>
                  </tr>
                </thead>
                <tbody className="tsup-b2borders-node-9">
                  {paginatedSales.map(sale => <tr key={sale.id} className={portalClass("orders-table-row")}>
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass("orders-order-id")}>#{sale.id.slice(0, 8)}</span>
                        <div className={portalClass("orders-table-text-soft")}>{new Date(sale.created_at).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass("orders-table-text-main")}>{sale.branch_id || 'WEB'}</span>
                      </td>
                      <td className={portalClass("orders-table-cell")}>
                        <div className={portalClass("orders-table-text-main")}>{sale.customer_name || 'B2B User'}</div>
                        <div className={portalClass("orders-table-text-soft")}>{sale.customer_email}</div>
                      </td>
                      <td className={portalClass("orders-table-cell align-right")}>
                        <span className={portalClass("orders-amount")}>{fmt(sale.total || sale.totals?.payable)}</span>
                      </td>
                      
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass(`orders-status-pill b2b-status-${(sale.status || '').toLowerCase()}`)}>
                          {sale.status}
                        </span>
                      </td>
                      
                      <td className={portalClass("orders-table-cell")}>
                        <span className={portalClass("orders-payment-chip")}>
                          {sale.payment_status}
                        </span>
                      </td>

                      <td className={portalClass("orders-table-cell")}>
                        <button className={portalClass("orders-btn-small")} onClick={() => openOrderDetails(sale)}>
                          View Items
                        </button>
                      </td>

                      <td className={portalClass("orders-table-cell")}>
                        {actionLoading === sale.id ? <span className={portalClass("orders-table-text-soft")}>Updating...</span> : <div className={portalClass("b2b-action-row")}>
                            {sale.status === 'B2B_PENDING' && <>
                                <button className={portalClass("orders-btn-small b2b-btn-success")} onClick={() => handleUpdateStatus(sale.id, 'APPROVED', null)}>Approve</button>
                                <button className={portalClass("orders-btn-small b2b-btn-danger")} onClick={() => handleUpdateStatus(sale.id, 'CANCELLED', 'FAILED')}>Decline</button>
                              </>}
                            
                            {sale.status === 'APPROVED' && sale.payment_status === 'PENDING' && <button className={portalClass("orders-btn-small b2b-btn-success")} onClick={() => handleUpdateStatus(sale.id, null, 'PAID')}>Mark Paid</button>}

                            {sale.status === 'APPROVED' && sale.payment_status === 'PAID' && <button className={portalClass("orders-btn-small b2b-btn-blue")} onClick={() => handleUpdateStatus(sale.id, 'DISPATCHED', null)}>Dispatch</button>}
                            
                            {sale.status === 'DISPATCHED' && <button className={portalClass("orders-btn-small b2b-btn-success-solid")} onClick={() => handleUpdateStatus(sale.id, 'DELIVERED', null)}>Delivered</button>}
                          </div>}
                      </td>
                    </tr>)}
                </tbody>
              </table>
              
              {}
              {totalPages > 1 && <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            padding: '16px',
            borderTop: '1px solid #333'
          }} className="tsup-b2borders-node-10">
                  <button style={{
              padding: '8px 16px',
              background: "#ffffff",
              color: "#42536a",
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="tsup-b2borders-node-11">
                    Previous
                  </button>
                  <span style={{
              color: "#42536a",
              fontWeight: 'bold',
              alignSelf: 'center'
            }} className="tsup-b2borders-node-12">Page {currentPage} of {totalPages}</span>
                  <button style={{
              padding: '8px 16px',
              background: "#ffffff",
              color: "#42536a",
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="tsup-b2borders-node-13">
                    Next
                  </button>
                </div>}
            </div>}
        </div>
      </div>

      {}
      {selectedOrder && <div className={portalClass("orders-modal-backdrop")} onClick={closeOrderDetails}>
          <div className={portalClass("orders-modal")} onClick={e => e.stopPropagation()} style={{
        maxWidth: '700px'
      }}>
            <div className={portalClass("orders-modal-header")}>
              <div className="tsup-b2borders-node-14">
                <h3 className={portalClass("orders-modal-title")}>Bulk Request #{selectedOrder.id.slice(0, 8)}</h3>
                <p className={portalClass("orders-modal-subtitle")}>{selectedOrder.customer_name} - {selectedOrder.customer_email}</p>
              </div>
              <button className={portalClass("orders-btn-small orders-btn-ghost")} onClick={closeOrderDetails}>Close</button>
            </div>

            <div className={portalClass("orders-items-grid")} style={{
          marginTop: '20px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
              {itemsLoading ? <div className={portalClass("orders-table-text-soft")}>Loading items...</div> : orderItems.length > 0 ? orderItems.map((it, i) => <div className={portalClass("orders-item-card")} key={i}>
                    <div className={portalClass("orders-item-media")}>
                      {it.image_url ? <img src={it.image_url} alt="product" className="tsup-b2borders-node-15" /> : <div className={portalClass("orders-item-placeholder")} />}
                    </div>
                    <div className={portalClass("orders-item-main")}>
                      <div className={portalClass("orders-item-top")}>
                        <div className={portalClass("orders-item-meta")}><span className={portalClass("orders-item-label")}>Name</span><span className={portalClass("orders-item-value")}>{it.product_name || '-'}</span></div>
                        <div className={portalClass("orders-item-meta")}><span className={portalClass("orders-item-label")}>Size/Color</span><span className={portalClass("orders-item-value")}>{it.size || '-'} / {it.colour || '-'}</span></div>
                      </div>
                      <div className={portalClass("orders-item-pricing")}>
                        <div className={portalClass("orders-item-qty")} style={{
                  color: "#42536a",
                  fontWeight: 'bold'
                }}>Qty: {it.qty}</div>
                        <div className={portalClass("orders-item-price")}>{fmt(it.price)}/ea</div>
                      </div>
                    </div>
                  </div>) : <div className={portalClass("orders-table-text-soft")}>No items found.</div>}
            </div>
          </div>
        </div>}

    </div>;
}
