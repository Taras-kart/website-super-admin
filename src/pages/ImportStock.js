import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './NavbarAdmin';
import { useAuth } from './AdminAuth';
import { useLoading } from './LoadingContext';
import { apiGet, apiUpload, apiPost } from './api';
import JSZip from 'jszip';
import './ImportStock.css';

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');

const CLOUD_NAME = 'deymt9uyh';
const UPLOAD_PRESET = 'unsigned_ean';
const PROCESS_LIMIT = 500;

function normalizeKey(k) {
  return String(k || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function pickValue(row, candidates) {
  const keys = Object.keys(row || {});
  for (const c of candidates) {
    const ck = normalizeKey(c);
    const found = keys.find(k => normalizeKey(k) === ck);
    if (found !== undefined) return row[found];
  }
  for (const c of candidates) {
    const ck = normalizeKey(c);
    const found = keys.find(k => normalizeKey(k).includes(ck));
    if (found !== undefined) return row[found];
  }
  return undefined;
}

function toNumber(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v)
    .replace(/₹/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return null;
  const m = s.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return isFinite(n) ? n : null;
}

function rowHasBannedPhrases(row) {
  const banned = ['inclusive of all taxes', 'brand', 'new in', 'product', '₹0.00'];
  const values = Object.values(row || {})
    .map(v => String(v ?? '').toLowerCase().trim())
    .filter(Boolean);
  return values.some(val => banned.some(b => val === b || val.includes(b)));
}

function isDefaultBrandOrProduct(s) {
  const t = String(s ?? '').toLowerCase().trim();
  if (!t) return true;
  const defaults = ['brand', 'product', 'new in', 'inclusive of all taxes'];
  return defaults.includes(t) || defaults.some(d => t.includes(d));
}

function shouldDropRow(row) {
  if (!row || typeof row !== 'object') return true;

  const values = Object.values(row).map(v => String(v ?? '').trim());
  const allEmpty = values.every(v => v === '');
  if (allEmpty) return true;

  const brand = pickValue(row, ['brand', 'brand name']);
  const product = pickValue(row, ['product', 'product name', 'name', 'title']);

  const priceVal = pickValue(row, ['price', 'selling price', 'sale price', 'our price', 'sp']);
  const mrpVal = pickValue(row, ['mrp', 'm.r.p', 'list price', 'regular price']);

  const price = toNumber(priceVal);
  const mrp = toNumber(mrpVal);

  const priceIsZero = price !== null && price === 0;
  const mrpIsZero = mrp !== null && mrp === 0;

  const defaultNames = isDefaultBrandOrProduct(brand) || isDefaultBrandOrProduct(product);

  if (rowHasBannedPhrases(row) && (priceIsZero || mrpIsZero)) return true;
  if (priceIsZero && mrpIsZero && defaultNames) return true;

  return false;
}

function parseCsvLine(line) {
  const cols = [];
  let cur = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const ch = line[j];
    if (ch === '"' && line[j + 1] === '"') {
      cur += '"';
      j++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cols.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }

  cols.push(cur);
  return cols;
}

function baseNameNoExt(name) {
  const n = name.split('/').pop() || name;
  const i = n.lastIndexOf('.');
  return i > 0 ? n.slice(0, i) : n;
}

function isImagePath(p) {
  const n = String(p || '').toLowerCase();
  return n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.png') || n.endsWith('.webp');
}

function extractIdentifierFromPath(path, mode) {
  const base = baseNameNoExt(path)
  if (mode === 'ean') {
    const m = String(base).match(/(\d{12,14})/)
    return m ? m[1] : ''
  }
  return String(base).trim()
}

async function cleanExcelOrCsvFile(inputFile) {
  const name = inputFile?.name || '';
  const lower = name.toLowerCase();

  if (lower.endsWith('.csv')) {
    const text = await inputFile.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (!lines.length) return inputFile;

    const headerLine = lines[0];
    const headers = parseCsvLine(headerLine).map(h => h.trim().replace(/^"|"$/g, ''));

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      const cols = parseCsvLine(line);
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cols[idx] ?? '';
      });

      if (!shouldDropRow(rowObj)) rows.push(rowObj);
    }

    const esc = v => {
      const s = String(v ?? '');
      if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const outLines = [];
    outLines.push(headers.map(esc).join(','));
    for (const r of rows) outLines.push(headers.map(h => esc(r[h])).join(','));

    const blob = new Blob([outLines.join('\n')], { type: 'text/csv' });
    return new File([blob], inputFile.name, { type: inputFile.type || 'text/csv' });
  }

  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    const xlsxModule = await import('xlsx');
    const XLSX = xlsxModule.default || xlsxModule;
    const buf = await inputFile.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheetName = wb.SheetNames?.[0];
    if (!sheetName) return inputFile;

    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
    const filtered = (Array.isArray(json) ? json : []).filter(r => !shouldDropRow(r));

    const newWb = XLSX.utils.book_new();
    const newWs = XLSX.utils.json_to_sheet(filtered.length ? filtered : []);
    XLSX.utils.book_append_sheet(newWb, newWs, sheetName);

    const out = XLSX.write(newWb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    return new File([blob], inputFile.name, { type: blob.type });
  }

  return inputFile;
}

