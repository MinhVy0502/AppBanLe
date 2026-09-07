import { CheckCircleIcon, ReceiptIcon, UserIcon } from '../common/Icons';
import { formatPrice } from '../../utils/formatters';

export default function PaymentSuccessModal({ showSuccess, lastOrder, onClose }) {
  if (!showSuccess || !lastOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="card-themed w-full max-w-lg rounded-3xl overflow-hidden animate-scale-up"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header */}
        <div
          className="p-6 text-center text-white relative overflow-hidden"
          style={{
            background: lastOrder.is_debt
              ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
              : 'linear-gradient(135deg, var(--success), #14b8a6)',
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-3">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold">
            {lastOrder.is_debt ? 'Ghi nợ thành công!' : 'Thanh toán thành công!'}
          </h2>
          <p className="text-sm opacity-90 mt-1 flex items-center justify-center gap-2">
            Hóa đơn #{lastOrder.data?.id || lastOrder.id}
            {lastOrder.is_debt && (
              <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded font-bold">
                MUA CHỊU
              </span>
            )}
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ border: '2px dashed var(--border-primary)', background: 'var(--bg-surface)' }}
          >
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <ReceiptIcon className="w-4 h-4 text-muted" /> Chi tiết hóa đơn
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
              {lastOrder.cart.map((item, idx) => (
                <div key={item.cart_id || idx} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="truncate font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {item.product?.product_name || item.product_name}
                    </span>
                    {item.unit_name && (
                      <span
                        className="px-1.5 py-0.2 rounded text-[10px] font-bold flex-shrink-0"
                        style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)' }}
                      >
                        {item.unit_name}
                      </span>
                    )}
                    <span className="text-muted flex-shrink-0">×{item.quantity}</span>
                  </div>
                  <span className="font-bold ml-3 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-between font-bold text-base pt-3"
              style={{ borderTop: '2px dashed var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <span>Tổng tiền</span>
              <span style={{ color: 'var(--success)' }}>{formatPrice(lastOrder.total)}</span>
            </div>
          </div>

          {/* Customer info */}
          {lastOrder.customer && (
            <div
              className="mt-4 p-3 rounded-xl flex items-center justify-between"
              style={{ background: 'var(--bg-inset)' }}
            >
              <div>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <UserIcon className="w-3.5 h-3.5" /> Khách hàng
                </span>
                <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {lastOrder.customer.customer_name}
                </p>
              </div>
              {lastOrder.is_debt && (
                <div className="text-right">
                  <span className="text-[11px]" style={{ color: 'var(--warning)' }}>
                    Đã ghi vào nợ
                  </span>
                  <p className="font-bold text-sm" style={{ color: 'var(--warning)' }}>
                    +{formatPrice(lastOrder.total)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            Tạo hóa đơn mới
          </button>
        </div>
      </div>
    </div>
  );
}
