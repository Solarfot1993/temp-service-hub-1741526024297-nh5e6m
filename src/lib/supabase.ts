import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      // Custom storage implementation to handle cache issues
      getItem: (key) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          // If there's any error parsing the stored data, remove it
          localStorage.removeItem(key);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Error storing auth data:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing auth data:', error);
        }
      }
    }
  },
  global: {
    headers: {
      'x-application-name': 'bydaygigs'
    }
  }
});

// Helper function to check if session is expired
export const isSessionExpired = (session: any) => {
  if (!session?.expires_at) return true;
  const expiresAt = new Date(session.expires_at).getTime();
  const now = new Date().getTime();
  return now >= expiresAt;
};

// Helper function to refresh session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
};

// Helper function to clear all auth data
export const clearAuthData = () => {
  try {
    // Clear Supabase session
    supabase.auth.signOut();
    
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.') || key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Add an interceptor to handle 401 errors
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    
    if (response.status === 401) {
      // Try to refresh the token
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!error && session) {
        // Retry the original request with the new token
        const [resource, config] = args;
        return await originalFetch(resource, {
          ...config,
          headers: {
            ...config?.headers,
            'Authorization': `Bearer ${session.access_token}`
          }
        });
      } else {
        // If refresh fails, clear auth data
        clearAuthData();
      }
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};