import { useMemo, useDeferredValue } from 'react';
import { getPasswordResult } from '../utils/password-strength';

export const usePasswordStrength = (password) => {
  const deferredPassword = useDeferredValue(password);

  return useMemo(() => {
    if (!deferredPassword) return null;
    return getPasswordResult(deferredPassword);
  }, [deferredPassword]);
};
