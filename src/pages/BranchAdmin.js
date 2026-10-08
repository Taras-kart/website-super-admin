import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "./BranchAdmin.css";
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
  "branch-admin-page": ["tsup-branchadmin-branch-admin-page"],
  "ba-header": ["tsup-branchadmin-ba-header"],
  "ba-title": ["tsup-branchadmin-ba-title"],
  "ba-subtitle": ["tsup-branchadmin-ba-subtitle"],
  "ba-header-actions": ["tsup-branchadmin-ba-header-actions"],
  "ba-stat-card": ["tsup-branchadmin-ba-stat-card"],
  "ba-stat-card-muted": ["tsup-branchadmin-ba-stat-card-muted"],
  "ba-stat-label": ["tsup-branchadmin-ba-stat-label"],
  "ba-stat-value": ["tsup-branchadmin-ba-stat-value"],
  "ba-button": ["tsup-branchadmin-ba-button"],
  "ba-button-gold": ["tsup-branchadmin-ba-button-gold"],
  "ba-button-small": ["tsup-branchadmin-ba-button-small"],
  "ba-button-outline": ["tsup-branchadmin-ba-button-outline"],
  "ba-message-row": ["tsup-branchadmin-ba-message-row"],
  "ba-alert": ["tsup-branchadmin-ba-alert"],
  "ba-alert-error": ["tsup-branchadmin-ba-alert-error"],
  "ba-alert-success": ["tsup-branchadmin-ba-alert-success"],
  "ba-content": ["tsup-branchadmin-ba-content"],
  "ba-card": ["tsup-branchadmin-ba-card"],
  "ba-card-left": ["tsup-branchadmin-ba-card-left"],
  "ba-card-right": ["tsup-branchadmin-ba-card-right"],
  "ba-card-header": ["tsup-branchadmin-ba-card-header"],
  "ba-card-header-row": ["tsup-branchadmin-ba-card-header-row"],
  "ba-card-title": ["tsup-branchadmin-ba-card-title"],
  "ba-card-subtitle": ["tsup-branchadmin-ba-card-subtitle"],
  "ba-tag": ["tsup-branchadmin-ba-tag"],
  "ba-card-controls": ["tsup-branchadmin-ba-card-controls"],
  "ba-input": ["tsup-branchadmin-ba-input"],
  "ba-table-wrapper": ["tsup-branchadmin-ba-table-wrapper"],
  "ba-table": ["tsup-branchadmin-ba-table"],
  "ba-table-compact": ["tsup-branchadmin-ba-table-compact"],
  "ba-row-inactive": ["tsup-branchadmin-ba-row-inactive"],
  "ba-cell-main": ["tsup-branchadmin-ba-cell-main"],
  "ba-cell-primary": ["tsup-branchadmin-ba-cell-primary"],
  "ba-cell-secondary": ["tsup-branchadmin-ba-cell-secondary"],
  "ba-status": ["tsup-branchadmin-ba-status"],
  "ba-status-active": ["tsup-branchadmin-ba-status-active"],
  "ba-status-inactive": ["tsup-branchadmin-ba-status-inactive"],
  "ba-actions-col": ["tsup-branchadmin-ba-actions-col"],
  "ba-loading": ["tsup-branchadmin-ba-loading"],
  "ba-empty": ["tsup-branchadmin-ba-empty"],
  "ba-modal-backdrop": ["tsup-branchadmin-ba-modal-backdrop"],
  "ba-modal": ["tsup-branchadmin-ba-modal"],
  "ba-modal-header": ["tsup-branchadmin-ba-modal-header"],
  "ba-modal-title": ["tsup-branchadmin-ba-modal-title"],
  "ba-modal-close": ["tsup-branchadmin-ba-modal-close"],
  "ba-modal-body": ["tsup-branchadmin-ba-modal-body"],
  "ba-form-grid": ["tsup-branchadmin-ba-form-grid"],
  "ba-form-group": ["tsup-branchadmin-ba-form-group"],
  "ba-form-group-inline": ["tsup-branchadmin-ba-form-group-inline"],
  "ba-label": ["tsup-branchadmin-ba-label"],
  "ba-label-hint": ["tsup-branchadmin-ba-label-hint"],
  "ba-helper-text": ["tsup-branchadmin-ba-helper-text"],
  "ba-modal-footer": ["tsup-branchadmin-ba-modal-footer"],
  "ba-switch": ["tsup-branchadmin-ba-switch"],
  "ba-switch-slider": ["tsup-branchadmin-ba-switch-slider"],
  "ba-switch-label": ["tsup-branchadmin-ba-switch-label"]
})[name] || ["tsup-branchadmin-" + name]).join(' ');
const BranchAdmin = () => {
  const [branchAdmins, setBranchAdmins] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    id: null,
    email: "",
    name: "",
    branch_name: "",
    branch_code: "",
    password: "",
    confirmPassword: "",
    is_active: true,
    warehouseId: ""
  });
  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("admin_token") || localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
  }, []);
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || "https://taras-kart-backend.vercel.app"
    });
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    instance.defaults.headers.common["Content-Type"] = "application/json";
    return instance;
  }, [token]);
  const fetchBranchAdmins = useCallback(async () => {
    setLoadingAdmins(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/auth-branch/branch-admins");
      const data = res.data;
      let arr = [];
      if (Array.isArray(data)) arr = data;else if (Array.isArray(data?.data)) arr = data.data;else if (Array.isArray(data?.admins)) arr = data.admins;else if (Array.isArray(data?.data?.data)) arr = data.data.data;
      setBranchAdmins(arr);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load branch admins");
    } finally {
      setLoadingAdmins(false);
    }
  }, [axiosInstance]);
  const fetchWarehouses = useCallback(async () => {
    setLoadingWarehouses(true);
    try {
      const res = await axiosInstance.get("/api/shiprocket/warehouses");
      const data = res.data;
      let arr = Array.isArray(data) ? data : data?.data || data?.warehouses || [];
      setWarehouses(arr);
    } catch (err) {
      console.warn("Backend failed to fetch warehouses:", err?.response?.status);
      setWarehouses([]);
    } finally {
      setLoadingWarehouses(false);
    }
  }, [axiosInstance]);
  useEffect(() => {
    fetchBranchAdmins();
    fetchWarehouses();
  }, [fetchBranchAdmins, fetchWarehouses]);
  const resetForm = () => {
    setForm({
      id: null,
      email: "",
      name: "",
      branch_name: "",
      branch_code: "",
      password: "",
      confirmPassword: "",
      is_active: true,
      warehouseId: ""
    });
  };
  const handleOpenCreate = () => {
    setIsEditing(false);
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };
  const handleOpenEdit = admin => {
    setIsEditing(true);
    setError("");
    setSuccess("");
    setForm({
      id: admin.id,
      email: admin.email || "",
      name: admin.name || "",
      branch_name: admin.branch_name || "",
      branch_code: admin.branch_code || "",
      password: "",
      confirmPassword: "",
      is_active: admin.is_active !== false,
      warehouseId: ""
    });
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };
  const handleChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleWarehouseSelect = e => {
    const value = e.target.value;
    setForm(prev => {
      if (!value) {
        return {
          ...prev,
          warehouseId: "",
          branch_name: prev.branch_name,
          branch_code: prev.branch_code
        };
      }
      const wh = warehouses.find(w => String(w.id) === String(value));
      if (!wh) {
        return {
          ...prev,
          warehouseId: value
        };
      }
      return {
        ...prev,
        warehouseId: value,
        branch_name: prev.branch_name || wh.name || "",
        branch_code: prev.branch_code || String(wh.warehouse_id || wh.pincode || "")
      };
    });
  };
  const validateForm = () => {
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!isEditing && !form.password.trim()) {
      setError("Password is required for new admin");
      return false;
    }
    if (form.password || form.confirmPassword) {
      if (form.password !== form.confirmPassword) {
        setError("Password and Confirm Password do not match");
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (isEditing && form.id) {
        const payload = {
          email: form.email.trim(),
          name: form.name.trim() || null,
          branch_name: form.branch_name.trim() || null,
          branch_code: form.branch_code.trim() || null,
          is_active: !!form.is_active
        };
        if (form.password.trim()) {
          payload.password = form.password.trim();
        }
        const res = await axiosInstance.put(`/api/auth-branch/branch-admins/${form.id}`, payload);
        const updated = res.data;
        setBranchAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
        setSuccess("Branch admin updated successfully");
      } else {
        const payload = {
          email: form.email.trim(),
          password: form.password.trim(),
          name: form.name.trim() || null,
          branch_name: form.branch_name.trim() || null,
          branch_code: form.branch_code.trim() || null
        };
        const res = await axiosInstance.post("/api/auth-branch/branch-admins", payload);
        const created = res.data;
        setBranchAdmins(prev => [created, ...prev]);
        setSuccess("Branch admin created successfully");
      }
      setShowModal(false);
      resetForm();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to save branch admin");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async admin => {
    if (!window.confirm(`Disable branch admin "${admin.email}"?`)) return;
    setError("");
    setSuccess("");
    setDeletingId(admin.id);
    try {
      const res = await axiosInstance.delete(`/api/auth-branch/branch-admins/${admin.id}`);
      const updated = res.data;
      setBranchAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
      setSuccess("Branch admin disabled");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to disable branch admin");
    } finally {
      setDeletingId(null);
    }
  };
  const filteredAdmins = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return branchAdmins;
    return branchAdmins.filter(a => {
      const email = (a.email || "").toLowerCase();
      const name = (a.name || "").toLowerCase();
      const branchName = (a.branch_name || "").toLowerCase();
      const branchCode = (a.branch_code || "").toLowerCase();
      return email.includes(q) || name.includes(q) || branchName.includes(q) || branchCode.includes(q);
    });
  }, [branchAdmins, search]);
  const formatDateTime = value => {
    if (!value) return "Never";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Invalid";
    return d.toLocaleString();
  };
  const activeCount = useMemo(() => branchAdmins.filter(a => a.is_active !== false).length, [branchAdmins]);
  const inactiveCount = useMemo(() => branchAdmins.filter(a => a.is_active === false).length, [branchAdmins]);
  return <div className={portalClass("branch-admin-page")}>
      
      <div className={portalClass("ba-header")}>
        <div className="tsup-branchadmin-node-0">
          <h1 className={portalClass("ba-title")}>Branch Admin Control</h1>
          <p className={portalClass("ba-subtitle")}>
            Super Admin can create, update, and disable branch administrators and view branch warehouses.
          </p>
        </div>
        <div className={portalClass("ba-header-actions")}>
          <div className={portalClass("ba-stat-card")}>
            <span className={portalClass("ba-stat-label")}>Active Admins</span>
            <span className={portalClass("ba-stat-value")}>{activeCount}</span>
          </div>
          <div className={portalClass("ba-stat-card ba-stat-card-muted")}>
            <span className={portalClass("ba-stat-label")}>Disabled</span>
            <span className={portalClass("ba-stat-value")}>{inactiveCount}</span>
          </div>
          <button className={portalClass("ba-button ba-button-gold")} onClick={handleOpenCreate}>
            + Add Branch Admin
          </button>
        </div>
      </div>

      {(error || success) && <div className={portalClass("ba-message-row")}>
          {error && <div className={portalClass("ba-alert ba-alert-error")}>{error}</div>}
          {success && <div className={portalClass("ba-alert ba-alert-success")}>{success}</div>}
        </div>}

      <div className={portalClass("ba-content")}>
        <section className={portalClass("ba-card ba-card-left")}>
          <div className={portalClass("ba-card-header")}>
            <div className="tsup-branchadmin-node-1">
              <h2 className={portalClass("ba-card-title")}>Shiprocket Warehouses</h2>
              <p className={portalClass("ba-card-subtitle")}>
                Reference branches from Shiprocket warehouses when assigning branch admins.
              </p>
            </div>
            <div className={portalClass("ba-tag")}>
              Total: {warehouses.length}
            </div>
          </div>
          {loadingWarehouses ? <div className={portalClass("ba-loading")}>Loading warehouses...</div> : warehouses.length === 0 ? <div className={portalClass("ba-empty")}>No warehouses configured yet.</div> : <div className={portalClass("ba-table-wrapper")}>
              <table className={portalClass("ba-table ba-table-compact")}>
                <thead className="tsup-branchadmin-node-2">
                  <tr className="tsup-branchadmin-node-3">
                    <th className="tsup-branchadmin-node-4">ID</th>
                    <th className="tsup-branchadmin-node-5">Warehouse ID</th>
                    <th className="tsup-branchadmin-node-6">Name</th>
                    <th className="tsup-branchadmin-node-7">City</th>
                    <th className="tsup-branchadmin-node-8">Pincode</th>
                    <th className="tsup-branchadmin-node-9">Phone</th>
                  </tr>
                </thead>
                <tbody className="tsup-branchadmin-node-10">
                  {warehouses.map(w => <tr key={w.id} className="tsup-branchadmin-node-11">
                      <td className="tsup-branchadmin-node-12">{w.id}</td>
                      <td className="tsup-branchadmin-node-13">{w.warehouse_id}</td>
                      <td className="tsup-branchadmin-node-14">{w.name}</td>
                      <td className="tsup-branchadmin-node-15">{w.city}</td>
                      <td className="tsup-branchadmin-node-16">{w.pincode}</td>
                      <td className="tsup-branchadmin-node-17">{w.phone}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>}
        </section>

        <section className={portalClass("ba-card ba-card-right")}>
          <div className={portalClass("ba-card-header ba-card-header-row")}>
            <div className="tsup-branchadmin-node-18">
              <h2 className={portalClass("ba-card-title")}>Branch Admins</h2>
              <p className={portalClass("ba-card-subtitle")}>
                Manage branch admin credentials and branch mapping.
              </p>
            </div>
            <div className={portalClass("ba-card-controls")}>
              <input className={portalClass("ba-input")} placeholder="Search by email, name, branch..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loadingAdmins ? <div className={portalClass("ba-loading")}>Loading branch admins...</div> : filteredAdmins.length === 0 ? <div className={portalClass("ba-empty")}>
              No branch admins found. Create the first one using the button above.
            </div> : <div className={portalClass("ba-table-wrapper")}>
              <table className={portalClass("ba-table")}>
                <thead className="tsup-branchadmin-node-19">
                  <tr className="tsup-branchadmin-node-20">
                    <th className="tsup-branchadmin-node-21">Admin</th>
                    <th className="tsup-branchadmin-node-22">Branch</th>
                    <th className="tsup-branchadmin-node-23">Status</th>
                    <th className="tsup-branchadmin-node-24">Last Login</th>
                    <th className={portalClass("ba-actions-col")}>Actions</th>
                  </tr>
                </thead>
                <tbody className="tsup-branchadmin-node-25">
                  {filteredAdmins.map(admin => <tr key={admin.id} className={portalClass(admin.is_active === false ? "ba-row-inactive" : "")}>
                      <td className="tsup-branchadmin-node-26">
                        <div className={portalClass("ba-cell-main")}>
                          <span className={portalClass("ba-cell-primary")}>{admin.email}</span>
                          {admin.name && <span className={portalClass("ba-cell-secondary")}>{admin.name}</span>}
                        </div>
                      </td>
                      <td className="tsup-branchadmin-node-27">
                        <div className={portalClass("ba-cell-main")}>
                          <span className={portalClass("ba-cell-primary")}>
                            {admin.branch_name || "Not set"}
                          </span>
                          {admin.branch_code && <span className={portalClass("ba-cell-secondary")}>
                              Code: {admin.branch_code}
                            </span>}
                        </div>
                      </td>
                      <td className="tsup-branchadmin-node-28">
                        {admin.is_active === false ? <span className={portalClass("ba-status ba-status-inactive")}>Disabled</span> : <span className={portalClass("ba-status ba-status-active")}>Active</span>}
                      </td>
                      <td className="tsup-branchadmin-node-29">{formatDateTime(admin.last_login)}</td>
                      <td className={portalClass("ba-actions-col")}>
                        <button className={portalClass("ba-button ba-button-small")} onClick={() => handleOpenEdit(admin)}>
                          Edit
                        </button>
                        <button className={portalClass("ba-button ba-button-small ba-button-outline")} onClick={() => handleDelete(admin)} disabled={deletingId === admin.id}>
                          {deletingId === admin.id ? "Disabling..." : "Disable"}
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>}
        </section>
      </div>

      {showModal && <div className={portalClass("ba-modal-backdrop")}>
          <div className={portalClass("ba-modal")}>
            <div className={portalClass("ba-modal-header")}>
              <h3 className={portalClass("ba-modal-title")}>
                {isEditing ? "Edit Branch Admin" : "Create Branch Admin"}
              </h3>
              <button className={portalClass("ba-modal-close")} onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={portalClass("ba-modal-body")}>
              <div className={portalClass("ba-form-grid")}>
                <div className={portalClass("ba-form-group")}>
                  <label className={portalClass("ba-label")}>Email</label>
                  <input type="email" name="email" className={portalClass("ba-input")} value={form.email} onChange={handleChange} required />
                </div>
                <div className={portalClass("ba-form-group")}>
                  <label className={portalClass("ba-label")}>Name</label>
                  <input type="text" name="name" className={portalClass("ba-input")} value={form.name} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>

              <div className={portalClass("ba-form-grid")}>
                <div className={portalClass("ba-form-group")}>
                  <label className={portalClass("ba-label")}>Branch Name</label>
                  <input type="text" name="branch_name" className={portalClass("ba-input")} value={form.branch_name} onChange={handleChange} placeholder="Eg: Vizianagaram Main" />
                </div>
                <div className={portalClass("ba-form-group")}>
                  <label className={portalClass("ba-label")}>Branch Code</label>
                  <input type="text" name="branch_code" className={portalClass("ba-input")} value={form.branch_code} onChange={handleChange} placeholder="Eg: 13435714" />
                </div>
              </div>

              <div className={portalClass("ba-form-group")}>
                <label className={portalClass("ba-label")}>Link Warehouse (optional)</label>
                <select name="warehouseId" className={portalClass("ba-input")} value={form.warehouseId} onChange={handleWarehouseSelect}>
                  <option value="" className="tsup-branchadmin-node-30">Select warehouse...</option>
                  {warehouses.map(w => <option key={w.id} value={w.id} className="tsup-branchadmin-node-31">
                      {w.name} | {w.city} | {w.pincode}
                    </option>)}
                </select>
                <div className={portalClass("ba-helper-text")}>
                  Selecting a warehouse will prefill branch name and branch code if empty.
                </div>
              </div>

              <div className={portalClass("ba-form-grid")}>
                <div className={portalClass("ba-form-group")}>
                  <label className={portalClass("ba-label")}>
                    Password {isEditing && <span className={portalClass("ba-label-hint")}>(leave blank to keep)</span>}
                  </label>
                  <input type="password" name="password" className={portalClass("ba-input")} value={form.password} onChange={handleChange} placeholder={isEditing ? "New password (optional)" : "Set password"} />
                </div>
                <div className={portalClass("ba-form-group")}>
                  <label className={portalClass("ba-label")}>Confirm Password</label>
                  <input type="password" name="confirmPassword" className={portalClass("ba-input")} value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
                </div>
              </div>

              {isEditing && <div className={portalClass("ba-form-group ba-form-group-inline")}>
                  <label className={portalClass("ba-label")}>Status</label>
                  <label className={portalClass("ba-switch")}>
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="tsup-branchadmin-node-32" />
                    <span className={portalClass("ba-switch-slider")} />
                    <span className={portalClass("ba-switch-label")}>
                      {form.is_active ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>}

              <div className={portalClass("ba-modal-footer")}>
                <button type="button" className={portalClass("ba-button ba-button-outline")} onClick={handleCloseModal} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className={portalClass("ba-button ba-button-gold")} disabled={saving}>
                  {saving ? isEditing ? "Saving..." : "Creating..." : isEditing ? "Save Changes" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
export default BranchAdmin;
