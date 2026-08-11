import { useState, useEffect, createContext, useContext } from 'react';
import ShelfManager from './components/ShelfManager';
import Checkout from './components/Checkout';
import Inventory from './components/Inventory';
import Dashboard from './components/Dashboard';
import OrderHistory from './components/OrderHistory';
import Customers from './components/Customers';
import ImportGoods from './components/ImportGoods';

/* ===================================================================
   SVG ICONS
   =================================================================== */
const icons = {
  store: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  dashboard: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  shelves: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  checkout: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
  inventory: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  sun: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  moon: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  logout: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  mail: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ),
  lock: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  user: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
};

/* ===================================================================
   THEME CONTEXT
   =================================================================== */
export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

/* ===================================================================
   App — Main Application Shell
   =================================================================== */
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [storeName, setStoreName] = useState(localStorage.getItem('store_name') || '');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Theme
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Login / Register form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
    { id: 'dashboard', label: 'Trang chủ', icon: icons.dashboard, color: '#6366f1' },
    { id: 'shelves', label: 'Kệ hàng', icon: icons.shelves, color: '#8b5cf6' },
    { id: 'imports', label: 'Nhập hàng', icon: icons.store, color: '#10b981' },
    { id: 'checkout', label: 'Tính tiền', icon: icons.checkout, color: '#f59e0b' },
    { id: 'orders', label: 'Hóa đơn', icon: icons.checkout, color: '#3b82f6' },
    { id: 'customers', label: 'Khách hàng', icon: icons.user, color: '#ec4899' },
    { id: 'inventory', label: 'Cảnh báo', icon: icons.inventory, color: '#ef4444' },
  ];

  /* ========== ĐÃ ĐĂNG NHẬP → Hiện tabs ========== */
  if (token) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
          {/* ===== TOP BAR — Brand + Actions ===== */}
          <header className="sticky top-0 z-40" style={{
            background: theme === 'dark'
              ? 'rgba(15, 23, 42, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderBottom: '1px solid var(--border-primary)',
          }}>
            {/* Row 1: Brand + Actions */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-glow"
                       style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))' }}>
                    {icons.store('w-5 h-5 text-white')}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {storeName}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Quản lý Tạp hóa</p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-1.5">
                  {/* Theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-inset)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                    title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
                  >
                    {theme === 'dark' ? icons.sun('w-[18px] h-[18px]') : icons.moon('w-[18px] h-[18px]')}
                  </button>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-bg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {icons.logout('w-4 h-4')}
                    <span className="hidden sm:inline text-xs">Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex overflow-x-auto custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 group"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                    >
                      {/* Icon with colored background when active */}
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: isActive ? `${tab.color}20` : 'transparent',
                          color: isActive ? tab.color : 'var(--text-muted)',
                        }}
                      >
                        {tab.icon('w-4 h-4')}
                      </div>
                      <span>{tab.label}</span>

                      {/* Active indicator — bottom bar */}
                      <div
                        className="absolute bottom-0 left-4 right-4 h-[2.5px] rounded-full transition-all duration-300"
                        style={{
                          background: isActive ? tab.color : 'transparent',
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="animate-fade-in" key={activeTab}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'shelves' && <ShelfManager />}
            {activeTab === 'imports' && <ImportGoods />}
            {activeTab === 'checkout' && <Checkout />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'customers' && <Customers />}
            {activeTab === 'inventory' && <Inventory />}
          </main>
        </div>
      </ThemeContext.Provider>
    );
  }

  /* ========== CHƯA ĐĂNG NHẬP → Form Login/Register ========== */
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
           style={{ background: 'var(--bg-primary)' }}>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full animate-float"
               style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))', opacity: 0.07, filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full animate-float"
               style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', opacity: 0.05, filter: 'blur(80px)', animationDelay: '1.5s' }} />
          <div className="absolute top-2/3 left-1/3 w-48 h-48 rounded-full animate-float"
               style={{ background: 'var(--success)', opacity: 0.04, filter: 'blur(50px)', animationDelay: '3s' }} />
        </div>

        {/* Theme toggle on login page */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer z-10"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', color: 'var(--text-tertiary)' }}
          title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
        >
          {theme === 'dark' ? icons.sun('w-5 h-5') : icons.moon('w-5 h-5')}
        </button>

        <div className="relative w-full max-w-md animate-fade-in-up">
          {/* Card */}
          <div className="rounded-2xl overflow-hidden"
               style={{
                 background: 'var(--bg-surface)',
                 border: '1px solid var(--border-primary)',
                 boxShadow: 'var(--shadow-xl)',
               }}>

            {/* Header gradient band */}
            <div className="h-1.5 animate-gradient"
                 style={{ background: 'linear-gradient(90deg, var(--brand-gradient-from), var(--brand-gradient-to), #ec4899, var(--brand-gradient-from))', backgroundSize: '200% 200%' }} />

            <div className="p-8">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow"
                     style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))' }}>
                  {icons.store('w-8 h-8 text-white')}
                </div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Quản lý Tạp hóa
                </h1>
                <p className="mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {isLogin ? 'Đăng nhập vào cửa hàng của bạn' : 'Tạo tài khoản cửa hàng mới'}
                </p>
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl text-sm font-medium animate-slide-down flex items-center gap-2"
                     style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-light)', color: 'var(--danger)' }}>
                  {icons.inventory('w-4 h-4 flex-shrink-0')}
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3.5 rounded-xl text-sm font-medium animate-slide-down flex items-center gap-2"
                     style={{ background: 'var(--success-bg)', border: '1px solid var(--success-light)', color: 'var(--success)' }}>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Tên cửa hàng
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                        {icons.store('w-4 h-4')}
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="VD: Tạp hóa Minh Anh"
                        required
                        className="w-full py-3 input-themed"
                        style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                      {icons.mail('w-4 h-4')}
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                      className="w-full py-3 input-themed"
                      style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                      {icons.lock('w-4 h-4')}
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      required
                      minLength={6}
                      className="w-full py-3 input-themed"
                      style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.4)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)'; }}
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
              <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                  className="font-semibold ml-1.5 transition-colors cursor-pointer"
                  style={{ color: 'var(--brand-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Ứng dụng Quản lý Tạp hóa • AppBanLe
          </p>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
