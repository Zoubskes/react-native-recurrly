import { useUser } from "@clerk/expo";
import { posthog } from "../../src/config/posthog";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const { subscriptions, addSubscription } = useSubscriptions();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | 
  null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const displayName =
    user?.username ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Recurly";
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;
  const handleCreateSubscription = (subscription: Subscription) => {
    addSubscription(subscription);
    setExpandedSubscriptionId(subscription.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
        <CreateSubscriptionModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onCreate={handleCreateSubscription}
        />
        <FlatList
        ListHeaderComponent={
          <>
                <View className="home-header">
        <View className="home-user">
          <Image source={avatarSource} className="home-avatar" />
          <Text className="home-user-name">{displayName}</Text>
        </View>

        <Pressable onPress={() => setIsCreateModalVisible(true)}>
          <Image source={icons.add} className="home-add-icon" />
        </Pressable>
      </View>
      
      <View className="home-balance-card">
        <Text className="home-balance-label">Balance</Text>

        <View className="home-balance-row">
          <Text className="home-balance-amount">
            {formatCurrency(HOME_BALANCE.amount)}
          </Text>
          <Text className="home-balance-date">
            {dayjs(HOME_BALANCE.nextRenewalDate).format("MMM/DD")}
          </Text>
        </View>
      </View>

      <View className= "mb-5">
        
        <ListHeading title="Upcoming"/>
        <FlatList 
        data={UPCOMING_SUBSCRIPTIONS}
        renderItem={({item}) => (
          <UpcomingSubscriptionCard { ... item} />)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<Text className="home-empt-state">No upcoming
          renewals yet.</Text>}
        />
      </View>
          <ListHeading title="All Subscriptions"/>
          </>
        }
        data={subscriptions} 
        keyExtractor={(item) => item.id}
        renderItem= {({ item}) => (
        <SubscriptionCard { ... item }
        expanded={expandedSubscriptionId === item.id}
        onPress={() => {
          const isExpanding = expandedSubscriptionId !== item.id;
          setExpandedSubscriptionId((currentId) =>
            (currentId === item.id ? null : item.id));
          if (isExpanding) {
            posthog.capture('subscription_card_expanded', {
              subscription_id: item.id,
              subscription_name: item.name,
            });
          }
        }}

         />
        )}
         extraData={expandedSubscriptionId}
         ItemSeparatorComponent={() => <View className="h-4" />}
         showsVerticalScrollIndicator={false}
         ListEmptyComponent={<Text className="home-empt-state">No subscriptions yet.</Text>}
         contentContainerClassName="pb-30"
      />

    </SafeAreaView>
  );
}
