import { createPortal } from 'react-dom';
import { XIcon, PackageIcon } from '../common/Icons';
import { formatPrice } from '../../utils/formatters';

export default function AssignShelfModal({
  showAddModal,
  onClose,
  activeShelf,
  unassignedProducts,
  selectedIds,
  toggleSelect,
  selectAll,
  assignProducts,
  saving,
}) {
  if (!showAddModal || !activeShelf) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 modal-overlay" />
      <div
        className="relative rounded-2xl w-full max-w-lg overflow-hidden animate-modal-in flex flex-col max-h-[85vh] card-themed"
        style={{ boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-primary)' }}
        >
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Thêm sản phẩm vào {activeShelf.shelf_name}
            </h3>
            <p className="text-xs text-muted">
              Chọn các sản phẩm chưa xếp kệ để đưa lên kệ này
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-muted hover:text-white hover:bg-white/10"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar: Select all */}
        {unassignedProducts.length > 0 && (
          <div
            className="px-6 py-2.5 flex items-center justify-between"
            style={{
              background: 'var(--bg-inset)',
              borderBottom: '1px solid var(--border-secondary)',
            }}
          >
            <span className="text-xs font-semibold text-secondary">
              {unassignedProducts.length} sản phẩm có sẵn
            </span>
            <button
              onClick={selectAll}
              className="text-xs font-bold transition-colors cursor-pointer"
              style={{ color: 'var(--brand-primary)' }}
            >
              {selectedIds.size === unassignedProducts.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>
        )}

        {/* Product checklist */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {unassignedProducts.length === 0 ? (
            <div className="text-center py-12">
              <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-muted" />
              <p className="font-semibold text-sm text-muted">Không có sản phẩm chưa xếp kệ</p>
              <p className="text-xs text-muted opacity-70 mt-1">
                Tất cả sản phẩm đã được xếp lên các kệ hàng.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {unassignedProducts.map((product) => {
                const isChecked = selectedIds.has(product.id);
                return (
                  <label
                    key={product.id}
                    className="flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-all select-none"
                    style={{
                      background: isChecked ? 'var(--brand-light)' : 'transparent',
                      boxShadow: isChecked ? `inset 0 0 0 1px var(--brand-primary)` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) e.currentTarget.style.background = 'var(--bg-inset)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                    />
                    <PackageIcon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: isChecked ? 'var(--brand-primary)' : 'var(--text-muted)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-sm truncate"
                        style={{ color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                      >
                        {product.product_name}
                      </p>
                      <p className="text-xs mt-0.5 text-muted">
                        {formatPrice(product.price)} • Tồn: {product.stock}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-primary)', background: 'var(--bg-inset)' }}
        >
          <p className="text-xs font-medium text-muted">
            Đã chọn: <span className="font-bold text-indigo-500">{selectedIds.size}</span>
          </p>
          <div className="flex items-center gap-2.5">
            <button onClick={onClose} className="btn-secondary text-xs px-4 py-2">
              Hủy
            </button>
            <button
              onClick={assignProducts}
              disabled={selectedIds.size === 0 || saving}
              className="btn-primary text-xs px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Đang lưu...' : `Xác nhận (${selectedIds.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
