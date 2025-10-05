/* eslint-disable @typescript-eslint/no-unused-vars */
import '@testing-library/jest-dom'

class MockIntersectionObserver implements IntersectionObserver {
  root: Element | null = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []
  scrollMargin: string = ''

  constructor() {}

  observe(_target: Element) {}
  unobserve(_target: Element) {}

  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
