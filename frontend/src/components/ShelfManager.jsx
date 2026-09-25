import { useState, useEffect } from 'react';
import api from '../services/api';
import { FolderIcon, PlusIcon, InboxIcon } from './common/Icons';
import ShelfCard from './shelf/ShelfCard';
import ShelfDetailModal from './shelf/ShelfDetailModal';
import AssignShelfModal from './shelf/AssignShelfModal';
import UnassignedProducts from './shelf/UnassignedProducts';
import ProductFormModal from './shelf/ProductFormModal';

/* Theme colors for shelves */
const THEMES = [
  { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', light: 'rgba(139,92,246,0.1)', color: '#8b5cf6', lightColor: '#a78bfa' },
  { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', light: 'rgba(16,185,129,0.1)', color: '#10b981', lightColor: '#34d399' },
  { gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)', light: 'rgba(245,158,11,0.1)', color: '#f59e0b', lightColor: '#fbbf24' },
  { gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)', light: 'rgba(244,63,94,0.1)', color: '#f43f5e', lightColor: '#fb7185' },
  { gradient: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', light: 'rgba(14,165,233,0.1)', color: '#0ea5e9', lightColor: '#38bdf8' },
  { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', light: 'rgba(99,102,241,0.1)', color: '#6366f1', lightColor: '#818cf8' },
];

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

  // Thêm / Sửa / Xóa sản phẩm
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    product_name: '',
    price: '',
    cost_price: '',
    stock: '',
    stock_input_mode: 'base',
    stock_pack_quantity: '',
    unit_type: 'lon',
    allow_retail: true,
    barcode: '',
    units: [],
  });
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingShelfId, setDeletingShelfId] = useState(null);

  // Derived data
  const getProductsOnShelf = (shelfId) => allProducts.filter((p) => p.shelf_id === shelfId);
  const unassignedProducts = allProducts.filter((p) => p.shelf_id === null);
  const activeShelf = shelves.find((s) => s.id === activeShelfId);
  const activeThemeIndex = activeShelf ? shelves.indexOf(activeShelf) % THEMES.length : 0;
  const activeTheme = THEMES[activeThemeIndex];

  // Fetch initial data
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
      setShelves(shelvesRes.data || []);
      setAllProducts(productsRes.data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // Shelf handlers
  const toggleShelf = (id) => setActiveShelfId((prev) => (prev === id ? null : id));
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

  const deleteShelf = async (shelfId) => {
    if (!window.confirm('Bạn có chắc muốn xóa kệ này? Sản phẩm trên kệ sẽ chuyển về trạng thái chưa xếp kệ.')) return;
    setDeletingShelfId(shelfId);
    try {
      await api.delete(`/shelves/${shelfId}`);
      setShelves((prev) => prev.filter((s) => s.id !== shelfId));
      setAllProducts((prev) => prev.map((p) => (p.shelf_id === shelfId ? { ...p, shelf_id: null } : p)));
      if (activeShelfId === shelfId) setActiveShelfId(null);
    } catch (err) {
      console.error('Lỗi xóa kệ:', err);
    }
    setDeletingShelfId(null);
  };

  // Product form handlers
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
      .filter((u) => u.unit_name && u.unit_name.trim() && Number(u.conversion_rate) > 1)
      .map((u) => ({
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
        barcode: productForm.barcode ? String(productForm.barcode).trim() : null,
        units: validUnits,
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct.id}`, payload);
        const updated = res.data?.data || res.data;
        setAllProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
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
        barcode: '',
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
      stock_pack_quantity:
        mainUnit && mainUnit.conversion_rate > 1
          ? String(Math.floor(Number(product.stock) / mainUnit.conversion_rate))
          : '',
      unit_type: product.unit_type || 'lon',
      allow_retail: product.allow_retail !== undefined ? product.allow_retail : true,
      barcode: product.barcode || '',
      units: (product.units || []).map((u) => ({
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
      barcode: '',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-gradient-from)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--brand-gradient-to)', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#ec4899', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--brand-gradient-from), var(--brand-gradient-to))',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}
            >
              <FolderIcon className="w-5 h-5 text-white" />
            </span>
            Quản lý Kệ hàng
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-muted">
            {shelves.length} kệ hàng • {allProducts.length} sản phẩm •{' '}
            <span className="font-medium text-amber-500">{unassignedProducts.length} chưa xếp kệ</span>
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={openAddProduct} className="btn-primary flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Thêm sản phẩm
          </button>
          <button
            onClick={() => setShowNewShelfForm(true)}
            className="btn-secondary flex items-center gap-2 font-semibold"
          >
            <PlusIcon className="w-4 h-4" /> Thêm kệ mới
          </button>
        </div>
      </div>

      {/* Form tạo kệ mới */}
      {showNewShelfForm && (
        <div className="mb-6 animate-slide-down">
          <div className="card-themed p-5">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Tạo kệ hàng mới
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createShelf()}
                placeholder="Nhập tên kệ (VD: Kệ Bánh Kẹo, Kệ Nước Ngọt...)"
                autoFocus
                className="flex-1 input-themed"
              />
              <button
                onClick={createShelf}
                disabled={creatingShelf || !newShelfName.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingShelf ? 'Đang tạo...' : 'Tạo'}
              </button>
              <button
                onClick={() => {
                  setShowNewShelfForm(false);
                  setNewShelfName('');
                }}
                className="btn-secondary"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {shelves.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <InboxIcon className="w-16 h-16 mx-auto mb-4 opacity-30 text-muted" />
          <h3 className="text-lg font-semibold mb-2 text-muted">Chưa có kệ hàng nào</h3>
          <p className="text-sm opacity-60 text-muted">
            Bấm "Thêm kệ mới" để bắt đầu sắp xếp sản phẩm.
          </p>
        </div>
      )}

      {/* Shelf Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {shelves.map((shelf, index) => {
          const theme = THEMES[index % THEMES.length];
          const products = getProductsOnShelf(shelf.id);
          const isActive = activeShelfId === shelf.id;
          return (
            <ShelfCard
              key={shelf.id}
              shelf={shelf}
              index={index}
              theme={theme}
              products={products}
              isActive={isActive}
              onToggle={() => toggleShelf(shelf.id)}
              onDelete={deleteShelf}
              isDeleting={deletingShelfId === shelf.id}
            />
          );
        })}
      </div>

      {/* Unassigned products section */}
      <UnassignedProducts
        unassignedProducts={unassignedProducts}
        deleteProduct={deleteProduct}
        deletingId={deletingId}
        openEditProduct={openEditProduct}
      />

      {/* Shelf detail modal */}
      <ShelfDetailModal
        activeShelf={activeShelf}
        activeTheme={activeTheme}
        products={getProductsOnShelf(activeShelfId)}
        onClose={() => setActiveShelfId(null)}
        openAddModal={openAddModal}
        openEditProduct={openEditProduct}
        removeFromShelf={removeFromShelf}
        deleteProduct={deleteProduct}
        deletingId={deletingId}
      />

      {/* Assign shelf modal */}
      <AssignShelfModal
        showAddModal={showAddModal}
        onClose={() => setShowAddModal(false)}
        activeShelf={activeShelf}
        unassignedProducts={unassignedProducts}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        selectAll={selectAll}
        assignProducts={assignProducts}
        saving={saving}
      />

      {/* Product form modal */}
      <ProductFormModal
        showProductModal={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        creatingProduct={creatingProduct}
        createProduct={createProduct}
        addUnitPreset={addUnitPreset}
        updateUnitField={updateUnitField}
        removeUnitRow={removeUnitRow}
      />
    </div>
  );
}
