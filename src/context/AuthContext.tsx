
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/database.types';

interface User {
  id: string;
  email: string;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: UserType | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  userType: UserType | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userType: UserType, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced fetchProfile function to be reused
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      if (profileData) {
        console.log('Profile data retrieved:', profileData);
        const userProfile = {
          id: profileData.id,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          user_type: profileData.user_type,
        };
        
        setProfile(userProfile);
        setUserType(profileData.user_type);
        return userProfile;
      }
      console.log('No profile found for user:', userId);
      return null;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.log('No authenticated user found');
          setUser(null);
          setProfile(null);
          setUserType(null);
          setIsLoading(false);
          return;
        }

        console.log('User found on app initialization:', user.id);
        
        setUser({
          id: user.id,
          email: user.email || '',
        });

        // Get profile data
        await fetchProfile(user.id);
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });

          // Use setTimeout to avoid potential auth deadlocks
          setTimeout(async () => {
            // Fetch profile on auth change
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          setUserType(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      console.log('Sign in successful, user ID:', data.user?.id);
      
      // Immediately fetch profile data to ensure userType is available
      if (data?.user) {
        const profileData = await fetchProfile(data.user.id);
        console.log('Profile after login:', profileData);
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userType: UserType, fullName: string) => {
    try {
      console.log('Attempting signup for:', email, 'as', userType);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      console.log('Sign up successful, creating profile');
      
      // Create the user profile immediately after signup
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            user_type: userType
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        } else {
          console.log('Profile created successfully');
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setUserType(null);
    console.log('Signed out successfully');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error('Cannot update profile: User not authenticated');
      return { error: new Error('User not authenticated') };
    }

    try {
      console.log('Updating profile for:', user.id, updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error && profile) {
        setProfile({ ...profile, ...updates });
        if (updates.user_type) setUserType(updates.user_type);
        console.log('Profile updated successfully');
      } else if (error) {
        console.error('Error updating profile:', error);
      }

      return { error };
    } catch (error) {
      console.error('Update profile exception:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    userType,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
