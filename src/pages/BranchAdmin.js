import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./BranchAdmin.css";
import Navbar from "./NavbarAdmin";

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
    return localStorage.getItem("token") || "";
  }, []);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"
    });
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    instance.defaults.headers.common["Content-Type"] = "application/json";
    return instance;
  }, [token]);

  const fetchBranchAdmins = async () => {
    setLoadingAdmins(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/auth-branch/branch-admins");
      setBranchAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load branch admins");
    } finally {
      setLoadingAdmins(false);
    }
  };

  const fetchWarehouses = async () => {
    setLoadingWarehouses(true);
    setError("");
    try {
      const res = await axiosInstance.get("/api/shiprocket/warehouses");
      setWarehouses(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(prev => prev || e?.response?.data?.message || "Failed to load warehouses");
    } finally {
      setLoadingWarehouses(false);
    }
  };

  useEffect(() => {
    fetchBranchAdmins();
    fetchWarehouses();
  }, []);

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
    const { name, value, type, checked } = e.target;
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
        return { ...prev, warehouseId: value };
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
        const res = await axiosInstance.put(
          `/api/auth-branch/branch-admins/${form.id}`,
          payload
        );
        const updated = res.data;
        setBranchAdmins(prev =>
          prev.map(a => (a.id === updated.id ? updated : a))
        );
        setSuccess("Branch admin updated successfully");
      } else {
        const payload = {
          email: form.email.trim(),
          password: form.password.trim(),
          name: form.name.trim() || null,
          branch_name: form.branch_name.trim() || null,
          branch_code: form.branch_code.trim() || null
        };
        const res = await axiosInstance.post(
          "/api/auth-branch/branch-admins",
          payload
        );
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
      const res = await axiosInstance.delete(
        `/api/auth-branch/branch-admins/${admin.id}`
      );
      const updated = res.data;
      setBranchAdmins(prev =>
        prev.map(a => (a.id === updated.id ? updated : a))
      );
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
      return (
        email.includes(q) ||
        name.includes(q) ||
        branchName.includes(q) ||
        branchCode.includes(q)
      );
    });
  }, [branchAdmins, search]);

  const formatDateTime = value => {
    if (!value) return "Never";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Invalid";
    return d.toLocaleString();
  };

  const activeCount = useMemo(
    () => branchAdmins.filter(a => a.is_active !== false).length,
    [branchAdmins]
  );

  const inactiveCount = useMemo(
    () => branchAdmins.filter(a => a.is_active === false).length,
    [branchAdmins]
  );

  return (
    <div className="branch-admin-page">
      <Navbar />
      <div className="ba-header">
        <div>
          <h1 className="ba-title">Branch Admin Control</h1>
          <p className="ba-subtitle">
            Super Admin can create, update, and disable branch administrators and view branch warehouses.
          </p>
        </div>
        <div className="ba-header-actions">
          <div className="ba-stat-card">
            <span className="ba-stat-label">Active Admins</span>
            <span className="ba-stat-value">{activeCount}</span>
          </div>
          <div className="ba-stat-card ba-stat-card-muted">
            <span className="ba-stat-label">Disabled</span>
            <span className="ba-stat-value">{inactiveCount}</span>
          </div>
          <button className="ba-button ba-button-gold" onClick={handleOpenCreate}>
            + Add Branch Admin
          </button>
        </div>
      </div>

      {(error || success) && (
        <div className="ba-message-row">
          {error && <div className="ba-alert ba-alert-error">{error}</div>}
          {success && <div className="ba-alert ba-alert-success">{success}</div>}
        </div>
      )}

      <div className="ba-content">
        <section className="ba-card ba-card-left">
          <div className="ba-card-header">
            <div>
              <h2 className="ba-card-title">Shiprocket Warehouses</h2>
              <p className="ba-card-subtitle">
                Reference branches from Shiprocket warehouses when assigning branch admins.
              </p>
            </div>
            <div className="ba-tag">
              Total: {warehouses.length}
            </div>
          </div>
          {loadingWarehouses ? (
            <div className="ba-loading">Loading warehouses...</div>
          ) : warehouses.length === 0 ? (
            <div className="ba-empty">No warehouses configured yet.</div>
          ) : (
            <div className="ba-table-wrapper">
              <table className="ba-table ba-table-compact">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Warehouse ID</th>
                    <th>Name</th>
                    <th>City</th>
                    <th>Pincode</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map(w => (
                    <tr key={w.id}>
                      <td>{w.id}</td>
                      <td>{w.warehouse_id}</td>
                      <td>{w.name}</td>
                      <td>{w.city}</td>
                      <td>{w.pincode}</td>
                      <td>{w.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="ba-card ba-card-right">
          <div className="ba-card-header ba-card-header-row">
            <div>
              <h2 className="ba-card-title">Branch Admins</h2>
              <p className="ba-card-subtitle">
                Manage branch admin credentials and branch mapping.
              </p>
            </div>
            <div className="ba-card-controls">
              <input
                className="ba-input"
                placeholder="Search by email, name, branch..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {loadingAdmins ? (
            <div className="ba-loading">Loading branch admins...</div>
          ) : filteredAdmins.length === 0 ? (
            <div className="ba-empty">
              No branch admins found. Create the first one using the button above.
            </div>
          ) : (
            <div className="ba-table-wrapper">
              <table className="ba-table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th className="ba-actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map(admin => (
                    <tr
                      key={admin.id}
                      className={admin.is_active === false ? "ba-row-inactive" : ""}
                    >
                      <td>
                        <div className="ba-cell-main">
                          <span className="ba-cell-primary">{admin.email}</span>
                          {admin.name && (
                            <span className="ba-cell-secondary">{admin.name}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ba-cell-main">
                          <span className="ba-cell-primary">
                            {admin.branch_name || "Not set"}
                          </span>
                          {admin.branch_code && (
                            <span className="ba-cell-secondary">
                              Code: {admin.branch_code}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {admin.is_active === false ? (
                          <span className="ba-status ba-status-inactive">Disabled</span>
                        ) : (
                          <span className="ba-status ba-status-active">Active</span>
                        )}
                      </td>
                      <td>{formatDateTime(admin.last_login)}</td>
                      <td className="ba-actions-col">
                        <button
                          className="ba-button ba-button-small"
                          onClick={() => handleOpenEdit(admin)}
                        >
                          Edit
                        </button>
                        <button
                          className="ba-button ba-button-small ba-button-outline"
                          onClick={() => handleDelete(admin)}
                          disabled={deletingId === admin.id}
                        >
                          {deletingId === admin.id ? "Disabling..." : "Disable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className="ba-modal-backdrop">
          <div className="ba-modal">
            <div className="ba-modal-header">
              <h3 className="ba-modal-title">
                {isEditing ? "Edit Branch Admin" : "Create Branch Admin"}
              </h3>
              <button className="ba-modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="ba-modal-body">
              <div className="ba-form-grid">
                <div className="ba-form-group">
                  <label className="ba-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="ba-input"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ba-form-group">
                  <label className="ba-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="ba-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="ba-form-grid">
                <div className="ba-form-group">
                  <label className="ba-label">Branch Name</label>
                  <input
                    type="text"
                    name="branch_name"
                    className="ba-input"
                    value={form.branch_name}
                    onChange={handleChange}
                    placeholder="Eg: Vizianagaram Main"
                  />
                </div>
                <div className="ba-form-group">
                  <label className="ba-label">Branch Code</label>
                  <input
                    type="text"
                    name="branch_code"
                    className="ba-input"
                    value={form.branch_code}
                    onChange={handleChange}
                    placeholder="Eg: 13435714"
                  />
                </div>
              </div>

              <div className="ba-form-group">
                <label className="ba-label">Link Warehouse (optional)</label>
                <select
                  name="warehouseId"
                  className="ba-input"
                  value={form.warehouseId}
                  onChange={handleWarehouseSelect}
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} | {w.city} | {w.pincode}
                    </option>
                  ))}
                </select>
                <div className="ba-helper-text">
                  Selecting a warehouse will prefill branch name and branch code if empty.
                </div>
              </div>

              <div className="ba-form-grid">
                <div className="ba-form-group">
                  <label className="ba-label">
                    Password {isEditing && <span className="ba-label-hint">(leave blank to keep)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="ba-input"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={isEditing ? "New password (optional)" : "Set password"}
                  />
                </div>
                <div className="ba-form-group">
                  <label className="ba-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="ba-input"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="ba-form-group ba-form-group-inline">
                  <label className="ba-label">Status</label>
                  <label className="ba-switch">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                    />
                    <span className="ba-switch-slider" />
                    <span className="ba-switch-label">
                      {form.is_active ? "Active" : "Disabled"}
                    </span>
                  </label>
                </div>
              )}

              <div className="ba-modal-footer">
                <button
                  type="button"
                  className="ba-button ba-button-outline"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ba-button ba-button-gold"
                  disabled={saving}
                >
                  {saving ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save Changes" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchAdmin;
