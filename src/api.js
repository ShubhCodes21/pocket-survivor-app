// ═══════════════════════════════════════════════════════════════════
// Pocket Survivor - API Client
// Handles all backend communication with JWT authentication
// ═══════════════════════════════════════════════════════════════════

const BASE = import.meta.env.VITE_API_URL || '/api';

// ── Token Management ────────────────────────────────────────────
let token = localStorage.getItem('ps-token');

export function setToken(t) {
  token = t;
  if (t) localStorage.setItem('ps-token', t);
  else localStorage.removeItem('ps-token');
}

export function getToken() {
  return token;
}

export function isLoggedIn() {
  return !!token;
}

export function logout() {
  setToken(null);
  localStorage.removeItem('ps-user');
}

// ── Base Fetch ──────────────────────────────────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    // If 401, token expired -> logout
    if (res.status === 401 || res.status === 403) {
      logout();
      window.location.reload();
    }
    throw new Error(data.message || 'Request failed');
  }

  return data.data !== undefined ? data.data : data;
}

// ── AUTH ─────────────────────────────────────────────────────────
export async function register(email, password, name, personality, monthlyBudget) {
  const data = await request('POST', '/auth/register', {
    email, password, name, personality, monthlyBudget
  });
  setToken(data.token);
  localStorage.setItem('ps-user', JSON.stringify(data.user));
  return data;
}

export async function login(email, password) {
  const data = await request('POST', '/auth/login', { email, password });
  setToken(data.token);
  localStorage.setItem('ps-user', JSON.stringify(data.user));
  return data;
}

export async function forgotPassword(email) {
  return request('POST', '/auth/forgot-password', { email });
}

export async function resetPassword(email, token, newPassword) {
  return request('POST', '/auth/reset-password', { email, token, newPassword });
}

export function getCachedUser() {
  try {
    return JSON.parse(localStorage.getItem('ps-user'));
  } catch {
    return null;
  }
}

// ── USER ────────────────────────────────────────────────────────
export async function getProfile() {
  return request('GET', '/user/profile');
}

export async function updateProfile(updates) {
  const data = await request('PATCH', '/user/profile', updates);
  localStorage.setItem('ps-user', JSON.stringify(data));
  return data;
}

// ── DASHBOARD ───────────────────────────────────────────────────
export async function getDashboard() {
  return request('GET', '/dashboard');
}

// ── COACH ───────────────────────────────────────────────────────
export async function refreshCoach() {
  return request('GET', '/coach');
}

// ── EXPENSES ────────────────────────────────────────────────────
export async function addExpense(expense) {
  return request('POST', '/expenses', expense);
}

export async function getTodayExpenses() {
  return request('GET', '/expenses/today');
}

export async function getExpenses(from, to) {
  return request('GET', `/expenses?from=${from}&to=${to}`);
}

export async function deleteExpense(id) {
  return request('DELETE', `/expenses/${id}`);
}

// ── GOALS ───────────────────────────────────────────────────────
export async function createGoal(goal) {
  return request('POST', '/goals', goal);
}

export async function getGoals() {
  return request('GET', '/goals');
}

export async function contributeToGoal(goalId, amount) {
  return request('POST', `/goals/${goalId}/contribute`, { amount });
}

export async function deleteGoal(id) {
  return request('DELETE', `/goals/${id}`);
}

// ── INSIGHTS ────────────────────────────────────────────────────
export async function getInsights() {
  return request('GET', '/insights');
}

// ── SMART SUGGESTIONS (NLP) ─────────────────────────────────────
export async function getSuggestions(timeOfDay) {
  return request('GET', `/suggestions/${timeOfDay}`);
}

// ── HEALTH ──────────────────────────────────────────────────────
export async function checkHealth() {
  try {
    const res = await fetch(`${BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
