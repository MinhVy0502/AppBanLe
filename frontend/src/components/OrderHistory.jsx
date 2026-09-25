import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import ThermalReceipt from './common/ThermalReceipt';
import { exportOrdersToExcel } from '../utils/excelExport';

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

export default function OrderHistory({ store: propStore }) {
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(propStore || null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [printingOrder, setPrintingOrder] = useState(null);

  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (propStore) setStore(propStore);
  }, [propStore]);

  useEffect(() => {
    fetchOrders();
    api.get('/profile').then(res => {
      const s = res?.data || res;
      if (s && s.id) setStore(s);
    }).catch(() => {});
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders?limit=200';
      if (dateFrom) url += `&from=${dateFrom}`;
      if (dateTo) url += `&to=${dateTo}`;
      const res = await api.get(url);
      setOrders(res.data?.data || res.data || []);
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

  const handlePrintOrder = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
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
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#3b82f6', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#10b981', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-primary)', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-semibold text-xs">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto pb-24 lg:pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            <ReceiptIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Lịch sử Hóa đơn</h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{summary.count} hóa đơn đã tạo</p>
          </div>
        </div>

        {/* Revenue Badges */}
        <div
          className="flex items-center gap-3 p-2.5 rounded-2xl border border-secondary text-xs card-themed"
          style={{ background: 'var(--bg-inset)' }}
        >
          <div>
            <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Doanh thu:</span>
            <strong className="text-emerald-400 font-bold text-xs sm:text-sm">{formatPrice(summary.totalRevenue)}</strong>
          </div>
          <div className="w-[1px] h-6" style={{ background: 'var(--border-secondary)' }} />
          <div>
            <span className="block text-[10px]" style={{ color: 'var(--text-muted)' }}>Lợi nhuận:</span>
            <strong className="text-indigo-400 font-bold text-xs sm:text-sm">{formatPrice(summary.totalProfit)}</strong>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card-themed p-3.5 sm:p-4 mb-5 rounded-3xl border border-secondary shadow-sm">
        <div className="grid grid-cols-2 sm:flex sm:items-end gap-2.5">
          <div className="col-span-1">
            <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Từ ngày</label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="input-themed w-full py-2 px-2.5 text-xs rounded-xl font-medium"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Đến ngày</label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="input-themed w-full py-2 px-2.5 text-xs rounded-xl font-medium"
            />
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 flex-wrap sm:flex-nowrap pt-1 sm:pt-0">
            <button
              type="button"
              onClick={applyFilter}
              className="btn-primary flex-1 sm:flex-initial py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SearchIcon className="w-3.5 h-3.5" /> Lọc
            </button>
            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={clearFilter}
                className="btn-secondary py-2 px-3 text-xs font-bold rounded-xl cursor-pointer"
              >
                Xóa lọc
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (orders.length === 0) {
                  alert('Không có đơn hàng nào để xuất Excel.');
                  return;
                }
                exportOrdersToExcel(orders, {
                  storeName: store?.store_name || 'CỬA HÀNG BÁN LẺ',
                  fromDate: dateFrom,
                  toDate: dateTo,
                });
              }}
              className="flex-1 sm:flex-initial py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-all sm:ml-auto"
              title="Xuất Báo cáo Doanh thu ra file Excel chuẩn Mẫu S1-HKD"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6" />
              </svg>
              <span>Xuất Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Order list */}
      {orders.length === 0 ? (
        <div className="card-themed p-12 text-center rounded-3xl border border-secondary">
          <ReceiptIcon className="w-14 h-14 mx-auto mb-3 opacity-30 text-muted" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Chưa có hóa đơn nào</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Hóa đơn sẽ tự động lưu vào đây sau mỗi lần thanh toán.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const profit = Number(order.total_price) - (Number(order.total_cost) || 0);
            const items = order.items || [];
            const isTransfer = order.payment_method === 'transfer';

            return (
              <div
                key={order.id}
                className="card-themed rounded-2xl overflow-hidden border border-secondary shadow-sm transition-all"
              >
                {/* Header row */}
                <div
                  className="p-3.5 flex items-center gap-3 cursor-pointer group hover:bg-surface-hover"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{
                      background: order.is_debt
                        ? 'rgba(245, 158, 11, 0.15)'
                        : isTransfer
                        ? 'rgba(14, 165, 233, 0.15)'
                        : 'rgba(16, 185, 129, 0.15)',
                      color: order.is_debt ? '#f59e0b' : isTransfer ? '#0ea5e9' : '#10b981',
                    }}
                  >
                    #{order.id}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
                        {formatPrice(order.total_price)}
                      </span>

                      {/* Payment Method Badge */}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{
                          background: order.is_debt
                            ? 'rgba(245, 158, 11, 0.12)'
                            : isTransfer
                            ? 'rgba(14, 165, 233, 0.12)'
                            : 'rgba(16, 185, 129, 0.12)',
                          color: order.is_debt ? '#f59e0b' : isTransfer ? '#0ea5e9' : '#10b981',
                        }}
                      >
                        {order.is_debt
                          ? (order.debt_paid ? 'Đã trả nợ' : 'Mua chịu (Nợ)')
                          : isTransfer
                          ? '📱 VietQR'
                          : '💵 Tiền mặt'}
                      </span>

                      {profit > 0 && (
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          +{formatPrice(profit)}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-muted flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {formatDate(order.created_at)} {formatTime(order.created_at)}
                      </span>
                      {order.customer && (
                        <span className="flex items-center gap-1 font-semibold text-secondary">
                          <UserIcon className="w-3 h-3" />
                          {order.customer.customer_name}
                        </span>
                      )}
                      <span>• {items.length} mặt hàng</span>
                    </p>
                  </div>

                  {/* Actions (Print & Delete) */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handlePrintOrder(order)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="In hóa đơn (K80)"
                    >
                      🖨️
                    </button>

                    <button
                      type="button"
                      onClick={() => cancelOrder(order.id)}
                      disabled={deletingId === order.id}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Hủy đơn & Hoàn kho"
                    >
                      {deletingId === order.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <TrashIcon className="w-4 h-4" />
                      )}
                    </button>

                    <ChevronIcon
                      className={`w-4 h-4 text-muted transition-transform duration-200 ml-1 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Item Breakdown */}
                {isExpanded && items.length > 0 && (
                  <div className="px-4 pb-4 pt-1 border-t border-secondary animate-slide-down">
                    <div className="rounded-xl overflow-hidden border border-secondary" style={{ background: 'var(--bg-inset)' }}>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-secondary text-muted text-[10px] font-bold">
                            <th className="text-left py-2 px-3">Sản phẩm</th>
                            <th className="text-center py-2 px-2">SL</th>
                            <th className="text-right py-2 px-3">Đơn giá</th>
                            <th className="text-right py-2 px-3">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, i) => (
                            <tr key={i} className="border-b border-secondary/50">
                              <td className="py-2 px-3">
                                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {item.product_name}
                                </span>
                                {item.unit_name && (
                                  <span className="ml-1 text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-1 py-0.2 rounded">
                                    {item.unit_name}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-2 text-center font-bold">{item.quantity}</td>
                              <td className="py-2 px-3 text-right text-muted">{formatPrice(item.price)}</td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-500">
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden Thermal Receipt for Print */}
      <ThermalReceipt order={printingOrder} store={store} />
    </div>
  );
}
