import { FolderIcon, FolderOpenIcon, TrashIcon, ChevronIcon } from '../common/Icons';
import { getUnitBadge } from '../../utils/formatters';

export default function ShelfCard({
  shelf,
  index,
  theme,
  products,
  isActive,
  onToggle,
  onDelete,
  isDeleting,
}) {
  return (
    <div
      onClick={onToggle}
      className="relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ease-out group"
      style={{
        background: 'var(--card-bg)',
        border: isActive ? `2px solid ${theme.color}` : '2px solid var(--card-border)',
        boxShadow: isActive ? `0 0 0 3px ${theme.light}, var(--shadow-lg)` : 'var(--shadow-sm)',
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--card-hover-border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderColor = 'var(--card-border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
    >
      {/* Gradient top bar */}
      <div className="h-1.5" style={{ background: theme.gradient }} />

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-center gap-3.5 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
            style={{ background: theme.gradient }}
          >
            {isActive ? (
              <FolderOpenIcon className="w-5 h-5 text-white" />
            ) : (
              <FolderIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-[0.95rem]" style={{ color: 'var(--text-primary)' }}>
              {shelf.shelf_name}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {products.length} sản phẩm
            </p>
          </div>
          {/* Delete shelf */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(shelf.id);
            }}
            disabled={isDeleting}
            title="Xóa kệ hàng"
            className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
            style={{ color: 'var(--danger)', border: '1px solid transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--danger-bg)';
              e.currentTarget.style.borderColor = 'var(--danger-light)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            {isDeleting ? (
              <span
                className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                style={{ borderColor: 'var(--danger-light)', borderTopColor: 'var(--danger)' }}
              />
            ) : (
              <TrashIcon className="w-4 h-4" />
            )}
          </button>
          {/* Expand indicator */}
          <ChevronIcon
            className="w-5 h-5 transition-all duration-300 flex-shrink-0"
            style={{
              color: isActive ? 'var(--text-tertiary)' : 'var(--text-muted)',
              transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>

        {/* Preview badges */}
        {products.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {products.slice(0, 3).map((p) => (
              <span
                key={p.id}
                className="text-xs px-2.5 py-1 rounded-lg font-medium truncate max-w-[160px]"
                style={{ background: theme.light, color: theme.color }}
              >
                {p.product_name}
                {getUnitBadge(p) && <span style={{ opacity: 0.7 }} className="ml-1">{getUnitBadge(p)}</span>}
              </span>
            ))}
            {products.length > 3 && (
              <span
                className="text-xs px-2 py-1 rounded-lg font-medium"
                style={{ background: 'var(--bg-inset)', color: 'var(--text-muted)' }}
              >
                +{products.length - 3}
              </span>
            )}
          </div>
        )}

        {products.length === 0 && (
          <p className="text-xs italic" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
            Chưa có sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
