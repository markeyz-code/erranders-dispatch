import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useUser } from './user';
import { navigateTo, useRoute, useRuntimeConfig } from '#imports';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signInWithRedirect } from 'firebase/auth';

export const useAuth = () => {
  const { setUser, setToken, logOut } = useUser();
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const firebaseLoading = ref(false);

  const getFirebaseAuth = () => {
    const config = useRuntimeConfig();
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
    };
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    return getAuth(app);
  };

  const checkRedirectResult = async () => {
    try {
      const auth = getFirebaseAuth();
      const result = await getRedirectResult(auth);
      if (result) {
        firebaseLoading.value = true;
        const idToken = await result.user.getIdToken();
        const res = await auth_api.firebaseLogin({ idToken, role: 'errander' });

        if (res.type === 'ERROR') throw { data: res.data || { message: 'Firebase login failed' } };

        const responseData = res.data?.data || res.data;
        const userData = responseData?.user;
        const tokenValue = responseData?.token;

        if (userData && tokenValue) {
          setUser(userData);
          setToken(tokenValue);
          showToast({
            title: "Welcome!",
            message: "You've successfully signed in with Google.",
            toastType: "success",
          });
          await navigateTo('/dashboard');
        }
      }
    } catch (e: any) {
      console.error('Redirect login error:', e);
    } finally {
      firebaseLoading.value = false;
    }
  };

  const firebaseLogin = async (options: { redirect?: boolean } = { redirect: true }) => {
    firebaseLoading.value = true;
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();

      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (err: any) {
        if (err.code === 'auth/popup-blocked') {
          console.warn('Popup blocked by browser. Falling back to signInWithRedirect...');
          await signInWithRedirect(auth, provider);
          return new Promise(() => {});
        }
        throw err;
      }
      const idToken = await result.user.getIdToken();

      const res = await auth_api.firebaseLogin({ idToken, role: 'errander' });

      if (res.type === 'ERROR') {
        throw { data: res.data || { message: 'Firebase login failed' } };
      }

      const responseData = res.data?.data || res.data;
      const userData = responseData?.user;
      const tokenValue = responseData?.token;

      if (!userData || !tokenValue) {
        throw { data: { message: 'Firebase login failed: unexpected response format' } };
      }

      setUser(userData);
      setToken(tokenValue);

      showToast({
        title: "Welcome!",
        message: "You've successfully signed in with Google.",
        toastType: "success",
      });

      if (options.redirect) {
        const route = useRoute();
        try {
          const redirectPath = (route.query.redirect as string) || '/dashboard';
          await navigateTo(redirectPath);
        } catch (navError) {
          // Ignore navigation aborts
        }
      }

      return responseData;
    } catch (e: any) {
      console.error('Firebase login failed:', e);
      showToast({
        title: "Login Failed",
        message: e.message || "Failed to login with Google.",
        toastType: "error",
      });
      throw e;
    } finally {
      firebaseLoading.value = false;
    }
  };

  const login = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    const route = useRoute();
    loading.value = true;
    try {
      payload.role = 'errander';
      const res = await auth_api.login(payload);
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Welcome Back!",
        message: "You've successfully logged in.",
        toastType: "success",
      });
      if (options.redirect) {
        const redirectPath = (route.query.redirect as string) || '/dashboard';
        await navigateTo(redirectPath);
      }
      return res.data;
    } catch (e: any) {
      console.error('Login error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const register = async (payload: any, options: { redirect?: boolean } = { redirect: true }) => {
    loading.value = true;
    try {
      const res = await auth_api.register(payload);
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Account Created!",
        message: "Welcome to Errandr.",
        toastType: "success",
      });
      if (options.redirect) {
        navigateTo('/dashboard');
      }
      return res.data;
    } catch (e: any) {
      console.error('Register error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await auth_api.getProfile();
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user || res.data);
    } catch (e: any) {
      console.error('Fetch profile error:', e);
      logOut();
    }
  };

  const verifyOTP = async (email: string, otp: string, options: { redirect?: boolean } = { redirect: true }) => {
    loading.value = true;
    try {
      const res = await auth_api.verifyOtp({ email, otp });
      if (res?.type === 'ERROR') throw res;
      setUser(res.data.user);
      setToken(res.data.token);
      showToast({
        title: "Verified!",
        message: "Email successfully verified.",
        toastType: "success",
      });
      if (options.redirect) {
        navigateTo('/dashboard');
      }
      return res.data;
    } catch (e: any) {
      console.error('Verify OTP error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resendOTP = async (email: string) => {
    loading.value = true;
    try {
      const res = await auth_api.resendOtp(email);
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Code Sent!",
        message: "A new verification code has been sent to your email.",
        toastType: "success",
      });
      return res.data;
    } catch (e: any) {
      console.error('Resend OTP error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const forgotPassword = async (email: string) => {
    loading.value = true;
    try {
      const res = await auth_api.forgotPassword(email);
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Code Sent!",
        message: res.data?.message || "Check your inbox for the reset code.",
        toastType: "success",
      });
      navigateTo(`/auth/verify-reset-otp?email=${encodeURIComponent(email)}`);
      return res.data;
    } catch (e: any) {
      console.error('Forgot password error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const verifyResetOTP = async (email: string, otp: string) => {
    loading.value = true;
    try {
      const res = await auth_api.verifyResetOtp({ email, otp });
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Code Verified!",
        message: res.data?.message || "Perfect! Now set your new password.",
        toastType: "success",
      });
      navigateTo(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
      return res.data;
    } catch (e: any) {
      console.error('Verify reset OTP error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (payload: any) => {
    loading.value = true;
    try {
      const res = await auth_api.resetPassword(payload);
      if (res?.type === 'ERROR') throw res;
      showToast({
        title: "Password Changed!",
        message: "You can now log in securely.",
        toastType: "success",
      });
      navigateTo('/auth/login');
      return res.data;
    } catch (e: any) {
      console.error('Reset password error:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    firebaseLoading,
    login,
    firebaseLogin,
    register,
    fetchProfile,
    forgotPassword,
    verifyResetOTP,
    verifyOTP,
    resendOTP,
    resetPassword,
    logOut,
    checkRedirectResult
  };
};
