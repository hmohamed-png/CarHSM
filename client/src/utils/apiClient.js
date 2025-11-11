const determineBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  return '';
};

const API_ROOT = determineBaseUrl().replace(/\/$/, '');

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      ...headers
    },
    credentials: 'include'
  };

  if (accessToken) {
    options.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body);
    if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }
  }

  let response;
  try {
    response = await fetch(`${API_ROOT}${endpoint}`, options);
  } catch (error) {
    throw new Error('Unable to reach the server. Please check your network connection.');
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const hasBody = response.status !== 204 && response.headers.get('content-length') !== '0';

  let data = null;
  if (isJson && hasBody) {
    try {
      data = await response.json();
    } catch (error) {
      // ignore JSON parse errors for non-JSON responses
    }
  }

  if (!response.ok) {
    const message = (data && data.message) || `API request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export async function trickleListObjects(type, limit = 50, includeMetadata = true) {
  const params = new URLSearchParams();
  if (Number.isFinite(limit)) params.set('limit', String(limit));
  params.set('meta', includeMetadata ? 'true' : 'false');

  const query = params.toString();
  return apiRequest(`/api/${type}${query ? `?${query}` : ''}`);
}

export async function trickleCreateObject(type, payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload for trickleCreateObject');
  }
  return apiRequest(`/api/${type}`, { method: 'POST', body: payload });
}

export async function trickleUpdateObject(type, objectId, updates) {
  if (!objectId) {
    throw new Error('objectId is required for trickleUpdateObject');
  }
  if (!updates || typeof updates !== 'object') {
    throw new Error('Invalid updates payload for trickleUpdateObject');
  }
  return apiRequest(`/api/${type}/${objectId}`, { method: 'PATCH', body: updates });
}

export async function trickleDeleteObject(type, objectId) {
  if (!objectId) {
    throw new Error('objectId is required for trickleDeleteObject');
  }
  return apiRequest(`/api/${type}/${objectId}`, { method: 'DELETE' });
}

export async function invokeAIAgent(systemPrompt, userMessage) {
  const data = await apiRequest('/api/ai', {
    method: 'POST',
    body: {
      systemPrompt,
      userMessage
    }
  });
  return data?.message || 'Sorry, I could not retrieve a response right now.';
}

export async function trickleResetStore() {
  await apiRequest('/api/reset', { method: 'POST' });
}

export function authRegister(payload) {
  return apiRequest('/api/auth/register', { method: 'POST', body: payload });
}

export function authSendOtp(payload) {
  return apiRequest('/api/auth/otp/send', { method: 'POST', body: payload });
}

export function authVerifyOtp(payload) {
  return apiRequest('/api/auth/otp/verify', { method: 'POST', body: payload });
}

export function authLogin(payload) {
  return apiRequest('/api/auth/login', { method: 'POST', body: payload });
}

export function authRefresh() {
  return apiRequest('/api/auth/refresh', { method: 'POST' });
}

export function authLogout() {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}

export function authMe() {
  return apiRequest('/api/auth/me');
}

if (typeof window !== 'undefined') {
  window.trickleListObjects = trickleListObjects;
  window.trickleCreateObject = trickleCreateObject;
  window.trickleUpdateObject = trickleUpdateObject;
  window.trickleDeleteObject = trickleDeleteObject;
  window.invokeAIAgent = invokeAIAgent;
  window.trickleResetStore = trickleResetStore;
}
