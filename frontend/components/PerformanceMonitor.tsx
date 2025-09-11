'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals の監視
    if (typeof window !== 'undefined' && 'performance' in window) {
      // FCP (First Contentful Paint) を監視
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
      });
      
      observer.observe({ entryTypes: ['paint', 'navigation', 'largest-contentful-paint'] });

      // LCP (Largest Contentful Paint) を監視
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => {
        observer.disconnect();
        lcpObserver.disconnect();
      };
    }
  }, []);

  return null;
}

// パフォーマンス改善のためのユーティリティ
export function preloadRoute(route: string) {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }
}

export function measureNavigationTiming(pageName: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const metrics = {
        page: pageName,
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        total: navigation.loadEventEnd - navigation.fetchStart,
      };
      
      console.table(metrics);
    }, 0);
  }
}
