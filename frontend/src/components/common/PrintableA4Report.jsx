import React from 'react';

export default function PrintableA4Report({
  isOpen,
  onClose,
  title = 'BẢNG KÊ CHI TIẾT HÀNG HÓA MUA VÀO',
  subTitle = 'Mẫu số S2-HKD (Ban hành kèm theo Thông tư 88/2021/TT-BTC của Bộ Tài chính)',
  items = [],
  dateRange = '',
  storeName = 'CỬA HÀNG BÁN LẺ',
  storeAddress = '',
}) {
  if (!isOpen) return null;

  const totalCost = items.reduce((sum, item) => sum + Number(item.total_cost || 0), 0);
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const formatCurrency = (val) => Number(val || 0).toLocaleString('vi-VN') + ' đ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {/* Container - Printable Card */}
      <div className="bg-white text-black w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-4">
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">📄 Báo cáo in ấn A4</span>
            <span className="text-xs text-slate-400">Chuẩn bị in hoặc lưu dạng PDF</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-1.076-.641-2.072-1.182-2.956M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              In ngay / Lưu PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Printable Content (Standard A4 Dimensions) */}
        <div className="p-8 sm:p-12 text-slate-800 text-xs sm:text-sm font-serif leading-relaxed" id="printable-a4-area">
          {/* Header Info */}
          <div className="flex justify-between items-start border-b pb-4 mb-6">
            <div>
              <h3 className="font-bold text-base uppercase">{storeName}</h3>
              <p className="text-slate-600 text-xs">Cơ sở kinh doanh bán lẻ & phân phối</p>
              {storeAddress && <p className="text-slate-600 text-xs">Địa chỉ: {storeAddress}</p>}
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Mẫu số: S2-HKD</p>
              <p>Ban hành theo TT 88/2021/TT-BTC</p>
              <p>Ngày in: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-950">{title}</h1>
            <p className="text-slate-600 italic text-xs mt-1">{subTitle}</p>
            {dateRange && <p className="font-medium text-slate-700 mt-1">({dateRange})</p>}
          </div>

          {/* Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse border border-slate-300 text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="border border-slate-300 p-2 text-center w-10">STT</th>
                  <th className="border border-slate-300 p-2 text-center w-24">Ngày nhập</th>
                  <th className="border border-slate-300 p-2">Nhà cung cấp</th>
                  <th className="border border-slate-300 p-2">Tên hàng hóa</th>
                  <th className="border border-slate-300 p-2 text-center">ĐVT</th>
                  <th className="border border-slate-300 p-2 text-right">Số lượng</th>
                  <th className="border border-slate-300 p-2 text-right">Đơn giá</th>
                  <th className="border border-slate-300 p-2 text-right">Thành tiền</th>
                  <th className="border border-slate-300 p-2">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 p-4 text-center text-slate-500 italic">
                      Không có số liệu đợt nhập trong khoảng thời gian này.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                      <td className="border border-slate-300 p-2 text-center whitespace-nowrap">
                        {item.import_date || '—'}
                      </td>
                      <td className="border border-slate-300 p-2">{item.supplier_name || 'Đại lý phân phối'}</td>
                      <td className="border border-slate-300 p-2 font-medium">
                        {item.product?.product_name || 'Sản phẩm'}
                      </td>
                      <td className="border border-slate-300 p-2 text-center">
                        {item.unit_name || item.product?.unit_type || 'Đơn vị'}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-semibold">
                        {item.quantity?.toLocaleString('vi-VN')}
                      </td>
                      <td className="border border-slate-300 p-2 text-right">
                        {formatCurrency(item.unit_cost)}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-bold">
                        {formatCurrency(item.total_cost)}
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-500 text-[11px]">{item.note || ''}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={5} className="border border-slate-300 p-2.5 text-center uppercase tracking-wider">
                    Tổng cộng
                  </td>
                  <td className="border border-slate-300 p-2.5 text-right font-extrabold text-slate-900">
                    {totalQty.toLocaleString('vi-VN')}
                  </td>
                  <td className="border border-slate-300 p-2.5"></td>
                  <td className="border border-slate-300 p-2.5 text-right font-extrabold text-emerald-800 text-sm">
                    {formatCurrency(totalCost)}
                  </td>
                  <td className="border border-slate-300 p-2.5"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 text-center mt-12 pt-4">
            <div>
              <p className="font-bold text-slate-800">Người lập biểu</p>
              <p className="text-slate-500 italic text-[11px]">(Ký, họ tên)</p>
              <div className="h-20" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Người giao hàng</p>
              <p className="text-slate-500 italic text-[11px]">(Ký, họ tên)</p>
              <div className="h-20" />
            </div>
            <div>
              <p className="text-slate-500 italic text-[11px]">
                Ngày ..... tháng ..... năm 20....
              </p>
              <p className="font-bold text-slate-800">Chủ hộ kinh doanh</p>
              <p className="text-slate-500 italic text-[11px]">(Ký, đóng dấu nếu có)</p>
              <div className="h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
