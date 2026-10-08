import React, { useEffect, useState } from 'react';
import './B2CProfiles.css';
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
  "b2c-container": ["tsup-b2cprofiles-b2c-container"],
  "b2c-header": ["tsup-b2cprofiles-b2c-header"],
  "b2c-title": ["tsup-b2cprofiles-b2c-title"],
  "b2c-table-wrap": ["tsup-b2cprofiles-b2c-table-wrap"],
  "b2c-table": ["tsup-b2cprofiles-b2c-table"],
  "b2c-empty": ["tsup-b2cprofiles-b2c-empty"]
})[name] || ["tsup-b2cprofiles-" + name]).join(' ');
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE_RAW = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) || DEFAULT_API_BASE;
const API_BASE = API_BASE_RAW.replace(/\/+$/, '');
const B2CProfiles = () => {
  const [b2cCustomers, setB2cCustomers] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/b2c-customers`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        setB2cCustomers(data);
      }
    }).catch(() => {});
  }, []);
  return <div className={portalClass("b2c-container")}>
      <div className={portalClass("b2c-header")}>
        <h2 className={portalClass("b2c-title")}>B2C Customers</h2>
      </div>
      <div className={portalClass("b2c-table-wrap")}>
        <table className={portalClass("b2c-table")}>
          <thead className="tsup-b2cprofiles-node-0">
            <tr className="tsup-b2cprofiles-node-1">
              <th className="tsup-b2cprofiles-node-2">Full Name</th>
              <th className="tsup-b2cprofiles-node-3">Email</th>
              <th className="tsup-b2cprofiles-node-4">Mobile</th>
            </tr>
          </thead>
          <tbody className="tsup-b2cprofiles-node-5">
            {b2cCustomers.map(customer => <tr key={customer.id} className="tsup-b2cprofiles-node-6">
                <td className="tsup-b2cprofiles-node-7">{customer.name}</td>
                <td className="tsup-b2cprofiles-node-8">{customer.email}</td>
                <td className="tsup-b2cprofiles-node-9">{customer.mobile}</td>
              </tr>)}
            {b2cCustomers.length === 0 && <tr className="tsup-b2cprofiles-node-10">
                <td colSpan="3" className={portalClass("b2c-empty")}>No customers found</td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>;
};
export default B2CProfiles;
