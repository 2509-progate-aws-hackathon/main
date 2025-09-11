'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

export function useOptimizedNavigation() {
  const router = useRouter();

  const navigateWithTransition = (href: string) => {
    // View Transitions API が利用可能な場合
    if (typeof window !== 'undefined' && 'startViewTransition' in document) {
      // @ts-ignore
      document.startViewTransition(() => {
        startTransition(() => {
          router.push(href);
        });
      });
    } else {
      // フォールバック
      startTransition(() => {
        router.push(href);
      });
    }
  };

  return { navigateWithTransition };
}
