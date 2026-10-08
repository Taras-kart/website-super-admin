import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AdminAuth';
import { useLoading } from './LoadingContext';
import { apiGet, apiUpload, apiPost } from './api';
import JSZip from 'jszip';
import './ImportStock.css';
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
  "import-page-admin": ["tsup-importstock-import-page-admin"],
  "import-wrap-admin": ["tsup-importstock-import-wrap-admin"],
  "import-card-admin": ["tsup-importstock-import-card-admin"],
  "import-title-admin": ["tsup-importstock-import-title-admin"],
  "import-subtitle-admin": ["tsup-importstock-import-subtitle-admin"],
  "import-form-admin": ["tsup-importstock-import-form-admin"],
  "select-wrap": ["tsup-importstock-select-wrap"],
  "label": ["tsup-importstock-label"],
  "audience-select": ["tsup-importstock-audience-select"],
  "invalid": ["tsup-importstock-invalid"],
  "inline-info": ["tsup-importstock-inline-info"],
  "pill-mini": ["tsup-importstock-pill-mini"],
  "ok": ["tsup-importstock-ok"],
  "warn": ["tsup-importstock-warn"],
  "import-filebox-admin": ["tsup-importstock-import-filebox-admin"],
  "import-filehint-admin": ["tsup-importstock-import-filehint-admin"],
  "import-btn-admin": ["tsup-importstock-import-btn-admin"],
  "import-msg-admin": ["tsup-importstock-import-msg-admin"],
  "import-actions-admin": ["tsup-importstock-import-actions-admin"],
  "import-ghost-btn-admin": ["tsup-importstock-import-ghost-btn-admin"],
  "import-tablewrap-admin": ["tsup-importstock-import-tablewrap-admin"],
  "import-table-admin": ["tsup-importstock-import-table-admin"],
  "pill-admin": ["tsup-importstock-pill-admin"],
  "pending": ["tsup-importstock-pending"],
  "processing": ["tsup-importstock-processing"],
  "complete": ["tsup-importstock-complete"],
  "completed": ["tsup-importstock-completed"],
  "partial": ["tsup-importstock-partial"],
  "error": ["tsup-importstock-error"],
  "import-empty-admin": ["tsup-importstock-import-empty-admin"],
  "import-note-admin": ["tsup-importstock-import-note-admin"],
  "excel-block": ["tsup-importstock-excel-block"],
  "zip-block": ["tsup-importstock-zip-block"],
  "image-stats": ["tsup-importstock-image-stats"],
  "unmatched-wrap": ["tsup-importstock-unmatched-wrap"],
  "unmatched-title": ["tsup-importstock-unmatched-title"],
  "unmatched-list": ["tsup-importstock-unmatched-list"],
  "unmatched-ean": ["tsup-importstock-unmatched-ean"],
  "unmatched-file": ["tsup-importstock-unmatched-file"],
  "discount-block": ["tsup-importstock-discount-block"],
  "discount-row": ["tsup-importstock-discount-row"],
  "discount-field": ["tsup-importstock-discount-field"],
  "discount-input": ["tsup-importstock-discount-input"]
})[name] || ["tsup-importstock-" + name]).join(' ');
const PROCESS_LIMIT = 100;
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
  const base = baseNameNoExt(path);
  if (mode === 'ean') {
    return String(base).replace(/__(front|back|side|detail[0-9]*)$/i, '').trim();
  }
  return String(base).trim();
}
function normalizeImageKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '|').replace(/^\|+|\|+$/g, '');
}
function safePublicIdPart(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}
function buildAliasKey(...parts) {
  return parts.map(p => String(p ?? '').trim()).filter(Boolean).join('__');
}
function addSharedAlias(map, collisions, alias, value) {
  const key = normalizeImageKey(alias);
  if (!key) return;
  if (collisions.has(key)) return;
  const existing = map.get(key);
  if (!existing) {
    map.set(key, value);
    return;
  }
  if (Number(existing.product_id) !== Number(value.product_id) || normalizeImageKey(existing.colour) !== normalizeImageKey(value.colour) || normalizeImageKey(existing.fit) !== normalizeImageKey(value.fit)) {
    map.delete(key);
    collisions.add(key);
  }
}
function buildImageLookups(products) {
  const eanMap = new Map();
  const sharedMap = new Map();
  const sharedCollisions = new Set();
  for (const item of Array.isArray(products) ? products : []) {
    const ean = String(item?.ean_code || '').trim();
    if (ean) {
      eanMap.set(ean, item);
    }
    const productId = Number(item?.product_id || 0);
    const colour = String(item?.color ?? item?.colour ?? '').trim();
    const pattern = String(item?.pattern_code || '').trim();
    const fit = String(item?.fit || '').trim();
    if (!productId || !colour) {
      continue;
    }
    const value = {
      product_id: productId,
      colour,
      fit,
      pattern_code: pattern,
      product_name: String(item?.product_name || '').trim(),
      brand: String(item?.brand ?? item?.brand_name ?? '').trim()
    };
    const aliases = [buildAliasKey(productId, colour), `${productId} ${colour}`, `${productId}-${colour}`, `${productId}_${colour}`];
    if (fit) {
      aliases.push(buildAliasKey(productId, colour, fit), `${productId} ${colour} ${fit}`, `${productId}-${colour}-${fit}`, `${productId}_${colour}_${fit}`);
    }
    if (pattern) {
      aliases.push(buildAliasKey(pattern, colour), `${pattern} ${colour}`, `${pattern}-${colour}`, `${pattern}_${colour}`);
      if (fit) {
        aliases.push(buildAliasKey(pattern, colour, fit), `${pattern} ${colour} ${fit}`, `${pattern}-${colour}-${fit}`, `${pattern}_${colour}_${fit}`);
      }
    }
    for (const alias of aliases) {
      addSharedAlias(sharedMap, sharedCollisions, alias, value);
    }
  }
  return {
    eanMap,
    sharedMap,
    sharedCollisions
  };
}
export default function ImportStock() {
  const {
    user
  } = useAuth();
  const {
    show,
    hide
  } = useLoading();
  const [file, setFile] = useState(null);
  const [imageZip, setImageZip] = useState(null);
  const [gender, setGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [message, setMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageProgress, setImageProgress] = useState({
    done: 0,
    total: 0
  });
  const [matchStats, setMatchStats] = useState({
    matched: 0,
    total: 0,
    skipped: 0
  });
  const [unmatchedList, setUnmatchedList] = useState([]);
  const [b2cDiscount, setB2cDiscount] = useState('');
  const [b2bDiscount, setB2bDiscount] = useState('');
  const [savingDiscounts, setSavingDiscounts] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const [imageMode, setImageMode] = useState('ean');
  const [importType, setImportType] = useState('B2C');
  const [b2bMessage, setB2bMessage] = useState('');
  const [b2bUploading, setB2bUploading] = useState(false);
  const branchId = user?.branch_id;
  const canUpload = useMemo(() => !!file && !!branchId && !uploading && !!gender && !!categoryId, [file, branchId, uploading, gender, categoryId]);
  const canUploadImages = useMemo(() => !!imageZip && !!branchId && !uploadingImages, [imageZip, branchId, uploadingImages]);
  const canSaveDiscounts = useMemo(() => {
    return !!branchId && !savingDiscounts && b2cDiscount !== '' && b2bDiscount !== '' && !isNaN(parseFloat(b2cDiscount)) && !isNaN(parseFloat(b2bDiscount));
  }, [branchId, savingDiscounts, b2cDiscount, b2bDiscount]);
  useEffect(() => {
    const saved = localStorage.getItem('import_gender') || '';
    const savedCategory = localStorage.getItem('import_category_id') || '';
    setGender(saved);
    setCategoryId(savedCategory);
  }, []);
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await apiGet('/api/categories?active=true&withCounts=false');
      const list = Array.isArray(data) ? data : Array.isArray(data?.categories) ? data.categories : [];
      setCategories(list.filter(category => category && category.is_active !== false && category.parent_id !== null && category.parent_id !== undefined && Number(category.level ?? 1) > 0));
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    const refreshCategories = () => fetchCategories();
    window.addEventListener('focus', refreshCategories);
    return () => window.removeEventListener('focus', refreshCategories);
  }, [fetchCategories]);
  const genderCategories = useMemo(() => categories.filter(category => String(category.gender || category.root_name || '').trim().toUpperCase() === gender), [categories, gender]);
  useEffect(() => {
    if (!categoryId || categoriesLoading) return;
    const valid = genderCategories.some(category => String(category.id) === String(categoryId));
    if (!valid) {
      setCategoryId('');
      localStorage.removeItem('import_category_id');
    }
  }, [categoryId, categoriesLoading, genderCategories]);
  const onB2BUpload = useCallback(async () => {
    if (!file || !gender || b2bUploading) {
      return;
    }
    setB2bUploading(true);
    setB2bMessage('');
    show();
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('gender', gender);
      if (categoryId) {
        fd.append('categoryId', categoryId);
      }
      const token = localStorage.getItem('auth_token') || '';
      const API_BASE_RAW = process.env.REACT_APP_API_BASE || 'https://taras-kart-backend.vercel.app';
      const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
      const res = await fetch(`${API_BASE}/api/b2b/import`, {
        method: 'POST',
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setB2bMessage(data.message || 'B2B import complete');
        if (data.errors?.length) {
          setB2bMessage(prev => prev + ' | Errors: ' + data.errors.slice(0, 3).join('; '));
        }
      } else {
        setB2bMessage(data.message || 'B2B import failed');
      }
    } catch (e) {
      setB2bMessage('Network error: ' + e.message);
    } finally {
      setB2bUploading(false);
      hide();
    }
  }, [file, gender, categoryId, b2bUploading, show, hide]);
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
        if (data.b2c_discount_pct !== undefined && data.b2c_discount_pct !== null) {
          setB2cDiscount(String(data.b2c_discount_pct));
        }
        if (data.b2b_discount_pct !== undefined && data.b2b_discount_pct !== null) {
          setB2bDiscount(String(data.b2b_discount_pct));
        }
      }
    } catch {
      setB2cDiscount('');
      setB2bDiscount('');
    }
  }, [branchId]);
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);
  const processJob = useCallback(async (jobId, setProg) => {
    let start = 0;
    let finished = false;
    setProg({
      jobId,
      state: 'Processing…',
      done: 0,
      total: null
    });
    while (!finished) {
      const r = await apiPost(`/api/branch/${encodeURIComponent(branchId)}/import/process/${jobId}?start=${start}&limit=${PROCESS_LIMIT}`);
      const processed = Number(r?.processed || 0);
      const next = r?.nextStart !== undefined && r?.nextStart !== null ? Number(r.nextStart) : start + processed;
      const total = r?.totalRows !== undefined && r?.totalRows !== null ? Number(r.totalRows) : null;
      const safeNext = Number.isFinite(next) ? next : start + processed;
      const doneCount = total !== null ? Math.min(safeNext, total) : safeNext;
      setProg({
        jobId,
        state: r?.done ? 'Completed' : 'Processing…',
        done: doneCount,
        total
      });
      if (r?.done || processed <= 0 || safeNext <= start) {
        finished = true;
      } else {
        start = safeNext;
      }
    }
  }, [branchId]);
  const onUpload = useCallback(async e => {
    e.preventDefault();
    if (!file || !branchId || !gender || !categoryId) {
      setMessage('Please select a gender, category, and file.');
      return;
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setMessage('You are not logged in');
      return;
    }
    setUploading(true);
    setMessage('');
    setProgress(null);
    show();
    try {
      const cleaned = file;
      const fd = new FormData();
      fd.append('file', cleaned);
      fd.append('gender', gender);
      fd.append('categoryId', categoryId);
      localStorage.setItem('import_gender', gender);
      localStorage.setItem('import_category_id', categoryId);
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
    }
  }, [file, branchId, gender, categoryId, show, hide, processJob, fetchJobs]);
  async function uploadToCloudinary(blob, publicIdBase) {
    const form = new FormData();
    form.append('image', blob, `${publicIdBase}.jpg`);
    return apiUpload('/api/upload', form);
  }
  const onUploadImages = useCallback(async e => {
    e.preventDefault();
    if (!imageZip || !branchId) {
      setImageMessage('Please choose a ZIP file.');
      return;
    }
    setUploadingImages(true);
    setImageMessage('');
    setImageProgress({
      done: 0,
      total: 0
    });
    setMatchStats({
      matched: 0,
      total: 0,
      skipped: 0
    });
    setUnmatchedList([]);
    show();
    try {
      const zip = await JSZip.loadAsync(imageZip);
      const entries = Object.values(zip.files).filter(f => !f.dir && isImagePath(f.name));
      let eanMap = new Map();
      let sharedMap = new Map();
      let sharedCollisions = new Set();
      if (imageMode === 'ean') {
        const identifiers = [...new Set(entries.map(file => extractIdentifierFromPath(file.name, imageMode).trim()).filter(Boolean))];
        for (let start = 0; start < identifiers.length; start += 1000) {
          const result = await apiPost(`/api/branch/${branchId}/images/lookup`, {
            eans: identifiers.slice(start, start + 1000)
          });
          if (!Array.isArray(result?.found)) throw new Error('Invalid barcode lookup response. Deploy the updated backend first.');
          for (const ean of result.found) eanMap.set(String(ean).trim(), true);
        }
      } else {
        const products = [];
        let offset = 0;
        while (true) {
          const page = await apiGet('/api/manage/stock', {
            branch_id: branchId,
            limit: 200,
            offset
          });
          products.push(...page.rows);
          offset += page.rows.length;
          if (offset >= page.total || !page.rows.length) break;
        }
        ({
          eanMap,
          sharedMap,
          sharedCollisions
        } = buildImageLookups(products));
      }
      const total = entries.length;
      let done = 0;
      let matched = 0;
      const unmatched = [];
      const confirmations = [];
      const seen = new Set();
      for (const f of entries) {
        const identifier = extractIdentifierFromPath(f.name, imageMode).trim();
        if (imageMode === 'ean') {
          const imageType = baseNameNoExt(f.name).match(/__(front|back|side|detail[0-9]*)$/i)?.[1]?.toLowerCase() || 'front';
          const imageKey = `${identifier}:${imageType}`;
          if (!identifier || !eanMap.has(identifier)) {
            unmatched.push({
              file: f.name,
              identifier: identifier || '(none)',
              reason: 'EAN not found'
            });
            done += 1;
            setImageProgress({
              done,
              total
            });
            continue;
          }
          if (seen.has(imageKey)) {
            unmatched.push({
              file: f.name,
              identifier,
              reason: 'Duplicate EAN in ZIP'
            });
            done += 1;
            setImageProgress({
              done,
              total
            });
            continue;
          }
          seen.add(imageKey);
          const blob = await f.async('blob');
          const uploaded = await uploadToCloudinary(blob, identifier);
          const secureUrl = String(uploaded?.secure_url || uploaded?.url || '').trim();
          if (!secureUrl) {
            unmatched.push({
              file: f.name,
              identifier,
              reason: 'Upload returned no URL'
            });
            done += 1;
            setImageProgress({
              done,
              total
            });
            continue;
          }
          confirmations.push({
            ean: identifier,
            image_type: imageType,
            secure_url: secureUrl,
            cloudinary_public_id: uploaded?.public_id || null
          });
          matched += 1;
          done += 1;
          setImageProgress({
            done,
            total
          });
          continue;
        }
        const key = normalizeImageKey(identifier);
        const shared = key ? sharedMap.get(key) : null;
        if (!identifier || !key || sharedCollisions.has(key)) {
          unmatched.push({
            file: f.name,
            identifier: identifier || '(none)',
            reason: sharedCollisions.has(key) ? 'Pattern/Product + colour (+fit) is ambiguous; use Product ID + colour + fit' : 'Invalid shared filename'
          });
          done += 1;
          setImageProgress({
            done,
            total
          });
          continue;
        }
        if (!shared) {
          unmatched.push({
            file: f.name,
            identifier,
            reason: 'Product + colour (+fit) not found'
          });
          done += 1;
          setImageProgress({
            done,
            total
          });
          continue;
        }
        const groupKey = `${shared.product_id}|${normalizeImageKey(shared.colour)}|${normalizeImageKey(shared.fit)}`;
        if (seen.has(groupKey)) {
          unmatched.push({
            file: f.name,
            identifier,
            reason: 'Duplicate product + colour + fit in ZIP'
          });
          done += 1;
          setImageProgress({
            done,
            total
          });
          continue;
        }
        seen.add(groupKey);
        const publicId = `shared_${shared.product_id}_${safePublicIdPart(shared.colour) || 'colour'}${shared.fit ? `_${safePublicIdPart(shared.fit)}` : ''}`;
        const blob = await f.async('blob');
        const uploaded = await uploadToCloudinary(blob, publicId);
        const secureUrl = String(uploaded?.secure_url || uploaded?.url || '').trim();
        if (!secureUrl) {
          unmatched.push({
            file: f.name,
            identifier,
            reason: 'Upload returned no URL'
          });
          done += 1;
          setImageProgress({
            done,
            total
          });
          continue;
        }
        confirmations.push({
          product_id: shared.product_id,
          colour: shared.colour,
          fit: shared.fit,
          secure_url: secureUrl,
          cloudinary_public_id: uploaded?.public_id || null
        });
        matched += 1;
        done += 1;
        setImageProgress({
          done,
          total
        });
      }
      if (confirmations.length) {
        const confirmation = await apiPost(`/api/branch/${encodeURIComponent(branchId)}/images/confirm`, {
          scope: imageMode === 'ean' ? 'legacy' : 'shared',
          images: confirmations
        });
        if (Number(confirmation?.totalUpdated) !== confirmations.length || Number(confirmation?.skipped || 0) > 0) {
          throw new Error(`Images reached Cloudinary, but database confirmation saved ${Number(confirmation?.totalUpdated) || 0} of ${confirmations.length}. Skipped ${Number(confirmation?.skipped) || 0}. Check the deployed backend before retrying.`);
        }
      }
      setMatchStats({
        matched,
        total,
        skipped: total - matched
      });
      setUnmatchedList(unmatched);
      setImageMessage(imageMode === 'ean' ? `Finished. Confirmed ${matched}/${total} EAN images. Unmatched ${unmatched.length}.` : `Finished. Confirmed ${matched}/${total} shared product-colour(-fit) images. Unmatched ${unmatched.length}.`);
      setImageZip(null);
    } catch (err) {
      setImageMessage(err?.payload?.message || err?.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
      hide();
    }
  }, [imageZip, branchId, imageMode, show, hide]);
  const onSaveDiscounts = useCallback(async e => {
    e.preventDefault();
    if (!branchId) {
      setDiscountMessage('Branch not found');
      return;
    }
    const b2c = parseFloat(b2cDiscount);
    const b2b = parseFloat(b2bDiscount);
    if (isNaN(b2c) || isNaN(b2b)) {
      setDiscountMessage('Enter valid discount percentages');
      return;
    }
    setSavingDiscounts(true);
    setDiscountMessage('');
    show();
    try {
      await apiPost(`/api/branch/${encodeURIComponent(branchId)}/discounts`, {
        b2c_discount_pct: b2c,
        b2b_discount_pct: b2b
      });
      setDiscountMessage('Discounts saved successfully');
    } catch (err) {
      setDiscountMessage(err?.payload?.message || err?.message || 'Failed to save discounts');
    } finally {
      setSavingDiscounts(false);
      hide();
      setTimeout(() => setDiscountMessage(''), 4000);
    }
  }, [branchId, b2cDiscount, b2bDiscount, show, hide]);
  return <div className={portalClass("import-page-admin")}>
      <div className={portalClass("ops-main")} style={{
      paddingBottom: 0
    }}><h1 className="tsup-importstock-heading">Excel &amp; images</h1><a href="/templates/Tara-Product-Import-Template.xlsx" download className="tsup-importstock-node-0">Download product import template</a><p className="tsup-importstock-node-1">Choose branch, department and category. Upload one row per colour and size. Re-uploading the same file resumes its original job.</p></div>
      <div className={portalClass("import-wrap-admin")}>
        <div className={portalClass("import-card-admin")}>
          <div className={portalClass("import-title-admin")}>
            Import Stock (Excel)
          </div>
          <div className={portalClass("import-subtitle-admin")}>
            Upload your branch Excel file for a selected category.
          </div>
          <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16
        }} className="tsup-importstock-node-2">
            <button type="button" onClick={() => {
            setImportType('B2C');
            setB2bMessage('');
          }} style={{
            padding: '8px 24px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
            background: importType === 'B2C' ? 'var(--portal-soft)' : "#ffffff",
            color: importType === 'B2C' ? 'var(--portal-accent)' : "#42536a"
          }} className="tsup-importstock-node-3">
              B2C Import
            </button>
            <button type="button" onClick={() => {
            setImportType('B2B');
            setMessage('');
          }} style={{
            padding: '8px 24px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 13,
            background: importType === 'B2B' ? 'var(--portal-soft)' : "#ffffff",
            color: importType === 'B2B' ? 'var(--portal-accent)' : "#42536a"
          }} className="tsup-importstock-node-4">
              B2B Import
            </button>
          </div>
          <form className={portalClass("import-form-admin")} onSubmit={e => e.preventDefault()}>
            <div className={portalClass("excel-block")}>
              <div className={portalClass("select-wrap")}>
                <label className={portalClass("label")}>
                  Gender
                </label>
                <select className={portalClass(`audience-select ${gender ? '' : 'invalid'}`)} value={gender} onChange={e => {
                setGender(e.target.value);
                setCategoryId('');
                localStorage.removeItem('import_category_id');
              }} required>
                  <option value="" className="tsup-importstock-node-5">
                    Select Gender
                  </option>
                  <option value="MEN" className="tsup-importstock-node-6">
                    Men
                  </option>
                  <option value="WOMEN" className="tsup-importstock-node-7">
                    Women
                  </option>
                  <option value="KIDS" className="tsup-importstock-node-8">
                    Kids
                  </option>
                </select>
              </div>
              <div className={portalClass("select-wrap")}>
                <label className={portalClass("label")}>
                  Category
                </label>
                <select className={portalClass(`audience-select ${categoryId ? '' : 'invalid'}`)} value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={!gender || categoriesLoading} required>
                  <option value="" className="tsup-importstock-node-9">
                    {categoriesLoading ? 'Loading Categories…' : !gender ? 'Select Gender First' : genderCategories.length ? 'Select Category' : 'No Categories Available'}
                  </option>
                  {genderCategories.map(category => <option key={category.id} value={category.id} className="tsup-importstock-node-10">
                      {category.category_path || category.name}
                    </option>)}
                </select>
              </div>
              <div className={portalClass("import-filebox-admin")}>
                <label className={portalClass("label")}>
                  Excel / CSV
                </label>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={e => setFile(e.target.files?.[0] || null)} className="tsup-importstock-node-11" />
                {file ? <div className={portalClass("import-filehint-admin")}>
                    {file.name}
                    {' • '}
                    {(file.size / 1024 / 1024).toFixed(2)}
                    {' MB'}
                  </div> : <div className={portalClass("import-filehint-admin")}>
                    No file selected
                  </div>}
                {importType === 'B2C' ? <>
                    <button className={portalClass("import-btn-admin")} onClick={onUpload} disabled={!canUpload}>
                      {uploading ? 'Uploading…' : 'Upload B2C Excel'}
                    </button>
                    {message ? <div className={portalClass("import-msg-admin")}>
                        {message}
                      </div> : null}
                  </> : <>
                    <button className={portalClass("import-btn-admin")} onClick={onB2BUpload} disabled={!file || !gender || !categoryId || b2bUploading}>
                      {b2bUploading ? 'Uploading…' : 'Upload B2B Excel'}
                    </button>
                    {b2bMessage ? <div className={portalClass("import-msg-admin")}>
                        {b2bMessage}
                      </div> : null}
                  </>}
                {progress ? <div className={portalClass("import-msg-admin")}>
                    {progress.state}
                    {' '}
                    {progress.total ? `${progress.done}/${progress.total}` : `${progress.done}+`}
                    {' rows'}
                  </div> : null}
              </div>
              <div className={portalClass("inline-info")}>
                <span className={portalClass(`pill-mini ${gender ? 'ok' : 'warn'}`)}>
                  {gender && categoryId ? `${gender} • ${genderCategories.find(category => String(category.id) === String(categoryId))?.name || 'Category selected'}` : 'Select a gender and category for Excel upload'}
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className={portalClass("import-card-admin")}>
          <div className={portalClass("import-title-admin")}>
            Upload Product Images
          </div>
          <div className={portalClass("import-subtitle-admin")}>
            Use EAN mode for legacy per-variant images, or Shared mode to upload one image for every size of the same product, colour, and fit.
          </div>
          <form className={portalClass("import-form-admin")} onSubmit={e => e.preventDefault()}>
            <div className={portalClass("zip-block")}>
              <div className={portalClass("import-filebox-admin")}>
                <label className={portalClass("label")}>
                  Images ZIP Folder
                </label>
                <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '10px',
                flexWrap: 'wrap'
              }} className="tsup-importstock-node-12">
                  <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }} className="tsup-importstock-node-13">
                    <input type="radio" name="imageMode" value="ean" checked={imageMode === 'ean'} onChange={() => setImageMode('ean')} className="tsup-importstock-node-14" />
                    EAN Image
                  </label>
                  <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }} className="tsup-importstock-node-15">
                    <input type="radio" name="imageMode" value="shared" checked={imageMode === 'shared'} onChange={() => setImageMode('shared')} className="tsup-importstock-node-16" />
                    Shared Product + Colour (+Fit) Image
                  </label>
                </div>
                <div className={portalClass("import-filehint-admin")} style={{
                marginBottom: '10px'
              }}>
                  {imageMode === 'ean' ? 'EAN filenames: 8903289347502.jpg (front), 8903289347502__back.jpg, 8903289347502__side.jpg' : 'Shared mode filename examples: 1508__JUNGLE GREEN.jpg (no fit distinction) or 1508__JUNGLE GREEN__RN.jpg / 1508__JUNGLE GREEN__RNS.jpg (when the same product+colour has different looks per fit, like GOKUL vests). Product ID + colour + fit is safest; Pattern + colour(+fit) also works when unique.'}
                </div>
                <input type="file" accept=".zip" onChange={e => setImageZip(e.target.files?.[0] || null)} className="tsup-importstock-node-17" />
                {imageZip ? <div className={portalClass("import-filehint-admin")}>
                    {imageZip.name}
                    {' • '}
                    {(imageZip.size / 1024 / 1024).toFixed(2)}
                    {' MB'}
                  </div> : <div className={portalClass("import-filehint-admin")}>
                    No ZIP selected
                  </div>}
                <button className={portalClass("import-btn-admin")} onClick={onUploadImages} disabled={!canUploadImages || uploadingImages}>
                  {uploadingImages ? `Uploading ${imageProgress.done}/${imageProgress.total}…` : 'Upload Images ZIP'}
                </button>
                {imageMessage ? <div className={portalClass("import-msg-admin")}>
                    {imageMessage}
                  </div> : null}
                <div className={portalClass("image-stats")}>
                  <span className="tsup-importstock-node-18">
                    Matched:{' '}
                    {matchStats.matched}
                  </span>
                  <span className="tsup-importstock-node-19">
                    Unmatched:{' '}
                    {matchStats.skipped}
                  </span>
                  <span className="tsup-importstock-node-20">
                    Total:{' '}
                    {matchStats.total}
                  </span>
                </div>
                {!!unmatchedList.length && <div className={portalClass("unmatched-wrap")}>
                    <div className={portalClass("unmatched-title")}>
                      Unmatched Images
                    </div>
                    <ul className={portalClass("unmatched-list")}>
                      {unmatchedList.map((u, i) => <li key={`${u.file}-${i}`} className="tsup-importstock-node-21">
                            <span className={portalClass("unmatched-ean")}>
                              {u.identifier}
                            </span>
                            <span className={portalClass("unmatched-file")}>
                              {u.file}
                              {u.reason ? ` — ${u.reason}` : ''}
                            </span>
                          </li>)}
                    </ul>
                  </div>}
              </div>
            </div>
          </form>
        </div>
        <div className={portalClass("import-card-admin")}>
          <div className={portalClass("import-title-admin")}>
            B2C / B2B Discounts
          </div>
          <div className={portalClass("import-subtitle-admin")}>
            Set discount percentages for all products in this branch. These are kept separate from Excel and image uploads.
          </div>
          <form className={portalClass("import-form-admin")} onSubmit={onSaveDiscounts}>
            <div className={portalClass("discount-block")}>
              <div className={portalClass("discount-row")}>
                <div className={portalClass("discount-field")}>
                  <label className={portalClass("label")}>
                    B2C Discount (%)
                  </label>
                  <input type="number" min="0" max="100" step="0.01" value={b2cDiscount} onChange={e => setB2cDiscount(e.target.value)} className={portalClass("discount-input")} />
                </div>
                <div className={portalClass("discount-field")}>
                  <label className={portalClass("label")}>
                    B2B Discount (%)
                  </label>
                  <input type="number" min="0" max="100" step="0.01" value={b2bDiscount} onChange={e => setB2bDiscount(e.target.value)} className={portalClass("discount-input")} />
                </div>
              </div>
              <button type="submit" className={portalClass("import-btn-admin")} disabled={!canSaveDiscounts}>
                {savingDiscounts ? 'Saving…' : 'Save Discounts'}
              </button>
              {discountMessage ? <div className={portalClass("import-msg-admin")}>
                  {discountMessage}
                </div> : null}
            </div>
          </form>
        </div>
        <div className={portalClass("import-card-admin")}>
          <div className={portalClass("import-title-admin")}>
            Recent Imports
          </div>
          <div className={portalClass("import-actions-admin")}>
            <button className={portalClass("import-ghost-btn-admin")} onClick={fetchJobs} disabled={refreshing}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <div className={portalClass("import-tablewrap-admin")}>
            <table className={portalClass("import-table-admin")}>
              <thead className="tsup-importstock-node-22">
                <tr className="tsup-importstock-node-23">
                  <th className="tsup-importstock-node-24">
                    ID
                  </th>
                  <th className="tsup-importstock-node-25">
                    File
                  </th>
                  <th className="tsup-importstock-node-26">
                    Gender
                  </th>
                  <th className="tsup-importstock-node-27">
                    Category
                  </th>
                  <th className="tsup-importstock-node-28">
                    Status
                  </th>
                  <th className="tsup-importstock-node-29">
                    Total
                  </th>
                  <th className="tsup-importstock-node-30">
                    Success
                  </th>
                  <th className="tsup-importstock-node-31">
                    Error
                  </th>
                  <th className="tsup-importstock-node-32">
                    Uploaded
                  </th>
                  <th className="tsup-importstock-node-33">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="tsup-importstock-node-34">
                {jobs.map(j => <tr key={j.id} className={portalClass("import-row-card")}>
                      <td data-label="ID" className="tsup-importstock-node-35">
                        {j.id}
                      </td>
                      <td data-label="File" className="tsup-importstock-node-36">
                        {j.file_name || '-'}
                      </td>
                      <td data-label="Gender" className="tsup-importstock-node-37">
                        {j.gender || '-'}
                      </td>
                      <td data-label="Category" className="tsup-importstock-node-38">
                        {j.category_name || '-'}
                      </td>
                      <td data-label="Status" className="tsup-importstock-node-39">
                        <span className={portalClass(`pill-admin ${String(j.status_enum || '').toLowerCase()}`)}>
                          {j.status_enum}
                        </span>
                      </td>
                      <td data-label="Total" className="tsup-importstock-node-40">
                        {j.rows_total ?? 0}
                      </td>
                      <td data-label="Success" className="tsup-importstock-node-41">
                        {j.rows_success ?? 0}
                      </td>
                      <td data-label="Error" className="tsup-importstock-node-42">
                        {j.rows_error ?? 0}
                      </td>
                      <td data-label="Uploaded" className="tsup-importstock-node-43">
                        {j.uploaded_at ? new Date(j.uploaded_at).toLocaleString() : '-'}
                      </td>
                      <td data-label="Completed" className="tsup-importstock-node-44">
                        {j.completed_at ? new Date(j.completed_at).toLocaleString() : '-'}
                      </td>
                    </tr>)}
                {!jobs.length && <tr className="tsup-importstock-node-45">
                    <td colSpan="9" className={portalClass("import-empty-admin")}>
                      No imports yet
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>
          <div className={portalClass("import-note-admin")}>
            Quantity counts selling units. For a 3-piece pack, enter quantity 1 and PACK SIZE 3, or 1box (pack of3). MRP is the full pack price. Normal products use PACK SIZE 1. Reimporting adds stock to your branch.
          </div>
        </div>
      </div>
    </div>;
}
