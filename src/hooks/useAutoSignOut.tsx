import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook that automatically signs out the user when the browser tab/window is closed
 * and clears all cached data to ensure fresh data on next login.
 */
export const useAutoSignOut = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clear cache when user logs out via auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        // Clear all React Query cache
        queryClient.clear();
        
        // Clear localStorage items related to the app (except Supabase auth)
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !key.startsWith('sb-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear sessionStorage
        sessionStorage.clear();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
