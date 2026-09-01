export interface SignupForm {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  acceptedTerms: boolean;
}

export interface SignupErrors {
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  acceptedTerms?: string;
  general?: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  bio: string;
  status: string;
  email: string;
  phone: string;
  avatar?: string | null;
}

export interface SettingsData {
  darkMode: boolean;
  motion: boolean;
  activityStatus: boolean;
  communityAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  profileVisibility: boolean;
}
