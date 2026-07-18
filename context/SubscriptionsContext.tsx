import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { createContext, ReactNode, useContext, useState } from "react";

type SubscriptionsContextValue = {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
};

const SubscriptionsContext = createContext<SubscriptionsContextValue | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions((currentSubscriptions) => [subscription, ...currentSubscriptions]);
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
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
