import { ref } from 'vue';
import { wallets_api } from "@/api_factory/modules/wallets";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useLoader } from "@/composables/core/useLoader";

export const useWallet = () => {
  const { showToast } = useCustomToast();
  const { startLoading, stopLoading } = useLoader();
  const balance = ref(0);
  const wallet = ref<any>(null);

  const fetchWallet = async () => {
    try {
      const res = await wallets_api.getWallet();
      wallet.value = res.data;
      balance.value = res.data.balance;
    } catch (e) { /* Error handled by axios */ }
  };

  const withdrawFunds = async (amount: number, isInstant: boolean = false) => {
    startLoading('Processing withdrawal...');
    try {
      const res = await wallets_api.withdraw(amount, isInstant);
      if (res.data) {
        showToast({
          title: "Withdrawal Successful",
          message: `₦${amount} has been queued for payout.`,
          toastType: "success",
        });
        await fetchWallet();
      }
    } finally {
      stopLoading();
    }
  };

  const updatePreferences = async (payload: any) => {
    startLoading('Saving preferences...');
    try {
      const res = await wallets_api.updatePreferences(payload);
      wallet.value = res.data;
      showToast({
        title: "Settings Updated",
        message: "Your payout preferences have been saved.",
        toastType: "success",
      });
      return res.data;
    } finally {
      stopLoading();
    }
  };

  const downloadReceipt = async (id: string) => {
    startLoading('Downloading receipt...');
    try {
      const res = await wallets_api.downloadReceipt(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast({ title: 'Success', message: 'Receipt downloaded successfully', toastType: 'success' });
    } catch (e: any) {
      showToast({ title: 'Error', message: 'Failed to download receipt', toastType: 'error' });
    } finally {
      stopLoading();
    }
  };

  return { balance, wallet, fetchWallet, withdrawFunds, updatePreferences, downloadReceipt };
};
