import { useState, useMemo } from 'react';
import { CartIcon, MinusIcon, PlusIcon, TrashIcon, UserIcon } from '../common/Icons';
import { formatPrice, getBaseUnitLabel } from '../../utils/formatters';

export default function CartSection({
  cart,
  totalItems,
  totalPrice,
  updateQuantity,
  removeFromCart,
  clearCart,
  customers,
  selectedCustomerId,
  setSelectedCustomerId,
  isDebt,
  setIsDebt,
  paymentMethod,
  setPaymentMethod,
  cashReceived,
  setCashReceived,
  paying,
  handleCheckout,
  onOpenVietQR,
  isMobileDrawer = false,
  onCloseDrawer,
}) {
  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId));

  // Change amount calculation
  const changeAmount = useMemo(() => {
    if (paymentMethod !== 'cash') return 0;
    const received = Number(cashReceived) || 0;
    return Math.max(0, received - totalPrice);
  }, [cashReceived, totalPrice, paymentMethod]);

  // Fast cash presets
  const fastCashOptions = useMemo(() => {
    const list = [totalPrice];
    [50000, 100000, 200000, 500000, 1000000].forEach((val) => {
      if (val >= totalPrice && !list.includes(val)) {
        list.push(val);
      }
    });
    return list.slice(0, 4);
  }, [totalPrice]);

  return (
    <div className={`w-full lg:w-[400px] flex-shrink-0 ${isMobileDrawer ? 'h-full flex flex-col' : ''}`}>
      <div
        className={`card-themed overflow-hidden flex flex-col ${
          isMobileDrawer
            ? 'h-full rounded-t-3xl border-0 shadow-2xl'
            : 'rounded-3xl sticky top-20 shadow-xl border border-secondary'
        }`}
      >
        {/* Cart header */}
        <div
          className="px-5 py-3.5 flex items-center justify-between text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Hóa đơn bán</h2>
              {totalItems > 0 && (
                <span className="text-[11px] opacity-90 font-medium">
                  {totalItems} món • {formatPrice(totalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-white/80 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
              >
                Xóa hết
              </button>
            )}

            {isMobileDrawer && (
              <button
                type="button"
                onClick={onCloseDrawer}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body: Cart items + Customer & Payment info */}
        <div className={`overflow-y-auto custom-scrollbar p-3 sm:p-4 space-y-3 ${isMobileDrawer ? 'flex-1 min-h-0' : 'max-h-[calc(100vh-280px)]'}`}>
          {/* Cart items list */}
          <div className="space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-2.5 flex items-center justify-center" style={{ background: 'var(--bg-inset)' }}>
                  <CartIcon className="w-7 h-7 opacity-30" />
                </div>
                <p className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                  Chưa có sản phẩm nào
                </p>
                <p className="text-[11px] mt-0.5 opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Chạm vào sản phẩm hoặc quét mã vạch để thêm
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cart_id}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl transition-all group/cart"
                  style={{ background: 'var(--bg-inset)' }}
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.product.product_name}
                      <span
                        className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: 'var(--brand-light)',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        {item.unit_name}
                      </span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {formatPrice(item.price)} × {item.quantity}
                      {item.conversion_rate > 1 && (
                        <span className="opacity-70 ml-1">
                          (= {item.quantity * item.conversion_rate}{' '}
                          {getBaseUnitLabel(item.product.unit_type).toLowerCase()})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Subtotal */}
                  <p
                    className="font-bold text-xs sm:text-sm flex-shrink-0 min-w-[65px] text-right"
                    style={{ color: 'var(--success)' }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-surface rounded-xl p-0.5 border border-secondary flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cart_id, -1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-surface-hover transition-colors cursor-pointer text-muted hover:text-primary"
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs w-5 text-center" style={{ color: 'var(--text-primary)' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cart_id, 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-surface-hover transition-colors cursor-pointer text-muted hover:text-primary"
                    >
                      <PlusIcon className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cart_id)}
                    className="w-7 h-7 rounded-xl flex items-center justify-center opacity-50 hover:opacity-100 transition-colors cursor-pointer text-muted hover:text-red-500"
                    title="Xóa món"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Customer & Payment Options Area */}
          <div className="pt-2 border-t border-secondary space-y-3">
            {/* Customer Selection */}
            <div>
              <label
                className="text-xs font-bold flex items-center justify-between mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-muted" /> Khách hàng
                </span>
                {selectedCustomer && Number(selectedCustomer.total_debt) > 0 && (
                  <span className="text-[10px] text-amber-500 font-bold">
                    Nợ cũ: {formatPrice(selectedCustomer.total_debt)}
                  </span>
                )}
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  if (!e.target.value && paymentMethod === 'debt') {
                    setPaymentMethod('cash');
                    setIsDebt(false);
                  }
                }}
                className="input-themed w-full py-2 px-3 text-xs rounded-xl font-medium"
              >
                <option value="">Khách vãng lai (Không lưu tên)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customer_name} {c.phone ? `(${c.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Hình thức thanh toán
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl" style={{ background: 'var(--bg-inset)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('cash');
                    setIsDebt(false);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'cash' ? 'shadow-md text-white' : ''
                  }`}
                  style={{
                    background: paymentMethod === 'cash' ? 'linear-gradient(135deg, var(--success), #14b8a6)' : 'transparent',
                    color: paymentMethod === 'cash' ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <span>💵 Tiền mặt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('transfer');
                    setIsDebt(false);
                    if (onOpenVietQR) onOpenVietQR();
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'transfer' ? 'shadow-md text-white' : ''
                  }`}
                  style={{
                    background: paymentMethod === 'transfer' ? 'linear-gradient(135deg, #0ea5e9, #3b82f6)' : 'transparent',
                    color: paymentMethod === 'transfer' ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  <span>📱 VietQR</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedCustomerId}
                  onClick={() => {
                    setPaymentMethod('debt');
                    setIsDebt(true);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
                    paymentMethod === 'debt' ? 'shadow-md text-white' : ''
                  }`}
                  style={{
                    background: paymentMethod === 'debt' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                    color: paymentMethod === 'debt' ? '#fff' : 'var(--text-secondary)',
                  }}
                  title={!selectedCustomerId ? 'Chọn khách hàng để ghi nợ' : ''}
                >
                  <span>📝 Ghi nợ</span>
                </button>
              </div>
            </div>

            {/* Cash Received Details */}
            {paymentMethod === 'cash' && (
              <div className="p-3 rounded-2xl space-y-2 animate-fade-in" style={{ background: 'var(--bg-inset)' }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Tiền khách đưa:</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={cashReceived || ''}
                    onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                    className="input-themed w-28 py-1 px-2 text-right font-bold text-xs rounded-lg"
                  />
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {fastCashOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCashReceived(opt)}
                      className="text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer"
                      style={{
                        background: cashReceived === opt ? 'var(--brand-primary)' : 'var(--bg-surface)',
                        color: cashReceived === opt ? '#fff' : 'var(--text-secondary)',
                        borderColor: cashReceived === opt ? 'var(--brand-primary)' : 'var(--border-secondary)',
                      }}
                    >
                      {opt === totalPrice ? 'Đúng tiền' : `${opt / 1000}k`}
                    </button>
                  ))}
                </div>

                {Number(cashReceived) >= totalPrice && (
                  <div className="flex items-baseline justify-between pt-1 border-t border-secondary text-xs">
                    <span className="font-bold text-emerald-500">Thối lại khách:</span>
                    <span className="font-bold text-sm text-emerald-500">
                      {formatPrice(changeAmount)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Bottom Footer: Total & Checkout Button */}
        <div
          className={`p-3.5 sm:p-4 border-t border-secondary flex-shrink-0 ${isMobileDrawer ? 'pb-8 sm:pb-4' : ''}`}
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Tổng thanh toán:
            </span>
            <span className="text-xl font-black" style={{ color: 'var(--success)' }}>
              {formatPrice(totalPrice)}
            </span>
          </div>

          <button
            type="button"
            onClick={paymentMethod === 'transfer' ? onOpenVietQR : handleCheckout}
            disabled={cart.length === 0 || paying}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg active:scale-98"
            style={{
              background:
                paymentMethod === 'debt'
                  ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
                  : paymentMethod === 'transfer'
                  ? 'linear-gradient(135deg, #0ea5e9, #3b82f6)'
                  : 'linear-gradient(135deg, var(--success), #14b8a6)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
            }}
          >
            {paying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : paymentMethod === 'debt' ? (
              <span>Xác nhận Ghi nợ ({formatPrice(totalPrice)})</span>
            ) : paymentMethod === 'transfer' ? (
              <span>Quét VietQR & Thanh toán ({formatPrice(totalPrice)})</span>
            ) : (
              <span>Thanh toán Tiền mặt ({formatPrice(totalPrice)})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
