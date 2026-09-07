/**
 * Utility functions for formatting prices, dates, times, and unit labels across AppBanLe.
 */

// Format price with VNĐ suffix (e.g. 50.000 ₫)
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(Number(price))) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(Number(price)) + ' ₫';
};

// Alias for compatibility
export const formatCurrency = formatPrice;

// Format date to DD/MM/YYYY
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// Format time to HH:mm
export const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

// Format datetime to DD/MM/YYYY HH:mm
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
};

// Calculate days until a date (positive = days remaining, negative = overdue)
export const daysUntil = (dateStr) => {
  if (!dateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
  if (isNaN(target.getTime())) return 0;
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

// Format month key YYYY-MM to T{m}/{yyyy} (e.g. 2026-08 -> T8/2026)
export const getMonthLabel = (monthKey) => {
  if (!monthKey) return '';
  const [y, m] = monthKey.split('-');
  return `T${parseInt(m, 10)}/${y}`;
};

// Format month key YYYY-MM to T{m} (e.g. 2026-08 -> T8)
export const getShortMonth = (monthKey) => {
  if (!monthKey) return '';
  const parts = monthKey.split('-');
  return `T${parseInt(parts[1], 10)}`;
};

// Format compact revenue for chart badges (e.g. 12.5 tr, 500k)
export const formatShortRevenue = (val) => {
  if (!val || val <= 0) return '';
  if (val >= 1000000) {
    return `${(val / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
  }
  if (val >= 1000) {
    return `${Math.round(val / 1000)}k`;
  }
  return `${val}`;
};

// Standard unit types and labels in retail grocery
export const UNIT_LABELS = {
  lon: 'Lon',
  chai: 'Chai',
  goi: 'Gói',
  hop: 'Hộp',
  bich: 'Bịch',
  bo: 'Bó',
  hu: 'Hũ',
  cai: 'Cái',
  dieu: 'Điếu',
  vien: 'Viên',
  cuon: 'Cuộn',
  cay: 'Cây',
  day: 'Dây',
  thung: 'Thùng',
  loc: 'Lốc',
  vi: 'Vỉ',
  bao: 'Bao',
  ket: 'Két',
  le: 'Lẻ',
};

export const getBaseUnitLabel = (type) => UNIT_LABELS[type] || type || 'Đơn vị';

export const getUnitBadge = (product) => {
  if (!product) return null;
  return getBaseUnitLabel(product.unit_type);
};
