import React, { useCallback, useEffect, useMemo, useState } from 'react'
import NavbarAdmin from './NavbarAdmin'
import { useAuth } from './AdminAuth'

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app'
const API_BASE = (
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE
).replace(/\/+$/, '')

export default function B2BStock() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [adjusting, setAdjusting] = useState({}) // productId -> true/false
  const [toast, setToast] = useState('')

  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }), [token])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/b2b/stock/all`, { headers: authHeaders })
      if (!res.ok) throw new Error('Failed to load B2B products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [authHeaders])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleAdjust = async (product, delta) => {
    const id = product.id
    if (adjusting[id]) return
    setAdjusting(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`${API_BASE}/api/b2b/stock/adjust`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          product_id: id,
          delta,
          reason: delta > 0 ? 'Manual stock addition' : 'Manual stock reduction'
        })
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.message || 'Adjustment failed')
        return
      }
      // Update local state immediately
      setProducts(prev => prev.map(p =>
        p.id === id ? { ...p, stock_qty: data.new_qty } : p
      ))
      showToast(`Stock updated: ${data.previous_qty} → ${data.new_qty} ${product.stock_unit === 'BOX' ? 'boxes' : 'pcs'}`)
    } catch {
      showToast('Network error')
    } finally {
      setAdjusting(prev => ({ ...prev, [id]: false }))
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.trim().toLowerCase()
    return products.filter(p =>
      p.brand_name?.toLowerCase().includes(q) ||
      p.product_name?.toLowerCase().includes(q) ||
      p.style_code?.toLowerCase().includes(q) ||
      p.colour?.toLowerCase().includes(q)
    )
  }, [products, search])

  const stockLabel = (p) => {
    if (p.stock_unit === 'BOX') {
      return `${p.stock_qty} box${p.stock_qty !== 1 ? 'es' : ''}${p.pieces_per_box ? ` (${p.pieces_per_box} pcs/box)` : ''}`
    }
    return `${p.stock_qty} pc${p.stock_qty !== 1 ? 's' : ''}`
  }

  const stockColor = (qty) => {
    if (qty <= 0) return '#ef4444'
    if (qty <= 5) return '#f59e0b'
    return '#4ade80'
  }

  return (
    <div style={styles.page}>
      <NavbarAdmin />
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>B2B Stock Management</h2>
            <p style={styles.subtitle}>Manage wholesale product inventory</p>
          </div>
          <button onClick={fetchProducts} style={styles.refreshBtn}>
            ↻ Refresh
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by brand, product, style code or colour..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />

        {loading ? (
          <div style={styles.state}>Loading...</div>
        ) : error ? (
          <div style={{ ...styles.state, color: '#ef4444' }}>{error}</div>
        ) : !filtered.length ? (
          <div style={styles.state}>
            {search ? 'No products match your search' : 'No B2B products found. Import products first.'}
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Style Code</th>
                  <th style={styles.th}>Colour</th>
                  <th style={styles.th}>MRP</th>
                  <th style={styles.th}>Markdown</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Adjust</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.brand_name}</td>
                    <td style={styles.td}>{p.product_name}</td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: 12 }}>{p.style_code}</td>
                    <td style={styles.td}>{p.colour || '—'}</td>
                    <td style={styles.td}>₹{Number(p.mrp).toFixed(0)}</td>
                    <td style={styles.td}>
                      {p.markdown_pct ? (
                        <span style={{ color: '#4ade80' }}>-{p.markdown_pct}%</span>
                      ) : '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: stockColor(p.stock_qty), fontWeight: 700 }}>
                        {stockLabel(p)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.adjRow}>
                        <button
                          style={styles.adjBtn}
                          onClick={() => handleAdjust(p, -1)}
                          disabled={adjusting[p.id] || p.stock_qty <= 0}
                          title="Remove 1"
                        >
                          −
                        </button>
                        <span style={styles.adjCount}>{p.stock_qty}</span>
                        <button
                          style={styles.adjBtn}
                          onClick={() => handleAdjust(p, 1)}
                          disabled={adjusting[p.id]}
                          title="Add 1"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={styles.summary}>
          Showing {filtered.length} of {products.length} products
          {products.filter(p => p.stock_qty <= 0).length > 0 && (
            <span style={{ color: '#ef4444', marginLeft: 16 }}>
              ⚠ {products.filter(p => p.stock_qty <= 0).length} out of stock
            </span>
          )}
        </div>
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#e5e7eb' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '24px 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 },
  subtitle: { color: '#6b7280', fontSize: 13, marginTop: 4 },
  refreshBtn: {
    background: '#1f2937', border: '1px solid #374151', color: '#fff',
    padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13
  },
  search: {
    width: '100%', background: '#111', border: '1px solid #374151',
    color: '#fff', padding: '10px 14px', borderRadius: 8, fontSize: 14,
    marginBottom: 16, boxSizing: 'border-box', outline: 'none'
  },
  state: { textAlign: 'center', padding: 40, color: '#6b7280', fontSize: 14 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    background: '#111', padding: '10px 12px', textAlign: 'left',
    color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #222',
    whiteSpace: 'nowrap'
  },
  tr: { borderBottom: '1px solid #1a1a1a' },
  td: { padding: '10px 12px', color: '#d1d5db', verticalAlign: 'middle' },
  adjRow: { display: 'flex', alignItems: 'center', gap: 8 },
  adjBtn: {
    width: 28, height: 28, background: '#1f2937', border: '1px solid #374151',
    color: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 0, lineHeight: 1
  },
  adjCount: { minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: 14, color: '#fff' },
  summary: { marginTop: 12, fontSize: 12, color: '#6b7280' },
  toast: {
    position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
    background: '#1f2937', border: '1px solid #374151', color: '#fff',
    padding: '10px 20px', borderRadius: 8, fontSize: 13, zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
  }
}
