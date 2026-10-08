import React, { useState } from 'react';
import './HomePage.css';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import DeleteProduct from './DeleteProduct';
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
  "admin-homepage": ["tsup-homepage-admin-homepage"],
  "admin-body": ["tsup-homepage-admin-body"],
  "admin-sidebar": ["tsup-homepage-admin-sidebar"],
  "sidebar-button": ["tsup-homepage-sidebar-button"],
  "active": ["tsup-homepage-active"],
  "admin-main": ["tsup-homepage-admin-main"]
})[name] || ["tsup-homepage-" + name]).join(' ');
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Add');
  const renderContent = () => {
    if (activeTab === 'Add') return <AddProduct />;
    if (activeTab === 'Update') return <UpdateProduct />;
    if (activeTab === 'Delete') return <DeleteProduct />;
    return null;
  };
  return <div className={portalClass("admin-homepage")}>
      
      <div className={portalClass("admin-body")}>
        <div className={portalClass("admin-sidebar")}>
          <button className={portalClass(`sidebar-button ${activeTab === 'Add' ? 'active' : ''}`)} onClick={() => setActiveTab('Add')}>
            <span className="tsup-homepage-node-0">Add Product</span>
          </button>

          <button className={portalClass(`sidebar-button ${activeTab === 'Update' ? 'active' : ''}`)} onClick={() => setActiveTab('Update')}>
            <span className="tsup-homepage-node-1">Update Product</span>
          </button>

          <button className={portalClass(`sidebar-button ${activeTab === 'Delete' ? 'active' : ''}`)} onClick={() => setActiveTab('Delete')}>
            <span className="tsup-homepage-node-2">Delete Product</span>
          </button>

        </div>
        <div className={portalClass("admin-main")}>{renderContent()}</div>
      </div>
    </div>;
};
export default HomePage;
