import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
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
  /** True when the signed-in user's role in the database is admin. */
  isAdmin: boolean;
  /** True for admins and moderators: the people who may edit site content. */
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, isAdmin: false, isEditor: false });

export const useAuth = () => useContext(AuthContext);

function toAppUser(session: Session): AppUser {
  const u = session.user;
  return {
    uid: u.id,
    id: u.id,
    email: u.email || null,
    displayName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
    photoURL: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
  };
}

// The role a new profile starts with. The database has the final say (see supabase-security.sql: it sets
// the role from the verified sign-in e-mail and blocks everyone else from changing it), so no personal
// e-mail addresses are kept in the website code.
function defaultRole(email: string | null) {
  return (email?.toLowerCase() || '').endsWith('@mongoliancenter.org') ? 'admin' : 'user';
}

async function loadOrCreateProfile(appUser: AppUser) {
  const { data, error } = await supabase.from('users').select('*').eq('id', appUser.uid).maybeSingle();
  if (data) return data;
  if (error) {
    // Don't create (and risk overwriting an existing profile/role) if we couldn't read it.
    console.error('Failed to load user profile:', error);
    return null;
  }
  const defaultProfile = {
    id: appUser.uid,
    email: appUser.email || '',
    display_name: appUser.displayName,
    photo_url: appUser.photoURL,
    role: defaultRole(appUser.email),
  };
  const { error: insertError } = await supabase.from('users').upsert(defaultProfile, { onConflict: 'id', ignoreDuplicates: true });
  if (insertError) console.error('Failed to create user profile:', insertError);
  return defaultProfile;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let lastUserId: string | null = null;

    // onAuthStateChange fires INITIAL_SESSION on subscribe, so it covers the initial
    // session check as well as sign-in/out (including the OAuth redirect callback).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        lastUserId = null;
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const appUser = toAppUser(session);
      setUser(appUser);

      // Token refreshes re-fire this event; only reload the profile when the user changes.
      if (lastUserId === appUser.uid) {
        setLoading(false);
        return;
      }
      lastUserId = appUser.uid;

      // Defer Supabase calls out of the auth callback (calling them inside it can deadlock).
      setTimeout(async () => {
        try {
          const p = await loadOrCreateProfile(appUser);
          if (!cancelled) setProfile(p);
        } catch (err) {
          console.error('Profile load failed:', err);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }, 0);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isEditor = isAdmin || profile?.role === 'moderator';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
};
