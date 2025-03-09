import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, isSessionExpired, refreshSession, clearAuthData } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_provider: boolean;
  is_admin?: boolean;
  provider_since: string | null;
  provider_bio: string | null;
  completed_jobs: number;
  phone?: string;
  location?: string;
  country?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  register: (email: string, password: string, fullName: string, isProvider: boolean) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Debug auth state
  useEffect(() => {
    const debugAuth = async () => {
      console.log('Checking auth state...');
      const { data, error } = await supabase.auth.getSession();
      console.log('Auth session:', data);
      if (error) console.error('Auth error:', error);
      
      const { data: userData } = await supabase.auth.getUser();
      console.log('Current user:', userData);
    };
    
    debugAuth();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const userData = await supabase.auth.getUser();
          if (userData.data.user) {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: userData.data.user.email || '',
                full_name: userData.data.user.user_metadata?.full_name || 'User',
                is_provider: false,
                is_admin: false,
                completed_jobs: 0
              });
            
            if (!insertError) {
              console.log('New profile created successfully');
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
              
              if (newProfile) {
                console.log('New profile:', newProfile);
                setProfile(newProfile);
              }
            } else {
              console.error('Error creating new profile:', insertError);
            }
          }
        } else {
          console.error('Error fetching profile:', error);
        }
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        
        if (session?.user) {
          if (isSessionExpired(session)) {
            console.log('Session expired, refreshing...');
            const { data } = await refreshSession();
            if (data.session) {
              console.log('Session refreshed successfully:', data.session);
              setSession(data.session);
              setUser(data.session.user);
              await fetchProfile(data.session.user.id);
            } else {
              console.log('Session refresh failed, logging out...');
              await handleLogout();
            }
          } else {
            console.log('Valid session found');
            setSession(session);
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
        } else {
          console.log('No session found');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        await handleLogout();
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      console.log('New session:', session);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        await handleLogout();
      } else if (session?.user) {
        if (isSessionExpired(session)) {
          console.log('Session expired during state change, refreshing...');
          const { data } = await refreshSession();
          if (data.session) {
            console.log('Session refreshed successfully:', data.session);
            setSession(data.session);
            setUser(data.session.user);
            await fetchProfile(data.session.user.id);
          } else {
            console.log('Session refresh failed, logging out...');
            await handleLogout();
          }
        } else {
          console.log('Valid session during state change');
          setSession(session);
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      }
    });

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    console.log('Handling logout...');
    clearAuthData();
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
    navigate('/');
    console.log('Logout complete');
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('Login result:', error ? 'Failed' : 'Success');
      return { error };
    } catch (error) {
      console.error('Error during login:', error);
      return { error };
    }
  };

  const register = async (email: string, password: string, fullName: string, isProvider: boolean) => {
    try {
      console.log('Attempting registration for:', email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return { error };
      }

      if (data.user) {
        console.log('Creating profile for new user:', data.user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            is_provider: isProvider,
            is_admin: false,
            provider_since: isProvider ? new Date().toISOString() : null,
            completed_jobs: 0
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { error: profileError };
        }
        
        console.log('Registration and profile creation successful');
      }

      return { error: null };
    } catch (error) {
      console.error('Error during registration:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      console.log('Initiating logout...');
      await handleLogout();
    } catch (error) {
      console.error('Error during logout:', error);
      await handleLogout();
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      console.log('Updating profile:', updates);
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error && profile) {
        console.log('Profile updated successfully');
        setProfile({ ...profile, ...updates });
      } else if (error) {
        console.error('Error updating profile:', error);
      }

      return { error };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      login, 
      register, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;