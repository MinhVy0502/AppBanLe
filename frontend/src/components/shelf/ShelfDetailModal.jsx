import { createPortal } from 'react-dom';
import { FolderOpenIcon, PlusIcon, XIcon, PackageIcon, PencilIcon, TrashIcon } from '../common/Icons';
import { formatPrice, getBaseUnitLabel } from '../../utils/formatters';

export default function ShelfDetailModal({
  activeShelf,
  activeTheme,
  products,
  onClose,
  openAddModal,
  openEditProduct,
  removeFromShelf,
  deleteProduct,
  deletingId,
}) {
  if (!activeShelf) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 modal-overlay" />
      <div
        className="relative rounded-2xl w-full sm:max-w-2xl overflow-hidden animate-modal-in flex flex-col max-h-[92vh] sm:max-h-[85vh]"
        style={{ background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: activeTheme.gradient }}
        >
          <div className="flex items-center gap-2 sm:gap-3 text-white min-w-0 flex-1 mr-2">
            <FolderOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-bold truncate">{activeShelf.shelf_name}</h2>
            <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 whitespace-nowrap">
              {products.length} SP
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openAddModal();
              }}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Thêm SP vào kệ</span>
              <span className="sm:hidden">Thêm SP</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer text-white"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product list */}
        <div
          className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-5"
          style={{ WebkitOverflowScrolling: 'touch', minHeight: 0 }}
        >
          {products.length === 0 ? (
            <div className="text-center py-12">
              <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-muted" />
              <p className="font-medium mb-1 text-muted">Kệ hàng trống</p>
              <p className="text-sm opacity-60 text-muted">
                Bấm "Thêm SP vào kệ" để đưa sản phẩm lên kệ này.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="rounded-xl transition-colors group/item animate-fade-in"
                  style={{ background: 'var(--bg-inset)', animationDelay: `${i * 0.04}s` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-inset)')}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0"
                      style={{ background: activeTheme.light }}
                    >
                      <PackageIcon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: activeTheme.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-sm sm:text-base"
                        style={{ color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: '1.4' }}
                      >
                        {product.product_name}
                        {product.allow_retail === false ? (
                          <span
                            className="ml-1.5 sm:ml-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md"
                            style={{
                              background: 'var(--warning-bg)',
                              color: 'var(--warning)',
                              border: '1px solid var(--warning-light)',
                            }}
                          >
                            Chỉ bán sỉ / thùng
                          </span>
                        ) : (
                          <span
                            className="ml-1.5 sm:ml-2 inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-md"
                            style={{
                              background: 'var(--brand-light)',
                              color: 'var(--brand-primary)',
                              border: '1px solid var(--brand-lighter)',
                            }}
                          >
                            {getBaseUnitLabel(product.unit_type)}
                          </span>
                        )}
                      </p>
                      <p className="text-xs sm:text-sm mt-0.5 text-muted">
                        {product.allow_retail === false && product.units?.length > 0
                          ? `${formatPrice(product.units[0].price)} / ${product.units[0].unit_name}`
                          : formatPrice(product.price)}
                        <span className="sm:hidden ml-2">• Tồn: {product.stock}</span>
                      </p>

                      {/* Packaging units preview */}
                      {Array.isArray(product.units) && product.units.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          {product.units.map((u, ui) => (
                            <span
                              key={ui}
                              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={{
                                background: 'var(--info-bg)',
                                color: 'var(--info)',
                                border: '1px solid var(--info-light)',
                              }}
                            >
                              {u.unit_name} ({u.conversion_rate}): {formatPrice(u.price)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-xs text-muted">Tồn kho</p>
                      <p className="font-semibold text-secondary">{product.stock}</p>
                    </div>

                    {/* Actions Desktop */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProduct(product);
                        }}
                        title="Sửa sản phẩm"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer flex-shrink-0 flex items-center gap-1"
                        style={{
                          color: 'var(--brand-primary)',
                          background: 'var(--brand-light)',
                          border: '1px solid var(--brand-lighter)',
                        }}
                      >
                        <PencilIcon className="w-3 h-3" /> Sửa
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromShelf(product.id);
                        }}
                        title="Gỡ khỏi kệ"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer flex-shrink-0"
                        style={{
                          color: 'var(--warning)',
                          background: 'var(--warning-bg)',
                          border: '1px solid var(--warning-light)',
                        }}
                      >
                        Gỡ kệ
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(product.id);
                        }}
                        disabled={deletingId === product.id}
                        title="Xóa sản phẩm"
                        className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0 text-red-500 hover:bg-red-500/10"
                      >
                        {deletingId === product.id ? (
                          <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin border-red-300 border-t-red-500" />
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions Mobile */}
                  <div className="flex sm:hidden items-center gap-1.5 px-3 pb-3 -mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditProduct(product);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      style={{
                        color: 'var(--brand-primary)',
                        background: 'var(--brand-light)',
                        border: '1px solid var(--brand-lighter)',
                      }}
                    >
                      <PencilIcon className="w-3 h-3" /> Sửa
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromShelf(product.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      style={{
                        color: 'var(--warning)',
                        background: 'var(--warning-bg)',
                        border: '1px solid var(--warning-light)',
                      }}
                    >
                      Gỡ kệ
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProduct(product.id);
                      }}
                      disabled={deletingId === product.id}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-red-500 bg-red-500/10"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
