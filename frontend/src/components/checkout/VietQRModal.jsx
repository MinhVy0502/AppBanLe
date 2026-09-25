import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { generateVietQRUrl } from '../../utils/vietqr';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

export default function VietQRModal({ isOpen, onClose, onConfirmPaid, totalAmount, store, orderId }) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [activeStore, setActiveStore] = useState(store);

  useEffect(() => {
    if (store) setActiveStore(store);
  }, [store]);

  useEffect(() => {
    if (isOpen && (!store || !store.bank_account_no)) {
      api.get('/profile')
        .then((res) => {
          const s = res?.data || res;
          if (s && s.id) {
            setActiveStore(s);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, store]);

  if (!isOpen) return null;

  const currentStore = activeStore || store;
  const hasBankConfig = Boolean(currentStore?.bank_id && currentStore?.bank_account_no);
  const qrUrl = hasBankConfig
    ? generateVietQRUrl({
        bankId: currentStore.bank_id,
        accountNo: currentStore.bank_account_no,
        amount: totalAmount,
        accountName: currentStore.bank_account_name || currentStore.store_name,
        orderId: orderId || 'POS',
      })
    : null;

  const copyToClipboard = (text, type) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(String(text));
      if (type === 'account') {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      } else {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      style={{ zIndex: 1100 }}
      onClick={onClose}
    >
      <div
        className="card-themed w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative"
        style={{ border: '1px solid var(--border-primary)', zIndex: 1101 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-4 text-center text-white relative"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-sm font-bold hover:bg-white/30 cursor-pointer"
          >
            ✕
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-2">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15h.008v.008H15V15zm0 3h.008v.008H15V18zm3-3h.008v.008H18V15zm3 3h.008v.008H21V18zm-3 3h.008v.008H18V21zm3 0h.008v.008H21V21z" />
            </svg>
          </div>
          <h3 className="font-bold text-base">Quét VietQR Chuyển Khoản</h3>
          <p className="text-xs opacity-90 mt-0.5">Giơ màn hình cho khách quét thanh toán</p>
        </div>

        {/* QR Code Container */}
        <div className="p-5 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto custom-scrollbar">
          {hasBankConfig ? (
            <>
              <div className="p-2 bg-white rounded-2xl shadow-lg border border-slate-200 inline-block">
                <img
                  src={qrUrl}
                  alt="Mã VietQR"
                  className="w-56 h-auto object-contain rounded-xl"
                  loading="eager"
                />
              </div>

              {/* Total Amount Badge */}
              <div className="w-full p-3 rounded-2xl flex items-center justify-between" style={{ background: 'var(--bg-inset)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Số tiền:</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-500">{formatPrice(totalAmount)}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(totalAmount, 'amount')}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold hover:bg-emerald-500/20 cursor-pointer"
                  >
                    {copiedAmount ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>
              </div>

              {/* Bank Details */}
              <div className="w-full text-xs space-y-1.5 p-3 rounded-2xl text-left" style={{ background: 'var(--bg-inset)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Ngân hàng:</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentStore.bank_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{currentStore.bank_account_no}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentStore.bank_account_no, 'account')}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold hover:bg-blue-500/20 cursor-pointer"
                    >
                      {copiedAccount ? '✓' : 'Chép'}
                    </button>
                  </div>
                </div>
                {currentStore.bank_account_name && (
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Chủ TK:</span>
                    <span className="font-bold uppercase" style={{ color: 'var(--text-primary)' }}>{currentStore.bank_account_name}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-8 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Chưa cài đặt số tài khoản</h4>
              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                Vui lòng vào Cài đặt quán để thêm Số tài khoản và Ngân hàng của bạn để kích hoạt mã VietQR tự động.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('open:bank-settings'));
                }}
                className="mt-1 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>⚙️ Cài đặt tài khoản ngân hàng ngay</span>
              </button>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={onConfirmPaid}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all cursor-pointer shadow-lg hover:brightness-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--success), #14b8a6)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            }}
          >
            ✓ Đã nhận tiền thành công
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
