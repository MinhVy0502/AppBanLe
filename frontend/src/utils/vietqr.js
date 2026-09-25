/**
 * VietQR Utility Helper
 * Sinh mã VietQR động theo chuẩn Napas247
 */

export const VIETNAM_BANKS = [
  { id: 'MB', name: 'MBBank (Quân Đội)', shortName: 'MB' },
  { id: 'VCB', name: 'Vietcombank (Ngoại Thương)', shortName: 'VCB' },
  { id: 'ICB', name: 'VietinBank (Công Thương)', shortName: 'Vietin' },
  { id: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)', shortName: 'BIDV' },
  { id: 'TCB', name: 'Techcombank (Kỹ Thương)', shortName: 'TCB' },
  { id: 'ACB', name: 'ACB (Á Châu)', shortName: 'ACB' },
  { id: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)', shortName: 'VPB' },
  { id: 'TPB', name: 'TPBank (Tiên Phong)', shortName: 'TPB' },
  { id: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)', shortName: 'STB' },
  { id: 'HDB', name: 'HDBank (Phát Triển TP.HCM)', shortName: 'HDB' },
  { id: 'VIB', name: 'VIB (Quốc Tế)', shortName: 'VIB' },
  { id: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)', shortName: 'SHB' },
  { id: 'OCB', name: 'OCB (Phương Đông)', shortName: 'OCB' },
  { id: 'MSB', name: 'MSB (Hàng Hải)', shortName: 'MSB' },
  { id: 'LPB', name: 'LPBank (Lộc Phát)', shortName: 'LPB' },
  { id: 'TIMO', name: 'Timo Digital Bank', shortName: 'Timo' },
];

/**
 * Sinh đường dẫn ảnh mã VietQR động
 * Template: compact2 (gọn gàng, có sẵn logo ngân hàng + Napas)
 */
export function generateVietQRUrl({ bankId, accountNo, amount = 0, accountName = '', orderId = '' }) {
  if (!bankId || !accountNo) return null;

  const cleanBank = String(bankId).trim().toUpperCase();
  const cleanAccount = String(accountNo).replace(/\s+/g, '').trim();
  const cleanAmount = Math.max(0, Math.round(Number(amount) || 0));

  let desc = `DH ${orderId || ''}`.trim();
  if (!orderId) {
    desc = 'THANH TOAN DON HANG';
  }

  const encodedDesc = encodeURIComponent(desc);
  const encodedName = accountName ? encodeURIComponent(String(accountName).trim().toUpperCase()) : '';

  let url = `https://img.vietqr.io/image/${cleanBank}-${cleanAccount}-compact2.png?amount=${cleanAmount}&addInfo=${encodedDesc}`;
  if (encodedName) {
    url += `&accountName=${encodedName}`;
  }

  return url;
}
