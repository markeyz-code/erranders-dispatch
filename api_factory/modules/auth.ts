import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const auth_api = {
  register: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/register', payload);
  },

  login: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/login', payload);
  },

  verifyOtp: (payload: { email: string; otp: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/verify-otp', payload);
  },

  resendOtp: (email: string) => {
    return GATEWAY_ENDPOINT.post('/auth/send-otp', { email });
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/profile');
  },

  updateProfile: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/users/me', payload);
  },

  forgotPassword: (email: string) => {
    return GATEWAY_ENDPOINT.post('/auth/forgot-password', { email });
  },

  resetPassword: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/reset-password', payload);
  },

  verifyResetOtp: (payload: { email: string; otp: string }) => {
    return GATEWAY_ENDPOINT.post('/auth/verify-reset-otp', payload);
  },

  updateFcmToken: (payload: { token: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/users/me/fcm-token', payload);
  },

  firebaseLogin: (payload: { idToken: string; role?: string; isSignUp?: boolean }) => {
    return GATEWAY_ENDPOINT.post('/auth/firebase', payload);
  },
};
