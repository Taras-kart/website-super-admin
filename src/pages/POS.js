import React, { useEffect, useRef, useState } from 'react';
import { Shell } from './Operations';
import { useAuth } from './AdminAuth';
import { apiGet, apiPost } from './api';
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
  "ops-password": ["tsup-operations-ops-password"]
})[name] || ["tsup-pos-" + name]).join(' ');
const money = n => Number(n || 0).toLocaleString('en-IN', {
  style: 'currency',
  currency: 'INR'
});
export default function POS() {
  const {
      user
    } = useAuth(),
    [ean, setEan] = useState(''),
    [items, setItems] = useState([]),
    [method, setMethod] = useState('CASH'),
    [ref, setRef] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [receipt, setReceipt] = useState(null),
    input = useRef(null),
    requestId = useRef(crypto.randomUUID());
  useEffect(() => {
    setItems([]);
    setReceipt(null);
    requestId.current = crypto.randomUUID();
    input.current?.focus();
  }, [user?.branch_id]);
  const scan = async e => {
    e.preventDefault();
    if (!ean.trim() || !user?.branch_id) return;
    setBusy(true);
    setError('');
    try {
      const row = await apiGet(`/barcodes/${encodeURIComponent(ean.trim())}`, {
        branch_id: user.branch_id
      });
      await apiPost('/inventory/scan', {
        branch_id: user.branch_id,
        ean_code: ean.trim(),
        qty: 1
      });
      setItems(old => {
        const found = old.find(v => v.variant_id === row.variant_id);
        return found ? old.map(v => v.variant_id === row.variant_id ? {
          ...v,
          qty: v.qty + 1
        } : v) : [...old, {
          ...row,
          qty: 1
        }];
      });
      setEan('');
      setReceipt(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      input.current?.focus();
    }
  };
  const total = items.reduce((sum, row) => sum + Number(row.sale_price ?? row.mrp) * row.qty, 0);
  const pay = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await apiPost('/sales/confirm', {
        branch_id: user.branch_id,
        sale_id: requestId.current,
        client_action_id: requestId.current,
        payment: {
          method,
          ref
        },
        items: items.map(row => ({
          variant_id: row.variant_id,
          qty: row.qty
        }))
      });
      setReceipt(result);
      setItems([]);
      setRef('');
      requestId.current = crypto.randomUUID();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <Shell title="Counter sale" subtitle="Scan items, review quantities, then confirm payment.">{error && <div className={portalClass("ops-alert")} role="alert">{error}</div>}{receipt && <div className={portalClass("ops-success")} role="status">Sale completed · {receipt.sale_id} · {money(receipt.total)}</div>}{!user?.branch_id ? <div className={portalClass("ops-empty")}>Select a branch to start a sale.</div> : <div className={portalClass("ops-pos-grid")}><section className={portalClass("ops-panel")}><form className={portalClass("ops-toolbar")} onSubmit={scan}><input ref={input} aria-label="Barcode" placeholder="Scan or enter barcode" value={ean} onChange={e => setEan(e.target.value)} className="tsup-pos-node-0" /><button disabled={busy} className="tsup-pos-node-1">Add item</button></form><div className={portalClass("ops-table-wrap")}><table className="tsup-pos-node-2"><thead className="tsup-pos-node-3"><tr className="tsup-pos-node-4"><th className="tsup-pos-node-5">Item</th><th className="tsup-pos-node-6">Size / colour</th><th className="tsup-pos-node-7">Price</th><th className="tsup-pos-node-8">Qty</th><th className="tsup-pos-node-9">Action</th></tr></thead><tbody className="tsup-pos-node-10">{items.map(row => <tr key={row.variant_id} className="tsup-pos-node-11"><td className="tsup-pos-node-12">{row.product_name}<small className="tsup-pos-node-13">{row.ean_code}</small></td><td className="tsup-pos-node-14">{row.size} / {row.colour}</td><td className="tsup-pos-node-15">{money(row.sale_price ?? row.mrp)}</td><td className="tsup-pos-node-16"><input className={portalClass("ops-pos-qty")} type="number" aria-label={`Quantity for ${row.product_name}`} min="1" step="1" value={row.qty} onChange={e => setItems(old => old.map(v => v.variant_id === row.variant_id ? {
                    ...v,
                    qty: Math.max(1, Math.floor(Number(e.target.value) || 1))
                  } : v))} /></td><td className="tsup-pos-node-17"><button disabled={busy} onClick={() => setItems(old => old.filter(v => v.variant_id !== row.variant_id))} className="tsup-pos-node-18">Remove</button></td></tr>)}</tbody></table></div>{!items.length && <div className={portalClass("ops-empty")}>Your sale is empty. Scan the first item.</div>}</section><section className={portalClass("ops-panel ops-form")}><h2 className="tsup-pos-node-19">Payment</h2><span className="tsup-pos-node-20">{items.reduce((s, r) => s + r.qty, 0)} selling units</span><strong className={portalClass("ops-pos-total")}>{money(total)}</strong><label className="tsup-pos-node-21">Method<select value={method} onChange={e => setMethod(e.target.value)} className="tsup-pos-node-22"><option className="tsup-pos-node-23">CASH</option><option className="tsup-pos-node-24">UPI</option><option className="tsup-pos-node-25">CARD</option></select></label><label className="tsup-pos-node-26">Payment reference<input value={ref} onChange={e => setRef(e.target.value)} className="tsup-pos-node-27" /></label><p className="tsup-pos-node-28">Confirm after receiving payment. Stock and prices are checked again when the sale completes.</p><button className={portalClass("ops-primary")} onClick={pay} disabled={busy || !items.length}>{busy ? 'Processing...' : 'Confirm sale'}</button></section></div>}</Shell>;
}
