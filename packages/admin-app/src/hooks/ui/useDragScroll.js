import { useRef, useCallback, useEffect } from "react";

export const useDragScroll = () => {
  const scrollRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;

    isDownRef.current = true;
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";

    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;

    e.preventDefault();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!scrollRef.current) return;

    isDownRef.current = false;
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "auto";
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!scrollRef.current) return;

    isDownRef.current = false;
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "auto";
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDownRef.current || !scrollRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (!scrollRef.current) return;

    isDownRef.current = true;
    const touch = e.touches[0];
    startXRef.current = touch.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDownRef.current || !scrollRef.current) return;

    const touch = e.touches[0];
    const x = touch.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDownRef.current = false;
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.style.cursor = "grab";
    element.style.scrollBehavior = "auto";

    const events = [
      ["mousedown", handleMouseDown],
      ["mouseleave", handleMouseLeave],
      ["mouseup", handleMouseUp],
      ["mousemove", handleMouseMove],
      ["touchstart", handleTouchStart, { passive: false }],
      ["touchmove", handleTouchMove, { passive: false }],
      ["touchend", handleTouchEnd],
    ];

    events.forEach(([event, handler, options]) => {
      element.addEventListener(event, handler, options);
    });

    return () => {
      if (element) {
        events.forEach(([event, handler, options]) => {
          element.removeEventListener(event, handler, options);
        });
      }
    };
  }, [
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return scrollRef;
};
