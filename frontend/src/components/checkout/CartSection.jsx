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
  paying,
  handleCheckout,
}) {
  const selectedCustomer = customers.find((c) => String(c.id) === String(selectedCustomerId));

  return (
    <div className="w-full lg:w-[380px] flex-shrink-0">
      <div
        className="rounded-2xl sticky top-20 overflow-hidden card-themed"
        style={{
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {/* Cart header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)' }}
        >
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
              className="text-white/80 hover:text-white text-xs font-semibold px-2 py-1 rounded transition-colors cursor-pointer"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-12 px-6">
              <CartIcon className="w-12 h-12 mx-auto mb-3 opacity-25 text-muted" />
              <p className="font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>
                Chưa có sản phẩm nào
              </p>
              <p className="text-xs mt-1 opacity-70" style={{ color: 'var(--text-muted)' }}>
                Bấm vào sản phẩm bên trái để thêm
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.cart_id}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl transition-colors animate-fade-in group/cart"
                  style={{ background: 'var(--bg-inset)' }}
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.product.product_name}
                      <span
                        className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: 'var(--brand-light)',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        {item.unit_name}
                      </span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
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
                    className="font-bold text-sm flex-shrink-0 min-w-[70px] text-right"
                    style={{ color: 'var(--success)' }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.cart_id, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                      title="Giảm"
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className="w-6 text-center font-bold text-xs"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cart_id, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                      title="Tăng"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.cart_id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-60 hover:opacity-100 transition-colors cursor-pointer text-muted hover:text-red-500"
                    title="Xóa món"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer & Payment Options */}
        <div
          className="p-4 space-y-3"
          style={{ borderTop: '1px solid var(--border-secondary)' }}
        >
          {/* Customer Selection */}
          <div>
            <label
              className="text-xs font-semibold flex items-center gap-1.5 mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              <UserIcon className="w-4 h-4 text-muted" /> Khách hàng
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                if (!e.target.value) setIsDebt(false);
              }}
              className="input-themed w-full py-2 px-3 text-xs rounded-xl"
            >
              <option value="">Khách vãng lai (Không lưu tên)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name} {c.phone ? `(${c.phone})` : ''} - Nợ: {formatPrice(c.total_debt)}
                </option>
              ))}
            </select>
          </div>

          {/* Debt checkbox (Only available if customer is chosen) */}
          {selectedCustomerId && (
            <label
              className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-colors"
              style={{
                background: isDebt ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-inset)',
                border: isDebt ? '1px solid var(--warning)' : '1px solid transparent',
              }}
            >
              <input
                type="checkbox"
                checked={isDebt}
                onChange={(e) => setIsDebt(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-xs font-bold" style={{ color: isDebt ? 'var(--warning)' : 'var(--text-primary)' }}>
                  Ghi nợ (Mua chịu)
                </span>
                <p className="text-[11px] opacity-70" style={{ color: 'var(--text-muted)' }}>
                  Số tiền sẽ được cộng vào tổng nợ của khách
                </p>
              </div>
            </label>
          )}

          {/* Total & Checkout Button */}
          <div className="pt-2">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Tổng thanh toán:
              </span>
              <span className="text-xl font-bold" style={{ color: 'var(--success)' }}>
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || paying}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: isDebt
                  ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
                  : 'linear-gradient(135deg, var(--success), #14b8a6)',
                boxShadow: isDebt
                  ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                  : '0 4px 15px rgba(16, 185, 129, 0.3)',
              }}
            >
              {paying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : isDebt ? (
                <span>Xác nhận Ghi nợ ({formatPrice(totalPrice)})</span>
              ) : (
                <span>Thanh toán ngay ({formatPrice(totalPrice)})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
