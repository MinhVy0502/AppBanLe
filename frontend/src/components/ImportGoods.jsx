import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';

/* ===================================================================
   SVG ICONS
   =================================================================== */
const TruckIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.149-.504 1.149-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-3.375m-7.5 0h7.5m-7.5 0l-1 3m8.5-3h2.375M16.5 6.75v3.75m0 0h2.375M16.5 10.5L15 14.25m1.5-7.5L15 3H5.625a1.125 1.125 0 00-1.125 1.125v9" />
  </svg>
);

const PackageIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChartIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const CalendarIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const CoinIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

/* ===================================================================
   HELPERS
   =================================================================== */
const formatCurrency = (n) => {
  return Number(n || 0).toLocaleString('vi-VN') + 'đ';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/* ===================================================================
   COMPONENT: ImportGoods
   =================================================================== */
export default function ImportGoods() {
  const [products, setProducts] = useState([]);
  const [imports, setImports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    product_id: '',
    supplier_name: '',
    quantity: '',
    unit_cost: '',
    note: '',
    import_date: new Date().toISOString().split('T')[0],
    unit_name: '',
    conversion_rate: 1,
  });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');

  // Tab
  const [activeSection, setActiveSection] = useState('list'); // 'list' | 'stats'

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ---- Fetch ----
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, importRes, statsRes] = await Promise.all([
        api.get('/products'),
        api.get('/imports'),
        api.get('/imports/stats'),
      ]);
      setProducts(prodRes.data);
      setImports(importRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // Khi chọn sản phẩm trong form nhập hàng
  const handleProductChange = (productId) => {
    const prod = products.find(p => String(p.id) === String(productId));
    if (!prod) {
      setForm(f => ({ ...f, product_id: '', unit_name: '', conversion_rate: 1, unit_cost: '' }));
      return;
    }
    // Mặc định ưu tiên chọn quy cách Thùng nếu có, hoặc quy cách đóng gói đầu tiên, hoặc đơn vị lẻ
    const thungUnit = (prod.units || []).find(u => u.unit_name.toLowerCase().includes('thùng') || u.is_default_import);
    const defaultUnit = thungUnit || (prod.units && prod.units.length > 0 ? prod.units[0] : null);

    if (defaultUnit) {
      setForm(f => ({
        ...f,
        product_id: productId,
        unit_name: defaultUnit.unit_name,
        conversion_rate: defaultUnit.conversion_rate,
        unit_cost: defaultUnit.cost_price ? String(defaultUnit.cost_price) : (Number(prod.cost_price || 0) * defaultUnit.conversion_rate ? String(Number(prod.cost_price || 0) * defaultUnit.conversion_rate) : ''),
      }));
    } else {
      setForm(f => ({
        ...f,
        product_id: productId,
        unit_name: prod.unit_type || 'cái',
        conversion_rate: 1,
        unit_cost: prod.cost_price ? String(prod.cost_price) : '',
      }));
    }
  };

  // ---- Handlers ----
  const createImport = async () => {
    const { product_id, quantity, unit_cost, unit_name, conversion_rate } = form;
    if (!product_id || !quantity || !unit_cost) {
      showToast('Vui lòng điền đầy đủ: sản phẩm, số lượng, giá nhập.', 'error');
      return;
    }
    setCreating(true);
    try {
      await api.post('/imports', {
        ...form,
        product_id: Number(product_id),
        quantity: Number(quantity),
        unit_cost: Number(unit_cost),
        unit_name: unit_name || null,
        conversion_rate: Number(conversion_rate) || 1,
      });
      showToast('Nhập hàng thành công!');
      setForm({
        product_id: '',
        supplier_name: '',
        quantity: '',
        unit_cost: '',
        note: '',
        import_date: new Date().toISOString().split('T')[0],
        unit_name: '',
        conversion_rate: 1,
      });
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.message || 'Lỗi khi nhập hàng.', 'error');
    }
    setCreating(false);
  };

  const deleteImport = async (id) => {
    if (!confirm('Xóa phiếu nhập này? Tồn kho sẽ bị trừ lại.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/imports/${id}`);
      showToast('Đã xóa phiếu nhập.');
      fetchAll();
    } catch (err) {
      showToast(err.message || 'Lỗi khi xóa.', 'error');
    }
    setDeletingId(null);
  };

  // ---- Computed ----
  const selectedProduct = useMemo(() => {
    return products.find(p => String(p.id) === String(form.product_id));
  }, [products, form.product_id]);

  const totalCostCalc = useMemo(() => {
    const q = Number(form.quantity) || 0;
    const u = Number(form.unit_cost) || 0;
    return q * u;
  }, [form.quantity, form.unit_cost]);

  const baseQuantityCalc = useMemo(() => {
    const q = Number(form.quantity) || 0;
    const r = Number(form.conversion_rate) || 1;
    return q * r;
  }, [form.quantity, form.conversion_rate]);

  const costPerBaseUnitCalc = useMemo(() => {
    const u = Number(form.unit_cost) || 0;
    const r = Number(form.conversion_rate) || 1;
    return r > 0 ? (u / r) : u;
  }, [form.unit_cost, form.conversion_rate]);

  const filteredImports = useMemo(() => {
    let list = imports;
    if (filterProduct) {
      list = list.filter(i => String(i.product_id) === filterProduct);
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(i =>
        (i.product?.product_name || '').toLowerCase().includes(s) ||
        (i.supplier_name || '').toLowerCase().includes(s) ||
        (i.note || '').toLowerCase().includes(s)
      );
    }
    if (filterFrom) {
      list = list.filter(i => i.import_date >= filterFrom);
    }
    if (filterTo) {
      list = list.filter(i => i.import_date <= filterTo);
    }
    return list;
  }, [imports, filterProduct, searchTerm, filterFrom, filterTo]);

  const filteredTotalCost = useMemo(() => {
    return filteredImports.reduce((s, i) => s + Number(i.total_cost || 0), 0);
  }, [filteredImports]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-primary)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--success)', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--warning)', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  /* ===================================================================
     RENDER
     =================================================================== */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
               style={{
                 background: toast.type === 'error' ? 'var(--danger-bg)' : 'var(--success-bg)',
                 color: toast.type === 'error' ? 'var(--danger)' : 'var(--success)',
                 border: `1px solid ${toast.type === 'error' ? 'var(--danger-light)' : 'var(--success-light)'}`,
               }}>
            {toast.type === 'error' ? (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            <span className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <TruckIcon className="w-5 h-5 text-white" />
              </div>
              Nhập hàng
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Quản lý nhập hàng và theo dõi chi phí từng đợt
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; }}
        >
          <PlusIcon className="w-4 h-4" />
          Nhập hàng mới
        </button>
      </div>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Tổng chi nhập hàng',
            value: formatCurrency(stats?.totalImportCost),
            icon: <CoinIcon className="w-5 h-5" />,
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
            shadowColor: 'rgba(245, 158, 11, 0.3)',
          },
          {
            label: 'Số đợt nhập',
            value: stats?.totalImports || 0,
            icon: <TruckIcon className="w-5 h-5" />,
            gradient: 'linear-gradient(135deg, #10b981, #059669)',
            shadowColor: 'rgba(16, 185, 129, 0.3)',
          },
          {
            label: 'Tổng SL đã nhập',
            value: (stats?.totalQuantityImported || 0).toLocaleString('vi-VN'),
            icon: <PackageIcon className="w-5 h-5" />,
            gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            shadowColor: 'rgba(99, 102, 241, 0.3)',
          },
          {
            label: 'Chi phí đợt lọc',
            value: formatCurrency(filteredTotalCost),
            icon: <ChartIcon className="w-5 h-5" />,
            gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
            shadowColor: 'rgba(236, 72, 153, 0.3)',
          },
        ].map((card, idx) => (
          <div key={idx} className="rounded-xl p-4 transition-all duration-200"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                   style={{ background: card.gradient, boxShadow: `0 4px 12px ${card.shadowColor}` }}>
                {card.icon}
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* ===== SECTION TABS ===== */}
      <div className="flex items-center gap-1 rounded-xl p-1 mb-6" style={{ background: 'var(--bg-inset)' }}>
        {[
          { id: 'list', label: 'Danh sách nhập', icon: <TruckIcon className="w-4 h-4" /> },
          { id: 'stats', label: 'Thống kê chi phí', icon: <ChartIcon className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer flex-1 justify-center"
            style={{
              background: activeSection === tab.id ? 'var(--bg-surface)' : 'transparent',
              color: activeSection === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeSection === tab.id ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== LIST SECTION ===== */}
      {activeSection === 'list' && (
        <div className="animate-fade-in">
          {/* Filters */}
          <div className="rounded-xl p-4 mb-4"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Tìm sản phẩm, NCC, ghi chú..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full py-2.5 input-themed text-sm"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
              {/* Product filter */}
              <select
                value={filterProduct}
                onChange={e => setFilterProduct(e.target.value)}
                className="w-full py-2.5 px-3 input-themed text-sm cursor-pointer"
              >
                <option value="">Tất cả sản phẩm</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.product_name}</option>
                ))}
              </select>
              {/* Date from */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <CalendarIcon />
                </span>
                <input
                  type="date"
                  value={filterFrom}
                  onChange={e => setFilterFrom(e.target.value)}
                  className="w-full py-2.5 input-themed text-sm"
                  style={{ paddingLeft: '2.25rem' }}
                  title="Từ ngày"
                />
              </div>
              {/* Date to */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  <CalendarIcon />
                </span>
                <input
                  type="date"
                  value={filterTo}
                  onChange={e => setFilterTo(e.target.value)}
                  className="w-full py-2.5 input-themed text-sm"
                  style={{ paddingLeft: '2.25rem' }}
                  title="Đến ngày"
                />
              </div>
            </div>
            {(searchTerm || filterProduct || filterFrom || filterTo) && (
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Tìm thấy <strong style={{ color: 'var(--text-primary)' }}>{filteredImports.length}</strong> phiếu nhập
                  {filteredTotalCost > 0 && <> • Tổng chi: <strong style={{ color: 'var(--warning)' }}>{formatCurrency(filteredTotalCost)}</strong></>}
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setFilterProduct(''); setFilterFrom(''); setFilterTo(''); }}
                  className="text-xs font-medium cursor-pointer transition-colors"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Import Table */}
          {filteredImports.length === 0 ? (
            <div className="rounded-xl p-12 text-center"
                 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                   style={{ background: 'var(--bg-inset)' }}>
                <TruckIcon className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Chưa có phiếu nhập nào</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nhấn "Nhập hàng mới" để bắt đầu</p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-secondary)' }}>
                      {['Sản phẩm', 'Nhà cung cấp', 'SL', 'Giá nhập', 'Tổng chi', 'Ngày nhập', 'Ghi chú', ''].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredImports.map((imp, idx) => (
                      <tr key={imp.id}
                          className="transition-colors duration-150"
                          style={{ borderBottom: idx < filteredImports.length - 1 ? '1px solid var(--border-secondary)' : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                 style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                              <PackageIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {imp.product?.product_name || `#${imp.product_id}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {imp.supplier_name || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold"
                                  style={{ background: 'var(--brand-bg)', color: 'var(--brand-primary)' }}>
                              +{imp.quantity} {imp.unit_name || imp.product?.unit_type || 'đơn vị'}
                            </span>
                            {((imp.conversion_rate && imp.conversion_rate > 1) || (imp.base_quantity && imp.base_quantity > imp.quantity)) && (
                              <div className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                (= {imp.base_quantity || (imp.quantity * imp.conversion_rate)} {imp.product?.unit_type || 'lẻ'})
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {formatCurrency(imp.unit_cost)}
                          {imp.unit_name && <span className="text-xs text-muted">/{imp.unit_name.toLowerCase()}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold" style={{ color: 'var(--warning)' }}>
                            {formatCurrency(imp.total_cost)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {formatDate(imp.import_date)}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-[150px] truncate" style={{ color: 'var(--text-muted)' }}>
                          {imp.note || '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => deleteImport(imp.id)}
                            disabled={deletingId === imp.id}
                            className="p-2 rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-bg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                            title="Xóa phiếu nhập"
                          >
                            {deletingId === imp.id ? (
                              <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                            ) : (
                              <TrashIcon />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
                {filteredImports.map(imp => (
                  <div key={imp.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                             style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                          <PackageIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                            {imp.product?.product_name || `#${imp.product_id}`}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {imp.supplier_name || 'Không có NCC'} • {formatDate(imp.import_date)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteImport(imp.id)}
                        disabled={deletingId === imp.id}
                        className="p-1.5 rounded-lg cursor-pointer"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold"
                            style={{ background: 'var(--brand-bg)', color: 'var(--brand-primary)' }}>
                        +{imp.quantity} {imp.unit_name || imp.product?.unit_type || 'đơn vị'}
                      </span>
                      {imp.conversion_rate > 1 && (
                        <span className="text-xs text-muted">
                          (= {imp.base_quantity || (imp.quantity * imp.conversion_rate)} {imp.product?.unit_type || 'lẻ'})
                        </span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>× {formatCurrency(imp.unit_cost)}</span>
                      <span className="text-xs font-bold ml-auto" style={{ color: 'var(--warning)' }}>{formatCurrency(imp.total_cost)}</span>
                    </div>
                    {imp.note && (
                      <p className="text-xs mt-2 italic" style={{ color: 'var(--text-muted)' }}>{imp.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== STATS SECTION ===== */}
      {activeSection === 'stats' && stats && (
        <div className="animate-fade-in">
          <div className="rounded-xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <ChartIcon className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              Chi phí nhập hàng theo tháng
            </h3>

            {/* Chart bars */}
            <div className="space-y-3">
              {stats.monthlyData.map((m, idx) => {
                const maxCost = Math.max(...stats.monthlyData.map(d => d.cost), 1);
                const pct = (m.cost / maxCost) * 100;
                const [year, month] = m.month.split('-');
                const monthLabel = `T${parseInt(month)}/${year}`;

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-16 text-right flex-shrink-0"
                          style={{ color: 'var(--text-muted)' }}>
                      {monthLabel}
                    </span>
                    <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'var(--bg-inset)' }}>
                      <div
                        className="h-full rounded-lg flex items-center px-2 transition-all duration-500"
                        style={{
                          width: `${Math.max(pct, m.cost > 0 ? 3 : 0)}%`,
                          background: m.cost > 0 ? 'linear-gradient(90deg, #10b981, #059669)' : 'transparent',
                        }}
                      >
                        {m.cost > 0 && (
                          <span className="text-xs font-bold text-white whitespace-nowrap">
                            {formatCurrency(m.cost)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs w-12 text-right flex-shrink-0"
                          style={{ color: m.count > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                      {m.count} đợt
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary row */}
            <div className="mt-6 pt-4 flex flex-wrap gap-6" style={{ borderTop: '1px solid var(--border-secondary)' }}>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tổng chi 12 tháng</p>
                <p className="text-lg font-bold" style={{ color: 'var(--warning)' }}>{formatCurrency(stats.totalImportCost)}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tổng đợt nhập</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalImports}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tổng SL nhập</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{(stats.totalQuantityImported || 0).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Chi trung bình / đợt</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalImports > 0 ? formatCurrency(stats.totalImportCost / stats.totalImports) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL — NHẬP HÀNG MỚI ===== */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
             style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
             onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-in-up"
               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-primary)', boxShadow: 'var(--shadow-xl)' }}
               onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
                 style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <TruckIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Nhập hàng mới</h2>
              </div>
              <button onClick={() => setShowModal(false)}
                      className="p-2 rounded-lg transition-colors cursor-pointer"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Product */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Sản phẩm <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <select
                  value={form.product_id}
                  onChange={e => handleProductChange(e.target.value)}
                  className="w-full py-2.5 px-3 input-themed text-sm cursor-pointer"
                >
                  <option value="">— Chọn sản phẩm —</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.product_name} (Kho: {p.stock} {p.unit_type || ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Đơn vị nhập hàng */}
              {selectedProduct && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Đơn vị nhập hàng <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <select
                    value={`${form.unit_name || ''}_${form.conversion_rate || 1}`}
                    onChange={(e) => {
                      const [uName, uRateStr] = e.target.value.split('_');
                      const rate = Number(uRateStr) || 1;
                      const matchingUnit = (selectedProduct.units || []).find(u => u.unit_name === uName);
                      setForm(f => ({
                        ...f,
                        unit_name: uName,
                        conversion_rate: rate,
                        unit_cost: matchingUnit && matchingUnit.cost_price ? String(matchingUnit.cost_price) : f.unit_cost,
                      }));
                    }}
                    className="w-full py-2.5 px-3 input-themed text-sm cursor-pointer font-medium"
                  >
                    {/* Packaging units first */}
                    {(selectedProduct.units || []).map(u => (
                      <option key={u.id || u.unit_name} value={`${u.unit_name}_${u.conversion_rate}`}>
                        📦 {u.unit_name} (1 {u.unit_name.toLowerCase()} = {u.conversion_rate} {selectedProduct.unit_type || 'lẻ'})
                        {u.cost_price > 0 ? ` — Giá nhập gợi ý: ${formatCurrency(u.cost_price)}` : ''}
                      </option>
                    ))}
                    {/* Base unit */}
                    <option value={`${selectedProduct.unit_type || 'cái'}_1`}>
                      🔹 {selectedProduct.unit_type || 'Đơn vị lẻ'} (Đơn vị lẻ cơ sở)
                      {selectedProduct.cost_price > 0 ? ` — Giá vốn: ${formatCurrency(selectedProduct.cost_price)}` : ''}
                    </option>
                  </select>
                </div>
              )}

              {/* Quantity & Unit cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Số lượng ({form.unit_name || selectedProduct?.unit_type || 'đơn vị'}) <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    placeholder="VD: 10"
                    className="w-full py-2.5 px-3 input-themed text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Giá nhập / 1 {form.unit_name || selectedProduct?.unit_type || 'đơn vị'} <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.unit_cost}
                    onChange={e => setForm(f => ({ ...f, unit_cost: e.target.value }))}
                    placeholder="VD: 216000"
                    className="w-full py-2.5 px-3 input-themed text-sm"
                  />
                </div>
              </div>

              {/* Total cost & Conversion preview */}
              {totalCostCalc > 0 && (
                <div className="rounded-xl p-3.5 space-y-1.5 animate-fade-in"
                     style={{ background: 'var(--success-bg)', border: '1px solid var(--success-light)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>Tổng chi phí nhập:</span>
                    <span className="text-lg font-bold" style={{ color: 'var(--success)' }}>{formatCurrency(totalCostCalc)}</span>
                  </div>
                  <div className="text-xs pt-2 border-t flex flex-wrap items-center justify-between gap-2"
                       style={{ borderColor: 'var(--success-light)', color: 'var(--text-secondary)' }}>
                    <span>
                      👉 Tồn kho nhận: <strong style={{ color: 'var(--text-primary)' }}>+{baseQuantityCalc} {selectedProduct?.unit_type || 'đơn vị lẻ'}</strong>
                    </span>
                    {Number(form.conversion_rate) > 1 && (
                      <span>
                        Giá vốn quy đổi: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(costPerBaseUnitCalc)} / {selectedProduct?.unit_type || 'đơn vị'}</strong>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Nhà cung cấp
                </label>
                <input
                  type="text"
                  value={form.supplier_name}
                  onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))}
                  placeholder="VD: Đại lý Minh Phát"
                  className="w-full py-2.5 px-3 input-themed text-sm"
                />
              </div>

              {/* Import date */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Ngày nhập
                </label>
                <input
                  type="date"
                  value={form.import_date}
                  onChange={e => setForm(f => ({ ...f, import_date: e.target.value }))}
                  className="w-full py-2.5 px-3 input-themed text-sm"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Ghi chú
                </label>
                <textarea
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  placeholder="VD: Nhập thêm do sắp Tết..."
                  rows={2}
                  className="w-full py-2.5 px-3 input-themed text-sm resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4"
                 style={{ borderTop: '1px solid var(--border-secondary)' }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-inset)' }}
              >
                Hủy
              </button>
              <button
                onClick={createImport}
                disabled={creating || !form.product_id || !form.quantity || !form.unit_cost}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  <>
                    <PlusIcon />
                    Nhập hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
