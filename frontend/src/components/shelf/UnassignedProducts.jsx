import { PackageIcon, TrashIcon, PencilIcon } from '../common/Icons';
import { formatPrice, getBaseUnitLabel } from '../../utils/formatters';

export default function UnassignedProducts({
  unassignedProducts,
  deleteProduct,
  deletingId,
  openEditProduct,
}) {
  if (unassignedProducts.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, var(--warning), #ea580c)' }}
        >
          <PackageIcon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Sản phẩm chưa xếp kệ
        </h2>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}
        >
          {unassignedProducts.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {unassignedProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-4 rounded-xl transition-all group/unassigned card-themed"
            style={{ boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'var(--card-hover-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--card-border)';
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245, 158, 11, 0.1)' }}
            >
              <PackageIcon className="w-5 h-5" style={{ color: 'var(--warning)' }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                {product.product_name}
                {product.allow_retail === false ? (
                  <span
                    className="ml-1.5 inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded"
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
                    className="ml-1.5 inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded"
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

              <p className="text-xs mt-0.5 text-muted">
                {product.allow_retail === false && product.units?.length > 0
                  ? `${formatPrice(product.units[0].price)} / ${product.units[0].unit_name} • Tồn: ${Math.floor(product.stock / product.units[0].conversion_rate)} ${product.units[0].unit_name}`
                  : `${formatPrice(product.price)} • Tồn: ${product.stock} ${getBaseUnitLabel(product.unit_type)}`}
              </p>

              {Array.isArray(product.units) && product.units.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mt-1">
                  {product.units.map((u, ui) => (
                    <span
                      key={ui}
                      className="text-[10px] px-1.5 py-0.2 rounded font-medium"
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

            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/unassigned:opacity-100 transition-all flex-shrink-0">
              {openEditProduct && (
                <button
                  onClick={() => openEditProduct(product)}
                  title="Sửa sản phẩm"
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  style={{ color: 'var(--brand-primary)', background: 'var(--brand-light)' }}
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => deleteProduct(product.id)}
                disabled={deletingId === product.id}
                title="Xóa sản phẩm"
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer disabled:opacity-50 text-red-500 hover:bg-red-500/10"
              >
                {deletingId === product.id ? (
                  <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin border-red-300 border-t-red-500" />
                ) : (
                  <TrashIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
