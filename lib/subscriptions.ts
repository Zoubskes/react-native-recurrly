import dayjs from "dayjs";

export const getSubscriptionBillingPeriod = (subscription: Subscription) => {
  const value = subscription.frequency || subscription.billing || "monthly";
  return value.toLowerCase();
};

export const getNextRenewalDate = (subscription: Subscription, fromDate = dayjs()) => {
  let renewalDate = dayjs(subscription.renewalDate || subscription.startDate);

  if (!renewalDate.isValid()) return null;

  const billingPeriod = getSubscriptionBillingPeriod(subscription);
  const unit = billingPeriod === "yearly" ? "year" : "month";

  while (renewalDate.isBefore(fromDate, "day")) {
    renewalDate = renewalDate.add(1, unit);
  }

  return renewalDate;
};

export const getDaysUntilRenewal = (subscription: Subscription, fromDate = dayjs()) => {
  const renewalDate = getNextRenewalDate(subscription, fromDate);

  if (!renewalDate) return null;

  return Math.max(0, renewalDate.startOf("day").diff(fromDate.startOf("day"), "day"));
};

export const getUpcomingSubscriptions = (
  subscriptions: Subscription[],
  limit?: number,
  fromDate = dayjs(),
) => {
  const upcomingSubscriptions = subscriptions
    .filter((subscription) => subscription.status !== "cancelled")
    .map((subscription) => ({
      subscription,
      renewalDate: getNextRenewalDate(subscription, fromDate),
      daysLeft: getDaysUntilRenewal(subscription, fromDate),
    }))
    .filter(
      (item): item is { subscription: Subscription; renewalDate: dayjs.Dayjs; daysLeft: number } =>
        Boolean(item.renewalDate) && item.daysLeft !== null,
    )
    .sort((first, second) => first.renewalDate.valueOf() - second.renewalDate.valueOf())
    .map(({ subscription, daysLeft }) => ({ ...subscription, daysLeft }));

  return typeof limit === "number" ? upcomingSubscriptions.slice(0, limit) : upcomingSubscriptions;
};
