import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

/* ===================================================================
   ICONS
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
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // ---- Fetch products ----
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
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
        // Không cho vượt quá tồn kho
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Không thêm nếu hết hàng
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
          // Không vượt quá tồn kho
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
      const res = await api.post('/orders', {
        total_price: totalPrice,
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.product_name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      });

      // Cập nhật tồn kho trong state
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((c) => c.product.id === p.id);
          if (cartItem) {
            return { ...p, stock: p.stock - cartItem.quantity };
          }
          return p;
        })
      );

      setLastOrder({ ...res.data, cart: [...cart], total: totalPrice });
      setCart([]);
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
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse-dot" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-gray-400 font-medium">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // ---- Success Screen ----
  if (showSuccess && lastOrder) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-modal-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-10 text-center">
            <CheckCircleIcon className="w-20 h-20 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Thanh toán thành công!</h2>
            <p className="text-emerald-100 mt-2">Hóa đơn #{lastOrder.data?.id} đã được tạo</p>
          </div>

          {/* Receipt */}
          <div className="p-6 sm:p-8">
            <div className="border border-dashed border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <ReceiptIcon className="w-5 h-5 text-gray-400" />
                Chi tiết hóa đơn
              </h3>
              <div className="space-y-2.5">
                {lastOrder.cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-gray-700 truncate">
                        {item.product.product_name}
                        {getUnitBadge(item.product) && (
                          <span className="ml-1 text-[10px] text-blue-500 font-semibold">
                            ({getUnitBadge(item.product)})
                          </span>
                        )}
                      </span>
                      <span className="text-gray-400">×{item.quantity}</span>
                    </div>
                    <span className="font-medium text-gray-900 ml-4 flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                <span className="font-bold text-emerald-600 text-xl">{formatPrice(lastOrder.total)}</span>
              </div>
            </div>

            <button
              onClick={() => { setShowSuccess(false); setLastOrder(null); }}
              className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              Tạo hóa đơn mới
            </button>
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
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <ReceiptIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tính tiền</h1>
              <p className="text-sm text-gray-400">{products.length} sản phẩm</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-5">
            <SearchIcon className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Product grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <PackageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">
                {search ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
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
                    className={`
                      relative text-left p-4 rounded-2xl border-2 transition-all duration-200 group
                      ${isOutOfStock
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : isMaxReached
                          ? 'border-orange-200 bg-orange-50/40 cursor-not-allowed'
                          : inCart
                            ? 'border-emerald-300 bg-emerald-50/60 shadow-md shadow-emerald-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                            : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                      }
                    `}
                  >
                    {/* Badge số lượng trong giỏ */}
                    {inCart && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-md animate-fade-in">
                        {inCart.quantity}
                      </span>
                    )}

                    {/* Overlay hết hàng */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md rotate-[-12deg]">
                          HẾT HÀNG
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isOutOfStock ? 'bg-gray-100' : inCart ? 'bg-emerald-100' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <PackageIcon className={`w-5 h-5 ${isOutOfStock ? 'text-gray-300' : inCart ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>

                    {/* Info */}
                    <p className={`font-medium text-sm truncate leading-tight ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                      {product.product_name}
                    </p>
                    {getUnitBadge(product) && (
                      <span className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1 ${
                        isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        📦 {getUnitBadge(product)}
                      </span>
                    )}
                    <p className={`font-bold text-sm mt-1 ${isOutOfStock ? 'text-gray-300' : inCart ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {formatPrice(product.price)}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      isOutOfStock ? 'text-red-400 font-semibold' : remaining <= 3 ? 'text-orange-500 font-semibold' : 'text-gray-300'
                    }`}>
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl sticky top-20 overflow-hidden">
            {/* Cart header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4 flex items-center justify-between">
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
                  <CartIcon className="w-14 h-14 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium text-sm">Chưa có sản phẩm nào</p>
                  <p className="text-gray-300 text-xs mt-1">Bấm vào sản phẩm bên trái để thêm</p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors animate-fade-in group/cart"
                    >
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.product.product_name}
                          {getUnitBadge(item.product) && (
                            <span className="ml-1 text-[10px] font-semibold px-1 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100">
                              {getUnitBadge(item.product)}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </p>
                      </div>

                      {/* Subtotal */}
                      <p className="font-bold text-emerald-600 text-sm flex-shrink-0 min-w-[80px] text-right">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-sm text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            item.quantity >= item.product.stock
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 cursor-pointer'
                          }`}
                          title={item.quantity >= item.product.stock ? `Tồn kho chỉ có ${item.product.stock}` : 'Thêm 1'}
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center opacity-0 group-hover/cart:opacity-100 transition-all cursor-pointer flex-shrink-0"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider + Total + Pay */}
            <div className="border-t border-gray-100 p-5">
              {/* Total */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-gray-500 font-medium">Tổng cộng</span>
                <span className={`font-extrabold text-2xl transition-all ${totalPrice > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Pay button */}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || paying}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all cursor-pointer"
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
