import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const erranders_api = {
  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/erranders/me');
  },

  register: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/erranders/register', payload);
  },

  getEarnings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/erranders/earnings');
  },

  toggleStatus: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/erranders/toggle-status');
  },

  // Alias for backwards compatibility (profile.vue, dashboard.ts use toggleOnline)
  toggleOnline: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/erranders/toggle-status');
  },

  getAssignedOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/errander');
  },
};
