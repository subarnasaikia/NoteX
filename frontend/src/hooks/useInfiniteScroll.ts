// hooks/useInfiniteScroll.ts
import { useRef, useCallback } from "react";

export const useInfiniteScroll = (hasMore: boolean, onLoadMore: () => void) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, onLoadMore]
  );

  return lastElementRef;
};
