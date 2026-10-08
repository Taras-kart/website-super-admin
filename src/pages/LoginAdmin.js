import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from './api';
import { useAuth } from './AdminAuth';
import { useLoading } from './LoadingContext';
import './LoginAdmin.css';
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
  "login-wrap-admin-admin-login": ["tsup-loginadmin-login-wrap-admin-admin-login"],
  "login-card-admin-admin-login": ["tsup-loginadmin-login-card-admin-admin-login"],
  "login-header-admin-admin-login": ["tsup-loginadmin-login-header-admin-admin-login"],
  "login-title-admin-admin-login": ["tsup-loginadmin-login-title-admin-admin-login"],
  "login-subtitle-admin-admin-login": ["tsup-loginadmin-login-subtitle-admin-admin-login"],
  "login-form-admin-admin-login": ["tsup-loginadmin-login-form-admin-admin-login"],
  "login-field-admin-admin-login": ["tsup-loginadmin-login-field-admin-admin-login"],
  "login-input-icon-admin-admin-login": ["tsup-loginadmin-login-input-icon-admin-admin-login"],
  "login-input-admin-admin-login": ["tsup-loginadmin-login-input-admin-admin-login"],
  "login-toggle-btn-admin-admin-login": ["tsup-loginadmin-login-toggle-btn-admin-admin-login"],
  "login-error-admin-admin-login": ["tsup-loginadmin-login-error-admin-admin-login"],
  "login-actions-row-admin-admin-login": ["tsup-loginadmin-login-actions-row-admin-admin-login"],
  "login-remember-admin-admin-login": ["tsup-loginadmin-login-remember-admin-admin-login"],
  "login-alt-admin-admin-login": ["tsup-loginadmin-login-alt-admin-admin-login"],
  "login-button-admin-admin-login": ["tsup-loginadmin-login-button-admin-admin-login"],
  "login-sep-admin-admin-login": ["tsup-loginadmin-login-sep-admin-admin-login"],
  "login-button-ghost-admin-admin-login": ["tsup-loginadmin-login-button-ghost-admin-admin-login"]
})[name] || ["tsup-loginadmin-" + name]).join(' ');
const SUPER_PORTAL = true;
export default function LoginAdmin() {
  const {
    login
  } = useAuth();
  const {
    show,
    hide
  } = useLoading();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const onSubmit = async e => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    show();
    try {
      const resp = await apiPost('/api/auth-branch/login', {
        username,
        password
      });
      if (SUPER_PORTAL && resp.user?.role !== 'SUPER_ADMIN') throw new Error('Use a super admin account for this portal');
      login(resp.token, resp.user);
      nav('/', {
        replace: true
      });
    } catch (e2) {
      setErr(e2.message || 'Unable to sign in');
    } finally {
      hide();
      setBusy(false);
    }
  };
  return <div className={portalClass("login-wrap-admin-admin-login")}>
      <div className={portalClass("login-card-admin-admin-login")}>
        <div className={portalClass("login-header-admin-admin-login")}>
          <div className={portalClass("login-title-admin-admin-login")}>{SUPER_PORTAL ? 'Super Admin Login' : 'Branch Admin Login'}</div>
          <div className={portalClass("login-subtitle-admin-admin-login")}>Sign in to manage your super admin dashboard</div>
        </div>
        <form onSubmit={onSubmit} className={portalClass("login-form-admin-admin-login")}>
          <div className={portalClass("login-field-admin-admin-login")}>
            <span className={portalClass("login-input-icon-admin-admin-login")} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="tsup-loginadmin-node-0">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" className="tsup-loginadmin-node-1" />
              </svg>
            </span>
            <input className={portalClass("login-input-admin-admin-login")} type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} autoFocus />
          </div>
          <div className={portalClass("login-field-admin-admin-login")}>
            <span className={portalClass("login-input-icon-admin-admin-login")} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="tsup-loginadmin-node-2">
                <path d="M17 8V7a5 5 0 10-10 0v1H5v14h14V8h-2zm-8-1a3 3 0 016 0v1H9V7zm8 5H7v8h10v-8z" className="tsup-loginadmin-node-3" />
              </svg>
            </span>
            <input className={portalClass("login-input-admin-admin-login")} type={showPwd ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" className={portalClass("login-toggle-btn-admin-admin-login")} onClick={() => setShowPwd(s => !s)} aria-label={showPwd ? 'Hide password' : 'Show password'}>
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>
          {err ? <div className={portalClass("login-error-admin-admin-login")}>{err}</div> : null}
          <button className={portalClass("login-button-admin-admin-login")} type="submit" disabled={busy || !username || !password}>
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
          <div className={portalClass("login-sep-admin-admin-login")} />
          <button type="button" className={portalClass("login-button-admin-admin-login login-button-ghost-admin-admin-login")} onClick={() => window.location.assign(process.env.REACT_APP_STOREFRONT_URL || 'https://www.attach.co.in')}>
            Back to website
          </button>
        </form>
      </div>
    </div>;
}
