import axios, { type AxiosResponse } from "axios";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useNetworkStatus } from '@/composables/core/useNetworkStatus'

const getBaseUrl = (): string => {
  try {
    const config = useRuntimeConfig();
    return (config.public.apiBase as string) || 'https://api.erranders.org';
  } catch {
    const envApiUrl = import.meta.env?.VITE_API_BASE_URL;
    return envApiUrl || 'https://api.erranders.org';
  }
};

const cleanBaseUrl = getBaseUrl().replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = cleanBaseUrl;
const $GATEWAY_ENDPOINT = `${cleanBaseUrl}/api/v1`;
const $GATEWAY_ENDPOINT_V2 = `${cleanBaseUrl}/v2`;
const $IMAGE_UPLOAD_ENDPOINT = cleanBaseUrl;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
  GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA,
  IMAGE_UPLOAD_ENDPOINT,
];

/**
 * The signed-in rider's campus, read from the `errandr_dispatch_user` cookie the
 * same way the token above is read from `errandr_dispatch_token` (with the same
 * localStorage fallback).
 *
 * Accepts a plain ObjectId/slug (`user.institution`) or a populated document
 * (`user.institution._id`). Returns '' when the account has no campus, in which
 * case no header is sent and the backend keeps its previous unscoped behaviour.
 */
const readInstitutionId = (): string => {
  if (typeof window === 'undefined') return '';

  let rawUser: any = null;

  const match = document.cookie.match(new RegExp('(^| )errandr_dispatch_user=([^;]+)'));
  if (match) {
    try {
      rawUser = JSON.parse(decodeURIComponent(match[2]));
    } catch (e) {}
  }
  if (!rawUser) {
    try {
      const stored = localStorage.getItem('user');
      if (stored) rawUser = JSON.parse(stored);
    } catch (e) {}
  }

  const institution = rawUser?.institution;
  if (!institution) return '';

  const ref = typeof institution === 'object'
    ? (institution._id || institution.slug)
    : institution;
  return typeof ref === 'string' ? ref.trim() : '';
};

instanceArray.forEach((instance) => {
  instance.defaults.timeout = 15000; // Set global timeout to 15 seconds
  instance.interceptors.request.use((config: any) => {
    let tokenValue = '';
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )errandr_dispatch_token=([^;]+)'));
      if (match) {
        tokenValue = decodeURIComponent(match[2]);
      } else {
        tokenValue = localStorage.getItem('token') || '';
      }
    }
    
    if (tokenValue) {
      config.headers = config.headers || {};
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${tokenValue}`);
      } else {
        config.headers.Authorization = `Bearer ${tokenValue}`;
      }
    }

    // A rider belongs to exactly one campus, so every request is pinned to it.
    // The backend resolves tenancy from the authenticated user *before* this
    // header, so it can never widen or move the account's campus — sending it
    // simply makes the scoping explicit.
    const institutionId = readInstitutionId();
    if (institutionId) {
      config.headers = config.headers || {};
      if (typeof config.headers.set === 'function') {
        config.headers.set('X-Institution-Id', institutionId);
      } else {
        config.headers['X-Institution-Id'] = institutionId;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      // Check for timeout or network connection error
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || err.message?.includes('Network Error') || typeof err.response === "undefined") {
        try {
          const { recordSlowNetwork } = useNetworkStatus();
          recordSlowNetwork();
        } catch (e) {}
        
        return {
          type: "ERROR",
          ...(err.response || { status: 0, statusText: "Network Error" }),
        };
      }
      if (err.response.status === 401) {
        console.log(err.response.data.error)
        // Only log out if we're not already on auth pages
        const isOnAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth')
        if (!isOnAuthPage && typeof window !== 'undefined') {
          document.cookie = 'errandr_dispatch_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'errandr_dispatch_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        if (err.response.data.message) {
          useCustomToast().showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else {
        useCustomToast().showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An unexpected error occurred",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
