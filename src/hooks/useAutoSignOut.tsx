import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook that automatically signs out the user when the browser tab/window is closed
 * WARNING: This creates a poor user experience as users expect to stay logged in
 * across sessions. Only use if explicitly required by your application's security needs.
 */
export const useAutoSignOut = () => {
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Sign out the user when tab/window closes
      await supabase.auth.signOut({ scope: 'local' });
    };

    // Listen for tab/window close
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};
