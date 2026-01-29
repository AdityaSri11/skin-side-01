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

    // Use pagehide event which is more reliable than beforeunload
    const handlePageHide = (event: PageTransitionEvent) => {
      // Only sign out if the page is actually being unloaded (not just hidden)
      if (!event.persisted) {
        // Use sendBeacon for reliable logout on tab close
        const supabaseUrl = 'https://rclqvwqlquldwmgttltq.supabase.co';
        const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbHF2d3FscXVsZHdtZ3R0bHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3ODczMjAsImV4cCI6MjA3MjM2MzMyMH0.UsxRSQ_v8ZEmY-SCVtzFfnpqEUlxZnUH-xDG25Jnz0g';
        
        // Get current session token from localStorage
        const storageKey = `sb-rclqvwqlquldwmgttltq-auth-token`;
        const sessionData = localStorage.getItem(storageKey);
        
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData);
            const accessToken = session?.access_token;
            
            if (accessToken) {
              // Send logout request via sendBeacon (fires even when tab is closing)
              const logoutUrl = `${supabaseUrl}/auth/v1/logout`;
              const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
              
              // Use fetch with keepalive for better reliability
              fetch(logoutUrl, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'apikey': anonKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
                keepalive: true, // Ensures request completes even after page unloads
              }).catch(() => {
                // Ignore errors - page is closing anyway
              });
            }
          } catch {
            // Ignore JSON parse errors
          }
        }
        
        // Clear all storage immediately
        localStorage.removeItem(storageKey);
        sessionStorage.clear();
        
        // Clear React Query cache
        queryClient.clear();
      }
    };

    // Also handle beforeunload as fallback
    const handleBeforeUnload = () => {
      const storageKey = `sb-rclqvwqlquldwmgttltq-auth-token`;
      localStorage.removeItem(storageKey);
      sessionStorage.clear();
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
