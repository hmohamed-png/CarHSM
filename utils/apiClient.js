const API_ROOT = (window.API_BASE_URL || '').replace(/\/$/, '');

async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const options = {
    method,
    headers: {
      ...headers
    }
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${API_ROOT}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

async function trickleListObjects(type, limit = 50, includeMetadata = true) {
  const params = new URLSearchParams();
  if (Number.isFinite(limit)) params.set('limit', String(limit));
  params.set('meta', includeMetadata ? 'true' : 'false');

  const query = params.toString();
  const data = await apiRequest(`/api/${type}${query ? `?${query}` : ''}`);
  return data;
}

async function trickleCreateObject(type, payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload for trickleCreateObject');
  }
  return apiRequest(`/api/${type}`, { method: 'POST', body: payload });
}

async function trickleUpdateObject(type, objectId, updates) {
  if (!objectId) {
    throw new Error('objectId is required for trickleUpdateObject');
  }
  if (!updates || typeof updates !== 'object') {
    throw new Error('Invalid updates payload for trickleUpdateObject');
  }
  return apiRequest(`/api/${type}/${objectId}`, { method: 'PATCH', body: updates });
}

async function trickleDeleteObject(type, objectId) {
  if (!objectId) {
    throw new Error('objectId is required for trickleDeleteObject');
  }
  return apiRequest(`/api/${type}/${objectId}`, { method: 'DELETE' });
}

async function invokeAIAgent(systemPrompt, userMessage) {
  const data = await apiRequest('/api/ai', {
    method: 'POST',
    body: {
      systemPrompt,
      userMessage
    }
  });
  return data?.message || 'Sorry, I could not retrieve a response right now.';
}

async function trickleResetStore() {
  await apiRequest('/api/reset', { method: 'POST' });
}

window.trickleListObjects = trickleListObjects;
window.trickleCreateObject = trickleCreateObject;
window.trickleUpdateObject = trickleUpdateObject;
window.trickleDeleteObject = trickleDeleteObject;
window.invokeAIAgent = invokeAIAgent;
window.trickleResetStore = trickleResetStore;
