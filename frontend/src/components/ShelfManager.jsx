import { useState, useEffect } from 'react';
import api from '../services/api';

/* ===================================================================
   BẢNG MÀU CHO KỆ HÀNG — mỗi kệ được gán một theme màu khác nhau
   =================================================================== */
const THEMES = [
  {
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    light: 'bg-violet-50', border: 'border-violet-300',
    ring: 'ring-violet-400/40', text: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    iconBg: 'bg-violet-100', iconText: 'text-violet-600',
  },
  {
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    light: 'bg-emerald-50', border: 'border-emerald-300',
    ring: 'ring-emerald-400/40', text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100', iconText: 'text-emerald-600',
  },
  {
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    light: 'bg-amber-50', border: 'border-amber-300',
    ring: 'ring-amber-400/40', text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    iconBg: 'bg-amber-100', iconText: 'text-amber-600',
  },
  {
    gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
    light: 'bg-rose-50', border: 'border-rose-300',
    ring: 'ring-rose-400/40', text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    iconBg: 'bg-rose-100', iconText: 'text-rose-600',
  },
  {
    gradient: 'bg-gradient-to-br from-sky-500 to-blue-600',
    light: 'bg-sky-50', border: 'border-sky-300',
    ring: 'ring-sky-400/40', text: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    iconBg: 'bg-sky-100', iconText: 'text-sky-600',
  },
  {
    gradient: 'bg-gradient-to-br from-indigo-500 to-violet-600',
    light: 'bg-indigo-50', border: 'border-indigo-300',
    ring: 'ring-indigo-400/40', text: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
    iconBg: 'bg-indigo-100', iconText: 'text-indigo-600',
  },
];

/* ===================================================================
   INLINE SVG ICONS
   =================================================================== */
const FolderIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

const FolderOpenIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
  </svg>
);

const PackageIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const PlusIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const XIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const InboxIcon = ({ className = 'w-12 h-12' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>
);

/* ===================================================================
   HELPER FUNCTIONS
   =================================================================== */
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

/* Quy cách đóng gói — labels & helpers */
const UNIT_LABELS = { le: 'Lẻ', loc: 'Lốc', thung: 'Thùng', hop: 'Hộp' };
const UNIT_ICONS  = { le: '🧴', loc: '📦', thung: '📦', hop: '📦' };
const UNIT_DESCS  = { le: '1 cái / 1 gói / 1 lon', loc: 'VD: Lốc 6 lon', thung: 'VD: Thùng 24 gói', hop: 'VD: Hộp 10 bao' };
const getUnitBadge = (p) => {
  if (!p.unit_type || p.unit_type === 'le') return null;
  const label = UNIT_LABELS[p.unit_type] || 'Lẻ';
  const qty = p.units_per_pack > 1 ? ` ${p.units_per_pack}` : '';
  return `${UNIT_ICONS[p.unit_type]} ${label}${qty}`;
};

/** Kiểm tra shelf có phải ngành hàng nước ngọt không (dựa vào tên kệ) */
const isSoftDrinkShelf = (shelfName) => {
  if (!shelfName) return false;
  return shelfName.toLowerCase().includes('nước ngọt');
};

/* ===================================================================
   COMPONENT CHÍNH: ShelfManager
   =================================================================== */
export default function ShelfManager() {
  // ---- State ----
  const [shelves, setShelves] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeShelfId, setActiveShelfId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [showNewShelfForm, setShowNewShelfForm] = useState(false);
  const [creatingShelf, setCreatingShelf] = useState(false);

  // -- Thêm / Xóa sản phẩm --
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({ product_name: '', price: '', stock: '', unit_type: 'le', units_per_pack: '' });
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingShelfId, setDeletingShelfId] = useState(null);

  // ---- Derived data ----
  const getProductsOnShelf = (shelfId) => allProducts.filter((p) => p.shelf_id === shelfId);
  const unassignedProducts = allProducts.filter((p) => p.shelf_id === null);
  const activeShelf = shelves.find((s) => s.id === activeShelfId);
  const activeThemeIndex = activeShelf ? shelves.indexOf(activeShelf) % THEMES.length : 0;
  const activeTheme = THEMES[activeThemeIndex];

  // ---- Fetch data ----
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shelvesRes, productsRes] = await Promise.all([
        api.get('/shelves'),
        api.get('/products'),
      ]);
      setShelves(shelvesRes.data);
      setAllProducts(productsRes.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // ---- Handlers ----
  const toggleShelf = (id) => {
    setActiveShelfId((prev) => (prev === id ? null : id));
  };

  const openAddModal = () => {
    setSelectedIds(new Set());
    setShowAddModal(true);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === unassignedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(unassignedProducts.map((p) => p.id)));
    }
  };

  const assignProducts = async () => {
    if (selectedIds.size === 0) return;
    setSaving(true);
    try {
      const promises = [...selectedIds].map((productId) =>
        api.put(`/products/${productId}/assign-shelf`, { shelf_id: activeShelfId })
      );
      await Promise.all(promises);
      // Cập nhật state ngay (optimistic update)
      setAllProducts((prev) =>
        prev.map((p) => (selectedIds.has(p.id) ? { ...p, shelf_id: activeShelfId } : p))
      );
      setShowAddModal(false);
    } catch (err) {
      console.error('Lỗi gán sản phẩm:', err);
    }
    setSaving(false);
  };

  const removeFromShelf = async (productId) => {
    try {
      await api.put(`/products/${productId}/assign-shelf`, { shelf_id: null });
      setAllProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, shelf_id: null } : p))
      );
    } catch (err) {
      console.error('Lỗi gỡ sản phẩm:', err);
    }
  };

  const createShelf = async () => {
    if (!newShelfName.trim()) return;
    setCreatingShelf(true);
    try {
      const res = await api.post('/shelves', { shelf_name: newShelfName.trim() });
      setShelves((prev) => [...prev, res.data]);
      setNewShelfName('');
      setShowNewShelfForm(false);
    } catch (err) {
      console.error('Lỗi tạo kệ:', err);
    }
    setCreatingShelf(false);
  };

  // ---- Thêm sản phẩm mới ----
  const createProduct = async () => {
    const { product_name, price, stock, unit_type, units_per_pack } = productForm;
    if (!product_name.trim() || price === '' || Number(price) < 0) return;
    setCreatingProduct(true);
    try {
      const res = await api.post('/products', {
        product_name: product_name.trim(),
        price: Number(price),
        stock: stock !== '' ? Number(stock) : 0,
        unit_type: unit_type || 'le',
        units_per_pack: unit_type !== 'le' && units_per_pack ? Number(units_per_pack) : 1,
      });
      setAllProducts((prev) => [...prev, res.data]);
      setProductForm({ product_name: '', price: '', stock: '', unit_type: 'le', units_per_pack: '' });
      setShowProductModal(false);
    } catch (err) {
      console.error('Lỗi thêm sản phẩm:', err);
    }
    setCreatingProduct(false);
  };

  // ---- Xóa sản phẩm ----
  const deleteProduct = async (productId) => {
    setDeletingId(productId);
    try {
      await api.delete(`/products/${productId}`);
      setAllProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err);
    }
    setDeletingId(null);
  };

  // ---- Xóa kệ hàng ----
  const deleteShelf = async (shelfId, e) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xóa kệ này? Sản phẩm trên kệ sẽ chuyển về trạng thái chưa xếp kệ.')) return;
    setDeletingShelfId(shelfId);
    try {
      await api.delete(`/shelves/${shelfId}`);
      setShelves((prev) => prev.filter((s) => s.id !== shelfId));
      setAllProducts((prev) => prev.map((p) => p.shelf_id === shelfId ? { ...p, shelf_id: null } : p));
      if (activeShelfId === shelfId) setActiveShelfId(null);
    } catch (err) {
      console.error('Lỗi xóa kệ:', err);
    }
    setDeletingShelfId(null);
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse-dot" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-gray-400 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <FolderIcon className="w-5 h-5 text-white" />
            </span>
            Quản lý Kệ hàng
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
            {shelves.length} kệ hàng • {allProducts.length} sản phẩm •{' '}
            <span className="text-amber-600 font-medium">{unassignedProducts.length} chưa xếp kệ</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowProductModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm sản phẩm
          </button>
          <button
            onClick={() => setShowNewShelfForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm kệ mới
          </button>
        </div>
      </div>

      {/* ============ FORM TẠO KỆ MỚI (conditional) ============ */}
      {showNewShelfForm && (
        <div className="mb-6 animate-slide-down">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Tạo kệ hàng mới</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createShelf()}
                placeholder="Nhập tên kệ (VD: Kệ Bánh Kẹo, Kệ Nước Ngọt...)"
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
              />
              <button
                onClick={createShelf}
                disabled={creatingShelf || !newShelfName.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {creatingShelf ? 'Đang tạo...' : 'Tạo'}
              </button>
              <button
                onClick={() => { setShowNewShelfForm(false); setNewShelfName(''); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ EMPTY STATE ============ */}
      {shelves.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <InboxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Chưa có kệ hàng nào</h3>
          <p className="text-gray-400 text-sm">Bấm "Thêm kệ mới" để bắt đầu sắp xếp sản phẩm.</p>
        </div>
      )}

      {/* ==================== SHELF GRID ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {shelves.map((shelf, index) => {
          const theme = THEMES[index % THEMES.length];
          const products = getProductsOnShelf(shelf.id);
          const isActive = activeShelfId === shelf.id;

          return (
            <div
              key={shelf.id}
              onClick={() => toggleShelf(shelf.id)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden
                border-2 transition-all duration-300 ease-out group
                ${isActive
                  ? `${theme.border} ring-4 ${theme.ring} scale-[1.02] shadow-xl`
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-1 shadow-sm'
                }
                bg-white
              `}
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 ${theme.gradient}`} />

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-center gap-3.5 mb-3">
                  {/* Folder icon */}
                  <div className={`w-11 h-11 rounded-xl ${theme.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                    {isActive
                      ? <FolderOpenIcon className="w-5.5 h-5.5 text-white" />
                      : <FolderIcon className="w-5.5 h-5.5 text-white" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-[0.95rem]">
                      {shelf.shelf_name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {products.length} sản phẩm
                    </p>
                  </div>
                  {/* Delete shelf button */}
                  <button
                    onClick={(e) => deleteShelf(shelf.id, e)}
                    disabled={deletingShelfId === shelf.id}
                    title="Xóa kệ hàng"
                    className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
                  >
                    {deletingShelfId === shelf.id
                      ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                      : <TrashIcon className="w-4 h-4 text-red-400" />
                    }
                  </button>
                  {/* Expand indicator */}
                  <ChevronIcon
                    className={`w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-all duration-300 flex-shrink-0 ${isActive ? 'rotate-180 text-gray-500' : ''}`}
                  />
                </div>

                {/* Preview badges: hiển thị 3 sản phẩm đầu tiên */}
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {products.slice(0, 3).map((p) => (
                      <span
                        key={p.id}
                        className={`text-xs px-2.5 py-1 rounded-lg ${theme.badge} font-medium truncate max-w-[160px]`}
                      >
                        {p.product_name}
                        {getUnitBadge(p) && <span className="ml-1 opacity-70">{getUnitBadge(p)}</span>}
                      </span>
                    ))}
                    {products.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-500 font-medium">
                        +{products.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {products.length === 0 && (
                  <p className="text-xs text-gray-300 italic">Chưa có sản phẩm</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== SẢN PHẨM CHƯA XẾP KỆ ==================== */}
      {unassignedProducts.length > 0 && (
        <div className="mt-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <PackageIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sản phẩm chưa xếp kệ</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
              {unassignedProducts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unassignedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group/unassigned"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <PackageIcon className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {product.product_name}
                    {getUnitBadge(product) && (
                      <span className="ml-1.5 inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                        {getUnitBadge(product)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatPrice(product.price)} • Tồn: {product.stock}
                  </p>
                </div>
                <button
                  onClick={() => deleteProduct(product.id)}
                  disabled={deletingId === product.id}
                  title="Xóa sản phẩm"
                  className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover/unassigned:opacity-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  {deletingId === product.id
                    ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    : <TrashIcon className="w-4 h-4 text-red-400" />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== EXPANDED SHELF PANEL ==================== */}
      {activeShelf && (
        <div className="mt-6 animate-shelf-open">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            {/* Panel header */}
            <div className={`px-6 py-4 ${activeTheme.gradient} flex items-center justify-between`}>
              <div className="flex items-center gap-3 text-white">
                <FolderOpenIcon className="w-6 h-6" />
                <h2 className="text-lg font-bold">{activeShelf.shelf_name}</h2>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-sm font-medium">
                  {getProductsOnShelf(activeShelfId).length} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openAddModal(); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  Thêm SP vào kệ
                </button>
                <button
                  onClick={() => setActiveShelfId(null)}
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Product list */}
            <div className="p-5">
              {getProductsOnShelf(activeShelfId).length === 0 ? (
                /* Empty shelf */
                <div className="text-center py-12">
                  <PackageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium mb-1">Kệ hàng trống</p>
                  <p className="text-sm text-gray-300">
                    Bấm "Thêm SP vào kệ" để đưa sản phẩm lên kệ này.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {getProductsOnShelf(activeShelfId).map((product, i) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors group/item animate-fade-in"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl ${activeTheme.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <PackageIcon className={`w-5 h-5 ${activeTheme.iconText}`} />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.product_name}
                          {getUnitBadge(product) && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                              {getUnitBadge(product)}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">{formatPrice(product.price)}</p>
                      </div>
                      {/* Stock */}
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="text-xs text-gray-400">Tồn kho</p>
                        <p className="font-semibold text-gray-700">{product.stock}</p>
                      </div>
                      {/* Remove from shelf */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromShelf(product.id); }}
                        title="Gỡ khỏi kệ"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer flex-shrink-0"
                      >
                        Gỡ kệ
                      </button>
                      {/* Delete product */}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                        disabled={deletingId === product.id}
                        title="Xóa sản phẩm"
                        className="w-9 h-9 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
                      >
                        {deletingId === product.id
                          ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          : <TrashIcon className="w-4 h-4 text-red-400" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD PRODUCTS MODAL ==================== */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Thêm sản phẩm vào kệ
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Kệ: <span className={`font-semibold ${activeTheme.text}`}>{activeShelf?.shelf_name}</span>
                {' • '}{unassignedProducts.length} sản phẩm chưa xếp kệ
              </p>
            </div>

            {/* Select all */}
            {unassignedProducts.length > 0 && (
              <div className="px-6 py-3 border-b border-gray-50 bg-gray-50/60">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={selectedIds.size === unassignedProducts.length}
                    onChange={selectAll}
                  />
                  <span className="font-medium text-sm text-gray-600">
                    Chọn tất cả ({unassignedProducts.length})
                  </span>
                </label>
              </div>
            )}

            {/* Product list */}
            <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
              {unassignedProducts.length === 0 ? (
                <div className="text-center py-14 px-6">
                  <PackageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">Không có sản phẩm nào chưa xếp kệ</p>
                  <p className="text-sm text-gray-300 mt-1">Tất cả sản phẩm đều đã được gán vào kệ.</p>
                </div>
              ) : (
                <div className="p-3 space-y-1">
                  {unassignedProducts.map((product) => {
                    const isChecked = selectedIds.has(product.id);
                    return (
                      <label
                        key={product.id}
                        className={`
                          flex items-center gap-4 p-3.5 rounded-xl cursor-pointer
                          transition-all duration-150 select-none
                          ${isChecked
                            ? 'bg-indigo-50/80 ring-1 ring-indigo-200'
                            : 'hover:bg-gray-50'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          className="checkbox-custom"
                          checked={isChecked}
                          onChange={() => toggleSelect(product.id)}
                        />
                        <PackageIcon className={`w-5 h-5 flex-shrink-0 ${isChecked ? 'text-indigo-500' : 'text-gray-300'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isChecked ? 'text-indigo-900' : 'text-gray-700'}`}>
                            {product.product_name}
                          </p>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {formatPrice(product.price)} • Tồn: {product.stock}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-400">
                Đã chọn: <span className="font-bold text-indigo-600">{selectedIds.size}</span>
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={assignProducts}
                  disabled={selectedIds.size === 0 || saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang lưu...
                    </span>
                  ) : (
                    `Xác nhận (${selectedIds.size})`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM SẢN PHẨM MỚI ==================== */}
      {showProductModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowProductModal(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <PackageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Thêm sản phẩm mới</h3>
                  <p className="text-sm text-gray-400">Nhập thông tin sản phẩm bên dưới</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên sản phẩm <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={productForm.product_name}
                  onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                  placeholder="VD: Mì Hảo Hảo, Coca Cola..."
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                />
              </div>

              {/* Giá + Tồn kho */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Giá bán (₫) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* ===== Quy cách đóng gói ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Quy cách đóng gói
                </label>
                <select
                  value={productForm.unit_type}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProductForm({
                      ...productForm,
                      unit_type: val,
                      units_per_pack: val === 'le' ? '' : (productForm.units_per_pack || (val === 'loc' ? '6' : val === 'hop' ? '10' : '24')),
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all bg-white cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px', paddingRight: '40px' }}
                >
                  <option value="le">🧴 Lẻ — 1 cái / 1 gói / 1 lon</option>
                  {activeShelf && isSoftDrinkShelf(activeShelf.shelf_name) && (
                    <option value="loc">📦 Lốc — VD: Lốc 6 lon (chỉ Nước ngọt)</option>
                  )}
                  <option value="thung">📦 Thùng — VD: Thùng 24 gói</option>
                  <option value="hop">📦 Hộp — VD: Hộp 10 bao (thuốc lá...)</option>
                </select>

                {/* Input số lượng lẻ trong gói — chỉ hiện khi KHÔNG phải Lẻ */}
                {productForm.unit_type !== 'le' && (
                  <div className="mt-3 animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Số lượng lẻ trong 1 {UNIT_LABELS[productForm.unit_type].toLowerCase()}
                      <span className="text-red-400"> *</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={productForm.units_per_pack}
                        onChange={(e) => setProductForm({ ...productForm, units_per_pack: e.target.value })}
                        placeholder={productForm.unit_type === 'loc' ? '6' : productForm.unit_type === 'hop' ? '10' : '24'}
                        className="w-28 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                      />
                      <span className="text-sm text-gray-400">
                        đơn vị lẻ / {UNIT_LABELS[productForm.unit_type].toLowerCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview giá */}
              {productForm.price && Number(productForm.price) > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 animate-fade-in">
                  <span className="text-sm text-emerald-600">Giá hiển thị:</span>
                  <span className="font-bold text-emerald-700">
                    {formatPrice(Number(productForm.price))}
                    {productForm.unit_type !== 'le' && (
                      <span className="font-normal text-emerald-500 ml-1">
                        / {UNIT_LABELS[productForm.unit_type].toLowerCase()}
                        {productForm.units_per_pack ? ` ${productForm.units_per_pack}` : ''}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40 flex items-center justify-end gap-2.5">
              <button
                onClick={() => { setShowProductModal(false); setProductForm({ product_name: '', price: '', stock: '', unit_type: 'le', units_per_pack: '' }); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={createProduct}
                disabled={creatingProduct || !productForm.product_name.trim() || productForm.price === '' || Number(productForm.price) < 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {creatingProduct ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang thêm...
                  </span>
                ) : (
                  'Thêm sản phẩm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
