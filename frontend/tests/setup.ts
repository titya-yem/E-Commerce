/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom';

// --- Mock ResizeObserver ---
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as any).ResizeObserver = ResizeObserverMock;

// --- Mock IntersectionObserver ---
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly scrollMargin: string = '';

  observe(_target: Element): void {}
  unobserve(_target: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}


(globalThis as any).IntersectionObserver = MockIntersectionObserver;
