import { useState, useCallback } from 'react';
import { User, DivisionType, ROUTE_PATHS } from '@/lib';

/**
 * Authentication and RBAC management hook for RISALAH Pesantren System.
 * Handles session persistence and complex role-based permission logic.
 */

const AUTH_STORAGE_KEY = 'risalah_auth_session';

export const useAuth = () => {
  // Initialize user from localStorage for persistence across reloads
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth session', e);
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates the current user state and persists to localStorage
   */
  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  /**
   * Clears the session and redirects to login
   */
  const logout = useCallback(() => {
    setUser(null);
    window.location.href = ROUTE_PATHS.LOGIN;
  }, [setUser]);

  /**
   * RBAC Helper: Can the user view this division's data?
   * - Super Admin (Mudir): Can read ALL divisions
   * - Top Management: Can read ALL divisions
   * - Divisional Admin: Can only read their own division
   */
  const canReadDivision = useCallback((divisionType: DivisionType): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'top_management') return true;
    return user.division === divisionType;
  }, [user]);

  /**
   * RBAC Helper: Can the user perform write operations (Create/Update/Delete)?
   * - Super Admin (Mudir): READ-ONLY (returns false)
   * - Top Management: Full access to everything
   * - Divisional Admin: Write access ONLY to their specific division
   */
  const canWriteDivision = useCallback((divisionType: DivisionType): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return false; // Mudir is strictly read-only
    if (user.role === 'top_management') return true;
    return user.role === 'divisional_admin' && user.division === divisionType;
  }, [user]);

  /**
   * RBAC Helper: Can the user provide feedback/comments on reports?
   * - Mudir and Top Management can give feedback to divisions
   */
  const canComment = useCallback((): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'top_management';
  }, [user]);

  /**
   * RBAC Helper: Can the user validate/approve items or minutes?
   * - Only Top Management (Ketua/Sekretaris Umum) has validation rights
   */
  const canValidate = useCallback((): boolean => {
    if (!user) return false;
    return user.role === 'top_management';
  }, [user]);

  return {
    user,
    setUser,
    logout,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user,
    // Simple Role Checks
    isMudir: user?.role === 'super_admin',
    isTopManagement: user?.role === 'top_management',
    isDivisionalAdmin: user?.role === 'divisional_admin',
    // Permission Logic
    canReadDivision,
    canWriteDivision,
    canComment,
    canValidate,
  };
};