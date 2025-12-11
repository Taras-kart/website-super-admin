import React, { useEffect, useMemo, useState } from 'react';
import './DeleteProduct.css';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const DEFAULT_ASSETS_BASE = 'https://taras-kart-backend.vercel.app/uploads';

const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;

const ASSETS_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_ASSETS_BASE) ||
  DEFAULT_ASSETS_BASE;

const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const ASSETS_BASE = ASSETS_BASE_RAW.replace(/\/+$/, '');

const toArray = (x) => (Array.isArray(x) ? x : []);
const coerceNumber = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v || '').trim());
  return Number.isFinite(n) ? n : 0;
};
const normalizeAssetUrl = (maybeRelative) => {
  if (!maybeRelative) return '';
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  const base = ASSETS_BASE || API_BASE;
  const needsSlash = !maybeRelative.startsWith('/');
  return `${base}${needsSlash ? '/' : ''}${maybeRelative}`;
};
const computeFinal = (price, discount) => {
  const p = coerceNumber(price);
  const d = coerceNumber(discount);
  return Number((p - (p * d) / 100).toFixed(2));
};
const mapRow = (p) => ({
  id: p.id || p.product_id || p._id || p.uuid,
  category: p.category || '',
  brand: p.brand || '',
  product_name: p.product_name || '',
  color: p.color || '',
  size: p.size || '',
  original_price_b2b: coerceNumber(p.original_price_b2b),
  discount_b2b: coerceNumber(p.discount_b2b),
  final_price_b2b: coerceNumber(p.final_price_b2b),
  original_price_b2c: coerceNumber(p.original_price_b2c),
  discount_b2c: coerceNumber(p.discount_b2c),
  final_price_b2c: coerceNumber(p.final_price_b2c),
  total_count: coerceNumber(p.total_count),
  image_url: normalizeAssetUrl(p.image_url || p.image || p.imageUrl || p.path || '')
});

const DeleteProduct = () => {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [confirmIds, setConfirmIds] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = res.ok ? await res.json() : [];
      setRows(toArray(data).map(mapRow));
    } catch {
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredSortedRows = useMemo(() => {
    let list = rows;
    if (filter === 'Men') list = list.filter((r) => r.category.toLowerCase() === 'men');
    else if (filter === 'Women') list = list.filter((r) => r.category.toLowerCase() === 'women');
    else if (filter === 'Kids') list = list.filter((r) => r.category.toLowerCase().startsWith('kids'));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.brand || '').toLowerCase().includes(q) ||
          (r.product_name || '').toLowerCase().includes(q) ||
          (r.color || '').toLowerCase().includes(q) ||
          (r.size || '').toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    else if (sortBy === 'price_b2c_asc')
      sorted.sort(
        (a, b) => computeFinal(a.original_price_b2c, a.discount_b2c) - computeFinal(b.original_price_b2c, b.discount_b2c)
      );
    else if (sortBy === 'price_b2c_desc')
      sorted.sort(
        (a, b) => computeFinal(b.original_price_b2c, b.discount_b2c) - computeFinal(a.original_price_b2c, a.discount_b2c)
      );
    else if (sortBy === 'stock_desc') sorted.sort((a, b) => coerceNumber(b.total_count) - coerceNumber(a.total_count));
    else if (sortBy === 'brand_asc') sorted.sort((a, b) => String(a.brand || '').localeCompare(String(b.brand || '')));
    return sorted;
  }, [rows, filter, search, sortBy]);

  const askDelete = (ids) => {
    if (!ids.length) {
      setPopupMessage('Select at least one product');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 1800);
      return;
    }
    setConfirmIds(ids);
    setShowConfirm(true);
  };

  const confirmDelete = async (ok) => {
    setShowConfirm(false);
    if (!ok) return;
    try {
      for (const id of confirmIds) {
        await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
      }
      const remain = rows.filter((r) => !confirmIds.includes(r.id));
      setRows(remain);
      setSelectedIds(new Set());
      setPopupMessage('Deleted successfully');
      setPopupType('success');
      setTimeout(() => setPopupMessage(''), 1800);
    } catch {
      setPopupMessage('Failed to delete some items');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2000);
    } finally {
      setConfirmIds([]);
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filteredSortedRows.map((r) => r.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    const next = new Set(selectedIds);
    if (allSelected) visibleIds.forEach((id) => next.delete(id));
    else visibleIds.forEach((id) => next.add(id));
    setSelectedIds(next);
  };

  return (
    <div className="delete-product-page">
      <div className="delete-toolbar">
        <div className="filters">
          {['All', 'Men', 'Women', 'Kids'].map((f) => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="tools">
          <input
            className="search-input"
            placeholder="Search by brand, product, color, size"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Sort: Recent</option>
            <option value="price_b2c_asc">Price B2C: Low to High</option>
            <option value="price_b2c_desc">Price B2C: High to Low</option>
            <option value="stock_desc">Stock: High to Low</option>
            <option value="brand_asc">Brand: A → Z</option>
          </select>
          <button className="refresh-btn" onClick={fetchAll} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="danger-btn" onClick={() => askDelete(Array.from(selectedIds))}>
            Delete Selected
          </button>
        </div>
      </div>

      <div className="delete-section2">
        <h2>Product Table</h2>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAllVisible}
                    checked={
                      filteredSortedRows.length > 0 &&
                      filteredSortedRows.every((r) => selectedIds.has(r.id))
                    }
                    aria-label="Select all visible"
                  />
                </th>
                <th>Sl. No</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Product Name</th>
                <th>Color</th>
                <th>Size</th>
                <th>Original Price (B2C)</th>
                <th>Discount % (B2C)</th>
                <th>Final Price (B2C)</th>
                <th>Stock</th>
                <th>Image</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredSortedRows.map((p, idx) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      aria-label={`Select ${p.product_name}`}
                    />
                  </td>
                  <td>{idx + 1}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>{p.product_name}</td>
                  <td>{p.color}</td>
                  <td>{p.size}</td>
                  <td>{p.original_price_b2c}</td>
                  <td>{p.discount_b2c}</td>
                  <td>{computeFinal(p.original_price_b2c, p.discount_b2c).toFixed(2)}</td>
                  <td>{p.total_count}</td>
                  <td>
                    <img src={p.image_url} alt="product" className="table-image" />
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => askDelete([p.id])}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredSortedRows.length && (
                <tr>
                  <td colSpan="13" style={{ padding: 16, color: 'gold' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {popupMessage && <div className={`popup-card ${popupType}`}>{popupMessage}</div>}

      {showConfirm && (
        <div className="popup-confirm-box centered-popup">
          <p>{confirmIds.length > 1 ? `Delete ${confirmIds.length} products?` : 'Delete this product?'}</p>
          <div className="popup-actions">
            <button onClick={() => confirmDelete(true)}>Yes</button>
            <button onClick={() => confirmDelete(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProduct;
