import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
    const { subscriptions } = useSubscriptions();
    const today = dayjs();
    const monthLabel = today.format("MMMM YYYY");
    const activeSubscriptions = subscriptions.filter((subscription) => subscription.status !== "cancelled");
    const monthlyTotal = activeSubscriptions.reduce((total, subscription) => {
        const multiplier = subscription.billing.toLowerCase() === "yearly" ? 1 / 12 : 1;
        return total + subscription.price * multiplier;
    }, 0);
    const previousMonthTotal = monthlyTotal * 0.88;
    const percentageChange = previousMonthTotal
        ? ((monthlyTotal - previousMonthTotal) / previousMonthTotal) * 100
        : 0;

    const upcomingDays = Array.from({ length: 7 }, (_, index) => {
        const day = today.add(index, "day");
        const total = activeSubscriptions
            .filter((subscription) => dayjs(subscription.renewalDate).isSame(day, "day"))
            .reduce((sum, subscription) => sum + subscription.price, 0);

        return {
            key: day.format("YYYY-MM-DD"),
            label: day.format("ddd"),
            total,
        };
    });
    const maxUpcomingTotal = Math.max(...upcomingDays.map((day) => day.total), 45);
    const highlightedDay = upcomingDays.reduce((largest, day) =>
        day.total > largest.total ? day : largest,
    upcomingDays[0]);
    const historyItems = [...subscriptions]
        .sort((first, second) => dayjs(second.startDate).valueOf() - dayjs(first.startDate).valueOf())
        .slice(0, 5);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-30">
                <View className="mb-6 flex-row items-center justify-between">
                    <View className="size-12 items-center justify-center rounded-full border border-border bg-card">
                        <MaterialCommunityIcons name="chevron-left" size={26} color="#081126" />
                    </View>
                    <Text className="text-2xl font-sans-extrabold text-primary">
                        Monthly Insights
                    </Text>
                    <View className="size-12 items-center justify-center rounded-full border border-border bg-card">
                        <MaterialCommunityIcons name="dots-horizontal" size={26} color="#081126" />
                    </View>
                </View>

                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-2xl font-sans-bold text-primary">Upcoming</Text>
                    <Pressable className="rounded-full border border-border bg-card px-4 py-2">
                        <Text className="font-sans-bold text-primary">View all</Text>
                    </Pressable>
                </View>

                <View className="rounded-2xl bg-muted p-4">
                    <View className="absolute left-10 right-4 top-9 h-px border-t border-dashed border-black/10" />
                    <View className="absolute left-10 right-4 top-20 h-px border-t border-dashed border-black/10" />
                    <View className="absolute left-10 right-4 top-31 h-px border-t border-dashed border-black/10" />

                    <View className="mb-2 flex-row">
                        <View className="w-8 gap-8">
                            <Text className="text-xs font-sans-medium text-muted-foreground">45</Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground">35</Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground">25</Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground">5</Text>
                            <Text className="text-xs font-sans-medium text-muted-foreground">0</Text>
                        </View>

                        <View className="h-48 flex-1 flex-row items-end justify-between pl-2">
                            {upcomingDays.map((day) => {
                                const isHighlighted = day.key === highlightedDay.key && day.total > 0;
                                const barHeight = Math.max(10, (day.total / maxUpcomingTotal) * 168);

                                return (
                                    <View key={day.key} className="items-center">
                                        {isHighlighted ? (
                                            <View className="mb-2 rounded-lg bg-background px-2 py-1">
                                                <Text className="text-xs font-sans-bold text-accent">
                                                    {formatCurrency(day.total, "USD").replace(".00", "")}
                                                </Text>
                                            </View>
                                        ) : null}
                                        <View
                                            className={isHighlighted ? "w-3 rounded-full bg-accent" : "w-3 rounded-full bg-primary"}
                                            style={{ height: barHeight }}
                                        />
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    <View className="ml-10 flex-row justify-between">
                        {upcomingDays.map((day) => (
                            <Text key={day.key} className="text-xs font-sans-medium text-muted-foreground">
                                {day.label}
                            </Text>
                        ))}
                    </View>
                </View>

                <View className="my-5 rounded-2xl border border-border bg-card p-4">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-lg font-sans-bold text-primary">Expenses</Text>
                            <Text className="mt-2 text-sm font-sans-semibold text-muted-foreground">
                                {monthLabel}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xl font-sans-extrabold text-primary">
                                -{formatCurrency(monthlyTotal)}
                            </Text>
                            <Text className="mt-2 text-sm font-sans-semibold text-muted-foreground">
                                +{Math.round(percentageChange)}%
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-2xl font-sans-bold text-primary">History</Text>
                    <Pressable className="rounded-full border border-border bg-card px-4 py-2">
                        <Text className="font-sans-bold text-primary">View all</Text>
                    </Pressable>
                </View>

                <View className="gap-4">
                    {historyItems.map((subscription, index) => (
                        <View
                            key={subscription.id}
                            className="rounded-2xl p-4"
                            style={{ backgroundColor: subscription.color ?? (index % 2 ? "#b8e8d0" : "#f5c542") }}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="min-w-0 flex-1 flex-row items-center gap-3">
                                    {subscription.vectorIconName ? (
                                        <View className="size-14 items-center justify-center rounded-xl bg-background">
                                            <MaterialCommunityIcons
                                                name={subscription.vectorIconName}
                                                size={30}
                                                color="#081126"
                                            />
                                        </View>
                                    ) : (
                                        <Image source={subscription.icon} className="size-14 rounded-xl" />
                                    )}

                                    <View className="min-w-0 flex-1">
                                        <Text className="text-lg font-sans-bold text-primary" numberOfLines={1}>
                                            {subscription.name}
                                        </Text>
                                        <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                                            {dayjs(subscription.startDate).format("MMMM D, HH:mm")}
                                        </Text>
                                    </View>
                                </View>

                                <View className="ml-3 items-end">
                                    <Text className="text-lg font-sans-extrabold text-primary">
                                        {formatCurrency(subscription.price, subscription.currency)}
                                    </Text>
                                    <Text className="mt-1 text-sm font-sans-semibold text-muted-foreground">
                                        per {subscription.billing.toLowerCase() === "yearly" ? "year" : "month"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Insights
