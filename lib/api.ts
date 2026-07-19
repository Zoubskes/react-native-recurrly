import { icons } from "@/constants/icons";
import { resolveSubscriptionIcon } from "@/lib/subscription-icons";
import Constants from "expo-constants";

const getDevApiUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(":")[0];

  return host ? `http://${host}:5500` : "http://localhost:5500";
};

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const shouldUseDevHost =
  __DEV__ && (!configuredApiUrl || configuredApiUrl.includes("localhost"));

const API_URL = shouldUseDevHost ? getDevApiUrl() : configuredApiUrl;

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ApiSubscription = {
  _id: string;
  name: string;
  price: number;
  currency?: string;
  frequency: string;
  category?: string;
  color?: string;
  startDate?: string;
  renewalDate?: string;
  paymentMethod?: string;
  status?: string;
};

export type CreateSubscriptionInput = {
  name: string;
  price: number;
  currency: string;
  frequency: string;
  category: string;
  color?: string;
  startDate: string;
  renewalDate?: string;
  paymentMethod: string;
};

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

const apiFetch = async <T,>(path: string, token: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.message || `Request failed with status ${response.status}`, response.status);
  }

  return payload;
};

export const mapApiSubscription = (subscription: ApiSubscription): Subscription => {
  const frequency = subscription.frequency || "monthly";
  const billing = frequency.charAt(0).toUpperCase() + frequency.slice(1);

  return {
    id: subscription._id,
    name: subscription.name,
    price: subscription.price,
    currency: subscription.currency ?? "USD",
    frequency,
    billing,
    category: subscription.category,
    color: subscription.color,
    startDate: subscription.startDate,
    renewalDate: subscription.renewalDate,
    paymentMethod: subscription.paymentMethod,
    status: subscription.status,
    icon: icons.wallet,
    vectorIconName: resolveSubscriptionIcon(subscription.name, subscription.category),
  };
};

export const subscriptionsApi = {
  list: async (token: string) => {
    const response = await apiFetch<ApiEnvelope<ApiSubscription[]>>(
      "/api/v1/subscriptions?limit=100",
      token,
    );

    return response.data.map(mapApiSubscription);
  },

  create: async (token: string, input: CreateSubscriptionInput) => {
    const response = await apiFetch<ApiEnvelope<{ subscription: ApiSubscription }>>(
      "/api/v1/subscriptions",
      token,
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );

    return mapApiSubscription(response.data.subscription);
  },

  delete: async (token: string, id: string) => {
    await apiFetch<ApiEnvelope<ApiSubscription>>(
      `/api/v1/subscriptions/${id}`,
      token,
      { method: "DELETE" },
    );
  },
};
