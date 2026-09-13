import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

export interface AppUser {
  uid: string;
  id?: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  profile: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email?.toLowerCase() || '';
        const isSuperAdmin = email === 'emeraldtorstein@gmail.com' || email === 'batmunkh.unen@gmail.com';
        const isDomainAdmin = email.endsWith('@mongoliancenter.org') || email === 'info@mongoliancenter.org';

        const appUser: AppUser = {
          uid: session.user.id,
          id: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
        };
        setUser(appUser);

        // Fetch or create user profile
        supabase.from('users').select('*').eq('id', session.user.id).maybeSingle().then(({ data, error }) => {
          if (data) {
            setProfile(data);
          } else {
            const defaultProfile = {
              id: session.user.id,
              email: session.user.email || '',
              display_name: appUser.displayName,
              photo_url: appUser.photoURL,
              role: isSuperAdmin || isDomainAdmin ? 'admin' : 'user',
            };
            supabase.from('users').upsert(defaultProfile).then(() => {
              setProfile(defaultProfile);
            });
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const email = session.user.email?.toLowerCase() || '';
        const isSuperAdmin = email === 'emeraldtorstein@gmail.com' || email === 'batmunkh.unen@gmail.com';
        const isDomainAdmin = email.endsWith('@mongoliancenter.org') || email === 'info@mongoliancenter.org';

        const appUser: AppUser = {
          uid: session.user.id,
          id: session.user.id,
          email: session.user.email || null,
          displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
        };
        setUser(appUser);

        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).maybeSingle();
        if (data) {
          setProfile(data);
        } else {
          const defaultProfile = {
            id: session.user.id,
            email: session.user.email || '',
            display_name: appUser.displayName,
            photo_url: appUser.photoURL,
            role: isSuperAdmin || isDomainAdmin ? 'admin' : 'user',
          };
          await supabase.from('users').upsert(defaultProfile);
          setProfile(defaultProfile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
