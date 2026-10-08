import React, { useRef, useEffect } from 'react';
import './B2BLogin.css';
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
})[name] || ["tsup-b2blogin-" + name]).join(' ');
const B2BLogin = ({
  name,
  email,
  mobile,
  password,
  confirmPassword,
  setName,
  setEmail,
  setMobile,
  setPassword,
  setConfirmPassword,
  handleSubmit,
  onClose
}) => {
  const popupRef = useRef(null);
  const handleClickOutside = e => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return <div className={portalClass("popup-overlay")}>
      <div className={portalClass("popup-box")} ref={popupRef}>
        <div className={portalClass("popup-close")} onClick={onClose}>×</div>
        <h3 className="tsup-b2blogin-node-0">Add New User</h3>

        <label className="tsup-b2blogin-node-1">Full Name</label>
        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="tsup-b2blogin-node-2" />

        <label className="tsup-b2blogin-node-3">Email</label>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="tsup-b2blogin-node-4" />

        <label className="tsup-b2blogin-node-5">Mobile Number</label>
        <input type="tel" placeholder="Mobile Number" maxLength="10" value={mobile} onChange={e => setMobile(e.target.value)} className="tsup-b2blogin-node-6" />

        <label className="tsup-b2blogin-node-7">Password</label>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="tsup-b2blogin-node-8" />

        <label className="tsup-b2blogin-node-9">Confirm Password</label>
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="tsup-b2blogin-node-10" />

        <button className={portalClass("submit-btn")} onClick={handleSubmit}>Submit</button>
      </div>
    </div>;
};
export default B2BLogin;
