import Cookies from 'js-cookie';
import refreshToken from '../shared/helper/refreshToken';

const API_SERVER = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timeout. Vui lòng thử lại sau.');
    }
    throw err; 
  } finally {
    clearTimeout(id);
  }
};

const request = async (method, path, data, extraHeaders = {}) => {
  let url = API_SERVER + path;

  const isQuery = (method === 'GET' || method === 'DELETE') && data && typeof data === 'object';
  if (isQuery) {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const params = new URLSearchParams(filtered).toString();
    if (params) url += (url.includes('?') ? '&' : '?') + params;
  }

  // Cấu hình fetch options
  const options = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...getAuthHeader(),
      ...extraHeaders,
    },
  };

  // Body cho POST / PATCH
  const hasBody = ['POST', 'PATCH', 'PUT'].includes(method);
  if (hasBody && data) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`${method} ${url}`, data || '');
  }

  let response;
  try {
    response = await fetchWithTimeout(url, options, 15000);
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra mạng hoặc backend.');
    }
    throw err;
  }

  if (response.status === 401) {
    try {
      const newToken = await refreshToken('/api/v1/auth/refresh_token');
      // Retry với token mới
      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetchWithTimeout(url, options, 15000);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Refresh success] Retried ${method} ${url}`);
      }
    } catch (refreshErr) {
      Cookies.remove('token');
      //================== Tạo error để throw ==============
      const err = new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      err.status = 401; 
      err.success = false;
      throw err;
    }
  }

  if (response.status === 404) {
    throw new Error('API không tồn tại (404).');
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  let parsed;
  try {
    if (contentType?.includes('application/json')) {
      parsed = await response.json();
    } else if (contentType?.includes('text/')) {
      parsed = await response.text();
    } else {
      parsed = await response.blob(); 
    }
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.error('Non-JSON response:', await response.text());
    }
    throw new Error('Phản hồi không hợp lệ từ backend.');
  }

  if (!response.ok) {
    const err = new Error(parsed?.message || `HTTP ${response.status}: ${response.statusText}`);
    err.success = parsed?.success ?? false;
    err.status = parsed?.status ?? response.status;
    throw err;
  }

  return parsed;
};

// Các hàm tiện ích
export const GET = (path, params, headers) => request('GET', path, params, headers);
export const POST = (path, data, headers) => request('POST', path, data, headers);
export const PATCH = (path, data, headers) => request('PATCH', path, data, headers);
export const PUT = (path, data, headers) => request('PUT', path, data, headers);
export const DELETE = (path, data, headers) => request('DELETE', path, data, headers);