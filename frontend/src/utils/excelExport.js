import * as XLSX from 'xlsx';

/**
 * Tiện ích xuất Excel chuẩn kế toán & thuế bán lẻ (Thông tư 88/2021/TT-BTC)
 */

const formatCurrencyNumber = (num) => Number(num || 0);

/**
 * Xuất Bảng kê Hàng hóa Mua vào (Mẫu S2-HKD)
 * @param {Array} imports - Danh sách phiếu nhập
 * @param {Object} options - { storeName, fromDate, toDate }
 */
export function exportImportsToExcel(imports = [], options = {}) {
  const { storeName = 'CỬA HÀNG BÁN LẺ', fromDate = '', toDate = '' } = options;

  const dateRangeText = (fromDate && toDate)
    ? `Kỳ báo cáo: Từ ngày ${fromDate} đến ngày ${toDate}`
    : (fromDate ? `Kỳ báo cáo: Từ ngày ${fromDate}` : (toDate ? `Kỳ báo cáo: Đến ngày ${toDate}` : `Toàn bộ thời gian`));

  // 1. Tiêu đề và thông tin doanh nghiệp
  const data = [
    [storeName.toUpperCase()],
    ['BẢNG KÊ CHI TIẾT HÀNG HÓA MUA VÀO (MẪU S2-HKD)'],
    ['(Ban hành kèm theo Thông tư số 88/2021/TT-BTC ngày 08/10/2021 của Bộ Tài chính)'],
    [dateRangeText],
    ['Ngày xuất file: ' + new Date().toLocaleDateString('vi-VN')],
    [], // Dòng trống
    [
      'STT',
      'Ngày nhập',
      'Nhà cung cấp / Đại lý',
      'Tên hàng hóa',
      'Đơn vị tính',
      'Số lượng',
      'SL quy đổi cơ sở',
      'Đơn giá nhập (VNĐ)',
      'Thành tiền (VNĐ)',
      'Ghi chú / Số HĐ',
    ],
  ];

  let totalAmount = 0;
  let totalQuantity = 0;

  // 2. Dữ liệu từng dòng
  imports.forEach((item, index) => {
    const cost = formatCurrencyNumber(item.total_cost);
    const qty = formatCurrencyNumber(item.quantity);
    totalAmount += cost;
    totalQuantity += qty;

    data.push([
      index + 1,
      item.import_date || '',
      item.supplier_name || 'Đại lý phân phối',
      item.product?.product_name || '',
      item.unit_name || item.product?.unit_type || 'Đơn vị',
      qty,
      formatCurrencyNumber(item.base_quantity),
      formatCurrencyNumber(item.unit_cost),
      cost,
      item.note || '',
    ]);
  });

  // 3. Dòng tổng cộng
  data.push([]);
  data.push([
    'TỔNG CỘNG',
    '',
    '',
    '',
    '',
    totalQuantity,
    '',
    '',
    totalAmount,
    '',
  ]);

  // 4. Khối chữ ký cuối bảng
  data.push([]);
  data.push([
    '',
    '',
    '',
    'Người lập biểu',
    '',
    '',
    '',
    'Kế toán / Chủ hộ kinh doanh',
    '',
    '',
  ]);
  data.push([
    '',
    '',
    '',
    '(Ký, ghi rõ họ tên)',
    '',
    '',
    '',
    '(Ký, ghi rõ họ tên)',
    '',
    '',
  ]);

  // Tạo Worksheet và Workbook
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Đặt độ rộng các cột tối ưu
  ws['!cols'] = [
    { wch: 6 },  // STT
    { wch: 14 }, // Ngày
    { wch: 25 }, // Nhà cung cấp
    { wch: 28 }, // Tên hàng
    { wch: 14 }, // ĐVT
    { wch: 12 }, // SL
    { wch: 16 }, // Quy đổi
    { wch: 18 }, // Đơn giá
    { wch: 20 }, // Thành tiền
    { wch: 25 }, // Ghi chú
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'So_Chi_Phi_S2_HKD');

  const fileName = `Bang_Ke_Nhap_Hang_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Xuất Bảng kê Doanh thu Bán hàng (Mẫu S1-HKD)
 * @param {Array} orders - Danh sách hóa đơn
 * @param {Object} options - { storeName, fromDate, toDate }
 */
export function exportOrdersToExcel(orders = [], options = {}) {
  const { storeName = 'CỬA HÀNG BÁN LẺ', fromDate = '', toDate = '' } = options;

  const dateRangeText = (fromDate && toDate)
    ? `Kỳ báo cáo: Từ ngày ${fromDate} đến ngày ${toDate}`
    : (fromDate ? `Kỳ báo cáo: Từ ngày ${fromDate}` : (toDate ? `Kỳ báo cáo: Đến ngày ${toDate}` : `Toàn bộ thời gian`));

  const data = [
    [storeName.toUpperCase()],
    ['SỔ CHI TIẾT DOANH THU BÁN HÀNG HÓA, DỊCH VỤ (MẪU S1-HKD)'],
    ['(Ban hành kèm theo Thông tư số 88/2021/TT-BTC ngày 08/10/2021 của Bộ Tài chính)'],
    [dateRangeText],
    ['Ngày xuất file: ' + new Date().toLocaleDateString('vi-VN')],
    [],
    [
      'STT',
      'Mã đơn',
      'Ngày giờ bán',
      'Hình thức thanh toán',
      'Khách hàng',
      'Khách trả (VNĐ)',
      'Tiền thừa (VNĐ)',
      'Ghi nợ (VNĐ)',
      'Doanh thu (VNĐ)',
      'Ghi chú',
    ],
  ];

  let totalRevenue = 0;
  let totalCash = 0;
  let totalDebt = 0;

  orders.forEach((o, index) => {
    const rev = formatCurrencyNumber(o.total_price);
    const cash = formatCurrencyNumber(o.cash_received);
    const debt = o.is_debt ? rev : 0;

    totalRevenue += rev;
    totalCash += cash;
    totalDebt += debt;

    const methodMap = {
      cash: 'Tiền mặt',
      transfer: 'Chuyển khoản VietQR',
      debt: 'Ghi nợ',
    };

    data.push([
      index + 1,
      `#${o.id}`,
      o.created_at ? new Date(o.created_at).toLocaleString('vi-VN') : '',
      methodMap[o.payment_method] || (o.is_debt ? 'Ghi nợ' : 'Tiền mặt'),
      o.customer?.customer_name || 'Khách lẻ',
      cash,
      formatCurrencyNumber(o.change_amount),
      debt,
      rev,
      o.note || '',
    ]);
  });

  data.push([]);
  data.push([
    'TỔNG CỘNG',
    '',
    '',
    '',
    '',
    totalCash,
    '',
    totalDebt,
    totalRevenue,
    '',
  ]);

  data.push([]);
  data.push([
    '',
    '',
    '',
    'Người lập biểu',
    '',
    '',
    '',
    'Chủ hộ kinh doanh',
    '',
    '',
  ]);
  data.push([
    '',
    '',
    '',
    '(Ký, ghi rõ họ tên)',
    '',
    '',
    '',
    '(Ký, ghi rõ họ tên)',
    '',
    '',
  ]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 10 },
    { wch: 22 },
    { wch: 22 },
    { wch: 20 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
    { wch: 25 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'So_Doanh_Thu_S1_HKD');

  const fileName = `Bao_Cao_Doanh_Thu_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
