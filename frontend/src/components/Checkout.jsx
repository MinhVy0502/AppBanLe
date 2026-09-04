import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

/* ===================================================================
   SVG ICONS
   =================================================================== */
const SearchIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const PlusIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const CartIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const CheckCircleIcon = ({ className = 'w-16 h-16' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ReceiptIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const PackageIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FolderIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

const UserIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

/* ===================================================================
   HELPERS
   =================================================================== */
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN').format(price) + ' ₫';

/* Quy cách đóng gói — labels */
const UNIT_LABELS = {
  lon: 'Lon', chai: 'Chai', goi: 'Gói', hop: 'Hộp', bich: 'Bịch', bo: 'Bó', hu: 'Hũ',
  cai: 'Cái', dieu: 'Điếu', vien: 'Viên', cuon: 'Cuộn', cay: 'Cây', day: 'Dây',
  thung: 'Thùng', loc: 'Lốc', vi: 'Vỉ', bao: 'Bao', ket: 'Két', le: 'Lẻ',
};
const getBaseUnitLabel = (type) => UNIT_LABELS[type] || type || 'Đơn vị';
const getUnitBadge = (type) => {
  if (!type) return '';
  const unit = typeof type === 'object' ? type.unit_type : type;
  return getBaseUnitLabel(unit);
};

const getStockDisplay = (product) => {
  const baseLabel = getBaseUnitLabel(product.unit_type).toLowerCase();
  const thungUnit = (product.units || []).find(u => u.unit_name.toLowerCase().includes('thùng') || u.conversion_rate >= 12) || (product.units && product.units[0]);

  if (product.allow_retail === false && thungUnit && thungUnit.conversion_rate > 1) {
    const numPacks = Math.floor(product.stock / thungUnit.conversion_rate);
    return `${numPacks} ${thungUnit.unit_name.toLowerCase()}`;
  }

  if (thungUnit && thungUnit.conversion_rate > 1 && product.stock >= thungUnit.conversion_rate) {
    const numPacks = Math.floor(product.stock / thungUnit.conversion_rate);
    const numLe = product.stock % thungUnit.conversion_rate;
    return `${product.stock} ${baseLabel} (~${numPacks} ${thungUnit.unit_name.toLowerCase()}${numLe > 0 ? ` ${numLe} lẻ` : ''})`;
  }
  return `${product.stock} ${baseLabel}`;
};

/* ===================================================================
   COMPONENT: Checkout (Tính tiền)
   =================================================================== */
export default function Checkout() {
  // ---- State ----
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [cart, setCart] = useState([]); // [{ cart_id, product, unit_name, conversion_rate, price, quantity }]
  const [search, setSearch] = useState('');
  const [selectedShelfId, setSelectedShelfId] = useState('all'); // 'all' | shelf id | 'none'
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Customer/Debt state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isDebt, setIsDebt] = useState(false);

  // ---- Fetch data ----
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, custRes, shelfRes] = await Promise.all([
        api.get('/products'),
        api.get('/customers'),
        api.get('/shelves')
      ]);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setShelves(shelfRes.data?.data || shelfRes.data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // ---- Filtered products (search + shelf filter) ----
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by shelf
    if (selectedShelfId !== 'all') {
      if (selectedShelfId === 'none') {
        result = result.filter((p) => !p.shelf_id);
      } else {
        result = result.filter((p) => p.shelf_id === Number(selectedShelfId));
      }
    }

    // Filter by search text
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((p) =>
        p.product_name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, search, selectedShelfId]);

  // ---- Count products per shelf (for badge) ----
  const shelfProductCounts = useMemo(() => {
    const counts = { all: products.length, none: 0 };
    products.forEach((p) => {
      if (!p.shelf_id) {
        counts.none++;
      } else {
        counts[p.shelf_id] = (counts[p.shelf_id] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // ---- Cart total ----
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // ---- Cart handlers ----
  const addToCart = (product, unit = null) => {
    const unitName = unit ? unit.unit_name : getBaseUnitLabel(product.unit_type);
    const conversionRate = unit ? (Number(unit.conversion_rate) || 1) : 1;
    const unitPrice = unit ? Number(unit.price) : Number(product.price);
    const cartId = `${product.id}_${unitName}`;

    setCart((prev) => {
      // Calculate current base quantity in cart for this product
      const currentBaseInCart = prev
        .filter((item) => item.product.id === product.id)
        .reduce((sum, item) => sum + item.quantity * item.conversion_rate, 0);

      if (currentBaseInCart + conversionRate > product.stock) {
        return prev;
      }

      const existingIndex = prev.findIndex((item) => item.cart_id === cartId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }

      return [
        ...prev,
        {
          cart_id: cartId,
          product,
          unit_name: unitName,
          conversion_rate: conversionRate,
          price: unitPrice,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (cartId, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cart_id === cartId);
      if (!item) return prev;

      if (delta > 0) {
        const currentBaseInCart = prev
          .filter((i) => i.product.id === item.product.id)
          .reduce((sum, i) => sum + i.quantity * i.conversion_rate, 0);

        if (currentBaseInCart + item.conversion_rate > item.product.stock) {
          return prev;
        }
      }

      return prev
        .map((i) => {
          if (i.cart_id !== cartId) return i;
          return { ...i, quantity: i.quantity + delta };
        })
        .filter((i) => i.quantity > 0);
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cart_id !== cartId));
  };

  const clearCart = () => setCart([]);

  // ---- Thanh toán ----
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setPaying(true);
    try {
      const payload = {
        total_price: totalPrice,
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.product_name,
          price: item.price,
          quantity: item.quantity,
          unit_name: item.unit_name,
          conversion_rate: item.conversion_rate,
        })),
      };

      if (selectedCustomerId) {
        payload.customer_id = selectedCustomerId;
        payload.is_debt = isDebt;
      }

      const res = await api.post('/orders', payload);

      setProducts((prev) =>
        prev.map((p) => {
          const cartItemsForP = cart.filter((c) => c.product.id === p.id);
          if (cartItemsForP.length > 0) {
            const totalDeducted = cartItemsForP.reduce((sum, c) => sum + c.quantity * c.conversion_rate, 0);
            return { ...p, stock: Math.max(0, p.stock - totalDeducted) };
          }
          return p;
        })
      );

      setLastOrder({
        ...res.data,
        cart: [...cart],
        total: totalPrice,
        customer: customers.find(c => c.id === Number(selectedCustomerId)),
        is_debt: isDebt
      });
      setCart([]);
      setSelectedCustomerId('');
      setIsDebt(false);
      setShowSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi thanh toán, vui lòng thử lại.';
      alert(msg);
      console.error('Lỗi thanh toán:', err);
    }
    setPaying(false);
  };

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--success)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#14b8a6', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--info)', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // ---- Success Screen ----
  if (showSuccess && lastOrder) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="rounded-2xl overflow-hidden animate-modal-in"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div className="px-8 py-10 text-center"
            style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)' }}>
            <CheckCircleIcon className="w-20 h-20 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Thanh toán thành công!</h2>
            <p className="text-emerald-100 mt-2 flex items-center justify-center gap-2">
              Hóa đơn #{lastOrder.data?.id || lastOrder.id}
              {lastOrder.is_debt && (
                <span className="bg-amber-400 text-amber-900 text-xs px-2 py-0.5 rounded font-bold">MUA CHỊU</span>
              )}
            </p>
          </div>

          {/* Receipt */}
          <div className="p-6 sm:p-8">
            <div className="rounded-2xl p-5"
              style={{ border: '2px dashed var(--border-primary)' }}>
              <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <ReceiptIcon className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                Chi tiết hóa đơn
              </h3>
              <div className="space-y-2.5">
                {lastOrder.cart.map((item, idx) => (
                  <div key={item.cart_id || idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="truncate flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span className="truncate font-medium">{item.product?.product_name || item.product_name}</span>
                        {item.unit_name && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold flex-shrink-0"
                                style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-subtle)' }}>
                            {item.unit_name}
                          </span>
                        )}
                      </div>
                      <span className="flex-shrink-0" style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                    </div>
                    <span className="font-bold ml-4 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between font-bold text-lg pt-4 mt-4"
                style={{ borderTop: '2px dashed var(--border-primary)', color: 'var(--text-primary)' }}>
                <span>Tổng tiền</span>
                <span style={{ color: 'var(--success)' }}>{formatPrice(lastOrder.total)}</span>
              </div>
            </div>

            {/* Customer Info */}
            {lastOrder.customer && (
              <div className="mt-4 p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-secondary)' }}>
                <div className="flex flex-col">
                  <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <UserIcon /> Khách hàng
                  </span>
                  <span className="font-bold text-base mt-0.5" style={{ color: 'var(--text-primary)' }}>
                    {lastOrder.customer.customer_name}
                  </span>
                </div>
                {lastOrder.is_debt && (
                  <div className="text-right">
                    <span className="text-xs" style={{ color: 'var(--warning)' }}>Đã cộng vào nợ</span>
                    <p className="font-bold" style={{ color: 'var(--warning)' }}>+{formatPrice(lastOrder.total)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => { setShowSuccess(false); setLastOrder(null); }}
                className="w-full mt-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--success), #14b8a6)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; }}
              >
                Tạo hóa đơn mới
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Main layout ----
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ==================== LEFT: DANH SÁCH SẢN PHẨM ==================== */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--success), #14b8a6)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}>
              <ReceiptIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Tính tiền</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{products.length} sản phẩm</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full pl-12 pr-10 py-3 input-themed"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 rounded-md transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Shelf filter tabs */}
          {shelves.length > 0 && (
            <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                {/* Tab: Tất cả */}
                <button
                  onClick={() => setSelectedShelfId('all')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0"
                  style={{
                    background: selectedShelfId === 'all'
                      ? 'linear-gradient(135deg, var(--success), #14b8a6)'
                      : 'var(--bg-inset)',
                    color: selectedShelfId === 'all' ? '#fff' : 'var(--text-secondary)',
                    border: selectedShelfId === 'all' ? 'none' : '1px solid var(--border-primary)',
                    boxShadow: selectedShelfId === 'all' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
                  }}
                >
                  <PackageIcon className="w-3.5 h-3.5" />
                  Tất cả
                  <span className="px-1.5 py-0.5 rounded-md text-xs font-bold" style={{
                    background: selectedShelfId === 'all' ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface)',
                    color: selectedShelfId === 'all' ? '#fff' : 'var(--text-muted)',
                  }}>
                    {shelfProductCounts.all}
                  </span>
                </button>

                {/* Tabs theo từng kệ */}
                {shelves.map((shelf) => (
                  <button
                    key={shelf.id}
                    onClick={() => setSelectedShelfId(String(shelf.id))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0"
                    style={{
                      background: selectedShelfId === String(shelf.id)
                        ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                        : 'var(--bg-inset)',
                      color: selectedShelfId === String(shelf.id) ? '#fff' : 'var(--text-secondary)',
                      border: selectedShelfId === String(shelf.id) ? 'none' : '1px solid var(--border-primary)',
                      boxShadow: selectedShelfId === String(shelf.id) ? '0 2px 8px rgba(139, 92, 246, 0.3)' : 'none',
                    }}
                  >
                    <FolderIcon className="w-3.5 h-3.5" />
                    {shelf.shelf_name}
                    {shelfProductCounts[shelf.id] > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md text-xs font-bold" style={{
                        background: selectedShelfId === String(shelf.id) ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface)',
                        color: selectedShelfId === String(shelf.id) ? '#fff' : 'var(--text-muted)',
                      }}>
                        {shelfProductCounts[shelf.id]}
                      </span>
                    )}
                  </button>
                ))}

                {/* Tab: Chưa xếp kệ */}
                {shelfProductCounts.none > 0 && (
                  <button
                    onClick={() => setSelectedShelfId('none')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0"
                    style={{
                      background: selectedShelfId === 'none'
                        ? 'linear-gradient(135deg, #6b7280, #4b5563)'
                        : 'var(--bg-inset)',
                      color: selectedShelfId === 'none' ? '#fff' : 'var(--text-muted)',
                      border: selectedShelfId === 'none' ? 'none' : '1px solid var(--border-primary)',
                      boxShadow: selectedShelfId === 'none' ? '0 2px 8px rgba(107, 114, 128, 0.3)' : 'none',
                    }}
                  >
                    <PackageIcon className="w-3.5 h-3.5" />
                    Chưa xếp kệ
                    <span className="px-1.5 py-0.5 rounded-md text-xs font-bold" style={{
                      background: selectedShelfId === 'none' ? 'rgba(255,255,255,0.2)' : 'var(--bg-surface)',
                      color: selectedShelfId === 'none' ? '#fff' : 'var(--text-muted)',
                    }}>
                      {shelfProductCounts.none}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Product grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <PackageIcon className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>
                {search ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product, idx) => {
                const baseInCart = cart
                  .filter((item) => item.product.id === product.id)
                  .reduce((sum, item) => sum + item.quantity * item.conversion_rate, 0);
                const totalItemsInCart = cart
                  .filter((item) => item.product.id === product.id)
                  .reduce((sum, item) => sum + item.quantity, 0);
                const remaining = product.stock - baseInCart;
                const isOutOfStock = product.stock <= 0;
                const isMaxReached = remaining <= 0 && !isOutOfStock;
                const hasUnits = Array.isArray(product.units) && product.units.length > 0;
                const isOnlyPack = product.allow_retail === false && hasUnits;
                const baseLabel = getBaseUnitLabel(product.unit_type);

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (!isOutOfStock && !isMaxReached) {
                        if (isOnlyPack) {
                          addToCart(product, product.units[0]);
                        } else if (!hasUnits) {
                          addToCart(product);
                        }
                      }
                    }}
                    className="relative text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 group animate-fade-in-up flex flex-col justify-between"
                    style={{
                      animationDelay: `${Math.min(idx * 0.02, 0.3)}s`,
                      background: isOutOfStock
                        ? 'var(--bg-inset)'
                        : baseInCart > 0
                          ? 'var(--success-bg)'
                          : 'var(--card-bg)',
                      border: `2px solid ${
                        isOutOfStock
                          ? 'var(--border-primary)'
                          : isMaxReached
                            ? 'var(--warning)'
                            : baseInCart > 0
                              ? 'var(--success)'
                              : 'var(--card-border)'
                      }`,
                      opacity: isOutOfStock ? 0.6 : 1,
                      cursor: isOutOfStock || isMaxReached ? 'default' : (isOnlyPack || !hasUnits) ? 'pointer' : 'default',
                      boxShadow: baseInCart > 0 ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)',
                    }}
                    onMouseEnter={e => {
                      if (!isOutOfStock && !isMaxReached) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = baseInCart > 0 ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)';
                    }}
                  >
                    {/* Badge số lượng trong giỏ */}
                    {totalItemsInCart > 0 && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md animate-bounce-in z-10"
                        style={{ background: 'var(--success)' }}>
                        {totalItemsInCart}
                      </span>
                    )}

                    {/* Overlay hết hàng */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none z-10">
                        <span className="text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md"
                          style={{ background: 'var(--danger)', transform: 'rotate(-12deg)' }}>
                          HẾT HÀNG
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Icon & Category */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                          style={{
                            background: isOutOfStock ? 'var(--bg-surface)' : baseInCart > 0 ? 'var(--success-light)' : 'var(--bg-inset)',
                          }}>
                          <PackageIcon className="w-4 h-4"
                            style={{ color: isOutOfStock ? 'var(--text-muted)' : baseInCart > 0 ? 'var(--success)' : 'var(--text-muted)' }} />
                        </div>
                        {product.shelf && selectedShelfId === 'all' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5"
                            style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)' }}>
                            <FolderIcon className="w-2.5 h-2.5" />
                            {product.shelf.shelf_name}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <p className="font-semibold text-sm truncate leading-tight"
                        style={{ color: isOutOfStock ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {product.product_name}
                      </p>

                      {/* Price */}
                      {isOnlyPack ? (
                        <p className="font-bold text-sm mt-1"
                          style={{ color: isOutOfStock ? 'var(--text-muted)' : baseInCart > 0 ? 'var(--success)' : 'var(--brand-primary)' }}>
                          {formatPrice(product.units[0].price)} <span className="text-xs font-normal text-muted">/{product.units[0].unit_name.toLowerCase()}</span>
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold inline-block"
                                style={{ background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid var(--warning-light)' }}>
                            Chỉ bán sỉ
                          </span>
                        </p>
                      ) : (
                        <p className="font-bold text-sm mt-1"
                          style={{ color: isOutOfStock ? 'var(--text-muted)' : baseInCart > 0 ? 'var(--success)' : 'var(--brand-primary)' }}>
                          {formatPrice(product.price)} <span className="text-xs font-normal text-muted">/{baseLabel.toLowerCase()}</span>
                        </p>
                      )}

                      {/* Tồn kho diễn giải */}
                      <p className="text-[11px] mt-1"
                        style={{
                          color: isOutOfStock ? 'var(--danger)' : remaining <= 5 ? 'var(--warning)' : 'var(--text-muted)',
                          fontWeight: isOutOfStock || remaining <= 5 ? 600 : 400,
                        }}>
                        {isOutOfStock ? 'Hết hàng' : `Kho: ${getStockDisplay({ ...product, stock: remaining })}`}
                      </p>
                    </div>

                    {/* Nút chọn nhanh đơn vị */}
                    {hasUnits && !isOutOfStock && (
                      <div className="mt-2.5 pt-2 border-t flex flex-col gap-1.5"
                           style={{ borderColor: 'var(--border-secondary)' }}
                           onClick={(e) => e.stopPropagation()}>
                        {!isOnlyPack && (
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            disabled={remaining < 1}
                            className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: 'var(--brand-primary)', color: '#fff' }}
                          >
                            <span>Bán lẻ ({baseLabel.toLowerCase()})</span>
                            <span>{formatPrice(product.price)}</span>
                          </button>
                        )}
                        {product.units.map((u) => {
                          const canAdd = remaining >= u.conversion_rate;
                          return (
                            <button
                              key={u.id || u.unit_name}
                              type="button"
                              onClick={() => {
                                if (canAdd) {
                                  addToCart(product, u);
                                } else {
                                  alert(`Kho chỉ còn ${remaining} ${baseLabel.toLowerCase()}, không đủ ${u.conversion_rate} ${baseLabel.toLowerCase()} để bán 1 ${u.unit_name}. Vui lòng vào tab "Nhập hàng" hoặc "Kệ hàng" để cập nhật tồn kho.`);
                                }
                              }}
                              className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer ${
                                canAdd ? 'hover:opacity-90' : 'opacity-70 hover:opacity-100'
                              }`}
                              style={{
                                background: canAdd ? (isOnlyPack ? 'var(--brand-primary)' : 'var(--bg-surface)') : 'var(--bg-inset)',
                                color: canAdd ? (isOnlyPack ? '#fff' : 'var(--text-primary)') : 'var(--text-muted)',
                                border: canAdd ? (isOnlyPack ? 'none' : '1px solid var(--border-primary)') : '1px dashed var(--border-secondary)',
                              }}
                              title={!canAdd ? `Kho còn ${remaining}, thiếu ${u.conversion_rate - remaining} để bán 1 ${u.unit_name}` : ''}
                            >
                              <div className="truncate flex items-center gap-1">
                                <span>📦 {u.unit_name} ({u.conversion_rate})</span>
                                {!canAdd && (
                                  <span className="text-[10px] font-bold text-amber-500">
                                    ({remaining}/{u.conversion_rate})
                                  </span>
                                )}
                              </div>
                              <span className="font-bold flex-shrink-0">{formatPrice(u.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================== RIGHT: GIỎ HÀNG / HÓA ĐƠN ==================== */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="rounded-2xl sticky top-20 overflow-hidden"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--shadow-xl)',
            }}>
            {/* Cart header */}
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)' }}>
              <div className="flex items-center gap-2.5 text-white">
                <CartIcon className="w-6 h-6" />
                <h2 className="font-bold text-lg">Hóa đơn</h2>
                {totalItems > 0 && (
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm font-medium">
                    {totalItems} SP
                  </span>
                )}
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-white/70 text-sm hover:text-white font-medium transition-colors cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {/* Cart items */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-14 px-6">
                  <CartIcon className="w-14 h-14 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                  <p className="font-medium text-sm" style={{ color: 'var(--text-muted)' }}>Chưa có sản phẩm nào</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>Bấm vào sản phẩm bên trái để thêm</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.cart_id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors animate-fade-in group/cart"
                      style={{ background: 'var(--bg-inset)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {item.product.product_name}
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', border: '1px solid var(--brand-lighter)' }}>
                            {item.unit_name}
                          </span>
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {formatPrice(item.price)} × {item.quantity}
                          {item.conversion_rate > 1 && (
                            <span className="opacity-70 ml-1">
                              (= {item.quantity * item.conversion_rate} {getBaseUnitLabel(item.product.unit_type).toLowerCase()})
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Subtotal */}
                      <p className="font-bold text-sm flex-shrink-0 min-w-[75px] text-right" style={{ color: 'var(--success)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.cart_id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                          style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cart_id, 1)}
                          disabled={
                            cart.filter(c => c.product.id === item.product.id).reduce((s, c) => s + c.quantity * c.conversion_rate, 0) + item.conversion_rate > item.product.stock
                          }
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            background: 'var(--success-bg)',
                            color: 'var(--success)',
                            cursor: 'pointer',
                          }}
                          title="Thêm 1"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.cart_id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover/cart:opacity-100 transition-all cursor-pointer flex-shrink-0"
                        style={{ color: 'var(--danger)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider + Total + Pay */}
            <div className="p-5" style={{ borderTop: '1px solid var(--border-primary)' }}>
              {/* Khách hàng & Mua chịu */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <UserIcon /> Khách hàng
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      if (!e.target.value) setIsDebt(false);
                    }}
                    className="flex-1 input-themed text-sm py-2 px-3"
                  >
                    <option value="">Khách lẻ</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.customer_name} {c.phone ? `(${c.phone})` : ''}</option>
                    ))}
                  </select>
                </div>

                {selectedCustomerId && (
                  <label className="mt-3 flex items-center gap-2 cursor-pointer w-fit group">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded border transition-colors"
                      style={{
                        borderColor: isDebt ? 'var(--warning)' : 'var(--border-secondary)',
                        background: isDebt ? 'var(--warning)' : 'var(--bg-surface)'
                      }}>
                      <input type="checkbox" className="sr-only" checked={isDebt} onChange={e => setIsDebt(e.target.checked)} />
                      {isDebt && <CheckCircleIcon className="w-3.5 h-3.5 text-white absolute" />}
                    </div>
                    <span className="text-sm font-medium select-none transition-colors"
                      style={{ color: isDebt ? 'var(--warning)' : 'var(--text-secondary)' }}>
                      Ghi nợ đơn này
                    </span>
                  </label>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-5">
                <span className="font-medium" style={{ color: 'var(--text-tertiary)' }}>Tổng cộng</span>
                <span className="font-extrabold text-2xl transition-all"
                  style={{ color: totalPrice > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Pay button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || paying}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--success), #14b8a6)',
                  boxShadow: cart.length > 0 ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
                  cursor: cart.length === 0 || paying ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (cart.length > 0 && !paying) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.4)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)'; }}
              >
                {paying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  `Thanh toán${totalPrice > 0 ? ' • ' + formatPrice(totalPrice) : ''}`
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
