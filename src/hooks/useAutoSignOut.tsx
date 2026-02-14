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
    // Clear cache when user logs out or on auth state change
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

    // Only sign out on actual tab close, not navigation
    // Using visibilitychange + unload pattern to distinguish close from navigate
    let isNavigating = false;

    const handleBeforeUnload = () => {
      // Mark that we're in an unload event
      // Don't clear storage here - let pagehide handle it
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      // event.persisted = true means page is going into bfcache (navigation, not close)
      // Only sign out if page is truly being destroyed
      if (!event.persisted) {
        const storageKey = `sb-rclqvwqlquldwmgttltq-auth-token`;
        const sessionData = localStorage.getItem(storageKey);
        
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData);
            const accessToken = session?.access_token;
            
            if (accessToken) {
              const supabaseUrl = 'https://rclqvwqlquldwmgttltq.supabase.co';
              const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbHF2d3FscXVsZHdtZ3R0bHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3ODczMjAsImV4cCI6MjA3MjM2MzMyMH0.UsxRSQ_v8ZEmY-SCVtzFfnpqEUlxZnUH-xDG25Jnz0g';
              const logoutUrl = `${supabaseUrl}/auth/v1/logout`;
              
              fetch(logoutUrl, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'apikey': anonKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
                keepalive: true,
              }).catch(() => {});
            }
          } catch {
            // Ignore JSON parse errors
          }
        }
        
        localStorage.removeItem(storageKey);
        sessionStorage.clear();
        queryClient.clear();
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
