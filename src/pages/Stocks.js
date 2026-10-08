import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './Stocks.css';
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
  "stocks-page": ["tsup-stocks-stocks-page"],
  "stocks-toolbar": ["tsup-stocks-stocks-toolbar"],
  "bar-row": ["tsup-stocks-bar-row"],
  "seg": ["tsup-stocks-seg"],
  "seg-btn": ["tsup-stocks-seg-btn"],
  "active": ["tsup-stocks-active"],
  "right-tools": ["tsup-stocks-right-tools"],
  "export": ["tsup-stocks-export"],
  "disabled": ["tsup-stocks-disabled"],
  "summary-cards": ["tsup-stocks-summary-cards"],
  "card": ["tsup-stocks-card"],
  "ok": ["tsup-stocks-ok"],
  "warn": ["tsup-stocks-warn"],
  "danger": ["tsup-stocks-danger"],
  "card-title": ["tsup-stocks-card-title"],
  "card-value": ["tsup-stocks-card-value"],
  "chips": ["tsup-stocks-chips"],
  "chip": ["tsup-stocks-chip"],
  "control-row": ["tsup-stocks-control-row"],
  "search-wrap": ["tsup-stocks-search-wrap"],
  "search": ["tsup-stocks-search"],
  "select": ["tsup-stocks-select"],
  "clear": ["tsup-stocks-clear"],
  "refresh": ["tsup-stocks-refresh"],
  "thresholds": ["tsup-stocks-thresholds"],
  "threshold": ["tsup-stocks-threshold"],
  "section-table": ["tsup-stocks-section-table"],
  "table-container": ["tsup-stocks-table-container"],
  "stock-table": ["tsup-stocks-stock-table"],
  "al": ["tsup-stocks-al"],
  "ar": ["tsup-stocks-ar"],
  "mono": ["tsup-stocks-mono"],
  "truncate": ["tsup-stocks-truncate"],
  "status": ["tsup-stocks-status"],
  "low": ["tsup-stocks-low"],
  "high": ["tsup-stocks-high"],
  "out": ["tsup-stocks-out"],
  "row-low": ["tsup-stocks-row-low"],
  "row-high": ["tsup-stocks-row-high"],
  "row-out": ["tsup-stocks-row-out"]
})[name] || ["tsup-stocks-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const toArray = x => Array.isArray(x) ? x : [];
const num = v => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').trim());
  return Number.isFinite(n) ? n : 0;
};
const safe = v => v == null ? '' : String(v);
const nf = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) : '-';
};
const cf = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : '-';
};
export default function Stocks() {
  const {
    user
  } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chip, setChip] = useState('All');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [lowThreshold, setLowThreshold] = useState(10);
  const [highThreshold, setHighThreshold] = useState(100);
  const [gender, setGender] = useState('ALL');
  const searchRef = useRef(null);
  const [csvUrl, setCsvUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  useEffect(() => {
    const g = localStorage.getItem('stocks_gender') || 'ALL';
    setGender(g);
  }, []);
  useEffect(() => {
    const fetchWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const token = localStorage.getItem("auth_token") || localStorage.getItem("admin_token") || "";
        const res = await fetch(`${API_BASE}/api/shiprocket/warehouses`, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
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
  }, []);
  const fetchStocks = useCallback(async () => {
    if (!selectedBranchId) {
      setRaw([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token') || '';
      const params = new URLSearchParams();
      if (gender !== 'ALL') params.set('gender', gender);
      const res = await fetch(`${API_BASE}/api/branch/${encodeURIComponent(selectedBranchId)}/stock${params.toString() ? `?${params.toString()}` : ''}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
        credentials: 'omit',
        mode: 'cors'
      });
      const data = res.ok ? await res.json() : [];
      setRaw(toArray(data));
    } catch {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId, gender]);
  useEffect(() => {
    if (selectedBranchId) {
      fetchStocks();
    }
  }, [fetchStocks, selectedBranchId]);
  const rows = useMemo(() => toArray(raw).map((s, idx) => {
    const id = s.variant_id ?? idx + 1;
    const brand = safe(s.brand_name);
    const product = safe(s.product_name);
    const pattern = safe(s.pattern_code);
    const fit = safe(s.fit_type);
    const mark = safe(s.mark_code);
    const color = safe(s.colour);
    const size = safe(s.size);
    const ean = safe(s.ean_code);
    const mrp = num(s.mrp);
    const sale = num(s.sale_price);
    const cost = num(s.cost_price);
    const quantity = num(s.on_hand);
    const reserved = num(s.reserved);
    let status = 'ok';
    if (quantity <= 0) status = 'out';else if (quantity <= lowThreshold) status = 'low';else if (quantity >= highThreshold) status = 'high';
    return {
      id,
      brand,
      product,
      pattern,
      fit,
      mark,
      color,
      size,
      ean,
      mrp,
      sale,
      cost,
      quantity,
      reserved,
      status
    };
  }), [raw, lowThreshold, highThreshold]);
  const brands = useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.brand).filter(Boolean))).sort()], [rows]);
  const counts = useMemo(() => {
    const totalUnits = rows.reduce((a, b) => a + b.quantity, 0);
    const out = rows.filter(r => r.status === 'out').length;
    const low = rows.filter(r => r.status === 'low').length;
    const high = rows.filter(r => r.status === 'high').length;
    return {
      totalSkus: rows.length,
      totalUnits,
      out,
      low,
      high
    };
  }, [rows]);
  const filtered = useMemo(() => {
    let list = rows;
    if (chip === 'Alerts') list = list.filter(r => r.status === 'out' || r.status === 'low');
    if (chip === 'Low Stock') list = list.filter(r => r.status === 'low');
    if (chip === 'High Stock') list = list.filter(r => r.status === 'high');
    if (chip === 'Out of Stock') list = list.filter(r => r.status === 'out');
    if (brand !== 'All') list = list.filter(r => r.brand === brand);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(r => [r.brand, r.product, r.pattern, r.fit, r.mark, r.color, r.size, r.ean].some(x => x.toLowerCase().includes(q)));
    }
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => b.id - a.id);
    if (sortBy === 'qty_desc') sorted.sort((a, b) => b.quantity - a.quantity);
    if (sortBy === 'qty_asc') sorted.sort((a, b) => a.quantity - b.quantity);
    if (sortBy === 'mrp_desc') sorted.sort((a, b) => b.mrp - a.mrp);
    if (sortBy === 'mrp_asc') sorted.sort((a, b) => a.mrp - b.mrp);
    if (sortBy === 'sale_desc') sorted.sort((a, b) => b.sale - a.sale);
    if (sortBy === 'sale_asc') sorted.sort((a, b) => a.sale - b.sale);
    if (sortBy === 'brand_asc') sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    return sorted;
  }, [rows, chip, brand, search, sortBy]);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage]);
  useEffect(() => {
    if (!filtered.length) {
      setCsvUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return '';
      });
      return;
    }
    const header = ['Sl. No,Status,Brand,Product,Pattern,Fit,Mark,Size,Colour,EAN,MRP,Sale Price,Cost Price,Qty,Reserved'];
    const lines = paginatedRows.map((s, i) => [i + 1, s.status.toUpperCase(), `"${(s.brand || '').replace(/"/g, '""')}"`, `"${(s.product || '').replace(/"/g, '""')}"`, `"${(s.pattern || '').replace(/"/g, '""')}"`, `"${(s.fit || '').replace(/"/g, '""')}"`, `"${(s.mark || '').replace(/"/g, '""')}"`, `"${(s.size || '').replace(/"/g, '""')}"`, `"${(s.color || '').replace(/"/g, '""')}"`, `"${(s.ean || '').replace(/"/g, '""')}"`, s.mrp, s.sale, s.cost, s.quantity, s.reserved].join(','));
    const csv = [...header, ...lines].join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    setCsvUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [filtered, paginatedRows]);
  useEffect(() => {
    return () => {
      if (csvUrl) URL.revokeObjectURL(csvUrl);
    };
  }, [csvUrl]);
  const onGenderChange = g => {
    setGender(g);
    localStorage.setItem('stocks_gender', g);
  };
  const clearSearch = () => {
    setSearch('');
    searchRef.current?.focus();
  };
  return <div className={portalClass("stocks-page")}>
      
      
      {}
      <div style={{
      padding: '16px 24px',
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #dce3ec",
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }} className="tsup-stocks-node-0">
        <h3 style={{
        margin: 0,
        color: "#42536a"
      }} className="tsup-stocks-node-1">Select Branch Context:</h3>
        {loadingWarehouses ? <span style={{
        color: "#42536a"
      }} className="tsup-stocks-node-2">Loading branches...</span> : <select style={{
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: "#ffffff",
        color: "#42536a",
        border: '1px solid gold',
        fontSize: '14px',
        minWidth: '250px'
      }} value={selectedBranchId} onChange={e => setSelectedBranchId(e.target.value)} className="tsup-stocks-node-3">
            <option value="" disabled className="tsup-stocks-node-4">-- Select a Branch --</option>
            {warehouses.map(w => <option key={w.id} value={w.id} className="tsup-stocks-node-5">
                {w.name} ({w.city})
              </option>)}
          </select>}
      </div>

      <div className={portalClass("stocks-toolbar")}>
        <div className={portalClass("bar-row")}>
          <div className={portalClass("seg")}>
            <button className={portalClass(`seg-btn ${gender === 'ALL' ? 'active' : ''}`)} onClick={() => onGenderChange('ALL')}>All</button>
            <button className={portalClass(`seg-btn ${gender === 'MEN' ? 'active' : ''}`)} onClick={() => onGenderChange('MEN')}>Men</button>
            <button className={portalClass(`seg-btn ${gender === 'WOMEN' ? 'active' : ''}`)} onClick={() => onGenderChange('WOMEN')}>Women</button>
            <button className={portalClass(`seg-btn ${gender === 'KIDS' ? 'active' : ''}`)} onClick={() => onGenderChange('KIDS')}>Kids</button>
          </div>
          <div className={portalClass("right-tools")}>
            {csvUrl ? <a className={portalClass("export")} href={csvUrl} download={`stock_${gender.toLowerCase()}.csv`}>Export CSV</a> : <button className={portalClass("export disabled")} disabled>Export CSV</button>}
            <button className={portalClass("refresh")} onClick={fetchStocks}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
        </div>

        <div className={portalClass("summary-cards")}>
          <div className={portalClass("card")}>
            <div className={portalClass("card-title")}>Total SKUs</div>
            <div className={portalClass("card-value")}>{nf(counts.totalSkus)}</div>
          </div>
          <div className={portalClass("card")}>
            <div className={portalClass("card-title")}>Total Units</div>
            <div className={portalClass("card-value")}>{nf(counts.totalUnits)}</div>
          </div>
          <div className={portalClass("card warn")}>
            <div className={portalClass("card-title")}>Low Stock</div>
            <div className={portalClass("card-value")}>{nf(counts.low)}</div>
          </div>
          <div className={portalClass("card danger")}>
            <div className={portalClass("card-title")}>Out of Stock</div>
            <div className={portalClass("card-value")}>{nf(counts.out)}</div>
          </div>
          <div className={portalClass("card ok")}>
            <div className={portalClass("card-title")}>High Stock</div>
            <div className={portalClass("card-value")}>{nf(counts.high)}</div>
          </div>
        </div>

        <div className={portalClass("chips")}>
          {['All', 'Alerts', 'Low Stock', 'High Stock', 'Out of Stock'].map(c => <button key={c} className={portalClass(`chip ${chip === c ? 'active' : ''}`)} onClick={() => setChip(c)}>
              {c}
            </button>)}
        </div>

        <div className={portalClass("control-row")}>
          <div className={portalClass("search-wrap")}>
            <input ref={searchRef} className={portalClass("search")} placeholder="Search brand, product, pattern, fit, mark, color, size, EAN" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className={portalClass("clear")} onClick={clearSearch}>✕</button>}
          </div>
          <select className={portalClass("select")} value={brand} onChange={e => setBrand(e.target.value)}>
            {brands.map(b => <option key={b} value={b} className="tsup-stocks-node-6">
                {b}
              </option>)}
          </select>
          <select className={portalClass("select")} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent" className="tsup-stocks-node-7">Sort: Recent</option>
            <option value="qty_desc" className="tsup-stocks-node-8">Qty: High → Low</option>
            <option value="qty_asc" className="tsup-stocks-node-9">Qty: Low → High</option>
            <option value="mrp_desc" className="tsup-stocks-node-10">MRP: High → Low</option>
            <option value="mrp_asc" className="tsup-stocks-node-11">MRP: Low → High</option>
            <option value="sale_desc" className="tsup-stocks-node-12">Sale Price: High → Low</option>
            <option value="sale_asc" className="tsup-stocks-node-13">Sale Price: Low → High</option>
            <option value="brand_asc" className="tsup-stocks-node-14">Brand: A → Z</option>
          </select>
        </div>

        <div className={portalClass("thresholds")}>
          <div className={portalClass("threshold")}>
            <label className="tsup-stocks-node-15">Low ≤</label>
            <input type="number" min="0" value={lowThreshold} onChange={e => setLowThreshold(Math.max(0, parseInt(e.target.value || '0', 10)))} className="tsup-stocks-node-16" />
          </div>
          <div className={portalClass("threshold")}>
            <label className="tsup-stocks-node-17">High ≥</label>
            <input type="number" min="0" value={highThreshold} onChange={e => setHighThreshold(Math.max(0, parseInt(e.target.value || '0', 10)))} className="tsup-stocks-node-18" />
          </div>
        </div>
      </div>

      <div className={portalClass("section-table")}>
        <h3 className="tsup-stocks-node-19">Live Stock Overview</h3>
        {loading ? <p className="tsup-stocks-node-20">Loading stocks...</p> : <div className={portalClass("table-container")}>
            <table className={portalClass("stock-table")}>
              <colgroup className="tsup-stocks-node-21">
                <col style={{
              width: '70px'
            }} className="tsup-stocks-node-22" />
                <col style={{
              width: '90px'
            }} className="tsup-stocks-node-23" />
                <col style={{
              width: '160px'
            }} className="tsup-stocks-node-24" />
                <col style={{
              width: '220px'
            }} className="tsup-stocks-node-25" />
                <col style={{
              width: '120px'
            }} className="tsup-stocks-node-26" />
                <col style={{
              width: '120px'
            }} className="tsup-stocks-node-27" />
                <col style={{
              width: '110px'
            }} className="tsup-stocks-node-28" />
                <col style={{
              width: '90px'
            }} className="tsup-stocks-node-29" />
                <col style={{
              width: '160px'
            }} className="tsup-stocks-node-30" />
                <col style={{
              width: '160px'
            }} className="tsup-stocks-node-31" />
                <col style={{
              width: '120px'
            }} className="tsup-stocks-node-32" />
                <col style={{
              width: '130px'
            }} className="tsup-stocks-node-33" />
                <col style={{
              width: '130px'
            }} className="tsup-stocks-node-34" />
                <col style={{
              width: '100px'
            }} className="tsup-stocks-node-35" />
                <col style={{
              width: '110px'
            }} className="tsup-stocks-node-36" />
              </colgroup>
              <thead className="tsup-stocks-node-37">
                <tr className="tsup-stocks-node-38">
                  <th className="tsup-stocks-node-39">Sl. No</th>
                  <th className="tsup-stocks-node-40">Status</th>
                  <th className={portalClass("al")}>Brand</th>
                  <th className={portalClass("al")}>Product</th>
                  <th className={portalClass("al")}>Pattern</th>
                  <th className={portalClass("al")}>Fit</th>
                  <th className={portalClass("al")}>Mark</th>
                  <th className="tsup-stocks-node-41">Size</th>
                  <th className={portalClass("al")}>Colour</th>
                  <th className={portalClass("al")}>EAN</th>
                  <th className={portalClass("ar")}>MRP</th>
                  <th className={portalClass("ar")}>Sale Price</th>
                  <th className={portalClass("ar")}>Cost Price</th>
                  <th className={portalClass("ar")}>Qty</th>
                  <th className={portalClass("ar")}>Reserved</th>
                </tr>
              </thead>
              <tbody className="tsup-stocks-node-42">
                {paginatedRows.map((s, index) => <tr key={s.id} className={portalClass(`row-${s.status}`)}>
                    <td className={portalClass("mono")}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="tsup-stocks-node-43">
                      <span className={portalClass(`status ${s.status}`)}>
                        {s.status === 'out' ? 'Out' : s.status === 'low' ? 'Low' : s.status === 'high' ? 'High' : 'OK'}
                      </span>
                    </td>
                    <td className={portalClass("al truncate")} title={s.brand}>{s.brand || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.product}>{s.product || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.pattern}>{s.pattern || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.fit}>{s.fit || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.mark}>{s.mark || '-'}</td>
                    <td className={portalClass("mono")}>{s.size || '-'}</td>
                    <td className={portalClass("al truncate")} title={s.color}>{s.color || '-'}</td>
                    <td className={portalClass("al mono truncate")} title={s.ean}>{s.ean || '-'}</td>
                    <td className={portalClass("ar")}>{cf(s.mrp)}</td>
                    <td className={portalClass("ar")}>{cf(s.sale)}</td>
                    <td className={portalClass("ar")}>{cf(s.cost)}</td>
                    <td className={portalClass("ar")}>{nf(s.quantity)}</td>
                    <td className={portalClass("ar")}>{nf(s.reserved)}</td>
                  </tr>)}
                {!filtered.length && <tr className="tsup-stocks-node-44">
                    <td colSpan="15" style={{
                padding: 16,
                color: "#42536a"
              }} className="tsup-stocks-node-45">No matching records</td>
                  </tr>}
              </tbody>
            </table>
            {totalPages > 1 && <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          padding: '16px',
          background: "#ffffff"
        }} className="tsup-stocks-node-46">
                <button className={portalClass("refresh")} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Previous
                </button>
                <span style={{
            color: "#42536a",
            fontWeight: 'bold',
            alignSelf: 'center'
          }} className="tsup-stocks-node-47">Page {currentPage} of {totalPages}</span>
                <button className={portalClass("refresh")} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>}
          </div>}
      </div>
    </div>;
}
