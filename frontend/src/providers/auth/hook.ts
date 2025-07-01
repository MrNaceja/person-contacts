import { use } from 'react';
import { AuthContext } from '@/providers/auth/context';

export const useAuth = () => {
  const authContext = use(AuthContext);
  if (!authContext) throw new Error('useAuth must be used within AuthProvider');
  return authContext;
}