export default function ImportStock() {
  const { user } = useAuth();
  const { show, hide } = useLoading();
  const [file, setFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);
  const [gender, setGender] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageProgress, setImageProgress] = useState({ done: 0, total: 0 });
  const [matchStats, setMatchStats] = useState({ matched: 0, total: 0, skipped: 0 });
  const [unmatchedList, setUnmatchedList] = useState([]);
  const [b2cDiscount, setB2cDiscount] = useState('');
  const [b2bDiscount, setB2bDiscount] = useState('');
  const [savingDiscounts, setSavingDiscounts] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const [imageMode, setImageMode] = useState('ean');

  // --- NEW: BRANCH SELECTOR STATE ---
  const [warehouses, setWarehouses] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(user?.branch_id || '');
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);

  const branchId = selectedBranchId;

  const canUpload = useMemo(() => !!file && !!branchId && !uploading && !!gender, [file, branchId, uploading, gender]);
  const canUploadImages = useMemo(() => !!imageZip && !!branchId && !uploadingImages, [imageZip, branchId, uploadingImages]);
  const canSaveDiscounts = useMemo(
    () => !!branchId && !savingDiscounts && b2cDiscount !== '' && b2bDiscount !== '' && !isNaN(parseFloat(b2cDiscount)) && !isNaN(parseFloat(b2bDiscount)),
    [branchId, savingDiscounts, b2cDiscount, b2bDiscount]
  );

  useEffect(() => {
    const saved = localStorage.getItem('import_gender') || '';
    setGender(saved);
  }, []);

