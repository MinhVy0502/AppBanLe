import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

/* ===================================================================
   ICONS
   =================================================================== */
const AlertIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const CalendarIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
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

const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArchiveIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

/* ===================================================================
   HELPERS
   =================================================================== */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const daysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

const getDaysLabel = (days) => {
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return 'Hết hạn hôm nay';
  if (days === 1) return 'Còn 1 ngày';
  return `Còn ${days} ngày`;
};

const getDaysBadge = (days) => {
  if (days < 0) return 'bg-red-100 text-red-700 border-red-200';
  if (days <= 7) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (days <= 30) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

/* ===================================================================
   COMPONENT: Inventory
   =================================================================== */
export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal thêm lô
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchForm, setBatchForm] = useState({
    product_id: '', batch_code: '', manufacturing_date: '', expiry_date: '', quantity: '',
  });
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [deletingBatchId, setDeletingBatchId] = useState(null);

  // Tab
  const [activeSection, setActiveSection] = useState('alerts'); // 'alerts' | 'batches'

  // ---- Fetch ----
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, batchRes, alertRes] = await Promise.all([
        api.get('/products'),
        api.get('/batches'),
        api.get('/batches/alerts'),
      ]);
      setProducts(prodRes.data);
      setBatches(batchRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // ---- Handlers ----
  const createBatch = async () => {
    const { product_id, expiry_date, quantity } = batchForm;
    if (!product_id || !expiry_date) return;
    setCreatingBatch(true);
    try {
      const res = await api.post('/batches', {
        ...batchForm,
        product_id: Number(product_id),
        quantity: quantity ? Number(quantity) : 0,
      });
      setBatches((prev) => [...prev, res.data]);
      setBatchForm({ product_id: '', batch_code: '', manufacturing_date: '', expiry_date: '', quantity: '' });
      setShowBatchModal(false);
      // Refresh alerts
      const alertRes = await api.get('/batches/alerts');
      setAlerts(alertRes.data);
    } catch (err) {
      console.error('Lỗi thêm lô:', err);
    }
    setCreatingBatch(false);
  };

  const deleteBatch = async (batchId) => {
    setDeletingBatchId(batchId);
    try {
      await api.delete(`/batches/${batchId}`);
      setBatches((prev) => prev.filter((b) => b.id !== batchId));
      const alertRes = await api.get('/batches/alerts');
      setAlerts(alertRes.data);
    } catch (err) {
      console.error('Lỗi xóa lô:', err);
    }
    setDeletingBatchId(null);
  };

  // ---- Alert counts ----
  const alertCounts = useMemo(() => {
    if (!alerts) return { expired: 0, soon: 0, month: 0, lowStock: 0, total: 0 };
    const expired = alerts.expired?.length || 0;
    const soon = alerts.expiringSoon?.length || 0;
    const month = alerts.expiringMonth?.length || 0;
    const lowStock = alerts.lowStock?.length || 0;
    return { expired, soon, month, lowStock, total: expired + soon + month + lowStock };
  }, [alerts]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse-dot" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-gray-400 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ---- Render alert item ----
  const renderBatchAlert = (batch, type) => {
    const days = daysUntil(batch.expiry_date);
    return (
      <div
        key={batch.id}
        className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group/alert animate-fade-in"
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          type === 'expired' ? 'bg-red-100' : type === 'soon' ? 'bg-orange-100' : 'bg-amber-100'
        }`}>
          {type === 'expired'
            ? <AlertIcon className={`w-4.5 h-4.5 text-red-500`} />
            : <ClockIcon className={`w-4.5 h-4.5 ${type === 'soon' ? 'text-orange-500' : 'text-amber-500'}`} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {batch.product?.product_name || 'Sản phẩm'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {batch.batch_code ? `Lô: ${batch.batch_code} • ` : ''}
            HSD: {formatDate(batch.expiry_date)} • SL: {batch.quantity}
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${getDaysBadge(days)}`}>
          {getDaysLabel(days)}
        </span>
        <button
          onClick={() => deleteBatch(batch.id)}
          disabled={deletingBatchId === batch.id}
          title="Xóa lô"
          className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center opacity-0 group-hover/alert:opacity-100 transition-all cursor-pointer flex-shrink-0"
        >
          {deletingBatchId === batch.id
            ? <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
            : <TrashIcon className="w-3.5 h-3.5 text-red-400" />
          }
        </button>
      </div>
    );
  };

  const renderLowStockItem = (product) => (
    <div
      key={product.id}
      className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all animate-fade-in"
    >
      <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
        <PackageIcon className="w-4.5 h-4.5 text-sky-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{product.product_name}</p>
        <p className="text-xs text-gray-400 mt-0.5">Giá: {new Intl.NumberFormat('vi-VN').format(product.price)} ₫</p>
      </div>
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${
        product.stock === 0 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-sky-100 text-sky-700 border-sky-200'
      }`}>
        {product.stock === 0 ? 'Hết hàng' : `Còn ${product.stock}`}
      </span>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-200">
            <ArchiveIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lô hàng & Cảnh báo</h1>
            <p className="text-sm text-gray-400">
              {batches.length} lô hàng •
              {alertCounts.total > 0
                ? <span className="text-red-500 font-medium ml-1">{alertCounts.total} cảnh báo</span>
                : <span className="text-emerald-500 font-medium ml-1">Không có cảnh báo</span>
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Section toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveSection('alerts')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeSection === 'alerts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertIcon className="w-4 h-4" />
              <span>Cảnh báo</span>
              {alertCounts.total > 0 && (
                <span className="ml-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                  {alertCounts.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection('batches')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeSection === 'batches' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Lô hàng</span>
            </button>
          </div>

          <button
            onClick={() => setShowBatchModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm lô
          </button>
        </div>
      </div>

      {/* ==================== ALERTS SECTION ==================== */}
      {activeSection === 'alerts' && (
        <div className="space-y-6 animate-fade-in">
          {alertCounts.total === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-1">Không có cảnh báo nào</h3>
              <p className="text-sm text-gray-400">Tất cả sản phẩm và lô hàng đều trong trạng thái tốt.</p>
            </div>
          ) : (
            <>
              {/* Hàng đã hết hạn */}
              {alerts.expired?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <h2 className="font-bold text-red-600 text-sm uppercase tracking-wide">
                      Đã hết hạn ({alerts.expired.length})
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {alerts.expired.map((b) => renderBatchAlert(b, 'expired'))}
                  </div>
                </div>
              )}

              {/* Sắp hết hạn - 7 ngày */}
              {alerts.expiringSoon?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <h2 className="font-bold text-orange-600 text-sm uppercase tracking-wide">
                      Sắp hết hạn — 7 ngày ({alerts.expiringSoon.length})
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {alerts.expiringSoon.map((b) => renderBatchAlert(b, 'soon'))}
                  </div>
                </div>
              )}

              {/* Sắp hết hạn - 30 ngày */}
              {alerts.expiringMonth?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <h2 className="font-bold text-amber-600 text-sm uppercase tracking-wide">
                      Cần lưu ý — 30 ngày ({alerts.expiringMonth.length})
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {alerts.expiringMonth.map((b) => renderBatchAlert(b, 'month'))}
                  </div>
                </div>
              )}

              {/* Tồn kho thấp */}
              {alerts.lowStock?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <h2 className="font-bold text-sky-600 text-sm uppercase tracking-wide">
                      Tồn kho thấp ≤ 5 ({alerts.lowStock.length})
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {alerts.lowStock.map(renderLowStockItem)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ==================== BATCHES LIST ==================== */}
      {activeSection === 'batches' && (
        <div className="animate-fade-in">
          {batches.length === 0 ? (
            <div className="text-center py-20">
              <CalendarIcon className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-1">Chưa có lô hàng nào</h3>
              <p className="text-sm text-gray-300">Bấm "Thêm lô" để theo dõi hạn sử dụng sản phẩm.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {batches.map((batch) => {
                const days = daysUntil(batch.expiry_date);
                return (
                  <div
                    key={batch.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group/batch"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      days < 0 ? 'bg-red-100' : days <= 7 ? 'bg-orange-100' : days <= 30 ? 'bg-amber-100' : 'bg-emerald-100'
                    }`}>
                      <CalendarIcon className={`w-5 h-5 ${
                        days < 0 ? 'text-red-500' : days <= 7 ? 'text-orange-500' : days <= 30 ? 'text-amber-500' : 'text-emerald-500'
                      }`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {batch.product?.product_name || 'Sản phẩm'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {batch.batch_code ? `Lô: ${batch.batch_code}` : 'Không có mã lô'}
                        {batch.manufacturing_date ? ` • NSX: ${formatDate(batch.manufacturing_date)}` : ''}
                      </p>
                    </div>

                    {/* HSD */}
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-xs text-gray-400">Hạn sử dụng</p>
                      <p className="font-semibold text-gray-700 text-sm">{formatDate(batch.expiry_date)}</p>
                    </div>

                    {/* Quantity */}
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-xs text-gray-400">Số lượng</p>
                      <p className="font-semibold text-gray-700">{batch.quantity}</p>
                    </div>

                    {/* Days badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex-shrink-0 ${getDaysBadge(days)}`}>
                      {getDaysLabel(days)}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => deleteBatch(batch.id)}
                      disabled={deletingBatchId === batch.id}
                      title="Xóa lô"
                      className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover/batch:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
                    >
                      {deletingBatchId === batch.id
                        ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        : <TrashIcon className="w-4 h-4 text-red-400" />
                      }
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== MODAL THÊM LÔ HÀNG ==================== */}
      {showBatchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowBatchModal(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-md">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Thêm lô hàng</h3>
                    <p className="text-sm text-gray-400">Nhập thông tin lô & hạn sử dụng</p>
                  </div>
                </div>
                <button onClick={() => setShowBatchModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <XIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Chọn sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sản phẩm <span className="text-red-400">*</span>
                </label>
                <select
                  value={batchForm.product_id}
                  onChange={(e) => setBatchForm({ ...batchForm, product_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all bg-white"
                >
                  <option value="">— Chọn sản phẩm —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.product_name}</option>
                  ))}
                </select>
              </div>

              {/* Mã lô */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã lô (tùy chọn)</label>
                <input
                  type="text"
                  value={batchForm.batch_code}
                  onChange={(e) => setBatchForm({ ...batchForm, batch_code: e.target.value })}
                  placeholder="VD: LOT-2025-001"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                />
              </div>

              {/* NSX + HSD */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày SX</label>
                  <input
                    type="date"
                    value={batchForm.manufacturing_date}
                    onChange={(e) => setBatchForm({ ...batchForm, manufacturing_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Hạn SD <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={batchForm.expiry_date}
                    onChange={(e) => setBatchForm({ ...batchForm, expiry_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Số lượng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng</label>
                <input
                  type="number"
                  min="0"
                  value={batchForm.quantity}
                  onChange={(e) => setBatchForm({ ...batchForm, quantity: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm transition-all"
                />
              </div>

              {/* Preview HSD */}
              {batchForm.expiry_date && (
                <div className={`flex items-center gap-2 p-3 rounded-xl border animate-fade-in ${getDaysBadge(daysUntil(batchForm.expiry_date))}`}>
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{getDaysLabel(daysUntil(batchForm.expiry_date))}</span>
                  <span className="text-xs ml-auto">{formatDate(batchForm.expiry_date)}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-end gap-2.5">
              <button
                onClick={() => { setShowBatchModal(false); setBatchForm({ product_id: '', batch_code: '', manufacturing_date: '', expiry_date: '', quantity: '' }); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={createBatch}
                disabled={creatingBatch || !batchForm.product_id || !batchForm.expiry_date}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-semibold shadow-md shadow-red-200 hover:shadow-lg hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {creatingBatch ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang thêm...
                  </span>
                ) : (
                  'Thêm lô hàng'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
