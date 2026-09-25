import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { playBeep, playErrorBuzz } from '../../utils/audio';

export default function CameraScannerModal({ isOpen, onClose, onDetected, products = [] }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [continuousMode, setContinuousMode] = useState(false);
  const [lastScannedName, setLastScannedName] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const isScanningRef = useRef(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleBarcodeFound = useCallback((rawCode) => {
    if (!rawCode || isScanningRef.current) return;
    const cleanCode = String(rawCode).trim();
    if (!cleanCode) return;

    isScanningRef.current = true;
    setLastScanned(cleanCode);
    setScannedCount((c) => c + 1);

    // 1. Âm thanh bíp
    playBeep();

    // 2. Rung phản hồi (Haptic Feedback) trên điện thoại
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(60);
      } catch (_) {}
    }

    // Tìm tên sản phẩm hiển thị thông báo
    const matched = products.find(
      (p) =>
        (p.barcode && String(p.barcode).trim().toLowerCase() === cleanCode.toLowerCase()) ||
        (p.units || []).some((u) => u.barcode && String(u.barcode).trim().toLowerCase() === cleanCode.toLowerCase())
    );
    if (matched) {
      setLastScannedName(matched.product_name);
    } else {
      setLastScannedName('');
    }

    if (onDetected) {
      onDetected(cleanCode, continuousMode);
    }

    // Cooldown trước khi cho phép quét mã kế tiếp
    const cooldownMs = continuousMode ? 1400 : 1000;
    setTimeout(() => {
      isScanningRef.current = false;
      if (!continuousMode && onClose) {
        onClose();
      }
    }, cooldownMs);
  }, [onDetected, continuousMode, onClose, products]);

  // Start camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setError('');
      setTorchOn(false);
      setManualCode('');
      return;
    }

    let active = true;

    async function initCamera() {
      try {
        setError('');
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Check torch support
        const track = stream.getVideoTracks()[0];
        if (track && track.getCapabilities) {
          const caps = track.getCapabilities();
          if (caps.torch) {
            setHasTorch(true);
          }
        }

        // Start scanning loop using native BarcodeDetector if available
        if ('BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({
              formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e', 'qr_code'],
            });

            const scanInterval = setInterval(async () => {
              if (!videoRef.current || !active || videoRef.current.readyState < 2) return;
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  handleBarcodeFound(barcodes[0].rawValue);
                }
              } catch (err) {
                // Ignore frame decode errors
              }
            }, 250);

            return () => clearInterval(scanInterval);
          } catch (e) {
            console.warn('BarcodeDetector format error, fallback to manual', e);
          }
        }
      } catch (err) {
        console.error('Lỗi khởi động camera:', err);
        setError('Không thể mở Camera. Vui lòng cấp quyền truy cập Camera trong trình duyệt.');
        playErrorBuzz();
      }
    }

    initCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [isOpen, handleBarcodeFound, stopCamera]);

  // Toggle flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        const nextState = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
      } catch (e) {
        console.error('Lỗi bật đèn flash:', e);
      }
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleBarcodeFound(manualCode.trim());
    setManualCode('');
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      style={{ zIndex: 99999 }}
    >
      <div
        className="card-themed w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative"
        style={{ border: '1px solid var(--border-primary)', zIndex: 100000 }}
      >
        {/* Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-secondary" style={{ background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15h.008v.008H15V15zm0 3h.008v.008H15V18zm3-3h.008v.008H18V15zm3 3h.008v.008H21V18zm-3 3h.008v.008H18V21zm3 0h.008v.008H21V21z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Quét mã vạch</h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {scannedCount > 0 ? `Đã quét ${scannedCount} lượt` : 'Hướng camera vào mã vạch'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Continuous Mode Toggle */}
            <button
              type="button"
              onClick={() => setContinuousMode((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              style={{
                background: continuousMode ? 'var(--brand-primary)' : 'var(--bg-inset)',
                color: continuousMode ? '#fff' : 'var(--text-secondary)',
              }}
              title={continuousMode ? 'Chế độ quét liên tục đang BẬT (không tự đóng camera)' : 'Bấm để bật chế độ quét liên tục nhiều món'}
            >
              <span>{continuousMode ? '⚡ Quét liên tục' : '🎯 Quét đơn'}</span>
            </button>

            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                style={{
                  background: torchOn ? '#f59e0b' : 'var(--bg-inset)',
                  color: torchOn ? '#fff' : 'var(--text-secondary)',
                }}
                title={torchOn ? 'Tắt đèn Flash' : 'Bật đèn Flash'}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-red-500 cursor-pointer"
              style={{ background: 'var(--bg-inset)' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Camera Viewport */}
        <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-400">
              <svg className="w-10 h-10 mx-auto mb-2 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-xs">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Laser Scanning Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                <div className="w-64 h-44 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-md" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-md" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-md" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-md" />

                  {/* Animated green laser line */}
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10b981] animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
              </div>
            </>
          )}

          {/* Last scanned toast banner */}
          {lastScanned && (
            <div className="absolute bottom-2 inset-x-4 py-2 px-3 rounded-2xl bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-md animate-fade-in shadow-xl border border-emerald-400/30 flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-200">✓</span>
                <span>Đã nhận: <strong className="font-mono tracking-wider">{lastScanned}</strong></span>
              </div>
              {lastScannedName && (
                <div className="text-[11px] font-medium text-emerald-100 truncate max-w-full mt-0.5">
                  📦 {lastScannedName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Manual Barcode / Last Digits Fallback */}
        <div className="p-4 space-y-3" style={{ background: 'var(--bg-surface)' }}>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Hoặc gõ mã vạch / 4 số cuối..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="input-themed flex-1 py-2 px-3 text-xs rounded-xl"
            />
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="btn-primary py-2 px-4 text-xs font-bold rounded-xl whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              Tìm
            </button>
          </form>

          <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
            💡 Mẹo: Có thể bật đèn Flash để quét rõ hơn trong góc tối.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
