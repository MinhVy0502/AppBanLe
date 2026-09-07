/**
 * API Service — wrapper quanh fetch, tự động gắn JWT token và xử lý lỗi xác thực.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    let data;
    try {
      data = await res.json();
    } catch {
      data = { success: false, message: 'Phản hồi từ máy chủ không hợp lệ' };
    }

    if (!res.ok) {
      // Nếu lỗi 401 (token hết hạn hoặc không hợp lệ), tự động đăng xuất và thông báo cho App
      if (res.status === 401 && token) {
        localStorage.removeItem('token');
        localStorage.removeItem('store_name');
        window.dispatchEvent(
          new CustomEvent('auth:expired', {
            detail: data.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          })
        );
      }

      const error = new Error(data.message || 'Yêu cầu thất bại');
      error.response = { status: res.status, data };
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body }),
  put: (url, body) => request(url, { method: 'PUT', body }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

export default api;
