import { useState, useEffect } from 'react';

/**
 * Hook to provide safe bottom offset for mobile browser chrome
 * Uses fixed offsets that work consistently across browsers
 */
export function useViewportOffset() {
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const calculateOffset = () => {
      // Only apply offset on mobile devices (width < 768px)
      if (window.innerWidth >= 768) {
        setBottomOffset(0);
        return;
      }

      // Detect browser type from user agent
      const userAgent = navigator.userAgent.toLowerCase();
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/crios/.test(userAgent);
      const isChrome = /chrome|crios/.test(userAgent);

      // Use fixed safe offsets that work for each browser
      // Safari iOS: smaller bottom toolbar (~44-50px)
      // Chrome mobile: larger bottom toolbar (~56-70px)
      if (isSafari) {
        setBottomOffset(20); // Safari needs less offset
      } else if (isChrome) {
        setBottomOffset(90); // Chrome needs more offset
      } else {
        // Default fallback for other browsers
        setBottomOffset(80);
      }
    };

    // Calculate on mount
    calculateOffset();

    // Recalculate on resize in case orientation changes
    window.addEventListener('resize', calculateOffset);

    return () => {
      window.removeEventListener('resize', calculateOffset);
    };
  }, []);

  return bottomOffset;
}
