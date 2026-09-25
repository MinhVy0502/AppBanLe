import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import ProductGrid from './checkout/ProductGrid';
import CartSection from './checkout/CartSection';
import PaymentSuccessModal from './checkout/PaymentSuccessModal';
import CameraScannerModal from './checkout/CameraScannerModal';
import VietQRModal from './checkout/VietQRModal';
import ThermalReceipt from './common/ThermalReceipt';
import { getBaseUnitLabel, formatPrice } from '../utils/formatters';
import { playBeep, playErrorBuzz, playSuccessChime } from '../utils/audio';

const STORAGE_KEY_ORDERS = 'appbanle_multi_orders';

export default function Checkout({ store: propStore }) {
  // ---- Data State ----
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [store, setStore] = useState(propStore || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propStore) setStore(propStore);
  }, [propStore]);
  const [search, setSearch] = useState('');
  const [selectedShelfId, setSelectedShelfId] = useState('all');

  // ---- Multi-tab Order State (Park Orders) ----
  // Holds array of order drafts: [{ id: 1, name: 'Đơn 1', cart: [], selectedCustomerId: '', isDebt: false, paymentMethod: 'cash', cashReceived: 0 }]
  const [orderDrafts, setOrderDrafts] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // Fallback
    }
    return [
      { id: 1, name: 'Đơn 1', cart: [], selectedCustomerId: '', isDebt: false, paymentMethod: 'cash', cashReceived: 0 },
    ];
  });
  const [activeOrderIdx, setActiveOrderIdx] = useState(0);

  // Active Draft helpers
  const currentOrder = orderDrafts[activeOrderIdx] || orderDrafts[0];
  const cart = currentOrder.cart || [];
  const selectedCustomerId = currentOrder.selectedCustomerId || '';
  const isDebt = currentOrder.isDebt || false;
  const paymentMethod = currentOrder.paymentMethod || 'cash';
  const cashReceived = currentOrder.cashReceived || 0;

  // Modals & Mobile View State
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [showVietQR, setShowVietQR] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Save drafts to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orderDrafts));
    } catch (e) {
      console.error('Không thể lưu đơn tạm:', e);
    }
  }, [orderDrafts]);

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, custRes, shelfRes, profileRes] = await Promise.all([
        api.get('/products'),
        api.get('/customers'),
        api.get('/shelves'),
        api.get('/profile').catch(() => null),
      ]);
      setProducts(prodRes.data || []);
      setCustomers(custRes.data || []);
      setShelves(shelfRes.data?.data || shelfRes.data || []);
      const storeData = profileRes?.data || profileRes;
      if (storeData && storeData.id) {
        setStore(storeData);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu bán hàng:', err);
    }
    setLoading(false);
  };

  // State Updater for Active Draft
  const updateCurrentDraft = useCallback((updates) => {
    setOrderDrafts((prev) => {
      const next = [...prev];
      const target = next[activeOrderIdx] || next[0];
      next[activeOrderIdx] = { ...target, ...updates };
      return next;
    });
  }, [activeOrderIdx]);

  // Multi-cart Tab Management
  const addOrderTab = () => {
    if (orderDrafts.length >= 5) {
      alert('Tối đa lưu 5 đơn hàng cùng lúc.');
      return;
    }
    const newId = Date.now();
    const newNum = orderDrafts.length + 1;
    setOrderDrafts((prev) => [
      ...prev,
      { id: newId, name: `Đơn ${newNum}`, cart: [], selectedCustomerId: '', isDebt: false, paymentMethod: 'cash', cashReceived: 0 },
    ]);
    setActiveOrderIdx(orderDrafts.length);
  };

  const closeOrderTab = (e, index) => {
    e.stopPropagation();
    if (orderDrafts.length === 1) {
      // Just clear
      updateCurrentDraft({ cart: [], selectedCustomerId: '', isDebt: false, cashReceived: 0 });
      return;
    }
    const next = orderDrafts.filter((_, idx) => idx !== index);
    setOrderDrafts(next);
    setActiveOrderIdx(Math.max(0, index - 1));
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedShelfId !== 'all') {
      if (selectedShelfId === 'none') {
        result = result.filter((p) => !p.shelf_id);
      } else {
        result = result.filter((p) => p.shelf_id === Number(selectedShelfId));
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.product_name.toLowerCase().includes(q);
        const barcodeMatch = p.barcode && p.barcode.toLowerCase().includes(q);
        const unitBarcodeMatch = (p.units || []).some(
          (u) => u.barcode && u.barcode.toLowerCase().includes(q)
        );
        return nameMatch || barcodeMatch || unitBarcodeMatch;
      });
    }

    return result;
  }, [products, search, selectedShelfId]);

  // Count products per shelf
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

  // Cart Totals
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Add Item to Cart
  const addToCart = useCallback((product, unit = null) => {
    const unitName = unit ? unit.unit_name : getBaseUnitLabel(product.unit_type);
    const conversionRate = unit ? Number(unit.conversion_rate) || 1 : 1;
    const unitPrice = unit ? Number(unit.price) : Number(product.price);
    const cartId = `${product.id}_${unitName}`;

    // Check stock
    const currentBaseInCart = cart
      .filter((item) => item.product.id === product.id)
      .reduce((sum, item) => sum + item.quantity * item.conversion_rate, 0);

    if (currentBaseInCart + conversionRate > product.stock) {
      playErrorBuzz();
      alert(`"${product.product_name}" không đủ tồn kho để thêm!`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.cart_id === cartId);
    let nextCart = [];
    if (existingIndex > -1) {
      nextCart = [...cart];
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        quantity: nextCart[existingIndex].quantity + 1,
      };
    } else {
      nextCart = [
        ...cart,
        {
          cart_id: cartId,
          product,
          unit_name: unitName,
          conversion_rate: conversionRate,
          price: unitPrice,
          quantity: 1,
        },
      ];
    }

    updateCurrentDraft({ cart: nextCart, cashReceived: totalPrice + unitPrice });
    playBeep();
  }, [cart, totalPrice, updateCurrentDraft]);

  // Quantity Controls
  const updateQuantity = (cartId, delta) => {
    const item = cart.find((i) => i.cart_id === cartId);
    if (!item) return;

    if (delta > 0) {
      const currentBaseInCart = cart
        .filter((i) => i.product.id === item.product.id)
        .reduce((sum, i) => sum + i.quantity * i.conversion_rate, 0);

      if (currentBaseInCart + item.conversion_rate > item.product.stock) {
        playErrorBuzz();
        alert(`Không đủ tồn kho để tăng thêm!`);
        return;
      }
    }

    const nextQty = item.quantity + delta;
    let nextCart = [];
    if (nextQty <= 0) {
      nextCart = cart.filter((i) => i.cart_id !== cartId);
    } else {
      nextCart = cart.map((i) => (i.cart_id === cartId ? { ...i, quantity: nextQty } : i));
    }

    updateCurrentDraft({ cart: nextCart });
  };

  const removeFromCart = (cartId) => {
    updateCurrentDraft({ cart: cart.filter((i) => i.cart_id !== cartId) });
  };

  const clearCart = () => {
    updateCurrentDraft({ cart: [], cashReceived: 0 });
  };

  // Barcode Detection Handler (Camera or Scanner)
  const handleBarcodeDetected = useCallback((barcode) => {
    if (!barcode) return;
    const clean = String(barcode).trim().toLowerCase();

    // 1. Search in base products barcode
    let matchedProduct = products.find((p) => p.barcode && String(p.barcode).trim().toLowerCase() === clean);
    let matchedUnit = null;

    // 2. If not found, search in product units
    if (!matchedProduct) {
      for (const p of products) {
        const u = (p.units || []).find((unit) => unit.barcode && String(unit.barcode).trim().toLowerCase() === clean);
        if (u) {
          matchedProduct = p;
          matchedUnit = u;
          break;
        }
      }
    }

    // 3. If not found, try matching last 4 digits
    if (!matchedProduct && clean.length >= 4) {
      matchedProduct = products.find((p) => p.barcode && p.barcode.endsWith(clean));
      if (!matchedProduct) {
        for (const p of products) {
          const u = (p.units || []).find((unit) => unit.barcode && unit.barcode.endsWith(clean));
          if (u) {
            matchedProduct = p;
            matchedUnit = u;
            break;
          }
        }
      }
    }

    if (matchedProduct) {
      addToCart(matchedProduct, matchedUnit);
    } else {
      playErrorBuzz();
      alert(`Không tìm thấy sản phẩm có mã vạch: "${barcode}"`);
    }
  }, [products, addToCart]);

  // Global Hardware Barcode Scanner Listener (USB / Bluetooth Keydown wedge)
  const barcodeBufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) {
        return;
      }

      const now = Date.now();
      // If time between keystrokes is > 80ms, it's human typing, reset buffer
      if (now - lastKeyTimeRef.current > 80) {
        barcodeBufferRef.current = '';
      }
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        if (barcodeBufferRef.current.length >= 3) {
          e.preventDefault();
          handleBarcodeDetected(barcodeBufferRef.current);
          barcodeBufferRef.current = '';
        }
      } else if (e.key.length === 1) {
        barcodeBufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBarcodeDetected]);

  // Execute Checkout API
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setPaying(true);
    try {
      const payload = {
        total_price: totalPrice,
        payment_method: paymentMethod,
        cash_received: paymentMethod === 'cash' ? (Number(cashReceived) || totalPrice) : totalPrice,
        change_amount: paymentMethod === 'cash' ? Math.max(0, (Number(cashReceived) || totalPrice) - totalPrice) : 0,
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

      // Deduct stock in local view
      setProducts((prev) =>
        prev.map((p) => {
          const cartItemsForP = cart.filter((c) => c.product.id === p.id);
          if (cartItemsForP.length > 0) {
            const totalDeducted = cartItemsForP.reduce(
              (sum, c) => sum + c.quantity * c.conversion_rate,
              0
            );
            return { ...p, stock: Math.max(0, p.stock - totalDeducted) };
          }
          return p;
        })
      );

      // Save order receipt for modal and thermal print
      const completedOrderData = {
        ...res.data,
        cart: [...cart],
        total: totalPrice,
        customer: customers.find((c) => c.id === Number(selectedCustomerId)),
        is_debt: isDebt,
        payment_method: paymentMethod,
        cash_received: payload.cash_received,
        change_amount: payload.change_amount,
        created_at: new Date().toISOString(),
      };

      setLastOrder(completedOrderData);
      playSuccessChime();

      // Clear current draft
      updateCurrentDraft({
        cart: [],
        selectedCustomerId: '',
        isDebt: false,
        cashReceived: 0,
        paymentMethod: 'cash',
      });

      setIsMobileDrawerOpen(false);
      setShowVietQR(false);
      setShowSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi thanh toán, vui lòng thử lại.';
      playErrorBuzz();
      alert(msg);
      console.error('Lỗi thanh toán:', err);
    }
    setPaying(false);
  };

  const handleOpenVietQR = async () => {
    try {
      const res = await api.get('/profile');
      const s = res?.data || res;
      if (s && s.id) {
        setStore(s);
      }
    } catch (_) {}
    setShowVietQR(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--success)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#14b8a6', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--info)', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-semibold text-sm">Đang tải dữ liệu bán hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto pb-28 lg:pb-8 animate-fade-in">
      {/* Top Bar: Multi-order Tabs (Park Orders) */}
      <div className="flex items-center justify-between gap-2 mb-4 overflow-x-auto pb-1 custom-scrollbar">
        <div className="flex items-center gap-1.5 flex-1">
          {orderDrafts.map((draft, idx) => {
            const isActive = idx === activeOrderIdx;
            const draftItemCount = (draft.cart || []).reduce((sum, i) => sum + i.quantity, 0);

            return (
              <button
                key={draft.id}
                type="button"
                onClick={() => setActiveOrderIdx(idx)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 shadow-sm ${
                  isActive ? 'shadow-md scale-102' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: isActive ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                <span>{draft.name}</span>
                {draftItemCount > 0 && (
                  <span
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-black"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--brand-light)',
                      color: isActive ? '#fff' : 'var(--brand-primary)',
                    }}
                  >
                    {draftItemCount}
                  </span>
                )}
                {orderDrafts.length > 1 && (
                  <span
                    onClick={(e) => closeOrderTab(e, idx)}
                    className="ml-1 opacity-60 hover:opacity-100 hover:text-red-300 cursor-pointer"
                    title="Đóng đơn này"
                  >
                    ✕
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={addOrderTab}
            className="w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-sm cursor-pointer border border-dashed border-secondary hover:border-brand-primary transition-colors text-muted hover:text-brand-primary flex-shrink-0"
            title="Thêm đơn hàng tạm (Lưu đơn)"
          >
            +
          </button>
        </div>

        {/* Barcode Scan Shortcut Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted font-medium bg-slate-100 dark:bg-slate-800/60 py-1.5 px-3 rounded-xl border border-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sẵn sàng quét súng USB / Bluetooth</span>
        </div>
      </div>

      {/* Main Dual-column Layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: Product Grid & Search */}
        <ProductGrid
          shelves={shelves}
          selectedShelfId={selectedShelfId}
          setSelectedShelfId={setSelectedShelfId}
          shelfProductCounts={shelfProductCounts}
          search={search}
          setSearch={setSearch}
          filteredProducts={filteredProducts}
          cart={cart}
          addToCart={addToCart}
          onOpenScanner={() => setShowCameraScanner(true)}
        />

        {/* Right: Cart Section (Desktop Sticky) */}
        <div className="hidden lg:block w-[400px] flex-shrink-0">
          <CartSection
            cart={cart}
            totalItems={totalItems}
            totalPrice={totalPrice}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            setSelectedCustomerId={(id) => updateCurrentDraft({ selectedCustomerId: id })}
            isDebt={isDebt}
            setIsDebt={(val) => updateCurrentDraft({ isDebt: val })}
            paymentMethod={paymentMethod}
            setPaymentMethod={(method) => updateCurrentDraft({ paymentMethod: method })}
            cashReceived={cashReceived}
            setCashReceived={(amount) => updateCurrentDraft({ cashReceived: amount })}
            paying={paying}
            handleCheckout={handleCheckout}
            onOpenVietQR={handleOpenVietQR}
          />
        </div>
      </div>

      {/* ========================================================
          MOBILE FLOATING CART BUTTON (When items > 0)
          ======================================================== */}
      {totalItems > 0 && !isMobileDrawerOpen && (
        <div className="lg:hidden fixed bottom-18 inset-x-3 z-30 animate-slide-up">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="w-full py-3 px-4 rounded-2xl text-white font-bold flex items-center justify-between shadow-2xl transition-all cursor-pointer active:scale-98"
            style={{
              background: 'linear-gradient(135deg, var(--success), #14b8a6)',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-xs font-black">
                {totalItems}
              </span>
              <span className="text-sm font-semibold">Xem giỏ hàng</span>
            </div>

            <div className="flex items-center gap-1.5 font-black text-base">
              <span>{formatPrice(totalPrice)}</span>
              <span>➔</span>
            </div>
          </button>
        </div>
      )}

      {/* ========================================================
          MOBILE CART BOTTOM SHEET DRAWER
          ======================================================== */}
      {isMobileDrawerOpen && createPortal(
        <div
          className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-md flex flex-col justify-end animate-fade-in"
          style={{ zIndex: 999 }}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="h-[92vh] max-h-[94vh] w-full flex flex-col overflow-hidden rounded-t-3xl shadow-2xl"
            style={{ zIndex: 1000 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CartSection
              cart={cart}
              totalItems={totalItems}
              totalPrice={totalPrice}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              setSelectedCustomerId={(id) => updateCurrentDraft({ selectedCustomerId: id })}
              isDebt={isDebt}
              setIsDebt={(val) => updateCurrentDraft({ isDebt: val })}
              paymentMethod={paymentMethod}
              setPaymentMethod={(method) => updateCurrentDraft({ paymentMethod: method })}
              cashReceived={cashReceived}
              setCashReceived={(amount) => updateCurrentDraft({ cashReceived: amount })}
              paying={paying}
              handleCheckout={handleCheckout}
              onOpenVietQR={handleOpenVietQR}
              isMobileDrawer={true}
              onCloseDrawer={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Camera Barcode Scanner Modal */}
      <CameraScannerModal
        isOpen={showCameraScanner}
        onClose={() => setShowCameraScanner(false)}
        onDetected={handleBarcodeDetected}
        products={products}
      />

      {/* Dynamic VietQR Modal */}
      <VietQRModal
        isOpen={showVietQR}
        onClose={() => setShowVietQR(false)}
        onConfirmPaid={handleCheckout}
        totalAmount={totalPrice}
        store={store}
        orderId={lastOrder?.id || 'DH'}
      />

      {/* Payment Success Receipt Modal */}
      <PaymentSuccessModal
        showSuccess={showSuccess}
        lastOrder={lastOrder}
        store={store}
        onClose={() => {
          setShowSuccess(false);
          setLastOrder(null);
        }}
      />

      {/* Hidden Printable Thermal Receipt for K80 / K58 bill printing */}
      <ThermalReceipt order={lastOrder} store={store} />
    </div>
  );
}
