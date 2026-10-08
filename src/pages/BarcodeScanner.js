import React, { useEffect, useRef, useState } from 'react';
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
})[name] || ["tsup-barcodescanner-" + name]).join(' ');
export default function BarcodeScanner({
  onDetected
}) {
  const videoRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [manual, setManual] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let codeReader = null;
    let cancelled = false;
    async function start() {
      try {
        const mod = await import('@zxing/browser').catch(() => null);
        if (!mod) return;
        const {
          BrowserMultiFormatReader
        } = mod;
        codeReader = new BrowserMultiFormatReader();
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices || !devices.length) return;
        setSupported(true);
        await codeReader.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (res, err) => {
          if (cancelled) return;
          if (res?.text) {
            onDetected?.(res.text.trim());
          } else if (err) {}
        });
      } catch (e) {
        setError('Camera scan unavailable');
      }
    }
    start();
    return () => {
      cancelled = true;
      try {
        codeReader?.reset();
      } catch {}
    };
  }, [onDetected]);
  return <div className={portalClass("scanner-wrap")} style={{
    display: 'grid',
    gap: 8
  }}>
      {supported ? <video ref={videoRef} style={{
      width: '100%',
      maxWidth: 420,
      borderRadius: 8
    }} muted playsInline className="tsup-barcodescanner-node-0" /> : <>
          <input placeholder="Enter/scan barcode" value={manual} onChange={e => setManual(e.target.value)} onKeyDown={e => {
        if (e.key === 'Enter' && manual.trim()) {
          onDetected?.(manual.trim());
          setManual('');
        }
      }} className="tsup-barcodescanner-node-1" />
          {error ? <small style={{
        color: '#f66'
      }} className="tsup-barcodescanner-node-2">{error}</small> : <small className="tsup-barcodescanner-node-3">Camera scanning not available. Type or use a USB barcode scanner here.</small>}
        </>}
    </div>;
}
