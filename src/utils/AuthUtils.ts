
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/database.types';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: UserType | null;
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
      .select('id, full_name, avatar_url, user_type')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('AuthUtils: Error fetching profile:', profileError);
      return null;
    }

    // If profile exists, return it
    if (profileData) {
      console.log('AuthUtils: Profile found:', profileData);
      return {
        id: profileData.id,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        user_type: profileData.user_type as UserType | null,
      };
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
    const newProfile = {
      id: userId,
      full_name: userMetadata.full_name || null,
      avatar_url: null,
      user_type: (userMetadata.user_type as UserType) || null,
    };
    
    // Insert the new profile into the database
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: newProfile.full_name,
        user_type: newProfile.user_type,
        avatar_url: newProfile.avatar_url
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
