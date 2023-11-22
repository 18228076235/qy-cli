import { useEffect, EffectCallback } from 'react';
export default function useMount(effect: EffectCallback) {
  useEffect(effect, []);
}
