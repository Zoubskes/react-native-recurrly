import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { posthog } from "@/src/config/posthog";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type SubscriptionsHeaderProps = {
    query: string;
    onQueryChange: (query: string) => void;
};

const SubscriptionsHeader = React.memo(({ query, onQueryChange }: SubscriptionsHeaderProps) => (
    <View className="mb-5">
        <Text className="text-3xl font-sans-extrabold text-primary">
            My Subscriptions
        </Text>
        <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
            Search and manage every recurring payment in one place.
        </Text>

        <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder="Search subscriptions"
            placeholderTextColor="rgba(0,0,0,0.45)"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            className="mt-5 rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary"
        />
    </View>
));

SubscriptionsHeader.displayName = "SubscriptionsHeader";

const Subscriptions = () => {
    const [query, setQuery] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const { subscriptions } = useSubscriptions();

    const filteredSubscriptions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) return subscriptions;

        return subscriptions.filter((subscription) => {
            const searchableText = [
                subscription.name,
                subscription.plan,
                subscription.category,
                subscription.billing,
                subscription.paymentMethod,
                subscription.status,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [query, subscriptions]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                data={filteredSubscriptions}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <SubscriptionsHeader query={query} onQueryChange={setQuery} />
                }
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => {
                            const isExpanding = expandedSubscriptionId !== item.id;
                            setExpandedSubscriptionId((currentId) =>
                                currentId === item.id ? null : item.id,
                            );
                            if (isExpanding) {
                                posthog.capture("subscription_card_expanded", {
                                    subscription_id: item.id,
                                    subscription_name: item.name,
                                });
                            }
                        }}
                    />
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                ListEmptyComponent={() => (
                    <View className="rounded-2xl border border-border bg-card p-5">
                        <Text className="text-lg font-sans-bold text-primary">
                            No subscriptions found
                        </Text>
                        <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
                            Try searching by name, plan, category, status, or payment method.
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                extraData={expandedSubscriptionId}
                contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    )
}
export default Subscriptions
