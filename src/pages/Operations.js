import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AdminAuth';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api';
import './Operations.css';
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
  "is-low": ["tsup-operations-is-low"],
  "is-muted": ["tsup-operations-is-muted"],
  "active": ["tsup-operations-active"],
  "is-open": ["tsup-operations-is-open"]
})[name] || ["tsup-operations-" + name]).join(' ');
const money = value => Number(value || 0).toLocaleString('en-IN', {
  style: 'currency',
  currency: 'INR'
});
const count = value => Number(value || 0).toLocaleString('en-IN');
const date = value => value ? new Date(value).toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata'
}) : 'Not yet';
const initialDates = () => {
  const end = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata'
  });
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return {
    start: d.toLocaleDateString('en-CA', {
      timeZone: 'Asia/Kolkata'
    }),
    end
  };
};
export function Shell({
  title,
  subtitle,
  children,
  actions
}) {
  return <><main className={portalClass("ops-main")}><header className={portalClass("ops-heading")}><div className="tsup-operations-node-0"><p className="tsup-operations-node-1">ATTACH OPERATIONS</p><h1 className="tsup-operations-node-2">{title}</h1>{subtitle && <span className="tsup-operations-node-3">{subtitle}</span>}</div><div className={portalClass("ops-actions")}>{actions}</div></header>{children}</main></>;
}
function Message({
  error,
  success
}) {
  return error ? <div className={portalClass("ops-alert")} role="alert">{error}</div> : success ? <div className={portalClass("ops-success")} role="status">{success}</div> : null;
}
function useData(path, params = {}) {
  const key = JSON.stringify(params),
    [data, setData] = useState(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setData(null);
    apiGet(path, JSON.parse(key), {
      signal: controller.signal
    }).then(result => {
      if (!controller.signal.aborted) setData(result);
    }).catch(e => {
      if (!controller.signal.aborted) setError(e.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [path, key, revision]);
  return {
    data,
    error,
    loading,
    reload: useCallback(() => setRevision(v => v + 1), [])
  };
}
function Dates({
  value,
  onChange
}) {
  return <div className={portalClass("ops-dates")}><label className="tsup-operations-node-4">From<input type="date" value={value.start} onChange={e => onChange({
        ...value,
        start: e.target.value
      })} className="tsup-operations-node-5" /></label><label className="tsup-operations-node-6">To<input type="date" value={value.end} onChange={e => onChange({
        ...value,
        end: e.target.value
      })} className="tsup-operations-node-7" /></label></div>;
}
function Pager({
  total,
  page,
  setPage,
  limit = 50
}) {
  return <div className={portalClass("ops-pagination")}><button disabled={!page} onClick={() => setPage(page - 1)} className="tsup-operations-node-8">Previous</button><span className="tsup-operations-node-9">{count(total)} results, page {page + 1} of {Math.max(1, Math.ceil(total / limit))}</span><button disabled={(page + 1) * limit >= total} onClick={() => setPage(page + 1)} className="tsup-operations-node-10">Next</button></div>;
}
function Empty({
  loading,
  children = 'No records match your selection.'
}) {
  return <div className={portalClass("ops-empty")}>{loading ? 'Loading...' : children}</div>;
}
function Modal({
  title,
  children,
  onClose
}) {
  useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  return <div className={portalClass("ops-overlay")} onMouseDown={e => {
    if (e.target === e.currentTarget) onClose();
  }}><section role="dialog" aria-modal="true" aria-label={title} className={portalClass("ops-modal")}><header className="tsup-operations-node-11"><h2 className="tsup-operations-node-12">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="tsup-operations-node-13">✕</button></header>{children}</section></div>;
}
export function Dashboard() {
  const {
      user
    } = useAuth(),
    [dates, setDates] = useState(initialDates);
  const {
    data,
    error,
    loading,
    reload
  } = useData('/manage/dashboard', {
    branch_id: user?.branch_id,
    ...dates
  });
  return <Shell title="Overview" subtitle={user?.branch_id ? 'Your selected branch at a glance' : 'Every branch, one clear view'} actions={<button onClick={reload} className="tsup-operations-node-14">Refresh</button>}><Dates value={dates} onChange={setDates} /><Message error={error} />{loading && !data ? <Empty loading /> : data && <><div className={portalClass("ops-metrics")}>{[['Collected sales', money(data.sales.revenue), 'Paid sales and delivered cash orders'], ['Orders', count(data.sales.orders), `${count(data.sales.pending)} awaiting completion`], ['Available stock', count(data.stocks.available), `${count(data.stocks.reserved)} reserved`], ['Low stock variants', count(data.stocks.low_stock), 'Available quantity of 5 or fewer']].map(([label, value, note]) => <article key={label} className="tsup-operations-node-15"><span className="tsup-operations-node-16">{label}</span><strong className="tsup-operations-node-17">{value}</strong><small className="tsup-operations-node-18">{note}</small></article>)}</div><div className={portalClass("ops-quick")}><Link to="/products">Add a product</Link><Link to="/import">Import Excel</Link><Link to="/pos">Start a sale</Link><Link to="/stocks">Review stock</Link></div><section className={portalClass("ops-panel")}><h2 className="tsup-operations-node-19">Branch performance</h2><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-20"><thead className="tsup-operations-node-21"><tr className="tsup-operations-node-22"><th className="tsup-operations-node-23">Branch</th><th className="tsup-operations-node-24">Status</th><th className="tsup-operations-node-25">On hand</th><th className="tsup-operations-node-26">Available</th><th className="tsup-operations-node-27">Orders</th><th className="tsup-operations-node-28">Collected sales</th></tr></thead><tbody className="tsup-operations-node-29">{data.branches.map(row => <tr key={row.id} className="tsup-operations-node-30"><td className="tsup-operations-node-31">{row.name}</td><td className="tsup-operations-node-32"><span className={portalClass(`ops-badge ${row.is_active ? '' : 'is-muted'}`)}>{row.is_active ? 'Active' : 'Inactive'}</span></td><td className="tsup-operations-node-33">{count(row.on_hand)}</td><td className="tsup-operations-node-34">{count(row.available)}</td><td className="tsup-operations-node-35">{count(row.orders)}</td><td className="tsup-operations-node-36">{money(row.revenue)}</td></tr>)}</tbody></table></div></section><section className={portalClass("ops-panel")}><h2 className="tsup-operations-node-37">Sales activity</h2><p className="tsup-operations-node-38">India time. Cancelled and failed orders do not count as collected sales.</p><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-39"><thead className="tsup-operations-node-40"><tr className="tsup-operations-node-41"><th className="tsup-operations-node-42">Date</th><th className="tsup-operations-node-43">Orders</th><th className="tsup-operations-node-44">Collected sales</th></tr></thead><tbody className="tsup-operations-node-45">{data.daily.map(row => <tr key={row.day} className="tsup-operations-node-46"><td className="tsup-operations-node-47">{String(row.day).slice(0, 10)}</td><td className="tsup-operations-node-48">{row.orders}</td><td className="tsup-operations-node-49">{money(row.revenue)}</td></tr>)}</tbody></table></div>{!data.daily.length && <Empty />}</section></>}</Shell>;
}
function downloadCsv(rows, name) {
  const keys = Object.keys(rows[0] || {});
  const cell = value => {
    let text = String(value ?? '');
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  const blob = new Blob(['\uFEFF' + [keys.map(cell).join(','), ...rows.map(row => keys.map(key => cell(row[key])).join(','))].join('\r\n')], {
    type: 'text/csv;charset=utf-8'
  });
  const url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function StockPage() {
  const {
      user
    } = useAuth(),
    [q, setQ] = useState(''),
    [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [low, setLow] = useState(false),
    [selected, setSelected] = useState(null),
    [quantity, setQuantity] = useState(''),
    [reason, setReason] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const {
    data,
    error: loadError,
    loading,
    reload
  } = useData('/manage/stock', {
    branch_id: user?.branch_id,
    q: search,
    offset: page * 50,
    low
  });
  useEffect(() => setPage(0), [user?.branch_id, search, low]);
  const save = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiPatch(`/manage/stock/${selected.variant_id}`, {
        branch_id: selected.branch_id,
        on_hand: Number(quantity),
        expected_on_hand: selected.on_hand,
        reason
      });
      setSelected(null);
      setSuccess('Stock updated');
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const changeVisibility = async row => {
    if (!window.confirm(`${row.is_active ? 'Hide' : 'Restore'} ${row.name} in ${row.branch_name}?`)) return;
    setError('');
    try {
      if (row.is_active) await apiDelete(`/manage/stock/${row.variant_id}`, {
        branch_id: row.branch_id
      });else await apiPatch(`/manage/stock/${row.variant_id}/restore`, {
        branch_id: row.branch_id
      });
      reload();
    } catch (e) {
      setError(e.message);
    }
  };
  const exportRows = async () => {
    setBusy(true);
    try {
      const all = [];
      let offset = 0,
        result;
      do {
        result = await apiGet('/manage/stock', {
          branch_id: user?.branch_id,
          q: search,
          low,
          limit: 200,
          offset
        });
        all.push(...result.rows);
        offset += result.rows.length;
      } while (offset < result.total && result.rows.length);
      downloadCsv(all, 'branch-stock.csv');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <Shell title="Stock inventory" subtitle="Quantities stay separate for each branch" actions={<><Link className={portalClass("ops-primary")} to="/products">Add product</Link><button disabled={busy} onClick={exportRows} className="tsup-operations-node-50">Export filtered stock</button></>}><div className={portalClass("ops-toolbar")}><form onSubmit={e => {
        e.preventDefault();
        setSearch(q);
      }} className="tsup-operations-node-51"><input aria-label="Search stock" placeholder="Product, brand, colour or barcode" value={q} onChange={e => setQ(e.target.value)} className="tsup-operations-node-52" /><button className="tsup-operations-node-53">Search</button></form><label className="tsup-operations-node-54"><input type="checkbox" checked={low} onChange={e => setLow(e.target.checked)} className="tsup-operations-node-55" /> Low stock only</label><button onClick={reload} className="tsup-operations-node-56">Refresh</button></div><Message error={error || loadError} success={success} /><section className={portalClass("ops-panel")}><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-57"><thead className="tsup-operations-node-58"><tr className="tsup-operations-node-59"><th className="tsup-operations-node-60">Product</th><th className="tsup-operations-node-61">Branch</th><th className="tsup-operations-node-62">Variant</th><th className="tsup-operations-node-63">Barcode</th><th className="tsup-operations-node-64">MRP</th><th className="tsup-operations-node-65">On hand</th><th className="tsup-operations-node-66">Reserved</th><th className="tsup-operations-node-67">Available</th><th className="tsup-operations-node-68">Actions</th></tr></thead><tbody className="tsup-operations-node-69">{data?.rows.map(row => <tr key={`${row.branch_id}:${row.variant_id}`} className="tsup-operations-node-70"><td className="tsup-operations-node-71"><strong className="tsup-operations-node-72">{row.name}</strong><small className="tsup-operations-node-73">{row.brand_name} · {row.category_name}</small></td><td className="tsup-operations-node-74">{row.branch_name}</td><td className="tsup-operations-node-75">{row.colour} / {row.size}<small className="tsup-operations-node-76">Pack of {row.pack_size || 1}</small></td><td className="tsup-operations-node-77">{row.ean_code || 'No barcode'}</td><td className="tsup-operations-node-78">{money(row.mrp)}</td><td className="tsup-operations-node-79">{row.on_hand}</td><td className="tsup-operations-node-80">{row.reserved}</td><td className="tsup-operations-node-81"><span className={portalClass(`ops-badge ${Number(row.available) <= 5 ? 'is-low' : ''}`)}>{row.available}</span></td><td className="tsup-operations-node-82"><div className={portalClass("ops-row-actions")}><button onClick={() => {
                    setSelected(row);
                    setQuantity(row.on_hand);
                    setReason('');
                    setError('');
                  }} className="tsup-operations-node-83">Adjust</button><Link to={`/products?variantId=${row.variant_id}&branchId=${row.branch_id}`}>Edit</Link><button onClick={() => changeVisibility(row)} className="tsup-operations-node-84">{row.is_active ? 'Hide' : 'Restore'}</button></div></td></tr>)}</tbody></table></div>{!data?.rows.length && <Empty loading={loading} />}<Pager total={data?.total || 0} page={page} setPage={setPage} /></section>{selected && <Modal title={`Adjust ${selected.name}`} onClose={() => setSelected(null)}><form onSubmit={save} className={portalClass("ops-form")}><p className="tsup-operations-node-85">{selected.branch_name} · {selected.colour} · {selected.size}</p><label className="tsup-operations-node-86">New on-hand quantity<input required type="number" min={selected.reserved} step="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="tsup-operations-node-87" /></label><label className="tsup-operations-node-88">Reason<input required minLength="3" value={reason} onChange={e => setReason(e.target.value)} placeholder="Stock count correction" className="tsup-operations-node-89" /></label><Message error={error} /><button className={portalClass("ops-primary")} disabled={busy}>{busy ? 'Saving...' : 'Save correction'}</button></form></Modal>}</Shell>;
}
const emptyProduct = {
  name: '',
  brand: '',
  gender: 'WOMEN',
  category_id: '',
  pattern: '',
  fit: '',
  size: '',
  colour: '',
  ean: '',
  mrp: '',
  sale_price: '',
  cost_price: 0,
  b2c_discount_pct: 0,
  b2b_discount_pct: 0,
  quantity: 0,
  pack_size: 1,
  image_url: ''
};
export function ProductEditor() {
  const {
      user
    } = useAuth(),
    [form, setForm] = useState(emptyProduct),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const params = new URLSearchParams(window.location.search),
    variantId = params.get('variantId'),
    branchId = params.get('branchId') || user?.branch_id;
  const {
      data
    } = useData('/categories/admin'),
    categories = Array.isArray(data) ? data : data?.categories || [];
  useEffect(() => {
    if (!variantId) return;
    apiGet(`/manage/products/${variantId}`, {
      branch_id: branchId
    }).then(row => setForm({
      ...emptyProduct,
      ...row,
      name: row.product_name || row.name,
      brand: row.brand_name,
      colour: row.colour,
      pattern: row.pattern_code || '',
      ean: row.ean_code || '',
      quantity: 0
    })).catch(e => setError(e.message));
  }, [variantId, branchId]);
  const field = (key, label, type = 'text', extra = {}) => <label className="tsup-operations-node-90">{label}<input type={type} value={form[key] ?? ''} onChange={e => setForm({
      ...form,
      [key]: e.target.value
    })} {...extra} className="tsup-operations-node-91" /></label>;
  const save = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const body = {
        ...form,
        branch_id: branchId
      };
      if (variantId) await apiPut(`/manage/products/${variantId}`, body);else await apiPost('/manage/products', body);
      setSuccess(variantId ? 'Product details updated' : 'Product saved and stock received');
      if (!variantId) setForm({
        ...form,
        size: '',
        colour: '',
        ean: '',
        quantity: 0
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <Shell title={variantId ? 'Edit product' : 'Add product'} subtitle="One row represents one colour and size. Use the same style code for every variant." actions={<Link to="/import">Bulk import with Excel</Link>}><Message error={error} success={success} />{!branchId ? <Empty>Select a branch in the navigation before adding products.</Empty> : <form className={portalClass("ops-panel ops-form")} onSubmit={save}><h2 className="tsup-operations-node-92">1. Product and category</h2><div className={portalClass("ops-form-grid")}>{field('name', 'Product name', 'text', {
          required: true,
          maxLength: 180
        })}{field('brand', 'Brand name', 'text', {
          required: true,
          maxLength: 100
        })}<label className="tsup-operations-node-93">Department<select value={form.gender} onChange={e => setForm({
            ...form,
            gender: e.target.value,
            category_id: ''
          })} className="tsup-operations-node-94">{['WOMEN', 'MEN', 'KIDS'].map(v => <option key={v} className="tsup-operations-node-95">{v}</option>)}</select></label><label className="tsup-operations-node-96">Category / subcategory<select required value={form.category_id} onChange={e => setForm({
            ...form,
            category_id: e.target.value
          })} className="tsup-operations-node-97"><option value="" className="tsup-operations-node-98">Select category</option>{categories.filter(row => row.gender === form.gender && Number(row.level) > 0 && row.is_active !== false).map(row => <option key={row.id} value={row.id} className="tsup-operations-node-99">{row.category_path || row.path || row.name}</option>)}</select></label>{field('pattern', 'Style / design code', 'text', {
          required: true
        })}{field('fit', 'Fit')}</div><h2 className="tsup-operations-node-100">2. Colour, size and barcode</h2><div className={portalClass("ops-form-grid")}>{field('colour', 'Colour', 'text', {
          required: true
        })}{field('size', 'Size', 'text', {
          required: true
        })}{field('ean', 'Barcode / EAN', 'text', {
          required: true,
          pattern: '[A-Za-z0-9._-]{3,64}'
        })}{field('pack_size', 'Pieces per selling pack', 'number', {
          min: 1,
          step: 1,
          required: true,
          disabled: !!variantId
        })}{field('image_url', 'Image URL (optional)', 'text')}</div><h2 className="tsup-operations-node-101">3. Price and opening stock</h2><div className={portalClass("ops-form-grid")}>{field('mrp', 'MRP per selling unit', 'number', {
          min: .01,
          step: .01,
          required: true
        })}{field('sale_price', 'Selling price (blank uses MRP)', 'number', {
          min: .01,
          step: .01
        })}{field('cost_price', 'Cost per selling unit', 'number', {
          min: 0,
          step: .01
        })}{field('b2c_discount_pct', 'Retail discount %', 'number', {
          min: 0,
          max: 100,
          step: .01
        })}{field('b2b_discount_pct', 'Wholesale discount %', 'number', {
          min: 0,
          max: 100,
          step: .01
        })}{!variantId && field('quantity', 'Stock to add in selected branch', 'number', {
          min: 0,
          step: 1,
          required: true
        })}</div><p className="tsup-operations-node-102">A discount percentage takes priority over the selling price. Price is per pack when pack size is greater than one. Unknown brands appear as Fashion on the website.</p>{variantId && <p className="tsup-operations-node-103">Product name and category apply to all variants of this style. Prices apply to this variant in every branch. Use Stock inventory to correct branch quantities.</p>}<div className={portalClass("ops-actions")}><button className={portalClass("ops-primary")} disabled={busy}>{busy ? 'Saving...' : variantId ? 'Save product' : 'Save product and stock'}</button><Link to="/stocks">View stock</Link></div></form>}</Shell>;
}
export function SalesPage() {
  const {
      user
    } = useAuth(),
    [dates, setDates] = useState(initialDates),
    [q, setQ] = useState(''),
    [search, setSearch] = useState(''),
    [page, setPage] = useState(0),
    [detail, setDetail] = useState(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState('');
  const {
    data,
    error: loadError,
    loading,
    reload
  } = useData('/manage/sales', {
    branch_id: user?.branch_id,
    ...dates,
    q: search,
    offset: page * 50
  });
  useEffect(() => setPage(0), [user?.branch_id, dates, search]);
  const open = async row => {
    try {
      setDetail(await apiGet(`/sales/admin/${row.id}`));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };
  const act = async action => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (action === 'ship') {
        const result = await apiPost(`/shiprocket/fulfill/${detail.sale.id}`, {});
        setNotice(`Shipment ready: ${result.shipments?.map(row => row.awb || row.shipment_id || row.shiprocket_shipment_id || 'Pickup pending').join(', ')}`);
      } else await apiPatch(`/manage/sales/${detail.sale.id}/status`, {
        status: action
      });
      await open(detail.sale);
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const exportRows = async () => {
    try {
      const rows = [];
      let offset = 0,
        result;
      do {
        result = await apiGet('/manage/sales', {
          branch_id: user?.branch_id,
          ...dates,
          q: search,
          offset,
          limit: 200
        });
        rows.push(...result.rows.map(({
          id,
          branch_name,
          customer_name,
          source,
          status,
          payment_status,
          total,
          created_at
        }) => ({
          id,
          branch_name,
          customer_name,
          source,
          status,
          payment_status,
          total,
          created_at
        })));
        offset += result.rows.length;
      } while (offset < result.total && result.rows.length);
      downloadCsv(rows, 'branch-sales.csv');
    } catch (e) {
      setError(e.message);
    }
  };
  return <Shell title="Sales and orders" subtitle="Online and counter sales, scoped to the selected branch" actions={<><button onClick={reload} className="tsup-operations-node-104">Refresh</button><button onClick={exportRows} className="tsup-operations-node-105">Export filtered sales</button></>}><Dates value={dates} onChange={setDates} /><form className={portalClass("ops-toolbar")} onSubmit={e => {
      e.preventDefault();
      setSearch(q);
    }}><input value={q} onChange={e => setQ(e.target.value)} placeholder="Order ID, customer or status" aria-label="Search sales" className="tsup-operations-node-106" /><button className="tsup-operations-node-107">Search</button></form><Message error={error || loadError} /><section className={portalClass("ops-panel")}><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-108"><thead className="tsup-operations-node-109"><tr className="tsup-operations-node-110"><th className="tsup-operations-node-111">Order</th><th className="tsup-operations-node-112">Customer</th><th className="tsup-operations-node-113">Branch</th><th className="tsup-operations-node-114">Source</th><th className="tsup-operations-node-115">Order status</th><th className="tsup-operations-node-116">Payment</th><th className="tsup-operations-node-117">Total</th><th className="tsup-operations-node-118">Details</th></tr></thead><tbody className="tsup-operations-node-119">{data?.rows.map(row => <tr key={row.id} className="tsup-operations-node-120"><td className="tsup-operations-node-121">{String(row.id).slice(0, 8)}<small className="tsup-operations-node-122">{date(row.created_at)}</small></td><td className="tsup-operations-node-123">{row.customer_name || 'Counter customer'}<small className="tsup-operations-node-124">{row.customer_email}</small></td><td className="tsup-operations-node-125">{row.branch_name || 'Unassigned'}</td><td className="tsup-operations-node-126">{row.source}</td><td className="tsup-operations-node-127"><span className={portalClass("ops-badge")}>{row.status}</span></td><td className="tsup-operations-node-128">{row.payment_status}</td><td className="tsup-operations-node-129">{money(row.total ?? row.totals?.payable)}</td><td className="tsup-operations-node-130"><button onClick={() => open(row)} className="tsup-operations-node-131">View</button></td></tr>)}</tbody></table></div>{!data?.rows.length && <Empty loading={loading} />}<Pager total={data?.total || 0} page={page} setPage={setPage} /></section>{detail && <Modal title={`Order ${String(detail.sale?.id).slice(0, 8)}`} onClose={() => setDetail(null)}><p className="tsup-operations-node-132">{detail.sale?.customer_name} · {detail.sale?.customer_email}</p><p className="tsup-operations-node-133">{detail.sale?.status} · {detail.sale?.payment_status}</p><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-134"><thead className="tsup-operations-node-135"><tr className="tsup-operations-node-136"><th className="tsup-operations-node-137">Item</th><th className="tsup-operations-node-138">Variant</th><th className="tsup-operations-node-139">Qty</th><th className="tsup-operations-node-140">Price</th></tr></thead><tbody className="tsup-operations-node-141">{detail.items?.map((row, i) => <tr key={i} className="tsup-operations-node-142"><td className="tsup-operations-node-143">{row.product_name}</td><td className="tsup-operations-node-144">{row.colour} / {row.size}</td><td className="tsup-operations-node-145">{row.qty}</td><td className="tsup-operations-node-146">{money(row.price)}</td></tr>)}</tbody></table></div><h3 className="tsup-operations-node-147">Delivery address</h3><p className="tsup-operations-node-148">{Object.values(detail.sale?.shipping_address || {}).filter(v => typeof v === 'string').join(', ') || 'Counter sale'}</p><strong className="tsup-operations-node-149">Payable: {money(detail.sale?.totals?.payable)}</strong><Message error={error} success={notice} />{detail.sale?.source === 'WEB' && ['PAID', 'COD'].includes(detail.sale.payment_status) && !['CANCELLED', 'DELIVERED', 'RETURNED'].includes(detail.sale.status) && <div className={portalClass("ops-actions")}>{{
          PLACED: 'PROCESSING',
          CONFIRMED: 'PROCESSING',
          PROCESSING: 'SHIPPED',
          SHIPPED: 'DELIVERED'
        }[detail.sale.status] && <button disabled={busy} onClick={() => act({
          PLACED: 'PROCESSING',
          CONFIRMED: 'PROCESSING',
          PROCESSING: 'SHIPPED',
          SHIPPED: 'DELIVERED'
        }[detail.sale.status])} className="tsup-operations-node-150">Mark {{
            PLACED: 'processing',
            CONFIRMED: 'processing',
            PROCESSING: 'shipped',
            SHIPPED: 'delivered'
          }[detail.sale.status]}</button>}<button disabled={busy} onClick={() => act('ship')} className="tsup-operations-node-151">Create Shiprocket shipment</button></div>}</Modal>}</Shell>;
}
export function ManagementPage({
  kind
}) {
  const admins = kind === 'admins',
    {
      user
    } = useAuth(),
    {
      data,
      error: loadError,
      loading,
      reload
    } = useData(`/manage/${kind}`),
    {
      data: branches
    } = useData('/manage/branches');
  const [form, setForm] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const fresh = () => setForm(admins ? {
    username: '',
    name: '',
    password: '',
    role_enum: 'ADMIN',
    branch_id: '',
    is_active: true
  } : {
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    is_active: true
  });
  const save = async e => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (form.id) await apiPut(`/manage/${kind}/${form.id}`, form);else await apiPost(`/manage/${kind}`, form);
      setForm(null);
      setSuccess('Saved successfully');
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const deactivate = async row => {
    if (!window.confirm(`Deactivate ${row.name || row.username}? Historical records will stay available.`)) return;
    try {
      await apiDelete(`/manage/${kind}/${row.id}`);
      reload();
      setSuccess('Deactivated successfully');
    } catch (e) {
      setError(e.message);
    }
  };
  const field = (key, label, type = 'text', required = false) => <label className="tsup-operations-node-152">{label}<input type={type} value={form[key] ?? ''} required={required} minLength={key === 'password' && (!form.id || form.password) ? 10 : undefined} onChange={e => setForm({
      ...form,
      [key]: e.target.value
    })} className="tsup-operations-node-153" /></label>;
  return <Shell title={admins ? 'Admins and access' : 'Branches'} subtitle={admins ? 'Each branch admin can access only their assigned branch' : 'Manage branch details and availability'} actions={<button className={portalClass("ops-primary")} onClick={fresh}>Create {admins ? 'admin' : 'branch'}</button>}><Message error={error || loadError} success={success} /><section className={portalClass("ops-panel")}><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-154"><thead className="tsup-operations-node-155"><tr className="tsup-operations-node-156"><th className="tsup-operations-node-157">{admins ? 'Admin' : 'Branch'}</th><th className="tsup-operations-node-158">{admins ? 'Role' : 'Code'}</th><th className="tsup-operations-node-159">{admins ? 'Assigned branch' : 'Location'}</th><th className="tsup-operations-node-160">Status</th><th className="tsup-operations-node-161">{admins ? 'Last login' : 'Contact'}</th><th className="tsup-operations-node-162">Actions</th></tr></thead><tbody className="tsup-operations-node-163">{data?.map(row => <tr key={row.id} className="tsup-operations-node-164"><td className="tsup-operations-node-165"><strong className="tsup-operations-node-166">{row.name || row.username}</strong>{admins && <small className="tsup-operations-node-167">{row.username}</small>}</td><td className="tsup-operations-node-168">{admins ? row.role_enum : row.code}</td><td className="tsup-operations-node-169">{admins ? row.branch_name || 'All branches' : [row.city, row.state].filter(Boolean).join(', ')}</td><td className="tsup-operations-node-170"><span className={portalClass(`ops-badge ${row.is_active ? '' : 'is-muted'}`)}>{row.is_active ? 'Active' : 'Inactive'}</span></td><td className="tsup-operations-node-171">{admins ? date(row.last_login) : row.phone}</td><td className="tsup-operations-node-172"><div className={portalClass("ops-row-actions")}><button onClick={() => {
                    setForm({
                      ...row,
                      password: ''
                    });
                    setError('');
                  }} className="tsup-operations-node-173">Edit</button><button disabled={!row.is_active || (admins && Number(row.id) === Number(user.id))} onClick={() => deactivate(row)} className="tsup-operations-node-174">Deactivate</button></div></td></tr>)}</tbody></table></div>{!data?.length && <Empty loading={loading} />}</section>{form && <Modal title={`${form.id ? 'Edit' : 'Create'} ${admins ? 'admin' : 'branch'}`} onClose={() => setForm(null)}><form className={portalClass("ops-form")} onSubmit={save}><div className={portalClass("ops-form-grid")}>{field('name', admins ? 'Full name' : 'Branch name', 'text', true)}{admins ? <>{field('username', 'Username / email', 'text', true)}{field('password', form.id ? 'New password (optional)' : 'Password', 'password', !form.id)}<label className="tsup-operations-node-175">Access level<select value={form.role_enum === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'} onChange={e => setForm({
                ...form,
                role_enum: e.target.value,
                branch_id: ''
              })} className="tsup-operations-node-176"><option value="ADMIN" className="tsup-operations-node-177">Branch admin</option><option value="SUPER_ADMIN" className="tsup-operations-node-178">Super admin</option></select></label>{form.role_enum !== 'SUPER_ADMIN' && <label className="tsup-operations-node-179">Branch<select required value={form.branch_id || ''} onChange={e => setForm({
                ...form,
                branch_id: e.target.value
              })} className="tsup-operations-node-180"><option value="" className="tsup-operations-node-181">Select a branch</option>{branches?.filter(b => b.is_active).map(b => <option key={b.id} value={b.id} className="tsup-operations-node-182">{b.name}</option>)}</select></label>}</> : <>{field('code', 'Branch code', 'text', true)}{field('address', 'Address')}{field('city', 'City')}{field('state', 'State')}{field('pincode', 'PIN code')}{field('phone', 'Phone')}{field('email', 'Email', 'email')}</>}<label className="tsup-operations-node-183">Status<select value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm({
              ...form,
              is_active: e.target.value === 'active'
            })} className="tsup-operations-node-184"><option value="active" className="tsup-operations-node-185">Active</option><option value="inactive" className="tsup-operations-node-186">Inactive</option></select></label></div><Message error={error} /><button className={portalClass("ops-primary")} disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></form></Modal>}</Shell>;
}
export function MovementsPage() {
  const {
      user
    } = useAuth(),
    [page, setPage] = useState(0),
    {
      data,
      error,
      loading
    } = useData('/manage/movements', {
      branch_id: user?.branch_id,
      offset: page * 50
    });
  return <Shell title="Stock movements" subtitle="A history of receipts, sales and stock corrections"><Message error={error} /><section className={portalClass("ops-panel")}><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-187"><thead className="tsup-operations-node-188"><tr className="tsup-operations-node-189"><th className="tsup-operations-node-190">Date</th><th className="tsup-operations-node-191">Branch</th><th className="tsup-operations-node-192">Product</th><th className="tsup-operations-node-193">Change</th><th className="tsup-operations-node-194">Balance</th><th className="tsup-operations-node-195">Reason</th></tr></thead><tbody className="tsup-operations-node-196">{data?.map(row => <tr key={row.id} className="tsup-operations-node-197"><td className="tsup-operations-node-198">{date(row.created_at)}</td><td className="tsup-operations-node-199">{row.branch_name}</td><td className="tsup-operations-node-200">{row.product_name}<small className="tsup-operations-node-201">{row.colour} / {row.size}</small></td><td className="tsup-operations-node-202">{Number(row.delta) > 0 ? '+' : ''}{row.delta}</td><td className="tsup-operations-node-203">{row.balance}</td><td className="tsup-operations-node-204">{row.reason}<small className="tsup-operations-node-205">{row.reference}</small></td></tr>)}</tbody></table></div>{!data?.length && <Empty loading={loading} />}<div className={portalClass("ops-pagination")}><button disabled={!page} onClick={() => setPage(page - 1)} className="tsup-operations-node-206">Previous</button><span className="tsup-operations-node-207">Page {page + 1}</span><button disabled={(data?.length || 0) < 50} onClick={() => setPage(page + 1)} className="tsup-operations-node-208">Next</button></div></section></Shell>;
}
export function AuditPage() {
  const {
    data,
    error,
    loading
  } = useData('/manage/audit');
  return <Shell title="Activity log" subtitle="The latest 200 administrative changes"><Message error={error} /><section className={portalClass("ops-panel")}><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-209"><thead className="tsup-operations-node-210"><tr className="tsup-operations-node-211"><th className="tsup-operations-node-212">When</th><th className="tsup-operations-node-213">Admin</th><th className="tsup-operations-node-214">Action</th><th className="tsup-operations-node-215">Record</th><th className="tsup-operations-node-216">Branch</th></tr></thead><tbody className="tsup-operations-node-217">{data?.map(row => <tr key={row.id} className="tsup-operations-node-218"><td className="tsup-operations-node-219">{date(row.created_at)}</td><td className="tsup-operations-node-220">{row.username || row.user_id}</td><td className="tsup-operations-node-221">{row.action}</td><td className="tsup-operations-node-222">{row.entity_id}</td><td className="tsup-operations-node-223">{row.branch_id || 'All'}</td></tr>)}</tbody></table></div>{!data?.length && <Empty loading={loading} />}</section></Shell>;
}
export function SettingsPage() {
  const {
      logout
    } = useAuth(),
    [form, setForm] = useState({
      old_password: '',
      new_password: ''
    }),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false);
  return <Shell title="Account settings"><form className={portalClass("ops-panel ops-form")} onSubmit={async e => {
      e.preventDefault();
      setBusy(true);
      try {
        await apiPost('/auth-branch/change-password', form);
        logout();
      } catch (e) {
        setMessage(e.message);
      } finally {
        setBusy(false);
      }
    }}><h2 className="tsup-operations-node-224">Change password</h2><p className="tsup-operations-node-225">Changing your password signs you out of all sessions.</p><label className="tsup-operations-node-226">Current password<input type="password" autoComplete="current-password" required value={form.old_password} onChange={e => setForm({
          ...form,
          old_password: e.target.value
        })} className="tsup-operations-node-227" /></label><label className="tsup-operations-node-228">New password<input type="password" autoComplete="new-password" required minLength="10" value={form.new_password} onChange={e => setForm({
          ...form,
          new_password: e.target.value
        })} className="tsup-operations-node-229" /></label><Message error={message} /><button className={portalClass("ops-primary")} disabled={busy}>Update password</button></form></Shell>;
}
export function ShippingPage() {
  const {
      data: branches
    } = useData('/manage/branches'),
    {
      data,
      error: loadError,
      reload
    } = useData('/shiprocket/warehouses'),
    [form, setForm] = useState({
      branch_id: '',
      warehouse_id: '',
      name: ''
    }),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(''),
    [busy, setBusy] = useState(false);
  const save = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiPut(`/manage/warehouses/${form.branch_id}`, form);
      setSuccess('Pickup mapping saved');
      reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return <Shell title="Shipping pickups" subtitle="Connect each branch to its exact Shiprocket pickup location"><Message error={error || loadError} success={success} /><form className={portalClass("ops-panel ops-form")} onSubmit={save}><div className={portalClass("ops-form-grid")}><label className="tsup-operations-node-230">Branch<select required value={form.branch_id} onChange={e => setForm({
            ...form,
            branch_id: e.target.value
          })} className="tsup-operations-node-231"><option value="" className="tsup-operations-node-232">Choose a branch</option>{branches?.filter(b => b.is_active).map(b => <option key={b.id} value={b.id} className="tsup-operations-node-233">{b.name}</option>)}</select></label><label className="tsup-operations-node-234">Shiprocket pickup ID<input required min="1" type="number" value={form.warehouse_id} onChange={e => setForm({
            ...form,
            warehouse_id: e.target.value
          })} className="tsup-operations-node-235" /></label><label className="tsup-operations-node-236">Exact pickup location name<input required value={form.name} onChange={e => setForm({
            ...form,
            name: e.target.value
          })} className="tsup-operations-node-237" /></label></div><p className="tsup-operations-node-238">Create or verify the pickup in Shiprocket first. Branch address details come from Branches.</p><button className={portalClass("ops-primary")} disabled={busy}>Save pickup mapping</button></form><section className={portalClass("ops-panel")}><div className={portalClass("ops-table-wrap")}><table className="tsup-operations-node-239"><thead className="tsup-operations-node-240"><tr className="tsup-operations-node-241"><th className="tsup-operations-node-242">Branch</th><th className="tsup-operations-node-243">Pickup name</th><th className="tsup-operations-node-244">Pickup ID</th><th className="tsup-operations-node-245">PIN code</th><th className="tsup-operations-node-246">Action</th></tr></thead><tbody className="tsup-operations-node-247">{data?.map(row => <tr key={row.id} className="tsup-operations-node-248"><td className="tsup-operations-node-249">{branches?.find(b => Number(b.id) === Number(row.branch_id))?.name}</td><td className="tsup-operations-node-250">{row.name}</td><td className="tsup-operations-node-251">{row.warehouse_id}</td><td className="tsup-operations-node-252">{row.pincode}</td><td className="tsup-operations-node-253"><button onClick={() => setForm(row)} className="tsup-operations-node-254">Edit</button></td></tr>)}</tbody></table></div></section></Shell>;
}
