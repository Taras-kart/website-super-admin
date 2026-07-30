import React, { useEffect, useState } from 'react'
import NavbarAdmin from './NavbarAdmin'
import { useAuth } from './AdminAuth'

const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app'
const API_BASE = (
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) ||
  DEFAULT_API_BASE
).replace(/\/+$/, '')

export default function CoinsSettings() {
  const { token } = useAuth()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Local form state
  const [form, setForm] = useState({
    coins_enabled: 'true',
    coins_signup_bonus: '100',
    coins_earn_rate_pct: '10',
    coins_redeem_order_limit: '5',
    coins_b2b_enabled: 'false'
  })

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' }

  useEffect(() => {
    fetchSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/coins/settings`, { headers: authHeaders })
      if (!res.ok) throw new Error('Failed to load settings')
      const data = await res.json()
      if (data.ok && data.settings) {
        setSettings(data.settings)
        setForm({
          coins_enabled: data.settings.coins_enabled ?? 'true',
          coins_signup_bonus: data.settings.coins_signup_bonus ?? '100',
          coins_earn_rate_pct: data.settings.coins_earn_rate_pct ?? '10',
          coins_redeem_order_limit: data.settings.coins_redeem_order_limit ?? '5',
          coins_b2b_enabled: data.settings.coins_b2b_enabled ?? 'false'
        })
      }
    } catch (e) {
      showMessage('Failed to load settings: ' + e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Validate
      const bonus = parseInt(form.coins_signup_bonus, 10)
      const rate = parseFloat(form.coins_earn_rate_pct)
      const limit = parseInt(form.coins_redeem_order_limit, 10)

      if (isNaN(bonus) || bonus < 0) return showMessage('Signup bonus must be 0 or more', 'error')
      if (isNaN(rate) || rate < 0 || rate > 100) return showMessage('Earn rate must be between 0 and 100', 'error')
      if (isNaN(limit) || limit < 1) return showMessage('Order limit must be at least 1', 'error')

      const res = await fetch(`${API_BASE}/api/coins/settings`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.message || 'Save failed')
      setSettings(data.settings)
      showMessage('Settings saved successfully', 'success')
    } catch (e) {
      showMessage('Save failed: ' + e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggle = (key) => {
    setForm(f => ({ ...f, [key]: f[key] === 'true' ? 'false' : 'true' }))
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <NavbarAdmin />
        <div style={styles.center}>Loading settings...</div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <NavbarAdmin />
      <div style={styles.container}>

        <div style={styles.header}>
          <h2 style={styles.title}>🪙 Coin Wallet Settings</h2>
          <p style={styles.subtitle}>Configure how Attach coins work for customers</p>
        </div>

        {message.text && (
          <div style={{ ...styles.alert, background: message.type === 'error' ? '#7f1d1d' : '#14532d' }}>
            {message.text}
          </div>
        )}

        {/* Master Switch */}
        <div style={styles.card}>
          <div style={styles.cardRow}>
            <div>
              <div style={styles.label}>Coins System</div>
              <div style={styles.hint}>Turn off to disable all coin earning and redemption across the site</div>
            </div>
            <button
              style={{ ...styles.toggle, background: form.coins_enabled === 'true' ? '#ca8a04' : '#374151' }}
              onClick={() => toggle('coins_enabled')}
            >
              {form.coins_enabled === 'true' ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Signup Bonus */}
        <div style={styles.card}>
          <div style={styles.label}>Signup Bonus Coins</div>
          <div style={styles.hint}>Coins credited when a new customer creates an account</div>
          <div style={styles.inputRow}>
            <input
              type="number"
              min="0"
              value={form.coins_signup_bonus}
              onChange={e => setForm(f => ({ ...f, coins_signup_bonus: e.target.value }))}
              style={styles.input}
            />
            <span style={styles.unit}>coins</span>
          </div>
          <div style={styles.preview}>
            Customer gets <strong>{form.coins_signup_bonus || 0} coins = ₹{form.coins_signup_bonus || 0} discount</strong> on first {form.coins_redeem_order_limit} orders
          </div>
        </div>

        {/* Earn Rate */}
        <div style={styles.card}>
          <div style={styles.label}>Coins Earn Rate</div>
          <div style={styles.hint}>Percentage of order subtotal (before fees) credited as coins after delivery</div>
          <div style={styles.inputRow}>
            <input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={form.coins_earn_rate_pct}
              onChange={e => setForm(f => ({ ...f, coins_earn_rate_pct: e.target.value }))}
              style={styles.input}
            />
            <span style={styles.unit}>%</span>
          </div>
          <div style={styles.preview}>
            ₹1,000 order → customer earns <strong>{Math.floor(1000 * parseFloat(form.coins_earn_rate_pct || 0) / 100)} coins</strong>
          </div>
        </div>

        {/* Redeem Order Limit */}
        <div style={styles.card}>
          <div style={styles.label}>Signup Coins — Eligible Orders</div>
          <div style={styles.hint}>
            Signup bonus coins can only be redeemed within this many paid orders.
            After the limit, remaining signup coins are discarded. Earned coins are not affected.
          </div>
          <div style={styles.inputRow}>
            <input
              type="number"
              min="1"
              value={form.coins_redeem_order_limit}
              onChange={e => setForm(f => ({ ...f, coins_redeem_order_limit: e.target.value }))}
              style={styles.input}
            />
            <span style={styles.unit}>orders</span>
          </div>
          <div style={styles.preview}>
            Signup coins usable in first <strong>{form.coins_redeem_order_limit || 5} paid orders</strong> only
          </div>
        </div>

        {/* B2B Toggle */}
        <div style={styles.card}>
          <div style={styles.cardRow}>
            <div>
              <div style={styles.label}>B2B Coins</div>
              <div style={styles.hint}>Allow B2B (wholesale) customers to earn and redeem coins</div>
            </div>
            <button
              style={{ ...styles.toggle, background: form.coins_b2b_enabled === 'true' ? '#ca8a04' : '#374151' }}
              onClick={() => toggle('coins_b2b_enabled')}
            >
              {form.coins_b2b_enabled === 'true' ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div style={{ ...styles.card, background: '#1a1a00', border: '1px solid #ca8a04' }}>
          <div style={{ color: '#ca8a04', fontWeight: 700, marginBottom: 10 }}>Current Config Summary</div>
          <div style={styles.summaryRow}><span>System active</span><span>{form.coins_enabled === 'true' ? '✅ Yes' : '❌ No'}</span></div>
          <div style={styles.summaryRow}><span>Signup bonus</span><span>{form.coins_signup_bonus} coins</span></div>
          <div style={styles.summaryRow}><span>Earn rate</span><span>{form.coins_earn_rate_pct}% of subtotal</span></div>
          <div style={styles.summaryRow}><span>Signup coins valid for</span><span>First {form.coins_redeem_order_limit} paid orders</span></div>
          <div style={styles.summaryRow}><span>B2B eligible</span><span>{form.coins_b2b_enabled === 'true' ? '✅ Yes' : '❌ No'}</span></div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#fff' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#aaa' },
  container: { maxWidth: 640, margin: '0 auto', padding: '24px 16px' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, color: '#ca8a04', margin: 0 },
  subtitle: { color: '#9ca3af', marginTop: 6, fontSize: 14 },
  alert: { padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14, color: '#fff' },
  card: {
    background: '#111', border: '1px solid #222', borderRadius: 10,
    padding: '16px 20px', marginBottom: 14
  },
  cardRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  label: { fontWeight: 600, fontSize: 15, color: '#f3f4f6', marginBottom: 4 },
  hint: { fontSize: 12, color: '#6b7280', marginBottom: 10 },
  inputRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 },
  input: {
    background: '#1f2937', border: '1px solid #374151', borderRadius: 6,
    color: '#fff', padding: '8px 12px', fontSize: 16, width: 100,
    outline: 'none'
  },
  unit: { color: '#9ca3af', fontSize: 14 },
  preview: { marginTop: 10, fontSize: 13, color: '#d1d5db', background: '#1f2937', padding: '8px 12px', borderRadius: 6 },
  toggle: {
    padding: '8px 20px', borderRadius: 20, border: 'none',
    color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13,
    minWidth: 60, transition: 'background 0.2s'
  },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '6px 0', borderBottom: '1px solid #222',
    fontSize: 13, color: '#d1d5db'
  },
  saveBtn: {
    width: '100%', padding: '14px', background: '#ca8a04',
    color: '#000', fontWeight: 700, fontSize: 16,
    border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 8
  }
}
