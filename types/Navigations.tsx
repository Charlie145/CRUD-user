export type RootStackParamList = {
  Home: { refresh?: boolean };
  UserAdd: { user?: string; userId?: string } | undefined;
};