import { useMemo } from 'react';
import { SearchIcon, PackageIcon, ReceiptIcon } from '../common/Icons';
import { formatPrice, getBaseUnitLabel } from '../../utils/formatters';

const getStockDisplay = (product) => {
  const baseLabel = getBaseUnitLabel(product.unit_type).toLowerCase();
  const thungUnit = (product.units || []).find(u => u.unit_name.toLowerCase().includes('thùng') || u.conversion_rate >= 12) || (product.units && product.units[0]);

  if (product.allow_retail === false && thungUnit && thungUnit.conversion_rate > 1) {
    const numPacks = Math.floor(product.stock / thungUnit.conversion_rate);
    return `${numPacks} ${thungUnit.unit_name.toLowerCase()}`;
  }

  if (thungUnit && thungUnit.conversion_rate > 1 && product.stock >= thungUnit.conversion_rate) {
    const numPacks = Math.floor(product.stock / thungUnit.conversion_rate);
    const numLe = product.stock % thungUnit.conversion_rate;
    return `${product.stock} ${baseLabel} (~${numPacks} ${thungUnit.unit_name.toLowerCase()}${numLe > 0 ? ` ${numLe} lẻ` : ''})`;
  }
  return `${product.stock} ${baseLabel}`;
};

export default function ProductGrid({
  shelves,
  selectedShelfId,
  setSelectedShelfId,
  shelfProductCounts,
  search,
  setSearch,
  filteredProducts,
  cart,
  addToCart,
}) {
  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 animate-fade-in-up">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--success), #14b8a6)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <ReceiptIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tính tiền
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Bấm vào sản phẩm để thêm vào hóa đơn
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card-themed p-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-themed w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs cursor-pointer font-bold"
              style={{ color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Shelf filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSelectedShelfId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedShelfId === 'all' ? 'text-white' : ''
            }`}
            style={{
              background: selectedShelfId === 'all' ? 'var(--brand-primary)' : 'var(--bg-inset)',
              color: selectedShelfId === 'all' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Tất cả
            <span
              className="px-1.5 py-0.2 rounded-full text-[10px]"
              style={{
                background: selectedShelfId === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface)',
              }}
            >
              {shelfProductCounts.all}
            </span>
          </button>

          {shelves.map((s) => {
            const count = shelfProductCounts[s.id] || 0;
            const isSelected = selectedShelfId === String(s.id);
            return (
              <button
                key={s.id}
                onClick={() => setSelectedShelfId(String(s.id))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected ? 'text-white' : ''
                }`}
                style={{
                  background: isSelected ? 'var(--brand-primary)' : 'var(--bg-inset)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {s.shelf_name}
                <span
                  className="px-1.5 py-0.2 rounded-full text-[10px]"
                  style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setSelectedShelfId('none')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedShelfId === 'none' ? 'text-white' : ''
            }`}
            style={{
              background: selectedShelfId === 'none' ? 'var(--brand-primary)' : 'var(--bg-inset)',
              color: selectedShelfId === 'none' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Chưa xếp kệ
            <span
              className="px-1.5 py-0.2 rounded-full text-[10px]"
              style={{
                background: selectedShelfId === 'none' ? 'rgba(255,255,255,0.25)' : 'var(--bg-surface)',
              }}
            >
              {shelfProductCounts.none}
            </span>
          </button>
        </div>
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="card-themed p-12 text-center">
          <PackageIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-muted" />
          <p className="font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>
            Không tìm thấy sản phẩm nào
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {filteredProducts.map((product) => {
            const hasUnits = product.units && product.units.length > 0;
            const isOnlyPack = product.allow_retail === false && hasUnits;
            const baseInCart = cart
              .filter((i) => i.product.id === product.id)
              .reduce((sum, i) => sum + i.quantity * i.conversion_rate, 0);
            const remaining = product.stock - baseInCart;
            const isOutOfStock = remaining <= 0;
            const baseLabel = getBaseUnitLabel(product.unit_type);

            return (
              <div
                key={product.id}
                className={`card-themed p-3.5 sm:p-4 transition-all flex flex-col justify-between group/card relative ${
                  isOutOfStock ? 'opacity-50' : 'hover:-translate-y-1'
                }`}
                style={{
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Out of stock badge */}
                {isOutOfStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    Hết hàng
                  </div>
                )}

                {/* Main Product Info */}
                <div
                  className={!isOutOfStock && !isOnlyPack ? 'cursor-pointer' : ''}
                  onClick={() => {
                    if (!isOutOfStock && !isOnlyPack) addToCart(product);
                  }}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3
                      className="font-bold text-sm line-clamp-2 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {product.product_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: 'var(--bg-inset)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {product.shelf?.shelf_name || 'Chưa xếp kệ'}
                    </span>
                    {isOnlyPack && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--danger)',
                        }}
                      >
                        Chỉ bán chẵn
                      </span>
                    )}
                  </div>

                  {/* Stock and Price */}
                  <div className="flex items-baseline justify-between mt-auto">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Tồn: <span className="font-semibold">{getStockDisplay(product)}</span>
                    </p>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between">
                    <p className="font-bold text-base" style={{ color: 'var(--brand-primary)' }}>
                      {isOnlyPack
                        ? `${formatPrice(product.units[0].price)}`
                        : `${formatPrice(product.price)}`}
                      <span className="text-xs font-normal opacity-70 ml-0.5">
                        /{isOnlyPack ? product.units[0].unit_name.toLowerCase() : baseLabel.toLowerCase()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quick Unit Selector */}
                {hasUnits && !isOutOfStock && (
                  <div
                    className="mt-2.5 pt-2 border-t flex flex-col gap-1.5"
                    style={{ borderColor: 'var(--border-secondary)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isOnlyPack && (
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={remaining < 1}
                        className="w-full text-xs font-bold py-1.5 px-2.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'var(--brand-primary)', color: '#fff' }}
                      >
                        <span>Bán lẻ ({baseLabel.toLowerCase()})</span>
                        <span>{formatPrice(product.price)}</span>
                      </button>
                    )}
                    {product.units.map((u) => {
                      const canAdd = remaining >= u.conversion_rate;
                      return (
                        <button
                          key={u.id || u.unit_name}
                          type="button"
                          onClick={() => {
                            if (canAdd) {
                              addToCart(product, u);
                            } else {
                              alert(`Kho chỉ còn ${remaining} ${baseLabel.toLowerCase()}, không đủ ${u.conversion_rate} ${baseLabel.toLowerCase()} để bán 1 ${u.unit_name}. Vui lòng nhập thêm hàng.`);
                            }
                          }}
                          className={`w-full text-xs font-semibold py-1.5 px-2.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer ${
                            canAdd ? 'hover:opacity-90' : 'opacity-70 hover:opacity-100'
                          }`}
                          style={{
                            background: canAdd ? (isOnlyPack ? 'var(--brand-primary)' : 'var(--bg-surface)') : 'var(--bg-inset)',
                            color: canAdd ? (isOnlyPack ? '#fff' : 'var(--text-primary)') : 'var(--text-muted)',
                            border: canAdd ? (isOnlyPack ? 'none' : '1px solid var(--border-primary)') : '1px dashed var(--border-secondary)',
                          }}
                        >
                          <div className="truncate flex items-center gap-1">
                            <span>📦 {u.unit_name} ({u.conversion_rate})</span>
                            {!canAdd && (
                              <span className="text-[10px] font-bold text-amber-500">
                                ({remaining}/{u.conversion_rate})
                              </span>
                            )}
                          </div>
                          <span className="font-bold flex-shrink-0">{formatPrice(u.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
