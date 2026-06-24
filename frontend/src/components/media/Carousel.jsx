import { useEffect, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Carousel({ mediaWidthNum, children, title }) {
  const carouselRef = useRef(null);
  const frameRef = useRef(null);
  const mediaWidth = mediaWidthNum + 16; // MediaWidthNum plus flex gap
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [showChevron, setShowChevron] = useState(true);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const c = carouselRef.current;
    if (!c) return;

    const checkLayout = () => {
      setShowChevron(c.scrollWidth >= c.clientWidth + 1);
      setHeight(Math.round(c.clientHeight));
    }

    const resizeObserver = new ResizeObserver(checkLayout);

    checkLayout();
    resizeObserver.observe(c);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const updateChevrons = () => {
    if (frameRef.current) return;
    
    frameRef.current = requestAnimationFrame(() => {
      const c = carouselRef.current;
      if (!c) return;
      setAtStart(c.scrollLeft < 1);
      setAtEnd(c.scrollLeft >= c.scrollWidth - c.clientWidth - 1);

      frameRef.current = null;
    });
  };

  const scroll = (dir) => {
    const c = carouselRef.current;
    if (!c) return;

    const skipItems = Math.floor(c.clientWidth / mediaWidth);
    const skipWidth = Math.max(skipItems, 1) * mediaWidth;
    c.scrollBy({ left: dir * skipWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {!atStart && showChevron && (
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-4 z-10 w-9 h-9 rounded-full bg-black/40 
            hover:bg-black/60 border border-transparent text-base-content flex items-center 
            justify-center transition-colors"
          style={{ top: (height / 3) + "px"}}
          aria-label={`Scroll ${title} left`}
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
          className="absolute -right-4 z-10 w-9 h-9 rounded-full bg-black/40 
            hover:bg-black/60 border border-transparent text-base-content flex items-center 
            justify-center transition-colors"
          style={{ top: (height / 3) + "px"}}
          aria-label={`Scroll ${title} right`}
        >
          <LuChevronRight />
        </button>
      )}
    </div>
  );
}
