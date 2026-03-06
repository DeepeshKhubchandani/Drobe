import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile browser chrome height and return safe bottom offset
 * Handles dynamic browser toolbars that appear/disappear on scroll
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

      // Calculate the difference between window height and visual viewport height
      // This gives us the browser chrome height
      const windowHeight = window.innerHeight;
      const viewportHeight = window.visualViewport?.height || windowHeight;
      const chromeHeight = windowHeight - viewportHeight;

      // If browser chrome is visible (viewport smaller than window), use that value
      // Otherwise, use a safe default based on typical browser chrome heights
      if (chromeHeight > 10) {
        setBottomOffset(chromeHeight);
      } else {
        // When chrome is hidden (fullscreen), use small safe offset
        setBottomOffset(10);
      }
    };

    // Calculate on mount
    calculateOffset();

    // Recalculate on resize and scroll
    window.addEventListener('resize', calculateOffset);
    window.addEventListener('scroll', calculateOffset);
    window.visualViewport?.addEventListener('resize', calculateOffset);
    window.visualViewport?.addEventListener('scroll', calculateOffset);

    return () => {
      window.removeEventListener('resize', calculateOffset);
      window.removeEventListener('scroll', calculateOffset);
      window.visualViewport?.removeEventListener('resize', calculateOffset);
      window.visualViewport?.removeEventListener('scroll', calculateOffset);
    };
  }, []);

  return bottomOffset;
}
