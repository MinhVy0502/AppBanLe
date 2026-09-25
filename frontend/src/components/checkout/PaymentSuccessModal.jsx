import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, ReceiptIcon, UserIcon } from '../common/Icons';
import { formatPrice } from '../../utils/formatters';

export default function PaymentSuccessModal({ showSuccess, lastOrder, onClose, store }) {
  const [copied, setCopied] = useState(false);

  if (!showSuccess || !lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const items = lastOrder.cart || lastOrder.items || [];
    const itemText = items
      .map((i) => `- ${i.product_name || i.product?.product_name}: ${i.quantity} ${i.unit_name || ''} = ${formatPrice(i.price * i.quantity)}`)
      .join('\n');
    const text = `CỬA HÀNG: ${store?.store_name || 'AppBanLe'}\nHÓA ĐƠN #${lastOrder.data?.id || lastOrder.id}\n${itemText}\nTỔNG TIỀN: ${formatPrice(lastOrder.total || lastOrder.total_price)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      style={{ zIndex: 1200 }}
      onClick={onClose}
    >
      <div
        className="card-themed w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative"
        style={{ border: '1px solid var(--border-primary)', zIndex: 1201 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-5 text-center text-white relative overflow-hidden flex-shrink-0"
          style={{
            background: lastOrder.is_debt
              ? 'linear-gradient(135deg, #f59e0b, #ea580c)'
              : lastOrder.payment_method === 'transfer'
              ? 'linear-gradient(135deg, #0ea5e9, #3b82f6)'
              : 'linear-gradient(135deg, var(--success), #14b8a6)',
          }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-2 shadow-inner">
            <CheckCircleIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold">
            {lastOrder.is_debt ? 'Ghi nợ thành công!' : lastOrder.payment_method === 'transfer' ? 'Chuyển khoản thành công!' : 'Thanh toán thành công!'}
          </h2>
          <p className="text-xs opacity-90 mt-0.5 flex items-center justify-center gap-1.5">
            Hóa đơn #{lastOrder.data?.id || lastOrder.id}
            {lastOrder.is_debt && (
              <span className="bg-white/25 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                MUA CHỊU
              </span>
            )}
          </p>
        </div>

        {/* Receipt Details Box */}
        <div className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ border: '2px dashed var(--border-primary)', background: 'var(--bg-inset)' }}
          >
            <h3 className="font-bold text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <ReceiptIcon className="w-4 h-4 text-muted" /> Chi tiết đơn mua
            </h3>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
              {(lastOrder.cart || lastOrder.items || []).map((item, idx) => (
                <div key={item.cart_id || idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
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
                  <span className="font-bold ml-2 flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-between font-extrabold text-sm pt-2 border-t-2 border-dashed border-secondary"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>Tổng tiền</span>
              <span className="text-emerald-500 font-black text-base">
                {formatPrice(lastOrder.total || lastOrder.total_price)}
              </span>
            </div>

            {/* Payment Details */}
            <div className="pt-2 border-t border-secondary space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex justify-between">
                <span>Hình thức:</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {lastOrder.is_debt ? 'Mua chịu (Ghi nợ)' : lastOrder.payment_method === 'transfer' ? 'Chuyển khoản VietQR' : 'Tiền mặt'}
                </span>
              </div>

              {lastOrder.payment_method === 'cash' && lastOrder.cash_received > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Khách đưa:</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                      {formatPrice(lastOrder.cash_received)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Tiền thối:</span>
                    <span>{formatPrice(lastOrder.change_amount || 0)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Customer info if applicable */}
          {lastOrder.customer && (
            <div
              className="p-3 rounded-2xl flex items-center justify-between text-xs"
              style={{ background: 'var(--bg-inset)' }}
            >
              <div>
                <span className="text-[11px] font-medium flex items-center gap-1 text-muted">
                  <UserIcon className="w-3.5 h-3.5" /> Khách hàng
                </span>
                <p className="font-bold text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {lastOrder.customer.customer_name} {lastOrder.customer.phone ? `(${lastOrder.customer.phone})` : ''}
                </p>
              </div>
              {lastOrder.is_debt && (
                <div className="text-right">
                  <span className="text-[10px] text-amber-500 font-semibold">Đã cộng vào nợ</span>
                  <p className="font-bold text-sm text-amber-500">
                    +{formatPrice(lastOrder.total || lastOrder.total_price)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-brand-primary"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.023-.641-2.004-1.185-2.922A9.965 9.965 0 0112 3c3.486 0 6.602 1.777 8.465 4.5 1.864 2.723 2.036 6.183.473 9.072M6.72 13.829A9.957 9.957 0 0012 21c3.55 0 6.716-1.85 8.577-4.668m-13.857-2.503a4.98 4.98 0 01-.12-1.077c0-2.761 2.239-5 5-5s5 2.239 5 5c0 .368-.04.726-.118 1.071" />
              </svg>
              In hóa đơn (K80)
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:border-brand-primary"
            >
              {copied ? '✓ Đã chép' : '📋 Gửi qua Zalo'}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-98"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))',
            }}
          >
            Tạo hóa đơn mới
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
