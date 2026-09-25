import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { SearchIcon, PackageIcon, ReceiptIcon, ChevronLeftIcon, ChevronRightIcon } from '../common/Icons';
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
  onOpenScanner,
}) {
  const shelfScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const updateScrollButtons = useCallback(() => {
    const el = shelfScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = shelfScrollRef.current;
    if (!el) return;

    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        updateScrollButtons();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('resize', updateScrollButtons);
      el.removeEventListener('wheel', onWheel);
    };
  }, [shelves, updateScrollButtons]);

  const handleScrollBy = (direction) => {
    const el = shelfScrollRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -240 : 240;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 300);
  };

  const handleMouseDown = (e) => {
    const el = shelfScrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - el.getBoundingClientRect().left;
    startScrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const el = shelfScrollRef.current;
    if (!el) return;
    e.preventDefault();
    const currentX = e.pageX - el.getBoundingClientRect().left;
    const walk = currentX - startXRef.current;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    el.scrollLeft = startScrollLeftRef.current - walk;
    updateScrollButtons();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 50);
  };

  const handleShelfClick = (id) => {
    if (hasDraggedRef.current) return;
    setSelectedShelfId(id);
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Search & Action Bar */}
      <div className="card-themed p-3 sm:p-4 mb-4 rounded-3xl border border-secondary shadow-sm">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, mã vạch hoặc 4 số cuối..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-themed w-full py-2.5 text-xs sm:text-sm rounded-2xl"
              style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.5rem' : '1rem' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs cursor-pointer font-bold text-muted"
              >
                ✕
              </button>
            )}
          </div>

          {/* Camera Scanner Trigger Button */}
          <button
            type="button"
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md hover:brightness-110 active:scale-95 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-hover))',
            }}
            title="Bật Camera Quét Mã Vạch"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <span className="hidden sm:inline">Quét camera</span>
          </button>
        </div>

        {/* Shelf Filter Pills */}
        <div className="relative flex items-center mt-3 pt-3 border-t border-secondary">
          {canScrollLeft && (
            <div
              className="absolute left-0 top-0 bottom-0 flex items-center z-10 pr-6 pointer-events-none"
              style={{ background: 'linear-gradient(to right, var(--bg-surface) 50%, transparent)' }}
            >
              <button
                type="button"
                onClick={() => handleScrollBy('left')}
                className="w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer pointer-events-auto hover:scale-110 active:scale-95"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div
            ref={shelfScrollRef}
            onScroll={updateScrollButtons}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex gap-1.5 overflow-x-auto select-none custom-scrollbar cursor-grab active:cursor-grabbing w-full scroll-smooth pb-0.5"
          >
            <button
              type="button"
              onClick={() => handleShelfClick('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                selectedShelfId === 'all' ? 'text-white shadow-sm' : ''
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
                  type="button"
                  onClick={() => handleShelfClick(String(s.id))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    isSelected ? 'text-white shadow-sm' : ''
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
          </div>
        </div>
      </div>

      {/* Product Grid List */}
      {filteredProducts.length === 0 ? (
        <div className="card-themed p-12 text-center rounded-3xl border border-secondary">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-muted" style={{ background: 'var(--bg-inset)' }}>
            <PackageIcon className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Không tìm thấy sản phẩm</h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Thử tìm với từ khóa khác hoặc quét mã vạch
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const isLowStock = p.stock > 0 && p.stock <= 5;
            const baseUnit = getBaseUnitLabel(p.unit_type);

            return (
              <div
                key={p.id}
                className="card-themed p-3 rounded-2xl border border-secondary shadow-sm flex flex-col justify-between transition-all hover:border-brand-primary group relative overflow-hidden"
              >
                {/* Product Info */}
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isOutOfStock
                          ? 'bg-red-500/10 text-red-500'
                          : isLowStock
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                      }`}
                    >
                      {isOutOfStock ? 'Hết hàng' : getStockDisplay(p)}
                    </span>

                    {p.barcode && (
                      <span className="text-[9px] font-mono text-muted bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded" title={`Mã vạch: ${p.barcode}`}>
                        #{p.barcode.slice(-4)}
                      </span>
                    )}
                  </div>

                  <h4
                    className="font-bold text-xs sm:text-sm line-clamp-2 leading-tight mb-2 group-hover:text-indigo-500 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    title={p.product_name}
                  >
                    {p.product_name}
                  </h4>
                </div>

                {/* Purchase Buttons (Base unit + Packaging units) */}
                <div className="space-y-1.5 pt-2 border-t border-secondary">
                  {/* Base Unit Button */}
                  {p.allow_retail !== false && (
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => addToCart(p, null)}
                      className="w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between active:scale-95"
                      style={{
                        background: 'var(--bg-inset)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="truncate text-left text-[11px]">
                        +1 {baseUnit}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(p.price)}
                      </span>
                    </button>
                  )}

                  {/* Additional Pack Units (e.g. Thùng, Lốc) */}
                  {(p.units || []).map((u) => {
                    const canAfford = p.stock >= u.conversion_rate;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        disabled={!canAfford}
                        onClick={() => addToCart(p, u)}
                        className="w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-between active:scale-95"
                        style={{
                          background: 'rgba(99, 102, 241, 0.08)',
                          color: 'var(--brand-primary)',
                        }}
                      >
                        <span className="truncate text-left text-[11px]">
                          +1 {u.unit_name} <span className="opacity-70 font-normal">({u.conversion_rate})</span>
                        </span>
                        <span className="font-bold">
                          {formatPrice(u.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
