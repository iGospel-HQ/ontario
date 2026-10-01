// Browser API client (auth-aware). Server components use lib/api/server.ts instead.

import { useAuthStore } from "@/store/use-auth-store";
import { siteConfig } from "@/lib/site";
import axios from "axios";

const api = axios.create({
  baseURL: siteConfig.apiUrl,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      const { logout } = useAuthStore.getState();
      logout();
      window.location.href = "/login";
      // originalRequest._retry = true
      // const refreshed = await refreshAccessToken()
      // if (refreshed) {
      //   return api(originalRequest)
      // }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  getDashboardStats: async () => {
    const response = await api.get("/transaction/dashboard/");
    return response.data;
  },
  getBanks: async () => {
    const response = await api.get("/transaction/payout/banks/");
    return response.data.data;
  },
  getBankDetailsByNumber: async (accountNumber: string, bankCode: string) => {
    const response = await api.post("/transaction/payout/bank-details/", {
      account_number: accountNumber,
      bank_code: bankCode,
    });
    return response.data.data.accountName; // Returns bank account name
  },
  getWalletBankAccounts: async () => {
    const response = await api.get("/wallet/bank-accounts/");
    return response.data;
  },
  addWalletBankAccount: async (data: any) => {
    const response = await api.post("/wallet/bank-accounts/", data);
    return response.data;
  },
  getWalletTransactions: async (page = 1) => {
    const response = await api.get(`/wallet/wallet-transactions/?page=${page}`);
    return response.data;
  },
  getWithdrawalsTransactions: async (page = 1) => {
    const response = await api.get(
      `/wallet/withdrawal-transactions/?page=${page}`
    );
    return response.data;
  },
  publishContent: async (formData: FormData) => {
    const response = await api.post("/content/publish/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  setupTransactionPin: (payload: any) =>
    api.post("/transaction/pin/setup/", payload),

  changeTransactionPin: (payload: any) =>
    api.post("/transaction/pin/change/", payload),

  withdrawFunds: (payload: any) =>
    api.post("/transaction/payout/withdraw/", payload),

  getUserProfile: async () => {
    const response = await api.get("/account/profile/");
    return response.data;
  },
  updateUserProfile: async (data: any) => {
    const response = await api.patch("/account/profile/", data);
    return response.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append("image", file)
    const response = await api.patch("/account/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string, newPasswordConfirm: string) => {
    const response = await api.post("/account/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm
    });
    return response.data;
  },
};

export default api;
