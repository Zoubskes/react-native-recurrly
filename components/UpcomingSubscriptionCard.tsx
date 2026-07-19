import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Image, Text, View } from "react-native";

const UpcomingSubscriptionCard = ({ name, price, daysLeft, icon, vectorIconName, currency 
}: UpcomingSubscription) => {
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                {vectorIconName ? (
                    <View className="upcoming-icon items-center justify-center rounded-xl bg-background">
                        <MaterialCommunityIcons name={vectorIconName} size={30} color="#081126" />
                    </View>
                ) : (
                    <Image source={icon} className="upcoming-icon" />
                )}
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, 
                    currency)}</Text>

                    <Text className="upcoming-meta" numberOfLines={1}>
                        {daysLeft === 0
                            ? "Renews today"
                            : daysLeft === 1
                                ? "1 day left"
                                : `${daysLeft} days left`}
                    </Text>
                </View>
            </View>

            <Text className="upcoming-name" numberOfLines={1}>
                {name}
            </Text>
        </View>
    )
}
export default UpcomingSubscriptionCard
