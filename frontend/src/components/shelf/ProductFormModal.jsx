import { createPortal } from 'react-dom';
import { PackageIcon, XIcon, TrashIcon } from '../common/Icons';
import { formatPrice, getBaseUnitLabel } from '../../utils/formatters';

export default function ProductFormModal({
  showProductModal,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  creatingProduct,
  createProduct,
  addUnitPreset,
  updateUnitField,
  removeUnitRow,
}) {
  if (!showProductModal) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 modal-overlay" />
      <div
        className="relative rounded-2xl w-full max-w-3xl overflow-hidden animate-modal-in max-h-[90vh] flex flex-col card-themed"
        style={{ boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--success), #14b8a6)' }}
            >
              <PackageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingProduct ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <p className="text-xs text-muted">
                {editingProduct
                  ? `Đang sửa: ${editingProduct.product_name}`
                  : 'Thiết lập tên, giá bán và quy cách đóng gói (Thùng/Lốc/Gói...)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-muted hover:text-white hover:bg-white/10"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Tên sản phẩm & Mã vạch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Tên sản phẩm <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                value={productForm.product_name}
                onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                placeholder="VD: Bia Tiger nâu, Nước ngọt Coca Cola, Mì Hảo Hảo..."
                autoFocus
                className="w-full input-themed text-base py-2.5 px-3 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Mã vạch (Tùy chọn)
              </label>
              <input
                type="text"
                value={productForm.barcode || ''}
                onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                placeholder="Quét hoặc gõ mã..."
                className="w-full input-themed text-sm py-2.5 px-3 font-mono"
              />
            </div>
          </div>

          {/* TÙY CHỌN: BÁN LẺ VS CHỈ BÁN NGUYÊN THÙNG */}
          <div
            className="p-4 rounded-xl border transition-all"
            style={{
              background: !productForm.allow_retail ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-inset)',
              borderColor: !productForm.allow_retail ? 'var(--warning)' : 'var(--border-secondary)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {!productForm.allow_retail
                      ? '📦 Chỉ bán nguyên thùng / quy cách (Không bán lẻ)'
                      : '🛒 Cho phép bán lẻ từng ' + getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                  </span>
                  {!productForm.allow_retail && (
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-bold"
                      style={{
                        background: 'var(--warning-bg)',
                        color: 'var(--warning)',
                        border: '1px solid var(--warning-light)',
                      }}
                    >
                      Chỉ bán sỉ
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 text-muted">
                  {!productForm.allow_retail
                    ? 'Sản phẩm này (như bia nguyên thùng) chỉ bán theo Thùng/Két/Lốc, thu ngân không thể xé lẻ bán từng lon/chai.'
                    : 'Khách hàng có thể mua lẻ từng ' +
                      getBaseUnitLabel(productForm.unit_type).toLowerCase() +
                      ' hoặc mua nguyên thùng/lốc/dây.'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={!productForm.allow_retail}
                  onChange={(e) => setProductForm({ ...productForm, allow_retail: !e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Đơn vị cơ sở & Giá bán */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                {productForm.allow_retail ? 'Đơn vị bán lẻ' : 'Đơn vị cơ sở bên trong'}{' '}
                <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                value={productForm.unit_type}
                onChange={(e) => setProductForm({ ...productForm, unit_type: e.target.value })}
                className="w-full input-themed text-sm py-2.5 px-3 cursor-pointer"
              >
                <option value="lon">Lon</option>
                <option value="chai">Chai</option>
                <option value="goi">Gói</option>
                <option value="hop">Hộp</option>
                <option value="bich">Bịch</option>
                <option value="cai">Cái / Chiếc</option>
                <option value="dieu">Điếu</option>
                <option value="vien">Viên</option>
                <option value="cuon">Cuộn</option>
                <option value="cay">Cây</option>
                <option value="hu">Hũ</option>
                <option value="bo">Bó</option>
                <option value="vi">Vỉ</option>
                <option value="bao">Bao</option>
                <option value="le">Lẻ</option>
              </select>
            </div>

            {productForm.allow_retail ? (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Giá bán lẻ (₫) <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="VD: 18000"
                    className="w-full input-themed text-sm py-2.5 px-3 font-semibold"
                  />
                  {productForm.price && Number(productForm.price) > 0 && (
                    <p className="text-xs font-bold mt-1" style={{ color: 'var(--success)' }}>
                      {formatPrice(Number(productForm.price))} /{' '}
                      {getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Giá vốn lẻ (₫)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={productForm.cost_price}
                    onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                    placeholder="VD: 14000"
                    className="w-full input-themed text-sm py-2.5 px-3"
                  />
                  {productForm.cost_price && Number(productForm.cost_price) > 0 && (
                    <p className="text-xs font-medium mt-1 text-muted">
                      Vốn: {formatPrice(Number(productForm.cost_price))}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="sm:col-span-2 flex items-center p-3 rounded-xl" style={{ background: 'var(--bg-inset)' }}>
                <p className="text-xs text-muted">
                  💡 Sản phẩm <strong>Chỉ bán nguyên kiện</strong>: Giá bán và giá vốn sẽ được thiết lập trực tiếp theo
                  Thùng/Két/Quy cách ở phần bên dưới.
                </p>
              </div>
            )}
          </div>

          {/* TỒN KHO & LỰA CHỌN ĐƠN VỊ NHẬP TỒN */}
          <div
            className="p-4 rounded-xl border"
            style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-secondary)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div>
                <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                  Số lượng tồn kho ban đầu
                </label>
                <p className="text-xs text-muted">
                  {productForm.stock_input_mode === 'pack' && productForm.units.length > 0
                    ? `Bạn đang nhập theo: ${productForm.units[0].unit_name || 'Thùng'} (Hệ thống sẽ tự quy đổi)`
                    : `Bạn đang nhập theo đơn vị lẻ: ${getBaseUnitLabel(productForm.unit_type)}`}
                </p>
              </div>
              {productForm.units && productForm.units.length > 0 && (
                <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, stock_input_mode: 'base' })}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    style={{
                      background:
                        productForm.stock_input_mode !== 'pack' ? 'var(--brand-primary)' : 'transparent',
                      color: productForm.stock_input_mode !== 'pack' ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    {getBaseUnitLabel(productForm.unit_type)} (Lẻ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm({ ...productForm, stock_input_mode: 'pack' })}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    style={{
                      background: productForm.stock_input_mode === 'pack' ? 'var(--warning)' : 'transparent',
                      color: productForm.stock_input_mode === 'pack' ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    📦 {productForm.units[0]?.unit_name || 'Thùng'} (
                    {productForm.units[0]?.conversion_rate || 24}{' '}
                    {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
                  </button>
                </div>
              )}
            </div>

            {productForm.stock_input_mode === 'pack' && productForm.units.length > 0 ? (
              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock_pack_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_pack_quantity: e.target.value })}
                    placeholder="VD: 10 (thùng)"
                    className="w-full input-themed text-base font-bold py-2.5 px-3 pr-24"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                    style={{ color: 'var(--warning)' }}
                  >
                    {productForm.units[0]?.unit_name || 'Thùng'}
                  </span>
                </div>
                {productForm.stock_pack_quantity !== '' && Number(productForm.stock_pack_quantity) > 0 && (
                  <p className="text-xs font-bold mt-2 flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
                    <span>✓ Quy đổi tồn kho:</span>
                    <span>
                      {Number(productForm.stock_pack_quantity)} {productForm.units[0]?.unit_name} ={' '}
                    </span>
                    <strong className="underline text-sm">
                      {Number(productForm.stock_pack_quantity) *
                        (Number(productForm.units[0]?.conversion_rate) || 24)}{' '}
                      {getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                    </strong>
                    <span>trong kho.</span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="0"
                    className="w-full input-themed text-base font-bold py-2.5 px-3 pr-20"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {getBaseUnitLabel(productForm.unit_type)}
                  </span>
                </div>
                {productForm.units &&
                  productForm.units.length > 0 &&
                  productForm.stock !== '' &&
                  Number(productForm.stock) > 0 && (
                    <p className="text-xs mt-2 text-muted">
                      💡 Tương đương: ~
                      {Math.floor(Number(productForm.stock) / Number(productForm.units[0].conversion_rate))}{' '}
                      {productForm.units[0].unit_name}
                      {Number(productForm.stock) % Number(productForm.units[0].conversion_rate) > 0 && (
                        <span>
                          {' '}
                          và{' '}
                          {Number(productForm.stock) % Number(productForm.units[0].conversion_rate)}{' '}
                          {getBaseUnitLabel(productForm.unit_type).toLowerCase()} lẻ
                        </span>
                      )}
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* QUY CÁCH ĐÓNG GÓI MỞ RỘNG */}
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Quy cách đóng gói & Giá sỉ (Thùng, Lốc, Dây, Cây...)
                </span>
                <p className="text-xs text-muted">
                  {!productForm.allow_retail
                    ? 'Bắt buộc thêm quy cách (Thùng, Két...) vì sản phẩm này chỉ bán nguyên kiện.'
                    : 'Thêm nếu bạn có bán nguyên thùng/lốc hoặc nhập hàng theo thùng.'}
                </p>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex items-center gap-2 flex-wrap mb-3.5">
              <button
                type="button"
                onClick={() => addUnitPreset('Thùng', 24)}
                className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-inset)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--brand-primary)',
                }}
              >
                + Thùng (24 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
              </button>
              <button
                type="button"
                onClick={() => addUnitPreset('Lốc', 6)}
                className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-inset)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--brand-primary)',
                }}
              >
                + Lốc (6 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
              </button>
              <button
                type="button"
                onClick={() => addUnitPreset('Dây', 12)}
                className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-inset)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--brand-primary)',
                }}
              >
                + Dây (12 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
              </button>
              <button
                type="button"
                onClick={() => addUnitPreset('Cây', 10)}
                className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-inset)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--brand-primary)',
                }}
              >
                + Cây (10 {getBaseUnitLabel(productForm.unit_type).toLowerCase()})
              </button>
              <button
                type="button"
                onClick={() => addUnitPreset('Hộp', 10)}
                className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-inset)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--brand-primary)',
                }}
              >
                + Hộp (10)
              </button>
              <button
                type="button"
                onClick={() => addUnitPreset('', 2)}
                className="text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-all hover:scale-105"
                style={{
                  background: 'var(--bg-inset)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                + Tự đặt quy cách
              </button>
            </div>

            {/* Packaging units rows */}
            {productForm.units && productForm.units.length > 0 ? (
              <div className="space-y-3">
                {productForm.units.map((u, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl border transition-all animate-fade-in"
                    style={{ background: 'var(--bg-inset)', borderColor: 'var(--border-secondary)' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
                      {/* Tên quy cách */}
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Tên quy cách <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={u.unit_name}
                          onChange={(e) => updateUnitField(index, 'unit_name', e.target.value)}
                          placeholder="VD: Thùng"
                          className="w-full input-themed text-sm py-2.5 px-3 font-semibold"
                        />
                      </div>

                      {/* Tỷ lệ quy đổi */}
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          1 {u.unit_name || 'quy cách'} chứa <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="2"
                            value={u.conversion_rate}
                            onChange={(e) => updateUnitField(index, 'conversion_rate', e.target.value)}
                            placeholder="24"
                            className="w-full input-themed text-sm py-2.5 px-3 pr-14 font-semibold"
                          />
                          <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold truncate max-w-[50px] text-muted"
                          >
                            {getBaseUnitLabel(productForm.unit_type).toLowerCase()}
                          </span>
                        </div>
                      </div>

                      {/* Giá bán quy cách */}
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Giá bán (₫) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={u.price}
                          onChange={(e) => updateUnitField(index, 'price', e.target.value)}
                          placeholder="VD: 370000"
                          className="w-full input-themed text-sm py-2.5 px-3 font-bold"
                        />
                        {u.price && Number(u.price) > 0 && (
                          <p className="text-xs font-bold mt-1" style={{ color: 'var(--success)' }}>
                            = {formatPrice(Number(u.price))}
                          </p>
                        )}
                      </div>

                      {/* Giá vốn quy cách */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Giá vốn (₫)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={u.cost_price}
                          onChange={(e) => updateUnitField(index, 'cost_price', e.target.value)}
                          placeholder="VD: 320000"
                          className="w-full input-themed text-sm py-2.5 px-3 font-medium"
                        />
                        {u.cost_price && Number(u.cost_price) > 0 && (
                          <p className="text-xs font-medium mt-1 text-muted">
                            = {formatPrice(Number(u.cost_price))}
                          </p>
                        )}
                      </div>

                      {/* Nút xóa */}
                      <div className="sm:col-span-1 flex items-center justify-end sm:pt-7">
                        <button
                          type="button"
                          onClick={() => removeUnitRow(index)}
                          title="Xóa quy cách này"
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer text-red-500 bg-red-500/10 hover:bg-red-500/20"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="p-4 rounded-xl text-center border border-dashed"
                style={{ borderColor: 'var(--border-secondary)' }}
              >
                <p className="text-xs text-muted">
                  Chưa có quy cách đóng gói nào. Bấm một trong các nút gợi ý trên để thêm nhanh.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-surface)' }}
        >
          <button onClick={onClose} className="btn-secondary">
            Hủy
          </button>
          <button
            onClick={createProduct}
            disabled={creatingProduct}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, var(--success), #14b8a6)',
              boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
            }}
          >
            {creatingProduct ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang lưu...
              </span>
            ) : editingProduct ? (
              'Lưu thay đổi'
            ) : (
              'Thêm sản phẩm'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
