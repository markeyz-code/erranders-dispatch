import { computed } from 'vue';
import { useCookie } from '#app';

interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  matricNumber?: string;
}

export const useUser = () => {
  const token = useCookie<string | null>('errandr_dispatch_token', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  });
  
  const refreshToken = useCookie<string | null>('errandr_dispatch_refresh_token', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  });

  const user = useCookie<User | null>('errandr_dispatch_user', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  });

  // Client-side hydration fallback from localStorage if cookies were dropped or not loaded
  if (typeof window !== 'undefined') {
    if (!token.value) {
      const storedToken = localStorage.getItem('token') || localStorage.getItem('errandr_dispatch_token');
      if (storedToken) token.value = storedToken;
    }
    if (!refreshToken.value) {
      const storedRefresh = localStorage.getItem('refreshToken') || localStorage.getItem('errandr_dispatch_refresh_token');
      if (storedRefresh) refreshToken.value = storedRefresh;
    }
    if (!user.value) {
      try {
        const storedUser = localStorage.getItem('user') || localStorage.getItem('errandr_dispatch_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed._id || parsed.id)) {
            parsed._id = parsed._id || parsed.id;
            user.value = parsed;
          }
        }
      } catch (e) {}
    } else if (user.value && !user.value._id && (user.value as any).id) {
      user.value._id = (user.value as any).id;
    }
  }

  const setUser = (userData: User) => {
    if (userData && !userData._id && (userData as any).id) {
      userData._id = (userData as any).id;
    }
    user.value = userData;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 365 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_dispatch_user=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('errandr_dispatch_user', JSON.stringify(userData));
    }
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 365 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_dispatch_token=${newToken}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('token', newToken);
      localStorage.setItem('errandr_dispatch_token', newToken);
    }
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
    if (typeof window !== 'undefined') {
      const expires = new Date(Date.now() + 365 * 86400 * 1000).toUTCString();
      document.cookie = `errandr_dispatch_refresh_token=${newRefreshToken}; expires=${expires}; path=/; samesite=lax`;
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('errandr_dispatch_refresh_token', newRefreshToken);
    }
  };

  const logOut = () => {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    if (typeof window !== 'undefined') {
      document.cookie = 'errandr_dispatch_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=lax;';
      document.cookie = 'errandr_dispatch_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=lax;';
      document.cookie = 'errandr_dispatch_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=lax;';
      localStorage.removeItem('token');
      localStorage.removeItem('errandr_dispatch_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('errandr_dispatch_refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('errandr_dispatch_user');
      localStorage.removeItem('errandr_cart');
      window.location.href = '/auth/login';
    }
  };

  const isLoggedIn = computed(() => !!token.value);

  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  return {
    user,
    token,
    refreshToken,
    setUser,
    setToken,
    setRefreshToken,
    logOut,
    isLoggedIn,
    fullName
  };
};
