import { useCallback, useEffect, useRef, useState } from 'react';

export const useIntersect = (
  onIntersect: () => void,
  options?: IntersectionObserverInit
) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const callback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => setInView(entry.isIntersecting));
  }, []);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(triggerRef.current);

    return () => observer.disconnect();
  }, [triggerRef]);

  useEffect(() => {
    inView && onIntersect();
  }, [inView]);

  return triggerRef;
};
