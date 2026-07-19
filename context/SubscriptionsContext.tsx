import { useAuth } from "@clerk/expo";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { CreateSubscriptionInput, subscriptionsApi } from "@/lib/api";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type SubscriptionsContextValue = {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string;
  refreshSubscriptions: () => Promise<void>;
  addSubscription: (subscription: CreateSubscriptionInput) => Promise<Subscription>;
  deleteSubscription: (id: string) => Promise<void>;
};

const SubscriptionsContext = createContext<SubscriptionsContextValue | undefined>(undefined);

const uniqueSubscriptionsById = (subscriptions: Subscription[]) => {
  const seen = new Set<string>();

  return subscriptions.filter((subscription) => {
    if (seen.has(subscription.id)) return false;

    seen.add(subscription.id);
    return true;
  });
};

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshSubscriptions = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;

    setIsLoading(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Missing Clerk session token");

      setSubscriptions(uniqueSubscriptionsById(await subscriptionsApi.list(token)));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not load subscriptions");
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    refreshSubscriptions();
  }, [refreshSubscriptions]);

  const addSubscription = async (subscription: CreateSubscriptionInput) => {
    const token = await getToken();
    if (!token) throw new Error("Missing Clerk session token");

    const createdSubscription = await subscriptionsApi.create(token, subscription);
    setSubscriptions((currentSubscriptions) =>
      uniqueSubscriptionsById([createdSubscription, ...currentSubscriptions]),
    );
    return createdSubscription;
  };

  const deleteSubscription = async (id: string) => {
    const token = await getToken();
    if (!token) throw new Error("Missing Clerk session token");

    await subscriptionsApi.delete(token, id);
    setSubscriptions((currentSubscriptions) =>
      currentSubscriptions.filter((subscription) => subscription.id !== id),
    );
  };

  return (
    <SubscriptionsContext.Provider
      value={{ subscriptions, isLoading, error, refreshSubscriptions, addSubscription, deleteSubscription }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);

  if (!context) {
    throw new Error("useSubscriptions must be used inside SubscriptionsProvider");
  }

  return context;
}
