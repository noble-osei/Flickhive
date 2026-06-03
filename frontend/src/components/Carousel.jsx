import { useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Carousel({ mediaWidthNum, children }) {
  const carouselRef = useRef(null);
  const mediaWidth = mediaWidthNum + 16; // MediaWidthNum plus flex gap
  const [skipWidth, setSkipWidth] = useState(mediaWidth * 2); // Initial value set for small screens
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [showChevron, setShowChevron] = useState(true);

  useEffect(() => {
    const c = carouselRef.current;
    if (!c) return;

    const readWidth = () => {
      setShowChevron(c.scrollWidth >= c.clientWidth + 1);

      let skipItems = Math.floor(c.clientWidth / mediaWidth);
      setSkipWidth((skipItems >= 1 ? skipItems : 1) * mediaWidth);
    };

    const resizeObserver = new ResizeObserver(() => {
      readWidth();
    });

    readWidth();
    resizeObserver.observe(c);
    window.addEventListener("resize", readWidth);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", readWidth);
    };
  }, [mediaWidth]);

  const updateChevrons = () => {
    const c = carouselRef.current;
    if (!c) return;
    setAtStart(c.scrollLeft < 1);
    setAtEnd(c.scrollLeft >= c.scrollWidth - c.clientWidth - 1);
  };

  const scroll = (dir) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir * skipWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {!atStart && showChevron && (
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-22.5 z-10 w-9 h-9 rounded-full bg-black/40 
            hover:bg-black/60 border border-transparent text-base-content flex items-center 
            justify-center transition-colors}"
          aria-label="Scroll Left"
        >
          <LuChevronLeft />
        </button>
      )}

      <div
        ref={carouselRef}
        onScroll={updateChevrons}
        className="flex gap-4 overflow-x-auto py-2 no-scrollbar snap-x snap-proximity scroll-smooth"
      >
        {children}
      </div>

      {!atEnd && showChevron && (
        <button
          onClick={() => scroll(1)}
          className="absolute -right-4 top-22.5 z-10 w-9 h-9 rounded-full bg-black/40 
            hover:bg-black/60 border border-transparent text-base-content flex items-center 
            justify-center transition-colors"
          aria-label="Scroll Right"
        >
          <LuChevronRight />
        </button>
      )}
    </div>
  );
}
