import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';

/* ===================================================================
   SVG ICONS
   =================================================================== */
const UsersIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const PhoneIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);
const CurrencyIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);
const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const PencilIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ClockIcon = ({ className = 'w-3.5 h-3.5' }) => (
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

/* ===================================================================
   COMPONENT: Customers
   =================================================================== */
export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form, setForm] = useState({ customer_name: '', phone: '', notes: '' });
  const [saving, setSaving] = useState(false);

  // Pay debt modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payCustomer, setPayCustomer] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paying, setPaying] = useState(false);

  // Detail panel
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) { console.error('Lỗi:', err); }
    setLoading(false);
  };

  const openAdd = () => { setEditingCustomer(null); setForm({ customer_name: '', phone: '', notes: '' }); setShowModal(true); };
  const openEdit = (c) => { setEditingCustomer(c); setForm({ customer_name: c.customer_name, phone: c.phone || '', notes: c.notes || '' }); setShowModal(true); };

  const saveCustomer = async () => {
    if (!form.customer_name.trim()) return;
    setSaving(true);
    try {
      if (editingCustomer) {
        const res = await api.put(`/customers/${editingCustomer.id}`, form);
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? res.data : c));
        if (selectedCustomer?.id === editingCustomer.id) setSelectedCustomer(res.data);
      } else {
        const res = await api.post('/customers', form);
        setCustomers(prev => [...prev, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi lưu khách hàng');
    }
    setSaving(false);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khách hàng này?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
      if (selectedCustomer?.id === id) { setSelectedCustomer(null); setCustomerOrders([]); }
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi xóa khách hàng');
    }
    setDeletingId(null);
  };

  const viewHistory = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingOrders(true);
    try {
      const res = await api.get(`/customers/${customer.id}/history`);
      setCustomerOrders(res.data.orders || []);
    } catch (err) { console.error('Lỗi:', err); }
    setLoadingOrders(false);
  };

  const openPayDebt = (c) => { setPayCustomer(c); setPayAmount(String(Number(c.total_debt))); setShowPayModal(true); };

  const handlePayDebt = async () => {
    if (!payAmount || Number(payAmount) <= 0) return;
    setPaying(true);
    try {
      const res = await api.post(`/customers/${payCustomer.id}/pay-debt`, { amount: Number(payAmount) });
      setCustomers(prev => prev.map(c => c.id === payCustomer.id ? res.data : c));
      if (selectedCustomer?.id === payCustomer.id) setSelectedCustomer(res.data);
      setShowPayModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thanh toán nợ');
    }
    setPaying(false);
  };

  // Summary
  const totalDebt = useMemo(() => customers.reduce((s, c) => s + Number(c.total_debt), 0), [customers]);
  const debtCustomers = useMemo(() => customers.filter(c => Number(c.total_debt) > 0).length, [customers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-primary)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#a855f7', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#ec4899', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium">Đang tải...</p>
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
               style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            <UsersIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Khách hàng</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {customers.length} khách • {debtCustomers > 0 && <span style={{ color: 'var(--warning)' }}>{debtCustomers} đang nợ</span>}
              {totalDebt > 0 && <span className="ml-1" style={{ color: 'var(--danger)' }}>• Tổng nợ: {formatPrice(totalDebt)}</span>}
            </p>
          </div>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer"
          style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <PlusIcon /> Thêm khách hàng
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Customer list */}
        <div className="flex-1 min-w-0">
          {customers.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <UsersIcon className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Chưa có khách hàng</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Bấm "Thêm khách hàng" để bắt đầu.</p>
            </div>
          ) : (
            <div className="space-y-2.5 animate-fade-in">
              {customers.map((c) => {
                const hasDebt = Number(c.total_debt) > 0;
                const isSelected = selectedCustomer?.id === c.id;
                return (
                  <div key={c.id}
                    onClick={() => viewHistory(c)}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer group/cust"
                    style={{
                      background: isSelected ? 'var(--brand-light)' : 'var(--card-bg)',
                      border: `1px solid ${isSelected ? 'var(--brand-primary)' : 'var(--card-border)'}`,
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    }}
                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--card-hover-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}}
                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: hasDebt ? 'var(--warning-bg)' : 'var(--brand-light)' }}>
                      <UserIcon className="w-5 h-5" style={{ color: hasDebt ? 'var(--warning)' : 'var(--brand-primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.customer_name}</p>
                      <p className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {c.phone && <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" />{c.phone}</span>}
                        <span className="flex items-center gap-1"><ClockIcon />{formatDate(c.created_at)}</span>
                      </p>
                    </div>
                    {/* Debt badge */}
                    {hasDebt ? (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Nợ</p>
                        <p className="font-bold text-sm" style={{ color: 'var(--danger)' }}>{formatPrice(c.total_debt)}</p>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium flex-shrink-0" style={{ color: 'var(--success)' }}>
                        <CheckIcon className="w-3.5 h-3.5" /> Hết nợ
                      </span>
                    )}
                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover/cust:opacity-100 transition-all flex-shrink-0">
                      {hasDebt && (
                        <button onClick={(e) => { e.stopPropagation(); openPayDebt(c); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-light)' }}>
                          Thu nợ
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <PencilIcon />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteCustomer(c.id); }}
                        disabled={deletingId === c.id}
                        className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        style={{ color: 'var(--danger)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {deletingId === c.id
                          ? <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                          : <TrashIcon />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedCustomer && (
          <div className="w-full lg:w-[400px] flex-shrink-0 animate-slide-up">
            <div className="card-themed sticky top-20 overflow-hidden">
              <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))' }}>
                <h3 className="font-bold text-white text-lg">{selectedCustomer.customer_name}</h3>
                <p className="text-white/60 text-sm mt-0.5">{selectedCustomer.phone || 'Chưa có SĐT'}</p>
                {Number(selectedCustomer.total_debt) > 0 && (
                  <div className="mt-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <span className="text-white/80 text-sm">Tổng nợ</span>
                    <span className="text-white font-bold text-lg">{formatPrice(selectedCustomer.total_debt)}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Lịch sử mua hàng</h4>
                {loadingOrders ? (
                  <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>Đang tải...</p>
                ) : customerOrders.length === 0 ? (
                  <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>Chưa có hóa đơn</p>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {customerOrders.map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-inset)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                             style={{ background: o.is_debt ? 'var(--warning-bg)' : 'rgba(168,85,247,0.1)' }}>
                          <span className="text-[10px] font-bold" style={{ color: o.is_debt ? 'var(--warning)' : '#a855f7' }}>#{o.id}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formatPrice(o.total_price)}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(o.created_at)} {formatTime(o.created_at)}
                          </p>
                        </div>
                        {o.is_debt && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold"
                                style={{
                                  background: o.debt_paid ? 'var(--success-bg)' : 'var(--warning-bg)',
                                  color: o.debt_paid ? 'var(--success)' : 'var(--warning)',
                                }}>
                            {o.debt_paid ? 'Đã trả' : 'Nợ'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====== MODAL THÊM/SỬA KHÁCH HÀNG ====== */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 modal-overlay" />
          <div className="relative rounded-2xl w-full max-w-md overflow-hidden animate-modal-in"
               style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
               onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingCustomer ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Tên khách hàng <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input type="text" value={form.customer_name}
                  onChange={e => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="VD: Anh Minh, Chị Lan..." autoFocus className="w-full input-themed" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Số điện thoại</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="VD: 0912345678" className="w-full input-themed" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Ghi chú</label>
                <textarea value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ghi chú thêm (tùy chọn)"
                  rows={2} className="w-full input-themed resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-end gap-2.5"
                 style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-inset)' }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Hủy</button>
              <button onClick={saveCustomer} disabled={saving || !form.customer_name.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? 'Đang lưu...' : (editingCustomer ? 'Cập nhật' : 'Thêm')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ====== MODAL THANH TOÁN NỢ ====== */}
      {showPayModal && payCustomer && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setShowPayModal(false)}>
          <div className="absolute inset-0 modal-overlay" />
          <div className="relative rounded-2xl w-full max-w-sm overflow-hidden animate-modal-in"
               style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
               onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Thu nợ</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Khách: <strong style={{ color: 'var(--text-secondary)' }}>{payCustomer.customer_name}</strong>
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl"
                   style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-light)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>Tổng nợ hiện tại</span>
                <span className="text-lg font-bold" style={{ color: 'var(--danger)' }}>{formatPrice(payCustomer.total_debt)}</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Số tiền thanh toán (₫) <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input type="number" min="1" max={Number(payCustomer.total_debt)}
                  value={payAmount} onChange={e => setPayAmount(e.target.value)}
                  className="w-full input-themed text-lg font-bold" autoFocus />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPayAmount(String(Number(payCustomer.total_debt)))}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-light)' }}>
                  Trả hết
                </button>
                <button onClick={() => setPayAmount(String(Math.round(Number(payCustomer.total_debt) / 2)))}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-lighter)' }}>
                  Trả nửa
                </button>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-end gap-2.5"
                 style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-inset)' }}>
              <button onClick={() => setShowPayModal(false)} className="btn-secondary">Hủy</button>
              <button onClick={handlePayDebt} disabled={paying || !payAmount || Number(payAmount) <= 0}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
                {paying ? 'Đang xử lý...' : `Xác nhận thu ${payAmount ? formatPrice(Number(payAmount)) : ''}`}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
