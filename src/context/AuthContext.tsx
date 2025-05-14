
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/database.types';
import { toast } from "sonner";

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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, user_type')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        console.log('Profile found:', data);
        const userProfile = {
          id: data.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          user_type: data.user_type as UserType | null,
        };
        
        setProfile(userProfile);
        setUserType(data.user_type as UserType | null);
        return userProfile;
      } else {
        // If no profile exists, create one with minimal information
        console.log('No profile found, creating new profile for user:', userId);
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const userMetadata = userData.user.user_metadata || {};
          
          // Create a new profile with user metadata
          const newProfile = {
            id: userId,
            full_name: userMetadata.full_name || null,
            avatar_url: null,
            user_type: (userMetadata.user_type as UserType) || null,
          };
          
          // Insert the new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: userId,
              full_name: newProfile.full_name,
              user_type: newProfile.user_type,
              avatar_url: newProfile.avatar_url
            }]);
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
          } else {
            console.log('Created new profile for user:', userId);
            setProfile(newProfile);
            setUserType(newProfile.user_type);
            return newProfile;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (session && session.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
              });
              
              // We must wait for fetchProfile to complete before marking as not loading
              await fetchProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
              setUserType(null);
            }
            
            setIsLoading(false);
          }
        );
        
        // THEN check for existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Auth session error:', sessionError);
          setIsLoading(false);
          return;
        }
        
        // Initialize from existing session if available
        if (sessionData.session) {
          console.log('Existing session found:', sessionData.session.user.id);
          setUser({
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || '',
          });
          
          await fetchProfile(sessionData.session.user.id);
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      setIsLoading(true);
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast.error(error.message || "Failed to sign in");
        setIsLoading(false);
        return { error };
      }
      
      console.log('Sign in successful, user ID:', data.user?.id);
      
      if (data?.user) {
        await fetchProfile(data.user.id);
      }
      
      toast.success("Signed in successfully!");
      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userType: UserType, fullName: string) => {
    try {
      console.log('Signing up user:', email, 'as', userType);
      setIsLoading(true);
      
      // Sign up the user with metadata
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
        toast.error(error.message || "Failed to sign up");
        setIsLoading(false);
        return { error };
      }

      console.log('Sign up successful, user data:', data);

      // If user was created, create a profile
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            full_name: fullName,
            user_type: userType,
            avatar_url: null
          }]);
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('Created profile for new user');
        }
        
        // Immediately set the user and profile
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
        
        setProfile({
          id: data.user.id,
          full_name: fullName,
          avatar_url: null,
          user_type: userType,
        });
        
        setUserType(userType);
      }

      toast.success("Signed up successfully! You can now sign in.");
      setIsLoading(false);
      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setUserType(null);
    setIsLoading(false);
    console.log('Signed out successfully');
    toast.success("Signed out successfully");
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error('Cannot update profile: User not authenticated');
      toast.error("You must be signed in to update your profile");
      return { error: new Error('User not authenticated') };
    }

    try {
      console.log('Updating profile for:', user.id, updates);
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error && profile) {
        setProfile({ ...profile, ...updates });
        if (updates.user_type) setUserType(updates.user_type);
        console.log('Profile updated successfully');
        toast.success("Profile updated successfully");
      } else if (error) {
        console.error('Error updating profile:', error);
        toast.error(error.message || "Failed to update profile");
      }

      setIsLoading(false);
      return { error };
    } catch (error) {
      console.error('Update profile exception:', error);
      setIsLoading(false);
      toast.error("An unexpected error occurred");
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
