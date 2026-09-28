import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** true after hydration — use to avoid SSR/client mismatches for browser-only values. */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
