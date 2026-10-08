import React, { useRef, useState } from 'react';
import './EditableImage.css';
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
  "editable-image-wrapper": ["tsup-editableimage-editable-image-wrapper"],
  "editable-image-img": ["tsup-editableimage-editable-image-img"],
  "editable-image-overlay": ["tsup-editableimage-editable-image-overlay"],
  "editable-image-btn": ["tsup-editableimage-editable-image-btn"],
  "editable-image-input": ["tsup-editableimage-editable-image-input"]
})[name] || ["tsup-editableimage-" + name]).join(' ');
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://taras-kart-backend.vercel.app';
const MAX_FILE_SIZE_BYTES = 3.5 * 1024 * 1024;
export default function EditableImage({
  slotId,
  section,
  imageUrl,
  defaultUrl,
  altText,
  onUpdated
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };
  const handleChange = async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert('File is too large. Please upload an image smaller than 3.5 MB.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (!uploadRes.ok) {
        if (uploadRes.status === 413) {
          alert('Image is too large for the server. Please upload a smaller image (under 3.5 MB).');
        } else {
          alert('Failed to upload image.');
        }
        setUploading(false);
        return;
      }
      const uploadJson = await uploadRes.json();
      const newImageUrl = uploadJson.imageUrl;
      const body = {
        section: section || null,
        imageUrl: newImageUrl,
        altText: altText || '',
        link: null,
        extra: null
      };
      const patchRes = await fetch(`${API_BASE}/api/homepage-images/${encodeURIComponent(slotId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!patchRes.ok) {
        alert('Failed to save homepage image mapping.');
        setUploading(false);
        return;
      }
      const updated = await patchRes.json();
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      alert('Something went wrong while uploading. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };
  const label = uploading ? 'Uploading...' : 'Replace';
  return <div className={portalClass("editable-image-wrapper")}>
      <img src={imageUrl || defaultUrl} alt={altText || ''} className={portalClass("editable-image-img")} />
      <div className={portalClass("editable-image-overlay")}>
        <button type="button" className={portalClass("editable-image-btn")} onClick={handleClick} disabled={uploading}>
          {label}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className={portalClass("editable-image-input")} onChange={handleChange} />
    </div>;
}
