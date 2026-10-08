import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from './NavbarAdmin';
import { useAuth } from './AdminAuth';
import { useLoading } from './LoadingContext';
import { apiGet, apiUpload, apiPost } from './api';
import JSZip from 'jszip';
import './ImportStock.css';
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
    return String(base).replace(/__(front|back|side|detail[0-9]*)$/i,'').trim();
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
    const form=new FormData();form.append('image',blob,`${publicIdBase}.jpg`)
    return apiUpload('/api/upload',form)
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
          const result = await apiPost(`/api/branch/${branchId}/images/lookup`, { eans: identifiers.slice(start, start + 1000) });
          if (!Array.isArray(result?.found)) throw new Error('Invalid barcode lookup response. Deploy the updated backend first.');
          for (const ean of result.found) eanMap.set(String(ean).trim(), true);
        }
      } else {
        const products=[];let offset=0;
        while(true){const page=await apiGet('/api/manage/stock',{branch_id:branchId,limit:200,offset});products.push(...page.rows);offset+=page.rows.length;if(offset>=page.total||!page.rows.length)break}
        ({ eanMap, sharedMap, sharedCollisions } = buildImageLookups(products));
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
          const imageType=baseNameNoExt(f.name).match(/__(front|back|side|detail[0-9]*)$/i)?.[1]?.toLowerCase()||'front';
          const imageKey=`${identifier}:${imageType}`;
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
  return <div className="import-page-admin">
      <Navbar /><div className="ops-main" style={{paddingBottom:0}}><a href="/templates/Tara-Product-Import-Template.xlsx" download>Download product import template</a><p>Choose branch, department and category. Upload one row per colour and size. Re-uploading the same file resumes its original job.</p></div>
      <div className="import-wrap-admin">
        <div className="import-card-admin">
          <div className="import-title-admin">
            Import Stock (Excel)
          </div>
          <div className="import-subtitle-admin">
            Upload your branch Excel file for a selected category.
          </div>
          <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16
        }}>
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
            background: importType === 'B2C' ? '#ca8a04' : '#1f2937',
            color: importType === 'B2C' ? '#000' : '#fff'
          }}>
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
            background: importType === 'B2B' ? '#ca8a04' : '#1f2937',
            color: importType === 'B2B' ? '#000' : '#fff'
          }}>
              B2B Import
            </button>
          </div>
          <form className="import-form-admin" onSubmit={e => e.preventDefault()}>
            <div className="excel-block">
              <div className="select-wrap">
                <label className="label">
                  Gender
                </label>
                <select className={`audience-select ${gender ? '' : 'invalid'}`} value={gender} onChange={e => {
                setGender(e.target.value);
                setCategoryId('');
                localStorage.removeItem('import_category_id');
              }} required>
                  <option value="">
                    Select Gender
                  </option>
                  <option value="MEN">
                    Men
                  </option>
                  <option value="WOMEN">
                    Women
                  </option>
                  <option value="KIDS">
                    Kids
                  </option>
                </select>
              </div>
              <div className="select-wrap">
                <label className="label">
                  Category
                </label>
                <select className={`audience-select ${categoryId ? '' : 'invalid'}`} value={categoryId} onChange={e => setCategoryId(e.target.value)} disabled={!gender || categoriesLoading} required>
                  <option value="">
                    {categoriesLoading ? 'Loading Categories…' : !gender ? 'Select Gender First' : genderCategories.length ? 'Select Category' : 'No Categories Available'}
                  </option>
                  {genderCategories.map(category => <option key={category.id} value={category.id}>
                      {category.category_path || category.name}
                    </option>)}
                </select>
              </div>
              <div className="import-filebox-admin">
                <label className="label">
                  Excel / CSV
                </label>
                <input type="file" accept=".xlsx,.xls,.csv" onChange={e => setFile(e.target.files?.[0] || null)} />
                {file ? <div className="import-filehint-admin">
                    {file.name}
                    {' • '}
                    {(file.size / 1024 / 1024).toFixed(2)}
                    {' MB'}
                  </div> : <div className="import-filehint-admin">
                    No file selected
                  </div>}
                {importType === 'B2C' ? <>
                    <button className="import-btn-admin" onClick={onUpload} disabled={!canUpload}>
                      {uploading ? 'Uploading…' : 'Upload B2C Excel'}
                    </button>
                    {message ? <div className="import-msg-admin">
                        {message}
                      </div> : null}
                  </> : <>
                    <button className="import-btn-admin" onClick={onB2BUpload} disabled={!file || !gender || !categoryId || b2bUploading}>
                      {b2bUploading ? 'Uploading…' : 'Upload B2B Excel'}
                    </button>
                    {b2bMessage ? <div className="import-msg-admin">
                        {b2bMessage}
                      </div> : null}
                  </>}
                {progress ? <div className="import-msg-admin">
                    {progress.state}
                    {' '}
                    {progress.total ? `${progress.done}/${progress.total}` : `${progress.done}+`}
                    {' rows'}
                  </div> : null}
              </div>
              <div className="inline-info">
                <span className={`pill-mini ${gender ? 'ok' : 'warn'}`}>
                  {gender && categoryId ? `${gender} • ${genderCategories.find(category => String(category.id) === String(categoryId))?.name || 'Category selected'}` : 'Select a gender and category for Excel upload'}
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className="import-card-admin">
          <div className="import-title-admin">
            Upload Product Images
          </div>
          <div className="import-subtitle-admin">
            Use EAN mode for legacy per-variant images, or Shared mode to upload one image for every size of the same product, colour, and fit.
          </div>
          <form className="import-form-admin" onSubmit={e => e.preventDefault()}>
            <div className="zip-block">
              <div className="import-filebox-admin">
                <label className="label">
                  Images ZIP Folder
                </label>
                <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '10px',
                flexWrap: 'wrap'
              }}>
                  <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}>
                    <input type="radio" name="imageMode" value="ean" checked={imageMode === 'ean'} onChange={() => setImageMode('ean')} />
                    EAN Image
                  </label>
                  <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}>
                    <input type="radio" name="imageMode" value="shared" checked={imageMode === 'shared'} onChange={() => setImageMode('shared')} />
                    Shared Product + Colour (+Fit) Image
                  </label>
                </div>
                <div className="import-filehint-admin" style={{
                marginBottom: '10px'
              }}>
                  {imageMode === 'ean' ? 'EAN filenames: 8903289347502.jpg (front), 8903289347502__back.jpg, 8903289347502__side.jpg' : 'Shared mode filename examples: 1508__JUNGLE GREEN.jpg (no fit distinction) or 1508__JUNGLE GREEN__RN.jpg / 1508__JUNGLE GREEN__RNS.jpg (when the same product+colour has different looks per fit, like GOKUL vests). Product ID + colour + fit is safest; Pattern + colour(+fit) also works when unique.'}
                </div>
                <input type="file" accept=".zip" onChange={e => setImageZip(e.target.files?.[0] || null)} />
                {imageZip ? <div className="import-filehint-admin">
                    {imageZip.name}
                    {' • '}
                    {(imageZip.size / 1024 / 1024).toFixed(2)}
                    {' MB'}
                  </div> : <div className="import-filehint-admin">
                    No ZIP selected
                  </div>}
                <button className="import-btn-admin" onClick={onUploadImages} disabled={!canUploadImages || uploadingImages}>
                  {uploadingImages ? `Uploading ${imageProgress.done}/${imageProgress.total}…` : 'Upload Images ZIP'}
                </button>
                {imageMessage ? <div className="import-msg-admin">
                    {imageMessage}
                  </div> : null}
                <div className="image-stats">
                  <span>
                    Matched:{' '}
                    {matchStats.matched}
                  </span>
                  <span>
                    Unmatched:{' '}
                    {matchStats.skipped}
                  </span>
                  <span>
                    Total:{' '}
                    {matchStats.total}
                  </span>
                </div>
                {!!unmatchedList.length && <div className="unmatched-wrap">
                    <div className="unmatched-title">
                      Unmatched Images
                    </div>
                    <ul className="unmatched-list">
                      {unmatchedList.map((u, i) => <li key={`${u.file}-${i}`}>
                            <span className="unmatched-ean">
                              {u.identifier}
                            </span>
                            <span className="unmatched-file">
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
        <div className="import-card-admin">
          <div className="import-title-admin">
            B2C / B2B Discounts
          </div>
          <div className="import-subtitle-admin">
            Set discount percentages for all products in this branch. These are kept separate from Excel and image uploads.
          </div>
          <form className="import-form-admin" onSubmit={onSaveDiscounts}>
            <div className="discount-block">
              <div className="discount-row">
                <div className="discount-field">
                  <label className="label">
                    B2C Discount (%)
                  </label>
                  <input type="number" min="0" max="100" step="0.01" value={b2cDiscount} onChange={e => setB2cDiscount(e.target.value)} className="discount-input" />
                </div>
                <div className="discount-field">
                  <label className="label">
                    B2B Discount (%)
                  </label>
                  <input type="number" min="0" max="100" step="0.01" value={b2bDiscount} onChange={e => setB2bDiscount(e.target.value)} className="discount-input" />
                </div>
              </div>
              <button type="submit" className="import-btn-admin" disabled={!canSaveDiscounts}>
                {savingDiscounts ? 'Saving…' : 'Save Discounts'}
              </button>
              {discountMessage ? <div className="import-msg-admin">
                  {discountMessage}
                </div> : null}
            </div>
          </form>
        </div>
        <div className="import-card-admin">
          <div className="import-title-admin">
            Recent Imports
          </div>
          <div className="import-actions-admin">
            <button className="import-ghost-btn-admin" onClick={fetchJobs} disabled={refreshing}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <div className="import-tablewrap-admin">
            <table className="import-table-admin">
              <thead>
                <tr>
                  <th>
                    ID
                  </th>
                  <th>
                    File
                  </th>
                  <th>
                    Gender
                  </th>
                  <th>
                    Category
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Total
                  </th>
                  <th>
                    Success
                  </th>
                  <th>
                    Error
                  </th>
                  <th>
                    Uploaded
                  </th>
                  <th>
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => <tr key={j.id} className="import-row-card">
                      <td data-label="ID">
                        {j.id}
                      </td>
                      <td data-label="File">
                        {j.file_name || '-'}
                      </td>
                      <td data-label="Gender">
                        {j.gender || '-'}
                      </td>
                      <td data-label="Category">
                        {j.category_name || '-'}
                      </td>
                      <td data-label="Status">
                        <span className={`pill-admin ${String(j.status_enum || '').toLowerCase()}`}>
                          {j.status_enum}
                        </span>
                      </td>
                      <td data-label="Total">
                        {j.rows_total ?? 0}
                      </td>
                      <td data-label="Success">
                        {j.rows_success ?? 0}
                      </td>
                      <td data-label="Error">
                        {j.rows_error ?? 0}
                      </td>
                      <td data-label="Uploaded">
                        {j.uploaded_at ? new Date(j.uploaded_at).toLocaleString() : '-'}
                      </td>
                      <td data-label="Completed">
                        {j.completed_at ? new Date(j.completed_at).toLocaleString() : '-'}
                      </td>
                    </tr>)}
                {!jobs.length && <tr>
                    <td colSpan="9" className="import-empty-admin">
                      No imports yet
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>
          <div className="import-note-admin">
            Quantity counts selling units. For a 3-piece pack, enter quantity 1 and PACK SIZE 3, or 1box (pack of3). MRP is the full pack price. Normal products use PACK SIZE 1. Reimporting adds stock to your branch.
          </div>
        </div>
      </div>
    </div>;
}
