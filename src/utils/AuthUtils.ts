
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/database.types';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: UserType | null;
  // Additional profile fields
  bio?: string | null;
  location?: string | null;
  license_number?: string | null;
  experience_years?: number | null;
  skills?: string[] | null;
}

/**
 * Fetches a user profile from the database or creates one if it doesn't exist
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('AuthUtils: Fetching profile for user:', userId);
    
    // First try to get the existing profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')  // Select all columns to avoid missing column issues
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('AuthUtils: Error fetching profile:', profileError);
      return null;
    }

    // If profile exists, return it
    if (profileData) {
      console.log('AuthUtils: Profile found:', profileData);
      return profileData as UserProfile;
    }
    
    // If no profile exists, we need user metadata to create one
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData?.user) {
      console.error('AuthUtils: Error getting user data:', userError || 'No user data available');
      return null;
    }
    
    // Get user metadata to create a new profile
    const userMetadata = userData.user.user_metadata || {};
    console.log('AuthUtils: User metadata for profile creation:', userMetadata);
    
    // Create the new profile data
    const newProfile: UserProfile = {
      id: userId,
      full_name: userMetadata.full_name || null,
      avatar_url: null,
      user_type: (userMetadata.user_type as UserType) || null,
      bio: null,
      location: null,
      license_number: null,
      experience_years: null,
      skills: null
    };
    
    // Insert the new profile into the database
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: newProfile.full_name,
        user_type: newProfile.user_type,
        avatar_url: newProfile.avatar_url,
        bio: newProfile.bio,
        location: newProfile.location,
        license_number: newProfile.license_number,
        experience_years: newProfile.experience_years,
        skills: newProfile.skills
      });
      
    if (insertError) {
      console.error('AuthUtils: Error creating profile:', insertError);
      return null;
    }
    
    console.log('AuthUtils: Created new profile for user:', userId);
    return newProfile;
  } catch (error) {
    console.error('AuthUtils: Profile fetch/create error:', error);
    return null;
  }
};

/**
 * Updates a user profile in the database
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    console.log('AuthUtils: Updating profile for user:', userId, updates);
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) {
      console.error('AuthUtils: Error updating profile:', error);
      return null;
    }
    
    // Fetch the updated profile
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')  // Select all columns to avoid missing column issues
      .eq('id', userId)
      .maybeSingle();
      
    if (fetchError) {
      console.error('AuthUtils: Error fetching updated profile:', fetchError);
      return null;
    }
    
    if (!data) {
      console.error('AuthUtils: No profile data returned after update');
      return null;
    }
    
    console.log('AuthUtils: Updated profile:', data);
    return data as UserProfile;
  } catch (error) {
    console.error('AuthUtils: Profile update error:', error);
    return null;
  }
};

/**
 * Helper function to determine dashboard URL based on user type
 */
export const getDashboardUrl = (userType: UserType | null): string => {
  console.log('AuthUtils: Getting dashboard URL for userType:', userType);
  
  if (!userType) {
    console.warn('AuthUtils: No valid user type found, using fallback');
    return '/';
  }
  
  switch (userType) {
    case 'team':
      return '/dashboard/team';
    case 'driver':
      return '/dashboard/driver';
    case 'engineer':
      return '/dashboard/engineer';
    case 'management':
      return '/dashboard/management';
    case 'admin':
      return '/dashboard/admin';
    default:
      console.warn('AuthUtils: Unknown user type:', userType);
      return '/';
  }
};
