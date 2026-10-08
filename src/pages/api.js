const API_BASE = process.env.REACT_APP_API_BASE || process.env.VITE_API_BASE || 'https://taras-kart-backend.vercel.app';
function buildUrl(path) {
  const normalizedPath = path.startsWith('/api') ? path : `/api${path}`;
  return `${API_BASE.replace(/\/+$/, '')}${normalizedPath}`;
}
async function request(method, path, body, opts = {}) {
  const url = buildUrl(path);
  const isLogin = url.includes('/api/auth-branch/login');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  };
  if (!isLogin) {
    const token = localStorage.getItem('auth_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  } else {
    delete headers.Authorization;
  }
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined || body === null ? undefined : JSON.stringify(body),
    credentials: 'omit',
    mode: 'cors',
    signal: opts.signal
  });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json().catch(() => ({})) : await response.text();
  if (!response.ok) {
    if (response.status === 401 && !path.includes('/login')) window.dispatchEvent(new Event('auth-expired'));
    const message = isJson && data?.message ? data.message : `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}
export function apiGet(path, params = {}, opts = {}) {
  const url = new URL(buildUrl(path));
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  const relativePath = `${url.pathname}${url.search}`;
  return request('GET', relativePath, null, opts);
}
export function apiPost(path, data, opts) {
  return request('POST', path, data, opts);
}
export function apiPut(path, data, opts) {
  return request('PUT', path, data, opts);
}
export function apiPatch(path, data, opts) {
  return request('PATCH', path, data, opts);
}
export function apiDelete(path, data, opts) {
  return request('DELETE', path, data, opts);
}
export async function apiUpload(path, formData, opts = {}) {
  const headers = {
    ...(opts.headers || {})
  };
  const token = localStorage.getItem('auth_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'omit',
    mode: 'cors',
    signal: opts.signal
  });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json().catch(() => ({})) : await response.text();
  if (!response.ok) {
    if (response.status === 401 && !path.includes('/login')) window.dispatchEvent(new Event('auth-expired'));
    const message = isJson && data?.message ? data.message : `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }
  return data;
}
