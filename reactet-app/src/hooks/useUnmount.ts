import { useEffect } from 'react';

export default function useUnmount(fn: () => void | undefined) {
  useEffect(() => fn, []);
}
