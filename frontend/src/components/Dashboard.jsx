import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

/* ===================================================================
   SVG ICONS
   =================================================================== */
const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const CurrencyIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const ChartIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ReceiptIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
  </svg>
);

const PackageIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const CalendarIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const AlertIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const TrendUpIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StoreIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);

const CheckIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ===================================================================
   HELPERS
   =================================================================== */
const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getMonthLabel = (monthKey) => {
  const [y, m] = monthKey.split('-');
  return `T${parseInt(m)}/${y}`;
};

const getShortMonth = (monthKey) => {
  const m = parseInt(monthKey.split('-')[1]);
  return `T${m}`;
};

const daysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

/* ===================================================================
   COMPONENT: Dashboard
   =================================================================== */
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data);
    } catch (err) {
      console.error('Lỗi tải thống kê:', err);
    }
    setLoading(false);
  };

  // Max revenue for chart scaling
  const maxRevenue = useMemo(() => {
    if (!data) return 0;
    return Math.max(...data.monthlyData.map((m) => m.revenue), 1);
  }, [data]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-gradient-from)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-gradient-to)', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#ec4899', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { store, summary, monthlyData, upcomingBatches, recentOrders } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ==================== PROFILE HEADER ==================== */}
      <div className="rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden animate-fade-in-up"
           style={{
             background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to), #a855f7)',
             boxShadow: '0 8px 32px rgba(99, 102, 241, 0.25)',
           }}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <StoreIcon className="w-8 h-8 text-white" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{store?.store_name || 'Cửa hàng'}</h1>
            <p className="text-white/60 text-sm mt-1">{store?.email}</p>
            <p className="text-white/40 text-xs mt-0.5">
              Tham gia từ: {formatDate(store?.created_at)}
            </p>
          </div>

          {/* Quick stat */}
          <div className="flex gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
              <p className="text-white/60 text-xs">Doanh thu tháng này</p>
              <p className="text-white font-bold text-lg">{formatPrice(summary.currentMonth.revenue)}</p>
              {summary.currentMonth.profit > 0 && (
                <p className="text-success-light text-xs font-semibold">
                  + Lãi {formatPrice(summary.currentMonth.profit)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SUMMARY CARDS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {/* Card: Tổng doanh thu */}
        <div className="card-themed p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-bg)' }}>
              <CurrencyIcon className="w-4 h-4" style={{ color: 'var(--success)' }} />
            </div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Doanh thu</p>
          </div>
          <p className="text-lg sm:text-xl font-extrabold animate-count-up truncate" style={{ color: 'var(--text-primary)' }}>
            {formatPrice(summary.totalRevenue)}
          </p>
        </div>

        {/* Card: Tổng lợi nhuận */}
        <div className="card-themed p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
              <TrendUpIcon className="w-4 h-4" style={{ color: '#10b981' }} />
            </div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Lợi nhuận</p>
          </div>
          <p className="text-lg sm:text-xl font-extrabold animate-count-up truncate" style={{ color: 'var(--success)' }}>
            {formatPrice(summary.totalProfit)}
          </p>
        </div>

        {/* Card: TB tháng */}
        <div className="card-themed p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-light)' }}>
              <TrendUpIcon className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            </div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>TB / tháng</p>
          </div>
          <p className="text-lg sm:text-xl font-extrabold animate-count-up truncate" style={{ color: 'var(--text-primary)' }}>
            {formatPrice(summary.avgMonthlyRevenue)}
          </p>
          <p className="text-[10px] sm:text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>
            Lãi: {formatPrice(summary.avgMonthlyProfit)}
          </p>
        </div>

        {/* Card: Khách hàng */}
        <div className="card-themed p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.1)' }}>
              <UserIcon className="w-4 h-4" style={{ color: '#ec4899' }} />
            </div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Khách hàng</p>
          </div>
          <p className="text-lg sm:text-xl font-extrabold animate-count-up" style={{ color: 'var(--text-primary)' }}>
            {summary.totalCustomers}
          </p>
          {Number(summary.totalDebt) > 0 ? (
            <p className="text-[10px] sm:text-xs mt-1 truncate font-semibold" style={{ color: 'var(--warning)' }}>Nợ: {formatPrice(summary.totalDebt)}</p>
          ) : (
            <p className="text-[10px] sm:text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>Không có nợ xấu</p>
          )}
        </div>

        {/* Card: Tổng đơn */}
        <div className="card-themed p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
              <ReceiptIcon className="w-4 h-4" style={{ color: '#a855f7' }} />
            </div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Hóa đơn</p>
          </div>
          <p className="text-lg sm:text-xl font-extrabold animate-count-up" style={{ color: 'var(--text-primary)' }}>
            {summary.totalOrders}
          </p>
          <p className="text-[10px] sm:text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{summary.totalProducts} sản phẩm</p>
        </div>

        {/* Card: Cảnh báo */}
        <div className="card-themed p-4 sm:p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: (summary.expiredCount + summary.expiringCount) > 0 ? 'var(--danger-bg)' : 'var(--bg-inset)' }}>
              <AlertIcon className="w-4 h-4" style={{ color: (summary.expiredCount + summary.expiringCount) > 0 ? 'var(--danger)' : 'var(--text-muted)' }} />
            </div>
            <p className="text-[11px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Cảnh báo</p>
          </div>
          <div className="space-y-1">
            {summary.expiredCount > 0 && <p className="text-[10px] sm:text-xs font-semibold" style={{ color: 'var(--danger)' }}>{summary.expiredCount} lô hết hạn</p>}
            {summary.expiringCount > 0 && <p className="text-[10px] sm:text-xs font-semibold" style={{ color: 'var(--warning)' }}>{summary.expiringCount} lô sắp hết hạn</p>}
            {summary.lowStockCount > 0 && <p className="text-[10px] sm:text-xs font-semibold" style={{ color: 'var(--info)' }}>{summary.lowStockCount} SP sắp hết</p>}
            {(summary.expiredCount + summary.expiringCount + summary.lowStockCount) === 0 && (
              <p className="text-[10px] sm:text-xs font-semibold" style={{ color: 'var(--success)' }}>Tuyệt vời!</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ==================== BIỂU ĐỒ DOANH THU ==================== */}
        <div className="lg:col-span-2 card-themed p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-2 mb-5">
            <ChartIcon className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Doanh thu theo tháng</h2>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-1.5 sm:gap-2 h-44 sm:h-52 mb-3">
            {monthlyData.map((m, i) => {
              const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
              const isCurrentMonth = i === monthlyData.length - 1;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                       style={{ background: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)' }}>
                    <p className="font-bold border-b border-white/20 pb-1 mb-1">{getMonthLabel(m.month)}</p>
                    <p>DT: {formatPrice(m.revenue)}</p>
                    {m.profit > 0 && <p style={{ color: '#34d399' }}>Lãi: {formatPrice(m.profit)}</p>}
                    <p className="opacity-75">{m.orders} đơn</p>
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 cursor-pointer"
                    style={{
                      height: `${Math.max(height, 2)}%`,
                      background: isCurrentMonth
                        ? 'linear-gradient(to top, var(--brand-gradient-from), var(--brand-gradient-to))'
                        : m.revenue > 0
                          ? 'var(--brand-light)'
                          : 'var(--bg-inset)',
                      boxShadow: isCurrentMonth ? 'var(--shadow-glow)' : 'none',
                      animationDelay: `${i * 0.05}s`,
                    }}
                    onMouseEnter={e => { if (!isCurrentMonth && m.revenue > 0) e.currentTarget.style.background = 'linear-gradient(to top, var(--brand-gradient-from), var(--brand-gradient-to))'; }}
                    onMouseLeave={e => { if (!isCurrentMonth && m.revenue > 0) e.currentTarget.style.background = 'var(--brand-light)'; }}
                  />
                </div>
              );
            })}
          </div>

          {/* Month labels */}
          <div className="flex gap-1.5 sm:gap-2">
            {monthlyData.map((m, i) => (
              <div key={m.month} className="flex-1 text-center">
                <p className="text-[10px] sm:text-xs font-medium"
                   style={{ color: i === monthlyData.length - 1 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>
                  {getShortMonth(m.month)}
                </p>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded"
                   style={{ background: 'linear-gradient(to top, var(--brand-gradient-from), var(--brand-gradient-to))' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tháng hiện tại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: 'var(--brand-light)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Các tháng trước</span>
            </div>
            <div className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
              TB: <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>{formatPrice(summary.avgMonthlyRevenue)}</span>/tháng
            </div>
          </div>
        </div>

        {/* ==================== HÓA ĐƠN GẦN NHẤT ==================== */}
        <div className="card-themed p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <ReceiptIcon className="w-5 h-5" style={{ color: '#a855f7' }} />
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Hóa đơn gần đây</h2>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <ReceiptIcon className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Chưa có hóa đơn nào</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[340px] overflow-y-auto custom-scrollbar">
              {recentOrders.map((order, i) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors animate-fade-in"
                  style={{
                    background: 'var(--bg-inset)',
                    animationDelay: `${i * 0.03}s`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                    <span className="text-xs font-bold" style={{ color: '#a855f7' }}>#{order.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatPrice(order.total_price)}</p>
                    <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <ClockIcon className="w-3 h-3" />
                      {formatDate(order.created_at)} {formatTime(order.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== ROW 3: Lô hàng + Bảng tháng ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Lô hàng sắp hết hạn */}
        <div className="card-themed p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5" style={{ color: 'var(--warning)' }} />
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Lô hàng sắp hết hạn</h2>
          </div>

          {upcomingBatches.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                   style={{ background: 'var(--success-bg)' }}>
                <CheckIcon className="w-6 h-6" style={{ color: 'var(--success)' }} />
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Không có lô nào sắp hết hạn</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingBatches.map((batch) => {
                const days = daysUntil(batch.expiry_date);
                const badgeStyle = days <= 7
                  ? { background: 'var(--danger-bg)', color: 'var(--danger)', borderColor: 'var(--danger-light)' }
                  : days <= 30
                    ? { background: 'var(--warning-bg)', color: 'var(--warning)', borderColor: 'var(--warning-light)' }
                    : { background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success-light)' };
                return (
                  <div
                    key={batch.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{ background: 'var(--bg-inset)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ background: badgeStyle.background }}>
                      <CalendarIcon className="w-4 h-4" style={{ color: badgeStyle.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {batch.product?.product_name || 'Sản phẩm'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {batch.batch_code || 'Không mã'} • HSD: {formatDate(batch.expiry_date)}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0"
                          style={{ ...badgeStyle, border: `1px solid ${badgeStyle.borderColor}` }}>
                      {days <= 0 ? 'Hết hạn' : `${days} ngày`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bảng doanh thu theo tháng */}
        <div className="card-themed p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 mb-4">
            <ChartIcon className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
            <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>Chi tiết theo tháng</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Tháng</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Doanh thu</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Đơn hàng</th>
                  <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>TB/đơn</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyData].reverse().map((m, i) => {
                  const avgPerOrder = m.orders > 0 ? Math.round(m.revenue / m.orders) : 0;
                  const isCurrentMonth = i === 0;
                  return (
                    <tr
                      key={m.month}
                      className="transition-colors"
                      style={{
                        borderBottom: '1px solid var(--border-secondary)',
                        background: isCurrentMonth ? 'var(--brand-light)' : 'transparent',
                      }}
                      onMouseEnter={e => { if (!isCurrentMonth) e.currentTarget.style.background = 'var(--bg-inset)'; }}
                      onMouseLeave={e => { if (!isCurrentMonth) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-medium" style={{ color: isCurrentMonth ? 'var(--brand-primary)' : 'var(--text-secondary)' }}>
                          {getMonthLabel(m.month)}
                        </span>
                        {isCurrentMonth && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold"
                                style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)' }}>
                            Hiện tại
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold"
                          style={{ color: m.revenue > 0 ? (isCurrentMonth ? 'var(--brand-primary)' : 'var(--text-primary)') : 'var(--text-muted)' }}>
                        {m.revenue > 0 ? formatPrice(m.revenue) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right"
                          style={{ color: m.orders > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        {m.orders || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs"
                          style={{ color: avgPerOrder > 0 ? 'var(--text-tertiary)' : 'var(--text-muted)' }}>
                        {avgPerOrder > 0 ? formatPrice(avgPerOrder) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
