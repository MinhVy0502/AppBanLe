import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

/* ===================================================================
   SVG ICONS
   =================================================================== */
const ReceiptIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);
const SearchIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const CalendarIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);
const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const ChevronIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
const UserIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const PackageIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

/* ===================================================================
   HELPERS
   =================================================================== */
const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';
const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
const formatTime = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

/* ===================================================================
   COMPONENT: OrderHistory
   =================================================================== */
export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders?limit=200';
      if (dateFrom) url += `&from=${dateFrom}`;
      if (dateTo) url += `&to=${dateTo}`;
      const res = await api.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi tải hóa đơn:', err);
    }
    setLoading(false);
  };

  const applyFilter = () => fetchOrders();

  const clearFilter = () => {
    setDateFrom('');
    setDateTo('');
    setTimeout(fetchOrders, 0);
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy hóa đơn này? Tồn kho sẽ được hoàn lại.')) return;
    setDeletingId(orderId);
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi hủy hóa đơn');
    }
    setDeletingId(null);
  };

  // Summary
  const summary = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);
    const totalCost = orders.reduce((s, o) => s + (Number(o.total_cost) || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const debtOrders = orders.filter(o => o.is_debt && !o.debt_paid).length;
    return { totalRevenue, totalCost, totalProfit, count: orders.length, debtOrders };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#a855f7', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#ec4899', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-primary)', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium">Đang tải hóa đơn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 4px 12px rgba(168,85,247,0.3)' }}>
            <ReceiptIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Lịch sử Hóa đơn</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{summary.count} hóa đơn</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card-themed p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Từ ngày</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-themed text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Đến ngày</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-themed text-sm" />
          </div>
          <button onClick={applyFilter} className="btn-primary flex items-center gap-1.5">
            <SearchIcon className="w-4 h-4" /> Lọc
          </button>
          {(dateFrom || dateTo) && (
            <button onClick={clearFilter} className="btn-secondary text-sm">Xóa bộ lọc</button>
          )}
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span style={{ color: 'var(--text-muted)' }}>
              Doanh thu: <strong style={{ color: 'var(--success)' }}>{formatPrice(summary.totalRevenue)}</strong>
            </span>
            {summary.totalProfit > 0 && (
              <span style={{ color: 'var(--text-muted)' }}>
                Lợi nhuận: <strong style={{ color: 'var(--brand-primary)' }}>{formatPrice(summary.totalProfit)}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Order list */}
      {orders.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <ReceiptIcon className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Chưa có hóa đơn nào</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            {dateFrom || dateTo ? 'Không tìm thấy hóa đơn trong khoảng thời gian đã chọn.' : 'Hóa đơn sẽ xuất hiện ở đây sau khi tính tiền.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {orders.map((order, idx) => {
            const isExpanded = expandedId === order.id;
            const profit = Number(order.total_price) - (Number(order.total_cost) || 0);
            const items = order.items || [];
            return (
              <div key={order.id}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  background: 'var(--card-bg)',
                  border: `1px solid ${isExpanded ? 'var(--card-hover-border)' : 'var(--card-border)'}`,
                  boxShadow: isExpanded ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  animationDelay: `${Math.min(idx * 0.02, 0.3)}s`,
                }}>
                {/* Order header row */}
                <div className="flex items-center gap-3 p-4 cursor-pointer group"
                     onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: order.is_debt ? 'var(--warning-bg)' : 'rgba(168,85,247,0.1)' }}>
                    <span className="text-xs font-bold" style={{ color: order.is_debt ? 'var(--warning)' : '#a855f7' }}>
                      #{order.id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{formatPrice(order.total_price)}</span>
                      {profit > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                              style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-light)' }}>
                          +{formatPrice(profit)}
                        </span>
                      )}
                      {order.is_debt && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                              style={{
                                background: order.debt_paid ? 'var(--success-bg)' : 'var(--warning-bg)',
                                color: order.debt_paid ? 'var(--success)' : 'var(--warning)',
                                border: order.debt_paid ? '1px solid var(--success-light)' : '1px solid var(--warning-light)',
                              }}>
                          {order.debt_paid ? 'Đã trả nợ' : 'Mua chịu'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />{formatDate(order.created_at)} {formatTime(order.created_at)}</span>
                      {order.customer && (
                        <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{order.customer.customer_name}</span>
                      )}
                      <span>{items.length} SP</span>
                    </p>
                  </div>
                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); cancelOrder(order.id); }}
                    disabled={deletingId === order.id}
                    title="Hủy hóa đơn"
                    className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
                    style={{ color: 'var(--danger)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {deletingId === order.id
                      ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                      : <TrashIcon />
                    }
                  </button>
                  <ChevronIcon className="w-4 h-4 transition-transform duration-200 flex-shrink-0"
                    style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>

                {/* Expanded items */}
                {isExpanded && items.length > 0 && (
                  <div className="px-5 pb-5 animate-slide-down">
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-secondary)' }}>
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: 'var(--bg-inset)' }}>
                            <th className="text-left py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Sản phẩm</th>
                            <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Giá bán</th>
                            <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>Giá vốn</th>
                            <th className="text-center py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>SL</th>
                            <th className="text-right py-2.5 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, i) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--border-secondary)' }}>
                              <td className="py-2.5 px-3">
                                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{item.product_name}</span>
                              </td>
                              <td className="py-2.5 px-3 text-right" style={{ color: 'var(--text-secondary)' }}>{formatPrice(item.price)}</td>
                              <td className="py-2.5 px-3 text-right hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>
                                {item.cost_price ? formatPrice(item.cost_price) : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-center" style={{ color: 'var(--text-secondary)' }}>{item.quantity}</td>
                              <td className="py-2.5 px-3 text-right font-bold" style={{ color: 'var(--text-primary)' }}>
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop: '2px solid var(--border-primary)' }}>
                            <td colSpan={3} className="py-2.5 px-3 text-right font-bold hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>Tổng cộng:</td>
                            <td colSpan={2} className="py-2.5 px-3 text-right font-bold sm:hidden" style={{ color: 'var(--text-secondary)' }}>Tổng:</td>
                            <td className="py-2.5 px-3 text-center" />
                            <td className="py-2.5 px-3 text-right font-bold text-base" style={{ color: 'var(--success)' }}>{formatPrice(order.total_price)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