// --- ROBUST FETCH WAREHOUSES ---
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token') || '';
        const res = await fetch(`${API_BASE}/api/shiprocket/warehouses`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const data = await res.json();
        
        // Aggressively hunt for the array in the response
        let arr = [];
        if (Array.isArray(data)) arr = data;
        else if (Array.isArray(data?.data)) arr = data.data;
        else if (Array.isArray(data?.warehouses)) arr = data.warehouses;
        else if (Array.isArray(data?.data?.shipping_address)) arr = data.data.shipping_address;
        else if (Array.isArray(data?.data?.data)) arr = data.data.data;

        setWarehouses(arr);

// Auto-select if user has a default branch (For ImportStock.js)
if (user?.branch_id && arr.length > 0 && !selectedBranchId) {
  setSelectedBranchId(String(user.branch_id));
} else if (arr.length > 0 && !selectedBranchId) {
  // If no user branch, just default to the first one in the list
  setSelectedBranchId(String(arr[0].id)); 
}

      } catch (err) {
        console.error('Failed to load warehouses', err);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = useCallback(async () => {
    if (!branchId) return;
    setRefreshing(true);
    show();
    try {
      const data = await apiGet(`/api/branch/${encodeURIComponent(branchId)}/import-jobs`);
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setRefreshing(false);
      hide();
    }
  }, [branchId, show, hide]);

  const fetchDiscounts = useCallback(async () => {
    if (!branchId) return;
    try {
      const data = await apiGet(`/api/branch/${encodeURIComponent(branchId)}/discounts`);
      if (data && typeof data === 'object') {
        if (data.b2c_discount_pct !== undefined && data.b2c_discount_pct !== null) setB2cDiscount(String(data.b2c_discount_pct));
        if (data.b2b_discount_pct !== undefined && data.b2b_discount_pct !== null) setB2bDiscount(String(data.b2b_discount_pct));
      }
    } catch {
      setB2cDiscount('');
      setB2bDiscount('');
    }
  }, [branchId]);

  useEffect(() => {
    if (branchId) {
      fetchJobs();
      fetchDiscounts();
    }
  }, [branchId, fetchJobs, fetchDiscounts]);

  const processJob = useCallback(
    async (jobId, setProg) => {
      let start = 0;
      let finished = false;
      setProg({ jobId, state: 'Processing…', done: 0, total: null });
      while (!finished) {
        const r = await apiPost(`/api/branch/${encodeURIComponent(branchId)}/import/process/${jobId}?start=${start}&limit=${PROCESS_LIMIT}`);
        const processed = Number(r?.processed || 0);
        const next = r?.nextStart !== undefined && r?.nextStart !== null ? Number(r.nextStart) : start + processed;
        const total = r?.totalRows !== undefined && r?.totalRows !== null ? Number(r.totalRows) : null;
        const safeNext = Number.isFinite(next) ? next : start + processed;
        const doneCount = total !== null ? Math.min(safeNext, total) : safeNext;
        setProg({ jobId, state: r?.done ? 'Completed' : 'Processing…', done: doneCount, total });
        if (r?.done || processed <= 0 || safeNext <= start) finished = true;
        else start = safeNext;
      }
    },
    [branchId]
  );

  const onUpload = useCallback(
    async e => {
      e.preventDefault();
      if (!file || !branchId || !gender) {
        setMessage('Please select a category and choose a file.');
        return;
      }
      setUploading(true);
      setMessage('');
      setProgress(null);
      show();
      try {
        const cleaned = await cleanExcelOrCsvFile(file);
        const fd = new FormData();
        fd.append('file', cleaned);
        fd.append('gender', gender);
        localStorage.setItem('import_gender', gender);
        const job = await apiUpload(`/api/branch/${encodeURIComponent(branchId)}/import`, fd);
        setMessage('Uploaded. Starting processing…');
        setFile(null);
        await processJob(job.id, setProgress);
        await fetchJobs();
      } catch (err) {
        setMessage(err?.payload?.message || err?.message || 'Upload failed');
      } finally {
        setUploading(false);
        hide();
        setTimeout(() => setMessage(''), 3000);
      }
    },
    [file, branchId, gender, show, hide, processJob, fetchJobs]
  );

  async function uploadToCloudinary(blob, publicIdBase) {
    const form = new FormData();
    form.append('file', blob);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('folder', 'products');
    form.append('public_id', publicIdBase);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
    return res.json();
  }

  const onUploadImages = useCallback(
    async e => {
      e.preventDefault();
      if (!imageZip || !branchId) {
        setImageMessage('Please choose a ZIP file.');
        return;
      }
      setUploadingImages(true);
      setImageMessage('');
      setImageProgress({ done: 0, total: 0 });
      setMatchStats({ matched: 0, total: 0, skipped: 0 });
      setUnmatchedList([]);
      show();
      try {
        let identifierSet = new Set();
        try {
          const list = await apiGet(`/api/products?limit=100000`);
          identifierSet = new Set((Array.isArray(list) ? list : []).map(p => String(p.ean_code || '').trim()).filter(Boolean));
        } catch {}
        const zip = await JSZip.loadAsync(imageZip);
        const entries = Object.values(zip.files).filter(f => !f.dir && isImagePath(f.name));
        const total = entries.length;
        let done = 0; let matched = 0; const unmatched = [];
        for (const f of entries) {
          const identifier = extractIdentifierFromPath(f.name, imageMode).trim();
          if (!identifier || !identifierSet.has(identifier)) {
            unmatched.push({ file: f.name, ean: identifier || '(none)' });
          } else {
            const blob = await f.async('blob');
            await uploadToCloudinary(blob, identifier);
            matched += 1;
          }
          done += 1;
          setImageProgress({ done, total });
        }
        setMatchStats({ matched, total, skipped: total - matched });
        setUnmatchedList(unmatched);
        setImageMessage(`Finished. Uploaded ${matched}/${total}. Unmatched ${unmatched.length}.`);
        setImageZip(null);
      } catch (err) {
        setImageMessage(err?.message || 'Image upload failed');
      } finally {
        setUploadingImages(false);
        hide();
        setTimeout(() => setImageMessage(''), 5000);
      }
    },
    [imageZip, branchId, imageMode, show, hide]
  );

  async function onSaveDiscounts(e) {
    e.preventDefault();
    if (!branchId) return;
    const b2c = parseFloat(b2cDiscount);
    const b2b = parseFloat(b2bDiscount);
    setSavingDiscounts(true);
    show();
    try {
      await apiPost(`/api/branch/${encodeURIComponent(branchId)}/discounts`, { b2c_discount_pct: b2c, b2b_discount_pct: b2b });
      setDiscountMessage('Discounts saved successfully');
    } catch (err) {
      setDiscountMessage('Failed to save discounts');
    } finally {
      setSavingDiscounts(false);
      hide();
      setTimeout(() => setDiscountMessage(''), 4000);
    }
  }

  return (
    <div className="import-page-admin">
      <Navbar />

      <div style={{ padding: '16px 24px', backgroundColor: '#111', borderBottom: '1px solid #333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, color: 'gold' }}>Select Branch Context:</h3>
        {loadingWarehouses ? <span style={{ color: '#aaa' }}>Loading branches...</span> : (
          <select style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#000', color: '#fff', border: '1px solid gold', fontSize: '14px', minWidth: '250px' }} value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)}>
            <option value="" disabled>-- Select a Branch --</option>
            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
          </select>
        )}
      </div>

      <div className="import-wrap-admin">
        <div className="import-card-admin">
          <div className="import-title-admin">Import Stock (Excel)</div>
          <form className="import-form-admin" onSubmit={e => e.preventDefault()}>
            <div className="excel-block">
              <select className="audience-select" value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="KIDS">Kids</option>
              </select>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={e => setFile(e.target.files?.[0] || null)} />
              <button className="import-btn-admin" onClick={onUpload} disabled={!canUpload}>{uploading ? 'Uploading…' : 'Upload Excel'}</button>
              {message && <div className="import-msg-admin">{message}</div>}
              {progress && <div className="import-msg-admin">{progress.state} {progress.total ? `${progress.done}/${progress.total}` : `${progress.done}+`} rows</div>}
            </div>
          </form>
        </div>

        <div className="import-card-admin">
          <div className="import-title-admin">Upload Product Images (ZIP)</div>
          <form className="import-form-admin" onSubmit={e => e.preventDefault()}>
            <div className="zip-block">
              <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="radio" name="imageMode" value="ean" checked={imageMode === 'ean'} onChange={() => setImageMode('ean')} /> Match by EAN
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="radio" name="imageMode" value="pattern" checked={imageMode === 'pattern'} onChange={() => setImageMode('pattern')} /> Match by Pattern
                </label>
              </div>
              <input type="file" accept=".zip" onChange={e => setImageZip(e.target.files?.[0] || null)} />
              <button className="import-btn-admin" onClick={onUploadImages} disabled={!canUploadImages || uploadingImages}>
                {uploadingImages ? `Uploading ${imageProgress.done}/${imageProgress.total}…` : 'Upload Images ZIP'}
              </button>
              {imageMessage && <div className="import-msg-admin">{imageMessage}</div>}
              {!!unmatchedList.length && (
                <div className="unmatched-wrap">
                  <ul className="unmatched-list">{unmatchedList.map((u, i) => <li key={i}>{u.ean}: {u.file}</li>)}</ul>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}