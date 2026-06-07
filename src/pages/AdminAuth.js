import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const AuthCtx = createContext({ token: null, user: null, ready: false, login: () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check both possible keys
    const t = localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
    const u = localStorage.getItem('auth_user') || localStorage.getItem('admin_user')
    
    if (t) {
      setToken(t)
      if (u) {
        try { setUser(JSON.parse(u)) } catch { setUser(null) }
      }
    }
    setReady(true)
  }, [])

  const login = useCallback((t, u, isSuperAdmin = false) => {
    // Store based on role to avoid confusion
    const tKey = isSuperAdmin ? 'admin_token' : 'auth_token'
    const uKey = isSuperAdmin ? 'admin_user' : 'auth_user'
    
    localStorage.setItem(tKey, t)
    localStorage.setItem(uKey, JSON.stringify(u || null))
    setToken(t)
    setUser(u || null)
  }, [])

  const logout = useCallback(() => {
    // Clear all possible keys
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ token, user, ready, login, logout }), [token, user, ready, login, logout])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}