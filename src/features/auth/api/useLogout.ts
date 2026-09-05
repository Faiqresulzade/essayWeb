import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAuthActions } from '../model/authContext';

/**
 * Çıxış: server xəbərdar edilir (best-effort), tokenlər təmizlənir və
 * bütün server keşi sıfırlanır ki, növbəti istifadəçi başqasının datasını görməsin.
 */
export function useLogout() {
  const { logout } = useAuthActions();
  const queryClient = useQueryClient();
  const [isPending, setPending] = useState(false);

  const runLogout = async () => {
    setPending(true);
    try {
      await logout();
      queryClient.clear();
    } finally {
      setPending(false);
    }
  };

  return { logout: runLogout, isPending };
}
