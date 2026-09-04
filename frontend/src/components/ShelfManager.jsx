import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';

/* ===================================================================
   BẢNG MÀU CHO KỆ HÀNG — mỗi kệ được gán một theme màu khác nhau
   =================================================================== */
const THEMES = [
  { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', light: 'rgba(139,92,246,0.1)', color: '#8b5cf6', lightColor: '#a78bfa' },
  { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', light: 'rgba(16,185,129,0.1)', color: '#10b981', lightColor: '#34d399' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)', light: 'rgba(245,158,11,0.1)', color: '#f59e0b', lightColor: '#fbbf24' },
  { gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)', light: 'rgba(244,63,94,0.1)', color: '#f43f5e', lightColor: '#fb7185' },
  { gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', light: 'rgba(14,165,233,0.1)', color: '#0ea5e9', lightColor: '#38bdf8' },
  { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', light: 'rgba(99,102,241,0.1)', color: '#6366f1', lightColor: '#818cf8' },
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

const PencilIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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
const UNIT_LABELS = {
  lon: 'Lon', chai: 'Chai', goi: 'Gói', hop: 'Hộp', bich: 'Bịch', bo: 'Bó', hu: 'Hũ',
  cai: 'Cái', dieu: 'Điếu', vien: 'Viên', cuon: 'Cuộn', cay: 'Cây', day: 'Dây',
  thung: 'Thùng', loc: 'Lốc', vi: 'Vỉ', bao: 'Bao', ket: 'Két', le: 'Lẻ',
};
const getBaseUnitLabel = (type) => UNIT_LABELS[type] || type || 'Đơn vị';
const getUnitBadge = (p) => {
  if (!p) return null;
  return getBaseUnitLabel(p.unit_type);
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

  // -- Thêm / Sửa / Xóa sản phẩm --
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    product_name: '',
    price: '',
    cost_price: '',
    stock: '',
    stock_input_mode: 'base', // 'base' | 'pack'
    stock_pack_quantity: '',
    unit_type: 'lon',
    allow_retail: true,
    units: [],
  });
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
  useEffect(() => { fetchData(); }, []);

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
  const toggleShelf = (id) => setActiveShelfId((prev) => (prev === id ? null : id));
  const openAddModal = () => { setSelectedIds(new Set()); setShowAddModal(true); };
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

  const addUnitPreset = (unitName, rate) => {
    setProductForm((prev) => ({
      ...prev,
      units: [
        ...prev.units,
        {
          unit_name: unitName,
          conversion_rate: String(rate),
          price: '',
          cost_price: '',
          barcode: '',
        },
      ],
    }));
  };

  const updateUnitField = (index, field, value) => {
    setProductForm((prev) => {
      const next = [...prev.units];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, units: next };
    });
  };

  const removeUnitRow = (index) => {
    setProductForm((prev) => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index),
    }));
  };

  const createProduct = async () => {
    const { product_name, price, cost_price, stock, stock_input_mode, stock_pack_quantity, unit_type, allow_retail, units } = productForm;
    if (!product_name.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }

    const validUnits = (units || [])
      .filter(u => u.unit_name && u.unit_name.trim() && Number(u.conversion_rate) > 1)
      .map(u => ({
        unit_name: u.unit_name.trim(),
        conversion_rate: Number(u.conversion_rate),
        price: Number(u.price) || 0,
        cost_price: u.cost_price !== '' && u.cost_price !== undefined ? Number(u.cost_price) : 0,
        barcode: u.barcode ? u.barcode.trim() : null,
      }));

    if (!allow_retail && validUnits.length === 0 && (price === '' || Number(price) < 0)) {
      alert('Sản phẩm chỉ bán sỉ / nguyên kiện cần có ít nhất một quy cách (ví dụ: Thùng 24).');
      return;
    }

    if (allow_retail && (price === '' || Number(price) < 0)) {
      alert('Vui lòng nhập giá bán lẻ hợp lệ.');
      return;
    }

    let finalPrice = Number(price);
    if (!allow_retail && (!price || Number(price) <= 0) && validUnits.length > 0) {
      finalPrice = validUnits[0].price / validUnits[0].conversion_rate;
    }
    if (isNaN(finalPrice) || finalPrice < 0) finalPrice = 0;

    let finalCostPrice = cost_price !== '' ? Number(cost_price) : 0;
    if (!allow_retail && (!cost_price || Number(cost_price) <= 0) && validUnits.length > 0 && validUnits[0].cost_price > 0) {
      finalCostPrice = validUnits[0].cost_price / validUnits[0].conversion_rate;
    }

    let finalStock = 0;
    if (stock_input_mode === 'pack' && validUnits.length > 0 && stock_pack_quantity !== '') {
      finalStock = Number(stock_pack_quantity) * validUnits[0].conversion_rate;
    } else if (stock !== '') {
      finalStock = Number(stock);
    }

    setCreatingProduct(true);
    try {
      const payload = {
        product_name: product_name.trim(),
        price: finalPrice,
        cost_price: finalCostPrice,
        stock: finalStock,
        unit_type: unit_type ? String(unit_type).trim().toLowerCase() : 'lon',
        units_per_pack: 1,
        allow_retail: allow_retail !== undefined ? allow_retail : true,
        units: validUnits,
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct.id}`, payload);
        const updated = res.data?.data || res.data;
        setAllProducts((prev) => prev.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const res = await api.post('/products', payload);
        const created = res.data?.data || res.data;
        setAllProducts((prev) => [...prev, created]);
      }
      setProductForm({
        product_name: '',
        price: '',
        cost_price: '',
        stock: '',
        stock_input_mode: 'base',
        stock_pack_quantity: '',
        unit_type: 'lon',
        allow_retail: true,
        units: [],
      });
      setEditingProduct(null);
      setShowProductModal(false);
    } catch (err) {
      console.error('Lỗi lưu sản phẩm:', err);
      alert(err.response?.data?.message || 'Lỗi lưu sản phẩm');
    }
    setCreatingProduct(false);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    const mainUnit = product.units && product.units.length > 0 ? product.units[0] : null;
    const isOnlyPack = product.allow_retail === false;
    setProductForm({
      product_name: product.product_name,
      price: String(product.price),
      cost_price: product.cost_price ? String(product.cost_price) : '',
      stock: String(product.stock),
      stock_input_mode: isOnlyPack && mainUnit ? 'pack' : 'base',
      stock_pack_quantity: mainUnit && mainUnit.conversion_rate > 1
        ? String(Math.floor(Number(product.stock) / mainUnit.conversion_rate))
        : '',
      unit_type: product.unit_type || 'lon',
      allow_retail: product.allow_retail !== undefined ? product.allow_retail : true,
      units: (product.units || []).map(u => ({
        unit_name: u.unit_name,
        conversion_rate: String(u.conversion_rate),
        price: u.price !== undefined ? String(u.price) : '',
        cost_price: u.cost_price ? String(u.cost_price) : '',
        barcode: u.barcode || '',
      })),
    });
    setShowProductModal(true);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      product_name: '',
      price: '',
      cost_price: '',
      stock: '',
      stock_input_mode: 'base',
      stock_pack_quantity: '',
      unit_type: 'lon',
      allow_retail: true,
      units: [],
    });
    setShowProductModal(true);
  };

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
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-gradient-from)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-gradient-to)', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#ec4899', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <span className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              <FolderIcon className="w-5 h-5 text-white" />
            </span>
            Quản lý Kệ hàng
          </h1>
          <p className="mt-1.5 text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            {shelves.length} kệ hàng • {allProducts.length} sản phẩm •{' '}
            <span className="font-medium" style={{ color: 'var(--warning)' }}>{unassignedProducts.length} chưa xếp kệ</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddProduct}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.25)'; }}
          >
            <PlusIcon className="w-4 h-4" /> Thêm sản phẩm
          </button>
          <button
            onClick={() => setShowNewShelfForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.25)'; }}
          >
            <PlusIcon className="w-4 h-4" /> Thêm kệ mới
          </button>
        </div>
      </div>

      {/* ============ FORM TẠO KỆ MỚI ============ */}
      {showNewShelfForm && (
        <div className="mb-6 animate-slide-down">
          <div className="card-themed p-5">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Tạo kệ hàng mới</h3>
            <div className="flex gap-3">
              <input
                type="text" value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createShelf()}
                placeholder="Nhập tên kệ (VD: Kệ Bánh Kẹo, Kệ Nước Ngọt...)"
                autoFocus className="flex-1 input-themed"
              />
              <button onClick={createShelf} disabled={creatingShelf || !newShelfName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {creatingShelf ? 'Đang tạo...' : 'Tạo'}
              </button>
              <button onClick={() => { setShowNewShelfForm(false); setNewShelfName(''); }}
                className="btn-secondary">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ EMPTY STATE ============ */}
      {shelves.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <InboxIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Chưa có kệ hàng nào</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Bấm "Thêm kệ mới" để bắt đầu sắp xếp sản phẩm.</p>
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
              className="relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-out group"
              style={{
                background: 'var(--card-bg)',
                border: isActive ? `2px solid ${theme.color}` : '2px solid var(--card-border)',
                boxShadow: isActive ? `0 0 0 3px ${theme.light}, var(--shadow-lg)` : 'var(--shadow-sm)',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--card-hover-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'scale(1)'; }}}
            >
              {/* Gradient top bar */}
              <div className="h-1.5" style={{ background: theme.gradient }} />

              {/* Card body */}
              <div className="p-5">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                       style={{ background: theme.gradient }}>
                    {isActive
                      ? <FolderOpenIcon className="w-5 h-5 text-white" />
                      : <FolderIcon className="w-5 h-5 text-white" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate text-[0.95rem]" style={{ color: 'var(--text-primary)' }}>
                      {shelf.shelf_name}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {products.length} sản phẩm
                    </p>
                  </div>
                  {/* Delete shelf */}
                  <button
                    onClick={(e) => deleteShelf(shelf.id, e)}
                    disabled={deletingShelfId === shelf.id}
                    title="Xóa kệ hàng"
                    className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
                    style={{ color: 'var(--danger)', border: '1px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.borderColor = 'var(--danger-light)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    {deletingShelfId === shelf.id
                      ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                      : <TrashIcon className="w-4 h-4" />
                    }
                  </button>
                  {/* Expand indicator */}
                  <ChevronIcon
                    className="w-5 h-5 transition-all duration-300 flex-shrink-0"
                    style={{
                      color: isActive ? 'var(--text-tertiary)' : 'var(--text-muted)',
                      transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </div>

                {/* Preview badges */}
                {products.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {products.slice(0, 3).map((p) => (
                      <span key={p.id} className="text-xs px-2.5 py-1 rounded-lg font-medium truncate max-w-[160px]"
                            style={{ background: theme.light, color: theme.color }}>
                        {p.product_name}
                        {getUnitBadge(p) && <span style={{ opacity: 0.7 }} className="ml-1">{getUnitBadge(p)}</span>}
                      </span>
                    ))}
                    {products.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded-lg font-medium"
                            style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)' }}>
                        +{products.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {products.length === 0 && (
                  <p className="text-xs italic" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>Chưa có sản phẩm</p>
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                 style={{ background: 'linear-gradient(135deg, var(--warning), #ea580c)' }}>
              <PackageIcon className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Sản phẩm chưa xếp kệ</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              {unassignedProducts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unassignedProducts.map((product) => (
              <div key={product.id}
                className="flex items-center gap-3 p-4 rounded-xl transition-all group/unassigned"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--card-hover-border)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--warning-bg)' }}>
                  <PackageIcon className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                    {product.product_name}
                    {product.allow_retail === false ? (
                      <span className="ml-1.5 inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning-light)' }}>
                        Chỉ bán sỉ / thùng
                      </span>
                    ) : (
                      <span className="ml-1.5 inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-lighter)' }}>
                        {getBaseUnitLabel(product.unit_type)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {product.allow_retail === false && product.units?.length > 0
                      ? `${formatPrice(product.units[0].price)} / ${product.units[0].unit_name} • Tồn: ${Math.floor(product.stock / product.units[0].conversion_rate)} ${product.units[0].unit_name}`
                      : `${formatPrice(product.price)} • Tồn: ${product.stock} ${getBaseUnitLabel(product.unit_type)}`
                    }
                  </p>
                  {Array.isArray(product.units) && product.units.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      {product.units.map((u, ui) => (
                        <span key={ui} className="text-[10px] px-1.5 py-0.2 rounded font-medium"
                              style={{ background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid var(--info-light)' }}>
                          {u.unit_name} ({u.conversion_rate}): {formatPrice(u.price)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteProduct(product.id)}
                  disabled={deletingId === product.id}
                  title="Xóa sản phẩm"
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover/unassigned:opacity-100 transition-all cursor-pointer disabled:opacity-50"
                  style={{ color: 'var(--danger)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {deletingId === product.id
                    ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                    : <TrashIcon className="w-4 h-4" />
                  }
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SHELF DETAIL MODAL ==================== */}
      {activeShelf && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 animate-fade-in" onClick={() => setActiveShelfId(null)}>
          <div className="absolute inset-0 modal-overlay" />
          <div className="relative rounded-2xl w-full sm:max-w-2xl overflow-hidden animate-modal-in flex flex-col max-h-[92vh] sm:max-h-[85vh]"
               style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
               onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0"
                 style={{ background: activeTheme.gradient }}>
              <div className="flex items-center gap-2 sm:gap-3 text-white min-w-0 flex-1 mr-2">
                <FolderOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-bold truncate">{activeShelf.shelf_name}</h2>
                <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 whitespace-nowrap">
                  {getProductsOnShelf(activeShelfId).length} SP
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); openAddModal(); }}
                  className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Thêm SP vào kệ</span><span className="sm:hidden">Thêm SP</span>
                </button>
                <button
                  onClick={() => setActiveShelfId(null)}
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Product list — scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5" style={{ WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
              {getProductsOnShelf(activeShelfId).length === 0 ? (
                <div className="text-center py-12">
                  <PackageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                  <p className="font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Kệ hàng trống</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                    Bấm "Thêm SP" để đưa sản phẩm lên kệ này.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getProductsOnShelf(activeShelfId).map((product, i) => (
                    <div
                      key={product.id}
                      className="rounded-xl transition-colors group/item animate-fade-in"
                      style={{ background: 'var(--bg-inset)', animationDelay: `${i * 0.04}s` }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                    >
                      {/* Product info row */}
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0"
                             style={{ background: activeTheme.light }}>
                          <PackageIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: activeTheme.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base" style={{ color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: '1.4' }}>
                            {product.product_name}
                            {product.allow_retail === false ? (
                              <span className="ml-1.5 sm:ml-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md"
                                    style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning-light)' }}>
                                Chỉ bán sỉ / thùng
                              </span>
                            ) : (
                              <span className="ml-1.5 sm:ml-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md"
                                    style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-lighter)' }}>
                                {getBaseUnitLabel(product.unit_type)}
                              </span>
                            )}
                          </p>
                          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {product.allow_retail === false && product.units?.length > 0
                              ? `${formatPrice(product.units[0].price)} / ${product.units[0].unit_name}`
                              : formatPrice(product.price)
                            }
                            <span className="sm:hidden ml-2" style={{ color: 'var(--text-muted)' }}>• Tồn: {product.stock}</span>
                          </p>
                          {Array.isArray(product.units) && product.units.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap mt-1">
                              {product.units.map((u, ui) => (
                                <span key={ui} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                      style={{ background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid var(--info-light)' }}>
                                  {u.unit_name} ({u.conversion_rate}): {formatPrice(u.price)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 hidden sm:block">
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tồn kho</p>
                          <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{product.stock}</p>
                        </div>
                        {/* Desktop action buttons — show on hover */}
                        <div className="hidden sm:flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditProduct(product); }}
                            title="Sửa sản phẩm"
                            className="px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer flex-shrink-0 flex items-center gap-1"
                            style={{ color: 'var(--brand-primary)', background: 'var(--brand-light)', border: '1px solid var(--brand-lighter)' }}
                          >
                            <PencilIcon className="w-3 h-3" /> Sửa
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFromShelf(product.id); }}
                            title="Gỡ khỏi kệ"
                            className="px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer flex-shrink-0"
                            style={{ color: 'var(--warning)', background: 'var(--warning-bg)', border: '1px solid var(--warning-light)' }}
                          >
                            Gỡ kệ
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                            disabled={deletingId === product.id}
                            title="Xóa sản phẩm"
                            className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
                            style={{ color: 'var(--danger)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            {deletingId === product.id
                              ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                              : <TrashIcon className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </div>
                      {/* Mobile action buttons — always visible */}
                      <div className="flex sm:hidden items-center gap-1.5 px-3 pb-3 -mt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditProduct(product); }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                          style={{ color: 'var(--brand-primary)', background: 'var(--brand-light)', border: '1px solid var(--brand-lighter)' }}
                        >
                          <PencilIcon className="w-3 h-3" /> Sửa
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromShelf(product.id); }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                          style={{ color: 'var(--warning)', background: 'var(--warning-bg)', border: '1px solid var(--warning-light)' }}
                        >
                          Gỡ kệ
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                          disabled={deletingId === product.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-50 flex-shrink-0 transition-colors"
                          style={{ color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid var(--danger-light)' }}
                        >
                          {deletingId === product.id
                            ? <span className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }} />
                            : <TrashIcon className="w-3.5 h-3.5" />
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== ADD PRODUCTS MODAL ==================== */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="absolute inset-0 modal-overlay" />
          <div className="relative rounded-2xl w-full max-w-lg overflow-hidden animate-modal-in"
               style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
               onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Thêm sản phẩm vào kệ</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Kệ: <span className="font-semibold" style={{ color: activeTheme.color }}>{activeShelf?.shelf_name}</span>
                {' • '}{unassignedProducts.length} sản phẩm chưa xếp kệ
              </p>
            </div>

            {unassignedProducts.length > 0 && (
              <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--border-secondary)', background: 'var(--bg-inset)' }}>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" className="checkbox-custom"
                    checked={selectedIds.size === unassignedProducts.length} onChange={selectAll} />
                  <span className="font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Chọn tất cả ({unassignedProducts.length})
                  </span>
                </label>
              </div>
            )}

            <div className="overflow-y-auto max-h-[380px] custom-scrollbar">
              {unassignedProducts.length === 0 ? (
                <div className="text-center py-14 px-6">
                  <PackageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                  <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Không có sản phẩm nào chưa xếp kệ</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Tất cả sản phẩm đều đã được gán vào kệ.</p>
                </div>
              ) : (
                <div className="p-3 space-y-1">
                  {unassignedProducts.map((product) => {
                    const isChecked = selectedIds.has(product.id);
                    return (
                      <label key={product.id}
                        className="flex items-center gap-4 p-3.5 rounded-xl cursor-pointer transition-all duration-150 select-none"
                        style={{
                          background: isChecked ? 'var(--brand-light)' : 'transparent',
                          boxShadow: isChecked ? `inset 0 0 0 1px var(--brand-primary)` : 'none',
                        }}
                        onMouseEnter={e => { if (!isChecked) e.currentTarget.style.background = 'var(--bg-inset)'; }}
                        onMouseLeave={e => { if (!isChecked) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <input type="checkbox" className="checkbox-custom" checked={isChecked} onChange={() => toggleSelect(product.id)} />
                        <PackageIcon className="w-5 h-5 flex-shrink-0" style={{ color: isChecked ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" style={{ color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {product.product_name}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {formatPrice(product.price)} • Tồn: {product.stock}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="px-6 py-4 flex items-center justify-between gap-3"
                 style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-inset)' }}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Đã chọn: <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>{selectedIds.size}</span>
              </p>
              <div className="flex items-center gap-2.5">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary">Hủy</button>
                <button onClick={assignProducts} disabled={selectedIds.size === 0 || saving}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang lưu...
                    </span>
                  ) : `Xác nhận (${selectedIds.size})`}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ==================== MODAL THÊM SẢN PHẨM MỚI ==================== */}
      {showProductModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in" onClick={() => setShowProductModal(false)}>
          <div className="absolute inset-0 modal-overlay" />
          <div className="relative rounded-2xl w-full max-w-3xl overflow-hidden animate-modal-in max-h-[90vh] flex flex-col"
               style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
               onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
                 style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                     style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)' }}>
                  <PackageIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {editingProduct ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {editingProduct ? `Đang sửa: ${editingProduct.product_name}` : 'Thiết lập tên, giá bán và quy cách đóng gói (Thùng/Lốc/Gói...)'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Tên sản phẩm <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={productForm.product_name}
                  onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                  placeholder="VD: Bia Tiger nâu, Nước ngọt Coca Cola, Mì Hảo Hảo..."
                  autoFocus
                  className="w-full input-themed text-base py-2.5 px-3 font-medium"
                />
              </div>

              {/* TÙY CHỌN: BÁN LẺ VS CHỈ BÁN NGUYÊN THÙNG */}
              <div className="p-4 rounded-xl border transition-all"
                   style={{
                     background: !productForm.allow_retail ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-inset)',
                     borderColor: !productForm.allow_retail ? 'var(--warning)' : 'var(--border-secondary)',
                   }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {!productForm.allow_retail
                          ? '📦 Chỉ bán nguyên thùng / quy cách (Không bán lẻ)'
                          : '🛒 Cho phép bán lẻ từng ' + getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                      </span>
                      {!productForm.allow_retail && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-bold"
                              style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning-light)' }}>
                          Chỉ bán sỉ
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {!productForm.allow_retail
                        ? 'Sản phẩm này (như bia nguyên thùng) chỉ bán theo Thùng/Két/Lốc, thu ngân không thể xé lẻ bán từng lon/chai.'
                        : 'Khách hàng có thể mua lẻ từng ' + getBaseUnitLabel(productForm.unit_type).toLowerCase() + ' hoặc mua nguyên thùng/lốc/dây.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={!productForm.allow_retail}
                      onChange={(e) => setProductForm({ ...productForm, allow_retail: !e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              {/* Đơn vị cơ sở & Giá bán */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {productForm.allow_retail ? 'Đơn vị bán lẻ' : 'Đơn vị cơ sở bên trong'} <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <select
                    value={productForm.unit_type}
                    onChange={(e) => setProductForm({ ...productForm, unit_type: e.target.value })}
                    className="w-full input-themed text-sm py-2.5 px-3 cursor-pointer"
                  >
                    <option value="lon">Lon</option>
                    <option value="chai">Chai</option>
                    <option value="goi">Gói</option>
                    <option value="hop">Hộp</option>
                    <option value="bich">Bịch</option>
                    <option value="cai">Cái / Chiếc</option>
                    <option value="dieu">Điếu</option>
                    <option value="vien">Viên</option>
                    <option value="cuon">Cuộn</option>
                    <option value="cay">Cây</option>
                    <option value="hu">Hũ</option>
                    <option value="bo">Bó</option>
                    <option value="vi">Vỉ</option>
                    <option value="bao">Bao</option>
                    <option value="le">Lẻ</option>
                  </select>
                </div>

                {productForm.allow_retail ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Giá bán lẻ (₫) <span style={{ color: 'var(--danger)' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="VD: 18000"
                        className="w-full input-themed text-sm py-2.5 px-3 font-semibold"
                      />
                      {productForm.price && Number(productForm.price) > 0 && (
                        <p className="text-xs font-bold mt-1" style={{ color: 'var(--success)' }}>
                          {formatPrice(Number(productForm.price))} / {getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Giá vốn lẻ (₫)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={productForm.cost_price}
                        onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                        placeholder="VD: 14000"
                        className="w-full input-themed text-sm py-2.5 px-3"
                      />
                      {productForm.cost_price && Number(productForm.cost_price) > 0 && (
                        <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
                          Vốn: {formatPrice(Number(productForm.cost_price))}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="sm:col-span-2 flex items-center p-3 rounded-xl" style={{ background: 'var(--bg-inset)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      💡 Sản phẩm <strong>Chỉ bán nguyên kiện</strong>: Giá bán và giá vốn sẽ được thiết lập trực tiếp theo Thùng/Két/Quy cách ở phần bên dưới.
                    </p>
                  </div>
                )}
              </div>

              {/* TỒN KHO & LỰA CHỌN ĐƠN VỊ NHẬP TỒN */}
              <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-secondary)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div>
                    <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                      Số lượng tồn kho ban đầu
                    </label>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {productForm.stock_input_mode === 'pack' && productForm.units.length > 0
                        ? `Bạn đang nhập theo: ${productForm.units[0].unit_name || 'Thùng'} (Hệ thống sẽ tự quy đổi)`
                        : `Bạn đang nhập theo đơn vị lẻ: ${getBaseUnitLabel(productForm.unit_type)}`}
                    </p>
                  </div>
                  {productForm.units && productForm.units.length > 0 && (
                    <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, stock_input_mode: 'base' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        style={{
                          background: productForm.stock_input_mode !== 'pack' ? 'var(--brand-primary)' : 'transparent',
                          color: productForm.stock_input_mode !== 'pack' ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {getBaseUnitLabel(productForm.unit_type)} (Lẻ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, stock_input_mode: 'pack' })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        style={{
                          background: productForm.stock_input_mode === 'pack' ? 'var(--warning)' : 'transparent',
                          color: productForm.stock_input_mode === 'pack' ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        📦 {productForm.units[0]?.unit_name || 'Thùng'} ({productForm.units[0]?.conversion_rate || 24} {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
                      </button>
                    </div>
                  )}
                </div>

                {productForm.stock_input_mode === 'pack' && productForm.units.length > 0 ? (
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={productForm.stock_pack_quantity}
                        onChange={(e) => setProductForm({ ...productForm, stock_pack_quantity: e.target.value })}
                        placeholder="VD: 10 (thùng)"
                        className="w-full input-themed text-base font-bold py-2.5 px-3 pr-24"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--warning)' }}>
                        {productForm.units[0]?.unit_name || 'Thùng'}
                      </span>
                    </div>
                    {productForm.stock_pack_quantity !== '' && Number(productForm.stock_pack_quantity) > 0 && (
                      <p className="text-xs font-bold mt-2 flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
                        <span>✓ Quy đổi tồn kho:</span>
                        <span>{Number(productForm.stock_pack_quantity)} {productForm.units[0]?.unit_name} = </span>
                        <strong className="underline text-sm">{Number(productForm.stock_pack_quantity) * (Number(productForm.units[0]?.conversion_rate) || 24)} {getBaseUnitLabel(productForm.unit_type).toLowerCase()}</strong>
                        <span>trong kho.</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        placeholder="0"
                        className="w-full input-themed text-base font-bold py-2.5 px-3 pr-20"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                        {getBaseUnitLabel(productForm.unit_type)}
                      </span>
                    </div>
                    {productForm.units && productForm.units.length > 0 && productForm.stock !== '' && Number(productForm.stock) > 0 && (
                      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        💡 Tương đương: ~{Math.floor(Number(productForm.stock) / Number(productForm.units[0].conversion_rate))} {productForm.units[0].unit_name}
                        {Number(productForm.stock) % Number(productForm.units[0].conversion_rate) > 0 && (
                          <span> và {Number(productForm.stock) % Number(productForm.units[0].conversion_rate)} {getBaseUnitLabel(productForm.unit_type).toLowerCase()} lẻ</span>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* QUY CÁCH ĐÓNG GÓI MỞ RỘNG */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      Quy cách đóng gói & Giá sỉ (Thùng, Lốc, Dây, Cây...)
                    </span>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {!productForm.allow_retail
                        ? 'Bắt buộc thêm quy cách (Thùng, Két...) vì sản phẩm này chỉ bán nguyên kiện.'
                        : 'Thêm nếu bạn có bán nguyên thùng/lốc hoặc nhập hàng theo thùng.'}
                    </p>
                  </div>
                </div>

                {/* Gợi ý thêm nhanh */}
                <div className="flex items-center gap-2 flex-wrap mb-3.5">
                  <button type="button" onClick={() => addUnitPreset('Thùng', 24)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--brand-primary)' }}>
                    + Thùng (24 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
                  </button>
                  <button type="button" onClick={() => addUnitPreset('Lốc', 6)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--brand-primary)' }}>
                    + Lốc (6 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
                  </button>
                  <button type="button" onClick={() => addUnitPreset('Dây', 12)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--brand-primary)' }}>
                    + Dây (12 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
                  </button>
                  <button type="button" onClick={() => addUnitPreset('Cây', 10)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--brand-primary)' }}>
                    + Cây (10 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
                  </button>
                  <button type="button" onClick={() => addUnitPreset('Hộp', 10)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--brand-primary)' }}>
                    + Hộp (10)
                  </button>
                  <button type="button" onClick={() => addUnitPreset('', 2)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                    + Tự đặt quy cách
                  </button>
                </div>

                {/* Danh sách quy cách (RỘNG RÃI, TO RÕ, KHÔNG BỊ CO CỤM) */}
                {productForm.units && productForm.units.length > 0 ? (
                  <div className="space-y-3">
                    {productForm.units.map((u, index) => (
                      <div key={index} className="p-4 rounded-2xl border transition-all animate-fade-in"
                           style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-secondary)' }}>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
                          {/* Tên quy cách */}
                          <div className="sm:col-span-3">
                            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                              Tên quy cách <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={u.unit_name}
                              onChange={(e) => updateUnitField(index, 'unit_name', e.target.value)}
                              placeholder="VD: Thùng"
                              className="w-full input-themed text-sm py-2.5 px-3 font-semibold"
                            />
                          </div>

                          {/* Tỷ lệ quy đổi */}
                          <div className="sm:col-span-3">
                            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                              1 {u.unit_name || 'quy cách'} chứa <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="2"
                                value={u.conversion_rate}
                                onChange={(e) => updateUnitField(index, 'conversion_rate', e.target.value)}
                                placeholder="24"
                                className="w-full input-themed text-sm py-2.5 px-3 pr-14 font-semibold"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold truncate max-w-[50px]" style={{ color: 'var(--text-muted)' }}>
                                {getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                              </span>
                            </div>
                          </div>

                          {/* Giá bán quy cách */}
                          <div className="sm:col-span-3">
                            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                              Giá bán (₫) <span style={{ color: 'var(--danger)' }}>*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="500"
                              value={u.price}
                              onChange={(e) => updateUnitField(index, 'price', e.target.value)}
                              placeholder="VD: 370000"
                              className="w-full input-themed text-sm py-2.5 px-3 font-bold"
                            />
                            {u.price && Number(u.price) > 0 && (
                              <p className="text-xs font-bold mt-1" style={{ color: 'var(--success)' }}>
                                = {formatPrice(Number(u.price))}
                              </p>
                            )}
                          </div>

                          {/* Giá vốn quy cách */}
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                              Giá vốn (₫)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="500"
                              value={u.cost_price}
                              onChange={(e) => updateUnitField(index, 'cost_price', e.target.value)}
                              placeholder="VD: 320000"
                              className="w-full input-themed text-sm py-2.5 px-3 font-medium"
                            />
                            {u.cost_price && Number(u.cost_price) > 0 && (
                              <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
                                = {formatPrice(Number(u.cost_price))}
                              </p>
                            )}
                          </div>

                          {/* Nút xóa */}
                          <div className="sm:col-span-1 flex items-center justify-end sm:pt-7">
                            <button
                              type="button"
                              onClick={() => removeUnitRow(index)}
                              title="Xóa quy cách này"
                              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                              style={{ color: 'var(--danger)', background: 'var(--danger-bg)' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl text-center border border-dashed" style={{ borderColor: 'var(--border-secondary)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Chưa có quy cách đóng gói nào. Bấm một trong các nút gợi ý trên để thêm nhanh.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0"
                 style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-surface)' }}>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setProductForm({
                    product_name: '',
                    price: '',
                    cost_price: '',
                    stock: '',
                    stock_input_mode: 'base',
                    stock_pack_quantity: '',
                    unit_type: 'lon',
                    allow_retail: true,
                    units: [],
                  });
                }}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={createProduct}
                disabled={creatingProduct}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}
              >
                {creatingProduct ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </span>
                ) : (editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
