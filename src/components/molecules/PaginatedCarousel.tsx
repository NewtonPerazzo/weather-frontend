import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginatedCarouselProps<T> = {
  ariaLabel: string;
  getItemKey: (item: T, index: number) => string;
  items: readonly T[];
  nextLabel: string;
  previousLabel: string;
  renderItem: (item: T, index: number) => ReactNode;
};

export function PaginatedCarousel<T>({
  ariaLabel,
  getItemKey,
  items,
  nextLabel,
  previousLabel,
  renderItem,
}: PaginatedCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex] ?? items[0];
  const hasMultipleItems = items.length > 1;

  function goToPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? items.length - 1 : currentIndex - 1,
    );
  }

  function goToNext() {
    setActiveIndex((currentIndex) =>
      currentIndex === items.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <section aria-label={ariaLabel} className="mt-2">
      <div className="flex items-center">
        <div className="flex w-full justify-start">
          {renderItem(activeItem, activeIndex)}
        </div>
      </div>

      {hasMultipleItems ? (
        <div className="mt-4 flex w-full max-w-md items-center justify-between gap-3">
          <button
            aria-label={previousLabel}
            className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition hover:border-sky-600 hover:text-sky-700 focus:outline-none focus:ring-3 focus:ring-sky-200"
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>

          <div className="flex flex-1 flex-wrap justify-center gap-1" role="tablist">
            {items.map((item, index) => (
              <button
                aria-label={`${index + 1} / ${items.length}`}
                aria-selected={index === activeIndex}
                className={`h-2 w-2 shrink-0 rounded-full transition ${
                  index === activeIndex
                    ? "bg-indigo-700"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                key={getItemKey(item, index)}
                onClick={() => setActiveIndex(index)}
                role="tab"
                type="button"
              />
            ))}
          </div>

          <button
            aria-label={nextLabel}
            className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-sm transition hover:border-sky-600 hover:text-sky-700 focus:outline-none focus:ring-3 focus:ring-sky-200"
            onClick={goToNext}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
