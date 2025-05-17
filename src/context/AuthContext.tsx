
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/database.types';
import { toast } from "sonner";
import { fetchUserProfile, getDashboardUrl, UserProfile, updateUserProfile } from '@/utils/AuthUtils';

interface User {
  id: string;
  email: string;
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
  getDashboardUrl: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Set up auth state listener FIRST to avoid missing events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (session && session.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
              });
              
              // Wait for fetchProfile to complete before marking as not loading
              const userProfile = await fetchUserProfile(session.user.id);
              if (userProfile) {
                setProfile(userProfile);
                setUserType(userProfile.user_type);
              }
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
          
          const userProfile = await fetchUserProfile(sessionData.session.user.id);
          if (userProfile) {
            setProfile(userProfile);
            setUserType(userProfile.user_type);
          }
        } else {
          setIsLoading(false);
        }
        
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
        // Make sure we get the profile info
        const userProfile = await fetchUserProfile(data.user.id);
        console.log('Retrieved user profile after sign in:', userProfile);
        
        // Update state to ensure we have both user and userType
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
        
        if (userProfile) {
          setProfile(userProfile);
          setUserType(userProfile.user_type);
        }
      }
      
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
      console.log('Signing up user:', email, 'as', userType, 'with name:', fullName);
      setIsLoading(true);
      
      // Make sure we're working with valid data
      if (!email || !password || !userType || !fullName) {
        const errorMsg = "Missing required registration data";
        console.error(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return { error: new Error(errorMsg) };
      }
      
      // Step 1: Sign up the user with metadata
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
          emailRedirectTo: window.location.origin + '/login'
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message || "Failed to sign up");
        setIsLoading(false);
        return { error };
      }

      console.log('Sign up successful, user data:', data);

      // Step 2: If user was created, create a profile
      if (data?.user) {
        console.log('Creating profile for new user:', data.user.id);
        
        // Insert the profile record with all required fields
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            user_type: userType,
            avatar_url: null
          });
          
        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error("Account created but profile setup failed. Please contact support.");
        } else {
          console.log('Created profile for new user:', data.user.id);
          
          // Double-check that the profile was created by fetching it
          const { data: checkProfileData, error: checkProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (checkProfileError || !checkProfileData) {
            console.error('Profile verification failed:', checkProfileError);
          } else {
            console.log('Profile verification successful:', checkProfileData);
          }
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
      } else {
        console.error('No user data returned from signUp call');
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
        return { error: new Error("No user data returned") };
      }

      toast.success("Signed up successfully!");
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setProfile(null);
      setUserType(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
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
      
      const updatedProfile = await updateUserProfile(user.id, updates);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        if (updates.user_type) setUserType(updates.user_type);
        console.log('Profile updated successfully');
        setIsLoading(false);
        return { error: null };
      } else {
        console.error('Error updating profile: No profile returned');
        setIsLoading(false);
        return { error: new Error('Failed to update profile') };
      }
    } catch (error) {
      console.error('Update profile exception:', error);
      setIsLoading(false);
      toast.error("An unexpected error occurred");
      return { error };
    }
  };

  // Use our helper function to get dashboard URL
  const getCurrentDashboardUrl = () => getDashboardUrl(userType);

  const value = {
    user,
    profile,
    userType,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getDashboardUrl: getCurrentDashboardUrl,
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
