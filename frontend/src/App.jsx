import { useState, useEffect, createContext, useContext, Component, lazy, Suspense } from 'react';
import BankSettingsModal from './components/common/BankSettingsModal';
import api from './services/api';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ShelfManager = lazy(() => import('./components/ShelfManager'));
const ImportGoods = lazy(() => import('./components/ImportGoods'));
const Checkout = lazy(() => import('./components/Checkout'));
const OrderHistory = lazy(() => import('./components/OrderHistory'));
const Customers = lazy(() => import('./components/Customers'));
const Inventory = lazy(() => import('./components/Inventory'));

class TabErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi giao diện:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 text-center card-themed animate-fade-in rounded-3xl border border-secondary shadow-lg">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-500/10 text-red-500">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Có lỗi khi hiển thị mục này
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            {this.state.error?.message || 'Vui lòng bấm thử lại hoặc liên hệ hỗ trợ.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
          >
            Thử lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  user: (cls = 'w-5 h-5') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
};

export const ThemeContext = createContext();
export function useTheme() {
  return useContext(ThemeContext);
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [storeName, setStoreName] = useState(localStorage.getItem('store_name') || '');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('appbanle_active_tab') || 'checkout');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Store profile with bank info
  const [storeProfile, setStoreProfile] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const handleOpenBankSettings = () => setShowBankModal(true);
    window.addEventListener('open:bank-settings', handleOpenBankSettings);
    return () => window.removeEventListener('open:bank-settings', handleOpenBankSettings);
  }, []);

  // Auth form
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for auth expiration
  useEffect(() => {
    const handleAuthExpired = (e) => {
      setToken(null);
      setStoreName('');
      setError(e.detail || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      setIsLogin(true);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, []);

  // Fetch store profile if token exists
  useEffect(() => {
    if (token) {
      api.get('/profile')
        .then((res) => {
          const storeData = res?.data || res;
          if (storeData && storeData.id) {
            setStoreProfile(storeData);
            if (storeData.store_name) {
              setStoreName(storeData.store_name);
              localStorage.setItem('store_name', storeData.store_name);
            }
          }
        })
        .catch(() => {});
    }
  }, [token]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('appbanle_active_tab', tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    localStorage.removeItem('appbanle_active_tab');
    setToken(null);
    setStoreName('');
    setEmail('');
    setPassword('');
    setName('');
  };

  // Main Desktop Navigation Items
  const NAV_ITEMS = [
    { id: 'checkout', label: 'Tính tiền (POS)', icon: icons.checkout, color: '#10b981', badge: 'Quầy' },
    { id: 'orders', label: 'Hóa đơn bán', icon: icons.checkout, color: '#3b82f6' },
    { id: 'shelves', label: 'Kệ hàng & SP', icon: icons.shelves, color: '#8b5cf6' },
    { id: 'imports', label: 'Nhập hàng', icon: icons.store, color: '#14b8a6' },
    { id: 'inventory', label: 'Kho & Cảnh báo', icon: icons.inventory, color: '#ef4444' },
    { id: 'customers', label: 'Khách & Sổ nợ', icon: icons.user, color: '#f59e0b' },
    { id: 'dashboard', label: 'Báo cáo & Thống kê', icon: icons.dashboard, color: '#6366f1' },
  ];

  // Mobile Bottom Navigation Bar (5 essential thumb-friendly items)
  const MOBILE_BOTTOM_TABS = [
    { id: 'checkout', label: 'Tính tiền', icon: icons.checkout },
    { id: 'orders', label: 'Hóa đơn', icon: icons.checkout },
    { id: 'imports', label: 'Nhập kho', icon: icons.store },
    { id: 'customers', label: 'Sổ nợ', icon: icons.user },
    { id: 'dashboard', label: 'Tổng quan', icon: icons.dashboard },
  ];

  /* ========== ĐÃ ĐĂNG NHẬP ========== */
  if (token) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="min-h-screen flex bg-primary transition-colors">
          {/* ========================================================
              DESKTOP SIDEBAR (>= 1024px)
              ======================================================== */}
          <aside
            className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 z-30 border-r border-secondary sticky top-0 h-screen ${
              sidebarCollapsed ? 'w-20' : 'w-64'
            }`}
            style={{
              background: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Sidebar Brand Header */}
            <div className="p-4 flex items-center justify-between border-b border-secondary h-16">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))' }}
                >
                  {icons.store('w-5 h-5 text-white')}
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0 truncate animate-fade-in">
                    <h2 className="font-extrabold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {storeName || 'Cửa hàng'}
                    </h2>
                    <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Online POS</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-primary transition-colors cursor-pointer"
                title={sidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
              >
                {sidebarCollapsed ? '➔' : '◀'}
              </button>
            </div>

            {/* Sidebar Nav Links */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer group relative ${
                      isActive ? 'text-white shadow-md' : 'text-muted hover:text-primary hover:bg-surface-hover'
                    }`}
                    style={{
                      background: isActive ? 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))' : 'transparent',
                    }}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {item.icon('w-5 h-5')}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && !isActive && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Bottom Actions */}
            <div className="p-3 border-t border-secondary space-y-1.5">
              {/* VietQR Bank Setup */}
              <button
                type="button"
                onClick={() => setShowBankModal(true)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-primary transition-colors cursor-pointer ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                title="Cài đặt tài khoản ngân hàng VietQR"
              >
                <span className="text-base">💳</span>
                {!sidebarCollapsed && <span className="truncate">Cài đặt VietQR</span>}
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted hover:text-primary transition-colors cursor-pointer ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
              >
                {theme === 'dark' ? icons.sun('w-4 h-4') : icons.moon('w-4 h-4')}
                {!sidebarCollapsed && (
                  <span>{theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}</span>
                )}
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
              >
                {icons.logout('w-4 h-4 text-red-400')}
                {!sidebarCollapsed && <span>Đăng xuất</span>}
              </button>
            </div>
          </aside>

          {/* ========================================================
              MAIN CONTENT WRAPPER
              ======================================================== */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top Navigation Bar (Always visible on mobile, minimal header on desktop) */}
            <header
              className="sticky top-0 z-40 h-14 sm:h-16 px-4 flex items-center justify-between border-b border-secondary"
              style={{
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Mobile Brand / Desktop Title */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform shadow-sm"
                  style={{ background: 'var(--brand-primary)' }}
                  title="Menu tất cả chức năng"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <div>
                  <h1 className="font-extrabold text-sm sm:text-base leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {storeName || 'AppBanLe'}
                  </h1>
                  <p className="text-[10px] text-muted font-medium">
                    {NAV_ITEMS.find((i) => i.id === activeTab)?.label || 'Quản lý bán lẻ'}
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Bank Settings Trigger */}
                <button
                  type="button"
                  onClick={() => setShowBankModal(true)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-secondary flex items-center gap-1.5 cursor-pointer hover:border-brand-primary text-secondary"
                  title="Cài đặt VietQR"
                >
                  <span>💳</span>
                  <span className="hidden sm:inline">VietQR</span>
                </button>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-secondary flex items-center justify-center text-muted hover:text-primary transition-colors cursor-pointer"
                  title="Chuyển theme"
                >
                  {theme === 'dark' ? icons.sun('w-4 h-4') : icons.moon('w-4 h-4')}
                </button>

                {/* Mobile Logout */}
                <button
                  type="button"
                  onClick={logout}
                  className="lg:hidden w-8 h-8 rounded-xl border border-secondary flex items-center justify-center text-muted hover:text-red-500 transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  {icons.logout('w-4 h-4')}
                </button>
              </div>
            </header>

            {/* Active View Area */}
            <main className="flex-1 overflow-x-hidden">
              <TabErrorBoundary key={activeTab}>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center py-32 animate-fade-in">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-3">
                          <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-primary)', animationDelay: '0s' }} />
                          <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#14b8a6', animationDelay: '0.2s' }} />
                          <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#ec4899', animationDelay: '0.4s' }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold">Đang chuyển trang...</p>
                      </div>
                    </div>
                  }
                >
                  {activeTab === 'checkout' && <Checkout store={storeProfile} />}
                  {activeTab === 'orders' && <OrderHistory store={storeProfile} />}
                  {activeTab === 'shelves' && <ShelfManager />}
                  {activeTab === 'imports' && <ImportGoods />}
                  {activeTab === 'inventory' && <Inventory />}
                  {activeTab === 'customers' && <Customers />}
                  {activeTab === 'dashboard' && <Dashboard />}
                </Suspense>
              </TabErrorBoundary>
            </main>

            {/* ========================================================
                MOBILE BOTTOM NAVIGATION BAR (< 1024px)
                Thumb-friendly, fixed at bottom with safe-area padding
                ======================================================== */}
            <nav
              className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-secondary safe-bottom flex items-center justify-around py-1.5 px-2"
              style={{
                background: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {MOBILE_BOTTOM_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                      isActive ? 'font-bold scale-105' : 'text-muted opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                    }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center mb-0.5">
                      {tab.icon('w-5 h-5')}
                    </div>
                    <span className="text-[10px] leading-tight">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ========================================================
              MOBILE SLIDE-OUT MENU DRAWER (< 1024px)
              Allows accessing all 7 tabs + settings on phones
              ======================================================== */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 flex animate-fade-in"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="w-72 max-w-[80vw] h-full flex flex-col p-4 animate-slide-right"
                style={{
                  background: theme === 'dark' ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                  borderRight: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-xl)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-secondary mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--brand-primary)' }}>
                      {icons.store('w-5 h-5 text-white')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{storeName || 'AppBanLe'}</h3>
                      <p className="text-[10px] text-emerald-500 font-semibold">Tất cả chức năng</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary cursor-pointer text-lg"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleSelectTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          isActive ? 'text-white shadow-md' : 'text-muted hover:text-primary hover:bg-surface-hover'
                        }`}
                        style={{
                          background: isActive ? 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))' : 'transparent',
                        }}
                      >
                        <div className="w-5 h-5 flex items-center justify-center">{item.icon('w-5 h-5')}</div>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && !isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-3 border-t border-secondary space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBankModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary cursor-pointer"
                  >
                    <span className="text-base">💳</span>
                    <span>Cài đặt VietQR</span>
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-500 cursor-pointer"
                  >
                    {icons.logout('w-4 h-4')}
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bank Settings Modal */}
          <BankSettingsModal
            isOpen={showBankModal}
            onClose={() => setShowBankModal(false)}
            store={storeProfile}
            onUpdated={(updated) => {
              setStoreProfile((prev) => ({ ...prev, ...updated }));
              setToast({
                type: 'success',
                title: 'Đã lưu cài đặt VietQR thành công!',
                message: `${updated.bank_id || 'Ngân hàng'} • STK: ${updated.bank_account_no} • ${updated.bank_account_name || ''}`,
              });
            }}
          />

          {/* Global Floating Toast Notification */}
          {toast && (
            <div
              className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] sm:w-auto shadow-2xl rounded-2xl p-4 border flex items-start gap-3 bg-emerald-950/95 border-emerald-500/60 text-white backdrop-blur-md animate-fade-in"
              style={{ boxShadow: '0 10px 30px rgba(16, 185, 129, 0.35)' }}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-base font-bold">
                ✓
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="font-bold text-xs sm:text-sm text-emerald-300">{toast.title}</h4>
                <p className="text-xs text-emerald-100/90 mt-0.5 break-words font-medium">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-white/60 hover:text-white text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </ThemeContext.Provider>
    );
  }

  /* ========== CHƯA ĐĂNG NHẬP → Form Login/Register ========== */
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
           style={{ background: 'var(--bg-primary)' }}>
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full animate-float"
               style={{ background: 'linear-gradient(135deg, var(--brand-primary), #8b5cf6)', opacity: 0.08, filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full animate-float"
               style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', opacity: 0.06, filter: 'blur(80px)', animationDelay: '1.5s' }} />
        </div>

        {/* Theme toggle on login */}
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer z-10 border border-secondary shadow-sm"
          style={{ background: 'var(--bg-surface)', color: 'var(--text-tertiary)' }}
          title="Đổi theme"
        >
          {theme === 'dark' ? icons.sun('w-5 h-5') : icons.moon('w-5 h-5')}
        </button>

        <div className="relative w-full max-w-md animate-fade-in-up">
          <div className="card-themed rounded-3xl overflow-hidden border border-secondary shadow-2xl">
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--brand-primary), #10b981, #f59e0b)' }} />

            <div className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-xl"
                     style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))' }}>
                  {icons.store('w-8 h-8 text-white')}
                </div>
                <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                  AppBanLe POS
                </h1>
                <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {isLogin ? 'Đăng nhập vào cửa hàng của bạn' : 'Đăng ký tài khoản cửa hàng mới'}
                </p>
              </div>

              {/* Messages */}
              {error && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold text-center border border-red-500/20 animate-fade-in">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold text-center border border-emerald-500/20 animate-fade-in">
                  {success}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Tên cửa hàng
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Tạp hóa Hoàng Gia"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-themed w-full py-2.5 px-3.5 rounded-xl text-xs font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Email đăng nhập
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@cuahang.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-themed w-full py-2.5 px-3.5 rounded-xl text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-themed w-full py-2.5 px-3.5 rounded-xl text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-xl text-xs font-extrabold cursor-pointer disabled:opacity-50 mt-2 shadow-lg"
                >
                  {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
                </button>
              </form>

              {/* Toggle Login / Register */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-xs font-bold hover:underline cursor-pointer"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {isLogin ? 'Chưa có tài khoản? Đăng ký miễn phí' : 'Đã có tài khoản? Đăng nhập ngay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
