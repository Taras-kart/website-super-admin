import React, { useEffect, useState } from 'react';
import './OrderCancelPopup.css';
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
  "ocp-backdrop": ["tsup-ordercancelpopup-ocp-backdrop"],
  "ocp-dialog": ["tsup-ordercancelpopup-ocp-dialog"],
  "ocp-header": ["tsup-ordercancelpopup-ocp-header"],
  "ocp-header-main": ["tsup-ordercancelpopup-ocp-header-main"],
  "ocp-header-top": ["tsup-ordercancelpopup-ocp-header-top"],
  "ocp-header-icon": ["tsup-ordercancelpopup-ocp-header-icon"],
  "ocp-header-text": ["tsup-ordercancelpopup-ocp-header-text"],
  "ocp-title": ["tsup-ordercancelpopup-ocp-title"],
  "ocp-chip-subtle": ["tsup-ordercancelpopup-ocp-chip-subtle"],
  "ocp-subtitle": ["tsup-ordercancelpopup-ocp-subtitle"],
  "ocp-close-btn": ["tsup-ordercancelpopup-ocp-close-btn"],
  "ocp-section": ["tsup-ordercancelpopup-ocp-section"],
  "ocp-section-summary": ["tsup-ordercancelpopup-ocp-section-summary"],
  "ocp-summary-row": ["tsup-ordercancelpopup-ocp-summary-row"],
  "ocp-summary-row-secondary": ["tsup-ordercancelpopup-ocp-summary-row-secondary"],
  "ocp-summary-block": ["tsup-ordercancelpopup-ocp-summary-block"],
  "ocp-summary-right": ["tsup-ordercancelpopup-ocp-summary-right"],
  "ocp-label": ["tsup-ordercancelpopup-ocp-label"],
  "ocp-value": ["tsup-ordercancelpopup-ocp-value"],
  "ocp-subvalue": ["tsup-ordercancelpopup-ocp-subvalue"],
  "ocp-value-strong": ["tsup-ordercancelpopup-ocp-value-strong"],
  "ocp-summary-pill-row": ["tsup-ordercancelpopup-ocp-summary-pill-row"],
  "ocp-chip": ["tsup-ordercancelpopup-ocp-chip"],
  "ocp-chip-payment": ["tsup-ordercancelpopup-ocp-chip-payment"],
  "ocp-chip-neutral": ["tsup-ordercancelpopup-ocp-chip-neutral"],
  "ocp-chip-cancelled": ["tsup-ordercancelpopup-ocp-chip-cancelled"],
  "ocp-summary-meta": ["tsup-ordercancelpopup-ocp-summary-meta"],
  "ocp-meta-label": ["tsup-ordercancelpopup-ocp-meta-label"],
  "ocp-meta-value": ["tsup-ordercancelpopup-ocp-meta-value"],
  "ocp-banner": ["tsup-ordercancelpopup-ocp-banner"],
  "ocp-body-scroll": ["tsup-ordercancelpopup-ocp-body-scroll"],
  "ocp-field-label": ["tsup-ordercancelpopup-ocp-field-label"],
  "ocp-radio-group": ["tsup-ordercancelpopup-ocp-radio-group"],
  "ocp-radio": ["tsup-ordercancelpopup-ocp-radio"],
  "ocp-textarea": ["tsup-ordercancelpopup-ocp-textarea"],
  "ocp-section-confirm": ["tsup-ordercancelpopup-ocp-section-confirm"],
  "ocp-confirm-cards": ["tsup-ordercancelpopup-ocp-confirm-cards"],
  "ocp-checkbox-card": ["tsup-ordercancelpopup-ocp-checkbox-card"],
  "ocp-checkbox-inner": ["tsup-ordercancelpopup-ocp-checkbox-inner"],
  "ocp-checkbox-text": ["tsup-ordercancelpopup-ocp-checkbox-text"],
  "ocp-checkbox-title": ["tsup-ordercancelpopup-ocp-checkbox-title"],
  "ocp-checkbox-desc": ["tsup-ordercancelpopup-ocp-checkbox-desc"],
  "ocp-footer": ["tsup-ordercancelpopup-ocp-footer"],
  "ocp-btn-secondary": ["tsup-ordercancelpopup-ocp-btn-secondary"],
  "ocp-btn-primary": ["tsup-ordercancelpopup-ocp-btn-primary"],
  "ocp-btn-primary-disabled": ["tsup-ordercancelpopup-ocp-btn-primary-disabled"]
})[name] || ["tsup-ordercancelpopup-" + name]).join(' ');
function fmtAmount(n) {
  return `₹${Number(n || 0).toFixed(2)}`;
}
function getPayable(sale) {
  if (sale && sale.totals && sale.totals.payable != null) return Number(sale.totals.payable);
  if (sale && sale.total != null) return Number(sale.total);
  if (Array.isArray(sale?.items) && sale.items.length) {
    return sale.items.reduce((acc, it) => acc + Number(it.price || 0) * Number(it.qty || 0), 0);
  }
  return 0;
}
function getPaymentLabel(sale) {
  if (!sale) return '-';
  const raw = String(sale.payment_status || 'COD').toUpperCase();
  if (raw.includes('COD')) return 'Cash on Delivery';
  if (raw.includes('PREPAID') || raw.includes('ONLINE') || raw.includes('PAID')) return 'Prepaid / Online';
  return raw || '-';
}
export default function OrderCancelPopup({
  open,
  sale,
  onClose,
  onConfirm,
  isSubmitting
}) {
  const [reasonType, setReasonType] = useState('stock');
  const [notes, setNotes] = useState('');
  const [confirmNotify, setConfirmNotify] = useState(false);
  const [confirmIrreversible, setConfirmIrreversible] = useState(false);
  useEffect(() => {
    if (open) {
      setReasonType('stock');
      setNotes('');
      setConfirmNotify(false);
      setConfirmIrreversible(false);
    }
  }, [open, sale?.id]);
  if (!open || !sale) return null;
  const payable = getPayable(sale);
  const paymentLabel = getPaymentLabel(sale);
  const cancelDisabled = !confirmNotify || !confirmIrreversible || isSubmitting;
  const itemCount = Array.isArray(sale.items) ? sale.items.length : 0;
  const handleBackdropClick = () => {
    if (isSubmitting) return;
    onClose && onClose();
  };
  const handleDialogClick = e => {
    e.stopPropagation();
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (cancelDisabled) return;
    const baseLabel = reasonType === 'stock' ? 'Cancelled by admin: stock or product issue' : reasonType === 'address' ? 'Cancelled by admin: address or contact issue' : reasonType === 'payment' ? 'Cancelled by admin: payment or refund risk' : reasonType === 'customer' ? 'Cancelled by admin: customer requested cancellation' : 'Cancelled by admin';
    const trimmedNotes = notes.trim();
    const finalReason = trimmedNotes ? `${baseLabel}. Notes: ${trimmedNotes}` : baseLabel;
    onConfirm && onConfirm(finalReason);
  };
  return <div className={portalClass("ocp-backdrop")} onClick={handleBackdropClick}>
      <div className={portalClass("ocp-dialog")} onClick={handleDialogClick}>
        <div className={portalClass("ocp-header")}>
          <div className={portalClass("ocp-header-main")}>
            <div className={portalClass("ocp-header-top")}>
              <div className={portalClass("ocp-header-icon")}>
                <span className="tsup-ordercancelpopup-node-0">!</span>
              </div>
              <div className={portalClass("ocp-header-text")}>
                <div className={portalClass("ocp-title")}>Cancel order</div>
                <div className={portalClass("ocp-chip-subtle")}>
                  Order #{sale.id}
                </div>
              </div>
            </div>
            <div className={portalClass("ocp-subtitle")}>
              You are cancelling this order. This will stop fulfilment and the customer should be informed clearly.
            </div>
          </div>
          <button className={portalClass("ocp-close-btn")} onClick={onClose} disabled={isSubmitting}>
            ✕
          </button>
        </div>

        <div className={portalClass("ocp-section ocp-section-summary")}>
          <div className={portalClass("ocp-summary-row")}>
            <div className={portalClass("ocp-summary-block")}>
              <div className={portalClass("ocp-label")}>Customer</div>
              <div className={portalClass("ocp-value")}>
                {sale.customer_name || '-'}
              </div>
              <div className={portalClass("ocp-subvalue")}>
                {sale.customer_mobile || 'No phone added'}
              </div>
            </div>
            <div className={portalClass("ocp-summary-block ocp-summary-right")}>
              <div className={portalClass("ocp-label")}>Amount payable</div>
              <div className={portalClass("ocp-value-strong")}>{fmtAmount(payable)}</div>
              <div className={portalClass("ocp-summary-pill-row")}>
                <div className={portalClass("ocp-chip ocp-chip-payment")}>
                  {paymentLabel}
                </div>
                {itemCount > 0 && <div className={portalClass("ocp-chip ocp-chip-neutral")}>
                    {itemCount} item{itemCount > 1 ? 's' : ''}
                  </div>}
              </div>
            </div>
          </div>
          <div className={portalClass("ocp-summary-row ocp-summary-row-secondary")}>
            <div className={portalClass("ocp-summary-block")}>
              <div className={portalClass("ocp-summary-meta")}>
                <span className={portalClass("ocp-meta-label")}>Order ID</span>
                <span className={portalClass("ocp-meta-value")}>#{sale.id}</span>
              </div>
              {sale.created_at && <div className={portalClass("ocp-summary-meta")}>
                  <span className={portalClass("ocp-meta-label")}>Placed on</span>
                  <span className={portalClass("ocp-meta-value")}>
                    {new Date(sale.created_at).toLocaleString()}
                  </span>
                </div>}
            </div>
          </div>
          <div className={portalClass("ocp-banner")}>
            Use a clear reason and short note. This helps your team and makes it easier to explain the cancellation to the customer.
          </div>
        </div>

        <div className={portalClass("ocp-body-scroll")}>
          <div className={portalClass("ocp-section")}>
            <div className={portalClass("ocp-field-label")}>Main reason</div>
            <div className={portalClass("ocp-radio-group")}>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="stock" checked={reasonType === 'stock'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-1" />
                <span className="tsup-ordercancelpopup-node-2">Stock or product issue (out of stock, damaged piece, wrong SKU)</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="address" checked={reasonType === 'address'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-3" />
                <span className="tsup-ordercancelpopup-node-4">Address or contact issue (invalid address, phone not reachable)</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="payment" checked={reasonType === 'payment'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-5" />
                <span className="tsup-ordercancelpopup-node-6">Payment or refund concern (duplicate order, suspicious payment)</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="customer" checked={reasonType === 'customer'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-7" />
                <span className="tsup-ordercancelpopup-node-8">Customer requested cancellation through call or message</span>
              </label>
              <label className={portalClass("ocp-radio")}>
                <input type="radio" name="ocp_reason" value="other" checked={reasonType === 'other'} onChange={e => setReasonType(e.target.value)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-9" />
                <span className="tsup-ordercancelpopup-node-10">Other internal reason</span>
              </label>
            </div>
            <textarea className={portalClass("ocp-textarea")} placeholder="Short note for internal use and for customer explanation. Example: Customer asked to cancel as delivery date was too late." value={notes} onChange={e => setNotes(e.target.value)} disabled={isSubmitting} />
          </div>

          <div className={portalClass("ocp-section ocp-section-confirm")}>
            <div className={portalClass("ocp-field-label")}>Before you cancel</div>
            <div className={portalClass("ocp-confirm-cards")}>
              <label className={portalClass("ocp-checkbox-card")}>
                <div className={portalClass("ocp-checkbox-inner")}>
                  <input type="checkbox" checked={confirmNotify} onChange={e => setConfirmNotify(e.target.checked)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-11" />
                  <div className={portalClass("ocp-checkbox-text")}>
                    <div className={portalClass("ocp-checkbox-title")}>
                      Inform the customer
                    </div>
                    <div className={portalClass("ocp-checkbox-desc")}>
                      I will make sure the customer is told that this order is cancelled and why it was cancelled.
                    </div>
                  </div>
                </div>
              </label>
              <label className={portalClass("ocp-checkbox-card")}>
                <div className={portalClass("ocp-checkbox-inner")}>
                  <input type="checkbox" checked={confirmIrreversible} onChange={e => setConfirmIrreversible(e.target.checked)} disabled={isSubmitting} className="tsup-ordercancelpopup-node-12" />
                  <div className={portalClass("ocp-checkbox-text")}>
                    <div className={portalClass("ocp-checkbox-title")}>
                      Final action
                    </div>
                    <div className={portalClass("ocp-checkbox-desc")}>
                      I understand this action cannot be reversed here. The order status will be set to cancelled.
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={portalClass("ocp-footer")}>
          <button type="button" className={portalClass("ocp-btn-secondary")} onClick={onClose} disabled={isSubmitting}>
            Keep order
          </button>
          <button type="button" className={portalClass(cancelDisabled ? 'ocp-btn-primary ocp-btn-primary-disabled' : 'ocp-btn-primary')} disabled={cancelDisabled} onClick={handleSubmit}>
            {isSubmitting ? 'Cancelling…' : 'Confirm cancellation'}
          </button>
        </div>
      </div>
    </div>;
}
