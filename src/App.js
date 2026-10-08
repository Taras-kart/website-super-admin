import PortalFrame from './PortalFrame';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/AdminAuth';
import { LoadingProvider } from './pages/LoadingContext';
import { Dashboard, StockPage, ProductEditor, SalesPage, ManagementPage, MovementsPage, AuditPage, SettingsPage, ShippingPage } from './pages/Operations';
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
})[name] || ["tsup-app-" + name]).join(' ');
const SUPER_PORTAL = true;
const Login = lazy(() => import('./pages/LoginAdmin'));
const ImportStock = lazy(() => import('./pages/ImportStock'));
const POS = lazy(() => import('./pages/POS'));
const Categories = lazy(() => import('./pages/CategoryManagement'));
const Customers = lazy(() => import('./pages/Customers'));
const Homepage = lazy(() => import('./pages/AdminHomepageImages'));
const OrderIssues = lazy(() => import('./pages/OrderIssues'));
const Returns = lazy(() => import('./pages/ReturnReview'));
const B2BOrders = lazy(() => import('./pages/B2BOrders'));
const B2BStock = lazy(() => import('./pages/B2BStock'));
const Coins = lazy(() => import('./pages/CoinsSettings'));
function Guard({
  children,
  superOnly = false
}) {
  const {
    token,
    user,
    ready
  } = useAuth();
  if (!ready) return <div className={portalClass("ops-empty")}>Checking your session...</div>;
  if (!token || !user) return <Navigate to="/login" replace />;
  if ((SUPER_PORTAL || superOnly) && user.role !== 'SUPER_ADMIN') return <div className={portalClass("ops-empty")}>This page requires super admin access. <a href="/login" className="tsup-app-node-0">Sign in with another account</a></div>;
  return children;
}
const protect = (page, superOnly = false) => <Guard superOnly={superOnly}>{page}</Guard>;
export default function App() {
  return <AuthProvider><LoadingProvider><BrowserRouter><PortalFrame><Suspense fallback={<div className={portalClass("ops-empty")}>Loading page...</div>}><Routes><Route path="/login" element={<Login />} /><Route path="/" element={protect(<Dashboard />)} /><Route path="/stocks" element={protect(<StockPage />)} /><Route path="/products" element={protect(<ProductEditor />)} /><Route path="/sales" element={protect(<SalesPage />)} /><Route path="/transactions" element={protect(<MovementsPage />)} /><Route path="/pos" element={protect(<POS />)} /><Route path="/import" element={protect(<ImportStock />)} /><Route path="/branches" element={protect(<ManagementPage kind="branches" />, true)} /><Route path="/branch-admins" element={protect(<ManagementPage kind="admins" />, true)} /><Route path="/categories" element={protect(<Categories />, true)} /><Route path="/customers" element={protect(<Customers />, true)} /><Route path="/homepage-images" element={protect(<Homepage />, true)} /><Route path="/order-issues" element={protect(<OrderIssues />, true)} /><Route path="/returns/:id" element={protect(<Returns />, true)} /><Route path="/b2b-orders" element={protect(<B2BOrders />, true)} /><Route path="/b2b-stock" element={protect(<B2BStock />, true)} /><Route path="/shipping" element={protect(<ShippingPage />, true)} /><Route path="/coin-settings" element={protect(<Coins />, true)} /><Route path="/audit" element={protect(<AuditPage />, true)} /><Route path="/settings" element={protect(<SettingsPage />)} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></Suspense></PortalFrame></BrowserRouter></LoadingProvider></AuthProvider>;
}
