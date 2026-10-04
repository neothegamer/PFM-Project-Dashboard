// API Service Layer — real backend
// Set VITE_API_BASE_URL in .env (e.g. https://your-backend.onrender.com/api)

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'pfm_token';

// ─── Token helpers ───────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Core request helper ─────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ─── Auth ────────────────────────────────────────────────────────
export const auth = {
  async register({ name, email, password }) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async login({ email, password }) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.token) setToken(data.token);
    return data;
  },

  async me() {
    return request('/auth/me');
  },

  logout() {
    clearToken();
  },
};

// ─── Plaid ───────────────────────────────────────────────────────
export const plaid = {
  async createLinkToken() {
    return request('/plaid/create-link-token', { method: 'POST' });
  },

  async exchangePublicToken(publicToken) {
    return request('/plaid/exchange-public-token', {
      method: 'POST',
      body: { public_token: publicToken },
    });
  },

  async getAccounts() {
    return request('/plaid/accounts');
  },

  async syncTransactions() {
    return request('/plaid/sync-transactions', { method: 'POST' });
  },

  async refreshBalances() {
    return request('/plaid/refresh-balances', { method: 'POST' });
  },
};

// ─── Accounts ────────────────────────────────────────────────────
export const accounts = {
  getAccounts: () => plaid.getAccounts(),
  createPlaidLinkToken: () => plaid.createLinkToken(),
  exchangePlaidPublicToken: (publicToken) =>
    plaid.exchangePublicToken(publicToken),

  async createManual(body) {
    return request('/accounts/manual', {
      method: 'POST',
      body,
    });
  },
};

// ─── Transactions ────────────────────────────────────────────────
export const transactions = {
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.account) params.set('account', filters.account);
    if (filters.category) params.set('category', filters.category);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.page) params.set('page', String(filters.page));

    const qs = params.toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },

  async createTransaction({ account, name, amount, date, category, notes }) {
    return request('/transactions', {
      method: 'POST',
      body: { account, name, amount, date, category, notes },
    });
  },

  async updateTransaction(id, updates) {
    return request(`/transactions/${id}`, {
      method: 'PUT',
      body: updates,
    });
  },

  async deleteTransaction(id) {
    return request(`/transactions/${id}`, { method: 'DELETE' });
  },

  async summaryByCategory() {
    return request('/transactions/summary/by-category');
  },

  async summaryByMonth() {
    return request('/transactions/summary/by-month');
  },
};

// ─── Budgets ─────────────────────────────────────────────────────
export const budgets = {
  async getBudgets() {
    return request('/budgets');
  },

  async setBudget({ category, monthlyLimit, color, notes }) {
    return request('/budgets', {
      method: 'PUT',
      body: { category, monthlyLimit, color, notes },
    });
  },

  async getStatus() {
    return request('/budgets/status');
  },

  async deleteBudget(id) {
    return request(`/budgets/${id}`, { method: 'DELETE' });
  },
};

// ─── Health ──────────────────────────────────────────────────────
export async function health() {
  return request('/health');
}

// ─── Default export (all modules) ────────────────────────────────
const api = {
  auth,
  plaid,
  accounts,
  transactions,
  budgets,
  health,
  getToken,
  setToken,
  clearToken,
};

export default api;