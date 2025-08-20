export type RootStackParamList = {
  Main: undefined; // holds the tabs
  EmotionalCheckIns: undefined; // details screen you want to push
};

export type DashboardInnerStackParamList = {
  DashboardHome: undefined;
  EmotionalCheckIns: undefined;
  ElderUserProfile: {
    elderName: string;
    dob: string;
    tags: string[];
    avatarUrl?: string;
  };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Chat: undefined;
  Calendar: undefined;
  Health: undefined;
  Settings: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  LogIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  // (Do NOT put EmotionalCheckIns here if it’s an in-app screen)
};
