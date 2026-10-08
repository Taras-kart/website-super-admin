import React, { useEffect, useMemo, useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import useOfflineQueue from './useOfflineQueue';
import { apiGet, apiPost } from './api';
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
  "ops-password": ["tsup-operations-ops-password"]
})[name] || ["tsup-posscan-" + name]).join(' ');
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
export default function POSScan() {
  const {
    user
  } = useAuth();
  const [branchId, setBranchId] = useState('');
  const [saleId, setSaleId] = useState(localStorage.getItem('pos_sale_id') || uuid());
  const [lines, setLines] = useState([]);
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState({
    method: 'cash',
    amount: '',
    ref: ''
  });
  const {
    queue,
    enqueue
  } = useOfflineQueue();
  useEffect(() => {
    const b = String(user?.branch_id || localStorage.getItem('pos_branch_id') || '').trim();
    setBranchId(b);
    if (b) localStorage.setItem('pos_branch_id', b);
  }, [user?.branch_id]);
  const total = useMemo(() => lines.reduce((a, b) => a + (Number(b.price) || 0) * (Number(b.qty) || 1), 0), [lines]);
  const addOrIncrement = line => {
    setLines(prev => {
      const idx = prev.findIndex(x => x.productId === line.productId && x.barcode === line.barcode);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          qty: (copy[idx].qty || 1) + 1
        };
        return copy;
      }
      return [...prev, {
        ...line,
        qty: 1
      }];
    });
  };
  async function lookupBarcode(barcode) {
    setStatus('Looking up...');
    try {
      const p = await apiGet(`/api/barcodes/${encodeURIComponent(barcode)}`).catch(() => null);
      if (!p) {
        setStatus(`No match: ${barcode}`);
        return;
      }
      const price = Number(p.retail_price ?? p.final_price_b2c ?? p.final_price ?? 0);
      addOrIncrement({
        id: uuid(),
        productId: p.id || p.variant_id || p.product_id || 0,
        name: p.product_name || p.name || 'Product',
        price: price,
        barcode
      });
      const actionId = uuid();
      const payload = {
        branch_id: branchId || user?.branch_id,
        ean_code: barcode,
        qty: 1,
        sale_id: saleId,
        client_action_id: actionId
      };
      try {
        await apiPost('/api/inventory/scan', payload);
      } catch {
        enqueue({
          id: actionId,
          url: '/api/inventory/scan',
          method: 'POST',
          body: payload
        });
      }
      setStatus('Added');
    } catch {
      setStatus('Lookup failed');
    } finally {
      setTimeout(() => setStatus(''), 1000);
    }
  }
  const changeQty = (lineId, delta) => {
    setLines(prev => prev.map(l => l.id === lineId ? {
      ...l,
      qty: Math.max(1, (l.qty || 1) + delta)
    } : l));
  };
  const removeLine = lineId => setLines(prev => prev.filter(l => l.id !== lineId));
  const startNewSale = () => {
    const id = uuid();
    setSaleId(id);
    localStorage.setItem('pos_sale_id', id);
    setLines([]);
  };
  async function confirmSale() {
    if (!lines.length) return;
    const actionId = uuid();
    const payload = {
      sale_id: saleId,
      branch_id: branchId || user?.branch_id,
      payment: {
        ...payment,
        amount: Number(payment.amount) || total
      },
      items: lines.map(l => ({
        variant_id: l.productId,
        qty: l.qty,
        ean_code: l.barcode,
        price: l.price
      })),
      client_action_id: actionId
    };
    try {
      await apiPost('/api/sales/confirm', payload);
      setStatus('Sale confirmed');
      startNewSale();
    } catch {
      enqueue({
        id: actionId,
        url: '/api/sales/confirm',
        method: 'POST',
        body: payload
      });
      setStatus('Queued (offline)');
      startNewSale();
    } finally {
      setTimeout(() => setStatus(''), 1500);
    }
  }
  return <div className={portalClass("pos-scan-page")}>
      
      <div style={{
      maxWidth: 1080,
      margin: '0 auto',
      padding: 16
    }} className="tsup-posscan-node-0">
        <h2 className="tsup-posscan-node-1">Branch POS</h2>
        <p style={{
        opacity: 0.8,
        marginTop: -6
      }} className="tsup-posscan-node-2">Scan items, then confirm after payment.</p>

        <div className={portalClass("pos-top")} style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'start'
      }}>
          <div className={portalClass("card")} style={{
          padding: 12
        }}>
            <label className="tsup-posscan-node-3">Branch</label>
            <div style={{
            marginTop: 6,
            fontWeight: 600
          }} className="tsup-posscan-node-4">{branchId || '—'}</div>
            <div style={{
            marginTop: 12
          }} className="tsup-posscan-node-5">
              <label className="tsup-posscan-node-6">Sale ID</label>
              <div style={{
              display: 'flex',
              gap: 8
            }} className="tsup-posscan-node-7">
                <input value={saleId} readOnly className="tsup-posscan-node-8" />
                <button onClick={startNewSale} className="tsup-posscan-node-9">New Sale</button>
              </div>
              <small style={{
              opacity: 0.7
            }} className="tsup-posscan-node-10">Queued actions: {queue.length}</small>
            </div>
          </div>

          <div className={portalClass("card")} style={{
          padding: 12
        }}>
            <label className="tsup-posscan-node-11">Scan / Enter Barcode</label>
            <BarcodeScanner onDetected={lookupBarcode} />
            {status && <div style={{
            marginTop: 8,
            color: "#42536a"
          }} className="tsup-posscan-node-12">{status}</div>}
          </div>
        </div>

        <div className={portalClass("card")} style={{
        marginTop: 16,
        padding: 12
      }}>
          <h3 className="tsup-posscan-node-13">Items</h3>
          <table style={{
          width: '100%',
          marginTop: 8
        }} className="tsup-posscan-node-14">
            <thead className="tsup-posscan-node-15">
              <tr className="tsup-posscan-node-16">
                <th className="tsup-posscan-node-17">Product</th>
                <th className="tsup-posscan-node-18">Barcode</th>
                <th className="tsup-posscan-node-19">Qty</th>
                <th className="tsup-posscan-node-20">Price</th>
                <th className="tsup-posscan-node-21">Subtotal</th>
                <th className="tsup-posscan-node-22"></th>
              </tr>
            </thead>
            <tbody className="tsup-posscan-node-23">
              {lines.map(l => <tr key={l.id} className="tsup-posscan-node-24">
                  <td className="tsup-posscan-node-25">{l.name}</td>
                  <td className="tsup-posscan-node-26">{l.barcode}</td>
                  <td className="tsup-posscan-node-27">
                    <div style={{
                  display: 'inline-flex',
                  gap: 6,
                  alignItems: 'center'
                }} className="tsup-posscan-node-28">
                      <button onClick={() => changeQty(l.id, -1)} className="tsup-posscan-node-29">-</button>
                      <span className="tsup-posscan-node-30">{l.qty}</span>
                      <button onClick={() => changeQty(l.id, +1)} className="tsup-posscan-node-31">+</button>
                    </div>
                  </td>
                  <td className="tsup-posscan-node-32">₹{Number(l.price || 0).toFixed(0)}</td>
                  <td className="tsup-posscan-node-33">₹{(Number(l.price || 0) * (l.qty || 1)).toFixed(0)}</td>
                  <td className="tsup-posscan-node-34"><button onClick={() => removeLine(l.id)} className="tsup-posscan-node-35">Remove</button></td>
                </tr>)}
              {!lines.length && <tr className="tsup-posscan-node-36">
                  <td colSpan="6" style={{
                padding: 12,
                color: "#42536a"
              }} className="tsup-posscan-node-37">No items yet. Scan a barcode.</td>
                </tr>}
            </tbody>
          </table>

          <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 12,
          gap: 16
        }} className="tsup-posscan-node-38">
            <div style={{
            textAlign: 'right'
          }} className="tsup-posscan-node-39">
              <div style={{
              fontSize: 14,
              opacity: 0.7
            }} className="tsup-posscan-node-40">Total</div>
              <div style={{
              fontWeight: 700,
              fontSize: 20
            }} className="tsup-posscan-node-41">₹{total.toFixed(0)}</div>
            </div>
          </div>
        </div>

        <div className={portalClass("card")} style={{
        marginTop: 16,
        padding: 12
      }}>
          <h3 className="tsup-posscan-node-42">Payment & Confirm</h3>
          <div style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: 'repeat(3, minmax(0,1fr))'
        }} className="tsup-posscan-node-43">
            <select value={payment.method} onChange={e => setPayment(p => ({
            ...p,
            method: e.target.value
          }))} className="tsup-posscan-node-44">
              <option value="cash" className="tsup-posscan-node-45">Cash</option>
              <option value="upi" className="tsup-posscan-node-46">UPI</option>
              <option value="card" className="tsup-posscan-node-47">Card</option>
            </select>
            <input type="number" placeholder="Amount (optional)" value={payment.amount} onChange={e => setPayment(p => ({
            ...p,
            amount: e.target.value
          }))} className="tsup-posscan-node-48" />
            <input type="text" placeholder="Ref / UTR (optional)" value={payment.ref} onChange={e => setPayment(p => ({
            ...p,
            ref: e.target.value
          }))} className="tsup-posscan-node-49" />
          </div>
          <div style={{
          marginTop: 12
        }} className="tsup-posscan-node-50">
            <button disabled={!branchId || !lines.length} onClick={confirmSale} className="tsup-posscan-node-51">Confirm Sale</button>
            {!branchId && <small style={{
            marginLeft: 8,
            color: "#42536a"
          }} className="tsup-posscan-node-52">Select branch</small>}
          </div>
        </div>
      </div>
    </div>;
}
