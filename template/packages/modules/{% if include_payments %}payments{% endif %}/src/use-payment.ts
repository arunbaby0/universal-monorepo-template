import { create } from "zustand";
import type { CreatePaymentIntentInput } from "@repo/types";
import { getApiUrl } from "@repo/types";

interface PaymentState {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
  paymentStatus: "idle" | "processing" | "succeeded" | "failed";

  // Actions
  createPaymentIntent: (input: CreatePaymentIntentInput) => Promise<string>;
  setPaymentStatus: (status: PaymentState["paymentStatus"]) => void;
  reset: () => void;
  clearError: () => void;
}

export const usePayment = create<PaymentState>()((set) => ({
  clientSecret: null,
  loading: false,
  error: null,
  paymentStatus: "idle",

  createPaymentIntent: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${getApiUrl()}/api/payments/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create payment intent");
      }

      const data = await res.json();
      set({ clientSecret: data.clientSecret, loading: false });
      return data.clientSecret;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create payment intent";
      set({ error: message, loading: false });
      throw err;
    }
  },

  setPaymentStatus: (status) => set({ paymentStatus: status }),

  reset: () =>
    set({
      clientSecret: null,
      loading: false,
      error: null,
      paymentStatus: "idle",
    }),

  clearError: () => set({ error: null }),
}));
