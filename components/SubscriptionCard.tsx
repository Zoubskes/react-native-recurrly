import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from "@/lib/utils";
import clsx from "clsx";
import { Image, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({ name, price, currency, icon, vectorIconName, billing, color, category,
    plan, renewalDate, expanded, onPress, paymentMethod, startDate, status, onCancelPress, isCancelling
}:
    SubscriptionCardProps
) => {
    return (
        <Pressable onPress={onPress} className={clsx('sub-card',
            expanded ? 'sub-card-expanded' : 'bg-card')} style={!expanded && color ? {backgroundColor: 
            color} : undefined}>
            <View className="sub-head">
                <View className="sub-main">
                    {vectorIconName ? (
                        <View className="sub-icon items-center justify-center bg-background">
                            <MaterialCommunityIcons name={vectorIconName} size={34} color="#081126" />
                        </View>
                    ) : (
                        <Image source={icon} className="sub-icon" />
                    )}
                    <View className="sub-copy">
                        <Text className="sub-title">
                            {name}
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" 
                        className="sub-meta">
                            {category?.trim() || plan?.trim() || (renewalDate ? 
                                formatSubscriptionDateTime(renewalDate) : '' )}
                        </Text>
                    </View>
                </View>
                <View className="sub-price-box">
                    <Text className="sub-price">{formatCurrency(price, currency)}</Text>
                    <Text className="sub-billing">{billing}</Text>
                </View>
            </View>
        
            {expanded && (
                <View className="sub-body">
                    <View className="sub-details">
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Payment:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                ellipsizeMode="tail">
                                    {paymentMethod?.trim() ?? 'Not provided'}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Category:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                ellipsizeMode="tail">
                                    {category?.trim() || plan?.trim() || 'Not provided'}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Started:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                ellipsizeMode="tail">
                                    {startDate ? formatSubscriptionDateTime(startDate) : ''}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Renewal date:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                ellipsizeMode="tail">
                                    {renewalDate ? formatSubscriptionDateTime(renewalDate) : ''}
                                </Text>
                            </View>
                        </View>
                        <View className="sub-row">
                            <View className="sub-row-copy">
                                <Text className="sub-label">Status:</Text>
                                <Text className="sub-value" numberOfLines={1}
                                ellipsizeMode="tail">
                                    {status ? formatStatusLabel(status) : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {onCancelPress ? (
                        <Pressable
                            className={clsx("sub-cancel", isCancelling && "sub-cancel-disabled")}
                            disabled={isCancelling}
                            onPress={(event) => {
                                event.stopPropagation();
                                onCancelPress();
                            }}
                        >
                            <Text className="sub-cancel-text">
                                {isCancelling ? "Deleting..." : "Delete Subscription"}
                            </Text>
                        </Pressable>
                    ) : null}
                </View>
            )}
        </Pressable>
    )
}
export default SubscriptionCard
