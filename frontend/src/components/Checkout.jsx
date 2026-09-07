import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import ProductGrid from './checkout/ProductGrid';
import CartSection from './checkout/CartSection';
import PaymentSuccessModal from './checkout/PaymentSuccessModal';
import { getBaseUnitLabel } from '../utils/formatters';

const CART_STORAGE_KEY = 'appbanle_cart';

export default function Checkout() {
  // ---- State ----
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shelves, setShelves] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedShelfId, setSelectedShelfId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Customer / Debt state
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isDebt, setIsDebt] = useState(false);

  // Cart state persisted to sessionStorage (avoids losing cart on tab change)
  const [cart, setCart] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Không thể lưu giỏ hàng vào sessionStorage:', err);
    }
  }, [cart]);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, custRes, shelfRes] = await Promise.all([
        api.get('/products'),
        api.get('/customers'),
        api.get('/shelves'),
      ]);
      setProducts(prodRes.data || []);
      setCustomers(custRes.data || []);
      setShelves(shelfRes.data?.data || shelfRes.data || []);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
    setLoading(false);
  };

  // Filtered products (by search and shelf)
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
      result = result.filter((p) => p.product_name.toLowerCase().includes(q));
    }

    return result;
  }, [products, search, selectedShelfId]);

  // Count products per shelf for badges
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

  // Totals
  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Cart handlers
  const addToCart = (product, unit = null) => {
    const unitName = unit ? unit.unit_name : getBaseUnitLabel(product.unit_type);
    const conversionRate = unit ? Number(unit.conversion_rate) || 1 : 1;
    const unitPrice = unit ? Number(unit.price) : Number(product.price);
    const cartId = `${product.id}_${unitName}`;

    setCart((prev) => {
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

      const nextQty = item.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((i) => i.cart_id !== cartId);
      }

      return prev.map((i) => (i.cart_id === cartId ? { ...i, quantity: nextQty } : i));
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((i) => i.cart_id !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem(CART_STORAGE_KEY);
  };

  // Checkout submission
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

      // Save order receipt for modal
      setLastOrder({
        ...res.data,
        cart: [...cart],
        total: totalPrice,
        customer: customers.find((c) => c.id === Number(selectedCustomerId)),
        is_debt: isDebt,
      });

      // Clear cart
      setCart([]);
      sessionStorage.removeItem(CART_STORAGE_KEY);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--success)', animationDelay: '0s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: '#14b8a6', animationDelay: '0.2s' }} />
            <div className="w-3 h-3 rounded-full animate-pulse-dot" style={{ background: 'var(--info)', animationDelay: '0.4s' }} />
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="font-medium text-sm">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Product search and list */}
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
        />

        {/* Right: Cart & Invoice */}
        <CartSection
          cart={cart}
          totalItems={totalItems}
          totalPrice={totalPrice}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
          customers={customers}
          selectedCustomerId={selectedCustomerId}
          setSelectedCustomerId={setSelectedCustomerId}
          isDebt={isDebt}
          setIsDebt={setIsDebt}
          paying={paying}
          handleCheckout={handleCheckout}
        />
      </div>

      {/* Success Modal */}
      <PaymentSuccessModal
        showSuccess={showSuccess}
        lastOrder={lastOrder}
        onClose={() => {
          setShowSuccess(false);
          setLastOrder(null);
        }}
      />
    </div>
  );
}
