import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export default (effect: EffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};
