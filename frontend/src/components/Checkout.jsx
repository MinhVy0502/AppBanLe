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
const UNIT_LABELS = { le: 'Lẻ', loc: 'Lốc', thung: 'Thùng', hop: 'Hộp' };
const getUnitBadge = (p) => {
  if (!p.unit_type || p.unit_type === 'le') return null;
  const label = UNIT_LABELS[p.unit_type] || 'Lẻ';
  const qty = p.units_per_pack > 1 ? ` ${p.units_per_pack}` : '';
  return `${label}${qty}`;
};

/* ===================================================================
   COMPONENT: Checkout (Tính tiền)
   =================================================================== */
export default function Checkout() {
  // ---- State ----
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [search, setSearch] = useState('');
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
      const [prodRes, custRes] = await Promise.all([
        api.get('/products'),
        api.get('/customers')
      ]);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // ---- Filtered products (search) ----
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase().trim();
    return products.filter((p) =>
      p.product_name.toLowerCase().includes(q)
    );
  }, [products, search]);

  // ---- Cart total ----
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // ---- Cart handlers ----
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (product.stock <= 0) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty > item.product.stock) return item;
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
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
          price: item.product.price,
          quantity: item.quantity,
        })),
      };

      if (selectedCustomerId) {
        payload.customer_id = selectedCustomerId;
        payload.is_debt = isDebt;
      }

      const res = await api.post('/orders', payload);

      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((c) => c.product.id === p.id);
          if (cartItem) {
            return { ...p, stock: p.stock - cartItem.quantity };
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
                {lastOrder.cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.product.product_name}
                        {getUnitBadge(item.product) && (
                          <span className="ml-1 text-[10px] font-semibold" style={{ color: 'var(--info)' }}>
                            ({getUnitBadge(item.product)})
                          </span>
                        )}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                    </div>
                    <span className="font-medium ml-4 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      {formatPrice(item.product.price * item.quantity)}
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
                const inCart = cart.find((item) => item.product.id === product.id);
                const cartQty = inCart ? inCart.quantity : 0;
                const remaining = product.stock - cartQty;
                const isOutOfStock = product.stock <= 0;
                const isMaxReached = remaining <= 0 && !isOutOfStock;
                return (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock || isMaxReached}
                    className="relative text-left p-4 rounded-2xl transition-all duration-200 group animate-fade-in-up"
                    style={{
                      animationDelay: `${Math.min(idx * 0.02, 0.3)}s`,
                      background: isOutOfStock
                        ? 'var(--bg-inset)'
                        : inCart
                          ? 'var(--success-bg)'
                          : 'var(--card-bg)',
                      border: `2px solid ${isOutOfStock
                          ? 'var(--border-primary)'
                          : isMaxReached
                            ? 'var(--warning)'
                            : inCart
                              ? 'var(--success)'
                              : 'var(--card-border)'
                        }`,
                      opacity: isOutOfStock ? 0.6 : 1,
                      cursor: isOutOfStock || isMaxReached ? 'not-allowed' : 'pointer',
                      boxShadow: inCart ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)',
                    }}
                    onMouseEnter={e => {
                      if (!isOutOfStock && !isMaxReached) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = inCart ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)';
                    }}
                  >
                    {/* Badge số lượng trong giỏ */}
                    {inCart && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md animate-bounce-in"
                        style={{ background: 'var(--success)' }}>
                        {inCart.quantity}
                      </span>
                    )}

                    {/* Overlay hết hàng */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                        <span className="text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md"
                          style={{ background: 'var(--danger)', transform: 'rotate(-12deg)' }}>
                          HẾT HÀNG
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                      style={{
                        background: isOutOfStock ? 'var(--bg-surface)' : inCart ? 'var(--success-light)' : 'var(--bg-inset)',
                      }}>
                      <PackageIcon className="w-5 h-5"
                        style={{ color: isOutOfStock ? 'var(--text-muted)' : inCart ? 'var(--success)' : 'var(--text-muted)' }} />
                    </div>

                    {/* Info */}
                    <p className="font-medium text-sm truncate leading-tight"
                      style={{ color: isOutOfStock ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {product.product_name}
                    </p>
                    {getUnitBadge(product) && (
                      <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1"
                        style={{
                          background: isOutOfStock ? 'var(--bg-surface)' : 'var(--info-bg)',
                          color: isOutOfStock ? 'var(--text-muted)' : 'var(--info)',
                          border: isOutOfStock ? 'none' : '1px solid var(--info-light)',
                        }}>
                        <PackageIcon className="w-3 h-3 mr-0.5" /> {getUnitBadge(product)}
                      </span>
                    )}
                    <p className="font-bold text-sm mt-1"
                      style={{ color: isOutOfStock ? 'var(--text-muted)' : inCart ? 'var(--success)' : 'var(--text-secondary)' }}>
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs mt-0.5"
                      style={{
                        color: isOutOfStock ? 'var(--danger)' : remaining <= 3 ? 'var(--warning)' : 'var(--text-muted)',
                        fontWeight: isOutOfStock || remaining <= 3 ? 600 : 400,
                      }}>
                      {isOutOfStock ? 'Hết hàng' : isMaxReached ? `Đã chọn hết (${product.stock})` : `Tồn: ${remaining}/${product.stock}`}
                    </p>
                  </button>
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
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors animate-fade-in group/cart"
                      style={{ background: 'var(--bg-inset)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-inset)'}
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                          {item.product.product_name}
                          {getUnitBadge(item.product) && (
                            <span className="ml-1 text-[10px] font-semibold px-1 py-0.5 rounded"
                              style={{ background: 'var(--info-bg)', color: 'var(--info)', border: '1px solid var(--info-light)' }}>
                              {getUnitBadge(item.product)}
                            </span>
                          )}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {formatPrice(item.product.price)} × {item.quantity}
                        </p>
                      </div>

                      {/* Subtotal */}
                      <p className="font-bold text-sm flex-shrink-0 min-w-[80px] text-right" style={{ color: 'var(--success)' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                          style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{
                            background: item.quantity >= item.product.stock ? 'var(--bg-inset)' : 'var(--success-bg)',
                            color: item.quantity >= item.product.stock ? 'var(--text-muted)' : 'var(--success)',
                            cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer',
                          }}
                          title={item.quantity >= item.product.stock ? `Tồn kho chỉ có ${item.product.stock}` : 'Thêm 1'}
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
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
