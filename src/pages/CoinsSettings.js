import React, { useEffect, useState } from 'react';
import { useAuth } from './AdminAuth';
const DEFAULT_API_BASE = 'https://taras-kart-backend.vercel.app';
const API_BASE = ((typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) || DEFAULT_API_BASE).replace(/\/+$/, '');
export default function CoinsSettings() {
  const {
    token
  } = useAuth();
  const [, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    type: ''
  });
  const [form, setForm] = useState({
    coins_enabled: 'true',
    coins_signup_bonus: '100',
    coins_earn_rate_pct: '10',
    coins_redeem_order_limit: '5',
    coins_b2b_enabled: 'false'
  });
  const authHeaders = token ? {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/coins/settings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();
        if (data.ok && data.settings) {
          setSettings(data.settings);
          setForm({
            coins_enabled: data.settings.coins_enabled ?? 'true',
            coins_signup_bonus: data.settings.coins_signup_bonus ?? '100',
            coins_earn_rate_pct: data.settings.coins_earn_rate_pct ?? '10',
            coins_redeem_order_limit: data.settings.coins_redeem_order_limit ?? '5',
            coins_b2b_enabled: data.settings.coins_b2b_enabled ?? 'false'
          });
        }
      } catch (e) {
        setMessage({
          text: 'Failed to load settings: ' + e.message,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [token]);
  const showMessage = (text, type = 'success') => {
    setMessage({
      text,
      type
    });
    setTimeout(() => setMessage({
      text: '',
      type: ''
    }), 3000);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const bonus = parseInt(form.coins_signup_bonus, 10);
      const rate = parseFloat(form.coins_earn_rate_pct);
      const limit = parseInt(form.coins_redeem_order_limit, 10);
      if (isNaN(bonus) || bonus < 0) return showMessage('Signup bonus must be 0 or more', 'error');
      if (isNaN(rate) || rate < 0 || rate > 100) return showMessage('Earn rate must be between 0 and 100', 'error');
      if (isNaN(limit) || limit < 1) return showMessage('Order limit must be at least 1', 'error');
      const res = await fetch(`${API_BASE}/api/coins/settings`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Save failed');
      setSettings(data.settings);
      showMessage('Settings saved successfully', 'success');
    } catch (e) {
      showMessage('Save failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };
  const toggle = key => {
    setForm(f => ({
      ...f,
      [key]: f[key] === 'true' ? 'false' : 'true'
    }));
  };
  if (loading) {
    return <div style={styles.page} className="tsup-coinssettings-node-0">
        
        <div style={styles.center} className="tsup-coinssettings-node-1">Loading settings...</div>
      </div>;
  }
  return <div style={styles.page} className="tsup-coinssettings-node-2">
      
      <div style={styles.container} className="tsup-coinssettings-node-3">

        <div style={styles.header} className="tsup-coinssettings-node-4">
          <h2 style={styles.title} className="tsup-coinssettings-node-5">Coin wallet settings</h2>
          <p style={styles.subtitle} className="tsup-coinssettings-node-6">Configure how Attach coins work for customers</p>
        </div>

        {message.text && <div style={{
        ...styles.alert,
        background: message.type === 'error' ? "#ffffff" : "#ffffff"
      }} className="tsup-coinssettings-node-7">
            {message.text}
          </div>}

        {}
        <div style={styles.card} className="tsup-coinssettings-node-8">
          <div style={styles.cardRow} className="tsup-coinssettings-node-9">
            <div className="tsup-coinssettings-node-10">
              <div style={styles.label} className="tsup-coinssettings-node-11">Coins System</div>
              <div style={styles.hint} className="tsup-coinssettings-node-12">Turn off to disable all coin earning and redemption across the site</div>
            </div>
            <button style={{
            ...styles.toggle,
            background: form.coins_enabled === 'true' ? 'var(--portal-soft)' : "#ffffff"
          }} onClick={() => toggle('coins_enabled')} className="tsup-coinssettings-node-13">
              {form.coins_enabled === 'true' ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {}
        <div style={styles.card} className="tsup-coinssettings-node-14">
          <div style={styles.label} className="tsup-coinssettings-node-15">Signup Bonus Coins</div>
          <div style={styles.hint} className="tsup-coinssettings-node-16">Coins credited when a new customer creates an account</div>
          <div style={styles.inputRow} className="tsup-coinssettings-node-17">
            <input type="number" min="0" value={form.coins_signup_bonus} onChange={e => setForm(f => ({
            ...f,
            coins_signup_bonus: e.target.value
          }))} style={styles.input} className="tsup-coinssettings-node-18" />
            <span style={styles.unit} className="tsup-coinssettings-node-19">coins</span>
          </div>
          <div style={styles.preview} className="tsup-coinssettings-node-20">
            Customer gets <strong className="tsup-coinssettings-node-21">{form.coins_signup_bonus || 0} coins = ₹{form.coins_signup_bonus || 0} discount</strong> on first {form.coins_redeem_order_limit} orders
          </div>
        </div>

        {}
        <div style={styles.card} className="tsup-coinssettings-node-22">
          <div style={styles.label} className="tsup-coinssettings-node-23">Coins Earn Rate</div>
          <div style={styles.hint} className="tsup-coinssettings-node-24">Percentage of order subtotal (before fees) credited as coins after delivery</div>
          <div style={styles.inputRow} className="tsup-coinssettings-node-25">
            <input type="number" min="0" max="100" step="0.5" value={form.coins_earn_rate_pct} onChange={e => setForm(f => ({
            ...f,
            coins_earn_rate_pct: e.target.value
          }))} style={styles.input} className="tsup-coinssettings-node-26" />
            <span style={styles.unit} className="tsup-coinssettings-node-27">%</span>
          </div>
          <div style={styles.preview} className="tsup-coinssettings-node-28">
            ₹1,000 order → customer earns <strong className="tsup-coinssettings-node-29">{Math.floor(1000 * parseFloat(form.coins_earn_rate_pct || 0) / 100)} coins</strong>
          </div>
        </div>

        {}
        <div style={styles.card} className="tsup-coinssettings-node-30">
          <div style={styles.label} className="tsup-coinssettings-node-31">Signup Coins — Eligible Orders</div>
          <div style={styles.hint} className="tsup-coinssettings-node-32">
            Signup bonus coins can only be redeemed within this many paid orders.
            After the limit, remaining signup coins are discarded. Earned coins are not affected.
          </div>
          <div style={styles.inputRow} className="tsup-coinssettings-node-33">
            <input type="number" min="1" value={form.coins_redeem_order_limit} onChange={e => setForm(f => ({
            ...f,
            coins_redeem_order_limit: e.target.value
          }))} style={styles.input} className="tsup-coinssettings-node-34" />
            <span style={styles.unit} className="tsup-coinssettings-node-35">orders</span>
          </div>
          <div style={styles.preview} className="tsup-coinssettings-node-36">
            Signup coins usable in first <strong className="tsup-coinssettings-node-37">{form.coins_redeem_order_limit || 5} paid orders</strong> only
          </div>
        </div>

        {}
        <div style={styles.card} className="tsup-coinssettings-node-38">
          <div style={styles.cardRow} className="tsup-coinssettings-node-39">
            <div className="tsup-coinssettings-node-40">
              <div style={styles.label} className="tsup-coinssettings-node-41">B2B Coins</div>
              <div style={styles.hint} className="tsup-coinssettings-node-42">Allow B2B (wholesale) customers to earn and redeem coins</div>
            </div>
            <button style={{
            ...styles.toggle,
            background: form.coins_b2b_enabled === 'true' ? 'var(--portal-soft)' : "#ffffff"
          }} onClick={() => toggle('coins_b2b_enabled')} className="tsup-coinssettings-node-43">
              {form.coins_b2b_enabled === 'true' ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {}
        <div style={{
        ...styles.card,
        background: "#ffffff",
        border: '1px solid var(--portal-line)'
      }} className="tsup-coinssettings-node-44">
          <div style={{
          color: 'var(--portal-accent)',
          fontWeight: 700,
          marginBottom: 10
        }} className="tsup-coinssettings-node-45">Current Config Summary</div>
          <div style={styles.summaryRow} className="tsup-coinssettings-node-46"><span className="tsup-coinssettings-node-47">System active</span><span className="tsup-coinssettings-node-48">{form.coins_enabled === 'true' ? 'Yes' : 'No'}</span></div>
          <div style={styles.summaryRow} className="tsup-coinssettings-node-49"><span className="tsup-coinssettings-node-50">Signup bonus</span><span className="tsup-coinssettings-node-51">{form.coins_signup_bonus} coins</span></div>
          <div style={styles.summaryRow} className="tsup-coinssettings-node-52"><span className="tsup-coinssettings-node-53">Earn rate</span><span className="tsup-coinssettings-node-54">{form.coins_earn_rate_pct}% of subtotal</span></div>
          <div style={styles.summaryRow} className="tsup-coinssettings-node-55"><span className="tsup-coinssettings-node-56">Signup coins valid for</span><span className="tsup-coinssettings-node-57">First {form.coins_redeem_order_limit} paid orders</span></div>
          <div style={styles.summaryRow} className="tsup-coinssettings-node-58"><span className="tsup-coinssettings-node-59">B2B eligible</span><span className="tsup-coinssettings-node-60">{form.coins_b2b_enabled === 'true' ? 'Yes' : 'No'}</span></div>
        </div>

        <button onClick={handleSave} disabled={saving} style={{
        ...styles.saveBtn,
        opacity: saving ? 0.6 : 1
      }} className="tsup-coinssettings-node-61">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>

      </div>
    </div>;
}
const styles = {
  page: {
    minHeight: '100vh',
    background: "#ffffff",
    color: "#42536a"
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    color: "#42536a"
  },
  container: {
    maxWidth: 640,
    margin: '0 auto',
    padding: '24px 16px'
  },
  header: {
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--portal-accent)',
    margin: 0
  },
  subtitle: {
    color: "#42536a",
    marginTop: 6,
    fontSize: 14
  },
  alert: {
    padding: '12px 16px',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    color: "#42536a"
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dce3ec",
    borderRadius: 10,
    padding: '16px 20px',
    marginBottom: 14
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16
  },
  label: {
    fontWeight: 600,
    fontSize: 15,
    color: "#42536a",
    marginBottom: 4
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 8
  },
  input: {
    background: "#ffffff",
    border: "1px solid #dce3ec",
    borderRadius: 6,
    color: "#42536a",
    padding: '8px 12px',
    fontSize: 16,
    width: 100,
    outline: 'none'
  },
  unit: {
    color: "#42536a",
    fontSize: 14
  },
  preview: {
    marginTop: 10,
    fontSize: 13,
    color: "#42536a",
    background: "#ffffff",
    padding: '8px 12px',
    borderRadius: 6
  },
  toggle: {
    padding: '8px 20px',
    borderRadius: 20,
    border: 'none',
    color: "#42536a",
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 13,
    minWidth: 60,
    transition: 'background 0.2s'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: "1px solid #dce3ec",
    fontSize: 13,
    color: "#42536a"
  },
  saveBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--portal-soft)',
    color: '#000',
    fontWeight: 700,
    fontSize: 16,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: 8
  }
};
