import { useState } from 'react';
import ShelfManager from './components/ShelfManager';
import Checkout from './components/Checkout';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';

/* ===================================================================
   App — Giao diện chính: Login/Register → ShelfManager / Checkout
   =================================================================== */
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [storeName, setStoreName] = useState(localStorage.getItem('store_name') || '');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'shelves' | 'checkout' | 'inventory'

  // Login / Register form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email, password }
        : { email, password, store_name: name };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('store_name', data.data.store.store_name);
        setToken(data.data.token);
        setStoreName(data.data.store.store_name);
      } else {
        // Đăng ký thành công → chuyển sang form login
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setPassword('');
      }
    } catch {
      setError('Không thể kết nối server. Hãy chắc chắn backend đang chạy.');
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('store_name');
    setToken(null);
    setStoreName('');
    setEmail('');
    setPassword('');
    setName('');
  };

  const TABS = [
    { id: 'dashboard', label: 'Trang chủ', icon: '📊' },
    { id: 'shelves', label: 'Kệ hàng', icon: '📦' },
    { id: 'checkout', label: 'Tính tiền', icon: '🧾' },
    { id: 'inventory', label: 'Lô & Cảnh báo', icon: '⚠️' },
  ];

  /* ========== ĐÃ ĐĂNG NHẬP → Hiện tabs ========== */
  if (token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        {/* Top navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏪</span>
              <div>
                <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{storeName}</p>
                <p className="text-xs text-gray-400">Quản lý Tạp hóa</p>
              </div>
            </div>

            {/* Tab buttons */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </nav>

        {/* Main content — render theo tab */}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'shelves' && <ShelfManager />}
        {activeTab === 'checkout' && <Checkout />}
        {activeTab === 'inventory' && <Inventory />}
      </div>
    );
  }

  /* ========== CHƯA ĐĂNG NHẬP → Form Login/Register ========== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-300/50">
              <span className="text-3xl">🏪</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Tạp hóa</h1>
            <p className="text-gray-400 mt-1.5 text-sm">
              {isLogin ? 'Đăng nhập vào cửa hàng của bạn' : 'Tạo tài khoản cửa hàng mới'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-slide-down">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium animate-slide-down">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên cửa hàng</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Tạp hóa Minh Anh"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                isLogin ? 'Đăng nhập' : 'Đăng ký'
              )}
            </button>
          </form>

          {/* Toggle login/register */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              className="text-indigo-500 font-semibold ml-1.5 hover:text-indigo-700 hover:underline transition-colors cursor-pointer"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/50 mt-6">
          Ứng dụng Quản lý Tạp hóa • Đồ án Web
        </p>
      </div>
    </div>
  );
}
