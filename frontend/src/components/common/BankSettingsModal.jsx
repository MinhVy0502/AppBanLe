import { useState, useEffect, useMemo } from 'react';
import { VIETNAM_BANKS, generateVietQRUrl } from '../../utils/vietqr';
import api from '../../services/api';

export default function BankSettingsModal({ isOpen, onClose, store, onUpdated }) {
  const [bankId, setBankId] = useState('TPB');
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showTestQR, setShowTestQR] = useState(false);

  // Tự động tải lại thông tin mới nhất từ máy chủ khi mở modal
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setMsg('');
      setSavedSuccess(false);
      if (store) {
        setBankId(store.bank_id || 'TPB');
        setAccountNo(store.bank_account_no || '');
        setAccountName(store.bank_account_name || '');
      }
      api.get('/profile')
        .then((res) => {
          const s = res?.data || res;
          if (s && s.id) {
            setBankId(s.bank_id || 'TPB');
            setAccountNo(s.bank_account_no || '');
            setAccountName(s.bank_account_name || '');
          }
        })
        .catch(() => {});
    }
  }, [isOpen, store]);

  const cleanAcc = useMemo(() => {
    return String(accountNo || '').replace(/\s+/g, '').trim();
  }, [accountNo]);

  const testQRUrl = useMemo(() => {
    if (!bankId || !cleanAcc || cleanAcc.length < 5) return null;
    return generateVietQRUrl({
      bankId,
      accountNo: cleanAcc,
      amount: 10000,
      accountName: accountName.trim().toUpperCase(),
      orderId: 'TEST',
    });
  }, [bankId, cleanAcc, accountName]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cleanAcc) {
      setMsg('Vui lòng nhập số tài khoản ngân hàng.');
      return;
    }
    if (!password) {
      setMsg('Vui lòng nhập mật khẩu tài khoản đăng nhập để xác nhận.');
      return;
    }

    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/profile/bank', {
        bank_id: bankId,
        bank_account_no: cleanAcc,
        bank_account_name: accountName.trim().toUpperCase(),
        password: password,
      });

      if (res.success) {
        setSavedSuccess(true);
        setMsg('✓ Cập nhật thông tin ngân hàng thành công!');
        if (onUpdated) onUpdated(res.data);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setMsg(res.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="card-themed w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        style={{ border: '1px solid var(--border-primary)' }}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-secondary" style={{ background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5m-15 10.5V10.5M3 21h18M3 9h18" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Cài đặt Ngân hàng VietQR</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cấu hình tài khoản nhận tiền chuyển khoản chuẩn Napas247</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-red-500 cursor-pointer"
            style={{ background: 'var(--bg-inset)' }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Security Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-400">
              <span>🛡️ Bảo mật Thanh toán VietQR Napas 247</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-300">
              Mã QR được sinh tự động theo tiêu chuẩn quốc gia Napas / Ngân hàng Nhà nước. 
              Khi khách quét, App ngân hàng của khách luôn hiện đích danh Tên chủ tài khoản đã đăng ký tại ngân hàng, tuyệt đối không thể bị chèn ép hay chuyển nhầm.
            </p>
          </div>

          {msg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${msg.includes('thành công') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Ngân hàng thụ hưởng <span className="text-red-400">*</span>
              </label>
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="input-themed w-full py-2.5 px-3 rounded-xl text-xs cursor-pointer font-medium"
                required
              >
                {VIETNAM_BANKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Số tài khoản ngân hàng <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: 00005846355 (tự động xóa khoảng trắng)"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className="input-themed w-full py-2.5 px-3 rounded-xl text-sm font-mono tracking-wider font-bold"
                required
              />
              {accountNo.includes(' ') && (
                <p className="text-[11px] text-amber-400 mt-1">
                  💡 Gợi ý: Hệ thống sẽ tự động loại bỏ các khoảng cách để mã QR đạt chuẩn tuyệt đối: <strong className="font-mono">{cleanAcc}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Tên chủ tài khoản (In hoa không dấu) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: NGUYEN GIA MINH"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                className="input-themed w-full py-2.5 px-3 rounded-xl text-xs uppercase font-bold tracking-wide"
                required
              />
            </div>

            {/* Password input: ALWAYS VISIBLE to guarantee security and prevent tampering */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <label className="block text-xs font-bold flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span>🔒 Mật khẩu tài khoản chủ cửa hàng</span>
                  <span className="text-red-400">*</span>
                </span>
                <span className="text-[10px] text-amber-400/90 font-normal">Chống gian lận đổi lén STK</span>
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu đăng nhập của bạn để xác nhận..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-themed w-full py-2 px-3 rounded-xl text-xs"
                required
                autoComplete="current-password"
              />
              <p className="text-[11px] text-zinc-400">
                Nhập mật khẩu tài khoản đăng nhập để xác thực bạn chính là chủ shop, ngăn nhân viên hoặc người ngoài tự ý đổi số tài khoản.
              </p>
            </div>

            {/* Live QR Test Preview */}
            {testQRUrl && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowTestQR(!showTestQR)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30"
                >
                  <span>{showTestQR ? '▲ Ẩn mã QR quét thử' : '📷 Xem mã QR quét thử kiểm tra tài khoản'}</span>
                </button>

                {showTestQR && (
                  <div className="mt-3 p-4 rounded-2xl bg-white text-zinc-900 flex flex-col items-center justify-center shadow-lg space-y-2 animate-fade-in">
                    <p className="text-xs font-bold text-zinc-700">MÃ VIETQR DÙNG THỬ (Mẫu 10.000đ)</p>
                    <img
                      src={testQRUrl}
                      alt="VietQR Test"
                      className="w-48 h-auto object-contain rounded-xl border border-zinc-200"
                    />
                    <p className="text-[11px] text-zinc-500 text-center max-w-xs leading-tight">
                      👉 Hãy dùng App Ngân hàng của bạn quét mã này. Nếu App hiện đúng <strong>{accountName || 'Tên của bạn'}</strong> ({bankId} - {cleanAcc}), thông tin đã chuẩn 100%!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Inline message near action buttons so user always sees it */}
            {msg && (
              <div className={`p-2.5 rounded-xl text-xs font-bold text-center animate-fade-in ${msg.includes('thành công') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {msg}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 py-2.5 text-xs font-bold rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving || !cleanAcc || !password || savedSuccess}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  savedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'btn-primary disabled:opacity-50'
                }`}
              >
                {savedSuccess ? (
                  '✓ Đã lưu thành công!'
                ) : saving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu cài đặt'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
