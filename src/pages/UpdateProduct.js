import React, { useState, useEffect, useMemo } from 'react';
import './UpdateProduct.css';

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

const normalizeAssetUrl = (maybeRelative) => {
  if (!maybeRelative) return '';
  if (/^https?:\/\//i.test(maybeRelative)) return maybeRelative;
  const base = ASSETS_BASE || API_BASE;
  if (!base) return maybeRelative;
  const needsSlash = !maybeRelative.startsWith('/');
  return `${base}${needsSlash ? '/' : ''}${maybeRelative}`;
};

const coerceNumber = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v || '').trim());
  return Number.isFinite(n) ? n : 0;
};

const rowFromApi = (p) => {
  const id = p.id || p.product_id || p._id || p.uuid;
  return {
    id,
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
    total_count: Number.isFinite(p.total_count) ? p.total_count : coerceNumber(p.total_count),
    image_url: normalizeAssetUrl(p.image_url || p.image || p.imageUrl || p.path || ''),
    newImageFile: null,
    preview_url: '',
    dirty: false
  };
};

const computeFinal = (price, discount) => {
  const p = coerceNumber(price);
  const d = coerceNumber(discount);
  return Number((p - (p * d) / 100).toFixed(2));
};

const UpdateProduct = () => {
  const [rows, setRows] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('');
  const [popupConfirm, setPopupConfirm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
      const data = await res.json();
      const mapped = Array.isArray(data) ? data.map(rowFromApi) : [];
      setRows(mapped);
    } catch {
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const updateField = (index, field, value) => {
    const next = [...rows];
    if (field === 'original_price_b2b' || field === 'discount_b2b' || field === 'original_price_b2c' || field === 'discount_b2c' || field === 'total_count') {
      next[index][field] = value === '' ? '' : coerceNumber(value);
    } else {
      next[index][field] = value;
    }
    if (field === 'original_price_b2b' || field === 'discount_b2b') {
      next[index].final_price_b2b = computeFinal(next[index].original_price_b2b, next[index].discount_b2b);
    }
    if (field === 'original_price_b2c' || field === 'discount_b2c') {
      next[index].final_price_b2c = computeFinal(next[index].original_price_b2c, next[index].discount_b2c);
    }
    next[index].dirty = true;
    setRows(next);
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const next = [...rows];
    next[index].newImageFile = file;
    next[index].preview_url = URL.createObjectURL(file);
    next[index].dirty = true;
    setRows(next);
  };

  const filteredSortedRows = useMemo(() => {
    let list = rows;
    if (filter === 'Men') list = list.filter((r) => r.category.toLowerCase() === 'men');
    else if (filter === 'Women') list = list.filter((r) => r.category.toLowerCase() === 'women');
    else if (filter === 'Kids') list = list.filter((r) => r.category.toLowerCase().startsWith('kids'));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) =>
        (r.brand || '').toLowerCase().includes(q) ||
        (r.product_name || '').toLowerCase().includes(q) ||
        (r.color || '').toLowerCase().includes(q) ||
        (r.size || '').toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sortBy === 'recent') sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
    else if (sortBy === 'price_b2c_asc') sorted.sort((a, b) => computeFinal(a.original_price_b2c, a.discount_b2c) - computeFinal(b.original_price_b2c, b.discount_b2c));
    else if (sortBy === 'price_b2c_desc') sorted.sort((a, b) => computeFinal(b.original_price_b2c, b.discount_b2c) - computeFinal(a.original_price_b2c, a.discount_b2c));
    else if (sortBy === 'stock_desc') sorted.sort((a, b) => coerceNumber(b.total_count) - coerceNumber(a.total_count));
    else if (sortBy === 'brand_asc') sorted.sort((a, b) => String(a.brand || '').localeCompare(String(b.brand || '')));
    return sorted;
  }, [rows, filter, search, sortBy]);

  const dirtyRows = useMemo(() => rows.filter((r) => r.dirty), [rows]);

  const validateDirty = () => {
    if (!dirtyRows.length) return false;
    return dirtyRows.every((p) =>
      p.id &&
      p.category &&
      p.brand &&
      p.product_name &&
      p.color &&
      p.size &&
      Number.isFinite(coerceNumber(p.original_price_b2b)) &&
      Number.isFinite(coerceNumber(p.discount_b2b)) &&
      Number.isFinite(coerceNumber(p.original_price_b2c)) &&
      Number.isFinite(coerceNumber(p.discount_b2c)) &&
      Number.isFinite(coerceNumber(p.total_count)) &&
      (p.image_url || p.preview_url || p.newImageFile)
    );
  };

  const handleUpdateClick = () => {
    if (!dirtyRows.length) {
      setPopupMessage('No changes to update');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2000);
      return;
    }
    if (!validateDirty()) {
      setPopupMessage('Please complete all required fields in edited rows');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2000);
      return;
    }
    setPopupConfirm(true);
  };

  const uploadImageIfNeeded = async (r) => {
    if (!r.newImageFile) return r.image_url;
    const formData = new FormData();
    formData.append('image', r.newImageFile);
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Upload failed ${res.status}`);
    const data = await res.json();
    const url = normalizeAssetUrl(data.imageUrl || data.url || data.path);
    return url;
  };

  const persistRow = async (r) => {
    const image_url = await uploadImageIfNeeded(r);
    const payload = {
      category: r.category,
      brand: r.brand,
      product_name: r.product_name,
      color: r.color,
      size: r.size,
      original_price_b2b: coerceNumber(r.original_price_b2b),
      discount_b2b: coerceNumber(r.discount_b2b),
      final_price_b2b: computeFinal(r.original_price_b2b, r.discount_b2b),
      original_price_b2c: coerceNumber(r.original_price_b2c),
      discount_b2c: coerceNumber(r.discount_b2c),
      final_price_b2c: computeFinal(r.original_price_b2c, r.discount_b2c),
      total_count: Math.max(0, Math.floor(coerceNumber(r.total_count))),
      image_url
    };
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(r.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Update failed ${res.status}`);
    const updated = await res.json().catch(() => payload);
    return { ...r, ...updated, image_url, newImageFile: null, preview_url: '', dirty: false };
  };

  const confirmUpdate = async (confirmed) => {
    setPopupConfirm(false);
    if (!confirmed) return;
    try {
      const updatedMap = new Map();
      for (const r of rows) {
        if (!r.dirty) continue;
        const u = await persistRow(r);
        updatedMap.set(r.id, u);
      }
      const next = rows.map((r) => updatedMap.get(r.id) || r);
      setRows(next);
      setPopupMessage('Changes saved');
      setPopupType('success');
      setTimeout(() => setPopupMessage(''), 2000);
    } catch {
      setPopupMessage('Error saving changes');
      setPopupType('error');
      setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  return (
    <div className="update-product-page">
      <div className="update-toolbar">
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
          <button className="refresh-btn" onClick={fetchAll} disabled={isLoading}>{isLoading ? 'Loading...' : 'Refresh'}</button>
        </div>
      </div>

      <div className="update-section2">
        <h2>Product Table</h2>
        <div className="table-scroll-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Product Name</th>
                <th>Color</th>
                <th>Size</th>
                <th>Original Price (B2B)</th>
                <th>Discount % (B2B)</th>
                <th>Final Price (B2B)</th>
                <th>Original Price (B2C)</th>
                <th>Discount % (B2C)</th>
                <th>Final Price (B2C)</th>
                <th>Total Count</th>
                <th>Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSortedRows.map((product, idx) => (
                <tr key={product.id || idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={product.category}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'category', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.brand}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'brand', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.product_name}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'product_name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.color}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'color', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={product.size}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'size', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.original_price_b2b}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'original_price_b2b', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.discount_b2b}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'discount_b2b', e.target.value)}
                    />
                  </td>
                  <td>{computeFinal(product.original_price_b2b, product.discount_b2b).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={product.original_price_b2c}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'original_price_b2c', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.discount_b2c}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'discount_b2c', e.target.value)}
                    />
                  </td>
                  <td>{computeFinal(product.original_price_b2c, product.discount_b2c).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={product.total_count}
                      onChange={(e) => updateField(rows.findIndex(r => r.id === product.id), 'total_count', e.target.value)}
                    />
                  </td>
                  <td>
                    <img
                      src={product.preview_url || product.image_url}
                      alt="product"
                      className="table-image"
                    />
                    <label className="image-upload-btn">
                      Add New Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(rows.findIndex(r => r.id === product.id), e.target.files && e.target.files[0])}
                      />
                    </label>
                  </td>
                  <td>
                    <span className={`status-pill ${product.dirty ? 'dirty' : 'clean'}`}>
                      {product.dirty ? 'Edited' : 'Saved'}
                    </span>
                  </td>
                </tr>
              ))}
              {!filteredSortedRows.length && (
                <tr>
                  <td colSpan="15" style={{ padding: 16, color: 'gold' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="update-section3">
        <button className="update-product-btn" onClick={handleUpdateClick}>Save Changes</button>
      </div>

      {popupMessage && (
        <div className={`popup-card ${popupType}`}>
          {popupMessage}
        </div>
      )}

      {popupConfirm && (
        <div className="popup-confirm-box centered-popup">
          <p>Save all edited rows?</p>
          <div className="popup-actions">
            <button onClick={() => confirmUpdate(true)}>Yes</button>
            <button onClick={() => confirmUpdate(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
