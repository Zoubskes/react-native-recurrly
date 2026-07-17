import { useClerk, useSession } from "@clerk/expo";
import { type Href, Redirect, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const TABS_ROUTE = "/(tabs)" as Href;

export default function Tasks() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { session, isLoaded } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isLoaded) return null;
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (!session.currentTask) return <Redirect href={TABS_ROUTE} />;

  const taskName = session.currentTask.key.replace(/_/g, " ");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <View className="auth-content justify-center">
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">R</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Recurly</Text>
              <Text className="auth-wordmark-sub">Smart billing</Text>
            </View>
          </View>

          <Text className="auth-title">Finish setup</Text>
          <Text className="auth-subtitle">
            Clerk requires one more account step before opening your subscriptions.
          </Text>
        </View>

        <View className="auth-card gap-4">
          <Text className="auth-label">Pending task</Text>
          <Text className="text-lg font-sans-bold capitalize text-primary">{taskName}</Text>
          <Text className="auth-helper">
            Complete this requirement in Clerk, then reopen the app or sign in again.
          </Text>

          <Pressable
            className={`auth-secondary-button ${isSigningOut ? "opacity-60" : ""}`}
            disabled={isSigningOut}
            onPress={handleSignOut}
          >
            {isSigningOut ? (
              <ActivityIndicator color="#ea7a53" />
            ) : (
              <Text className="auth-secondary-button-text">Sign out and start over</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
