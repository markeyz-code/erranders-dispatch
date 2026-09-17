import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const settings_api = {
  getPayoutSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/payout');
  },
};
