import { useClerk, useUser } from "@clerk/expo";
import images from "@/constants/images";
import { useRouter } from "expo-router";
import { posthog } from "../../src/config/posthog";
import { styled } from "nativewind";
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const router = useRouter();
    const { signOut } = useClerk();
    const { user } = useUser();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [error, setError] = useState("");

    const displayName =
        user?.username ||
        user?.fullName ||
        user?.primaryEmailAddress?.emailAddress ||
        "Recurly user";
    const emailAddress = user?.primaryEmailAddress?.emailAddress ?? "No email connected";
    const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;

    const handleSignOut = async () => {
        try {
            setError("");
            setIsSigningOut(true);
            posthog.capture('user_signed_out');
            posthog.reset();
            await signOut();
            router.replace("/(auth)/sign-in");
        } catch {
            setError("Could not sign out. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-30"
            >
                <Text className="mb-5 text-3xl font-sans-extrabold text-primary">
                    Settings
                </Text>

                <View className="rounded-3xl border border-border bg-card p-5">
                    <View className="flex-row items-center gap-4">
                        <Image source={avatarSource} className="size-18 rounded-full" />

                        <View className="min-w-0 flex-1">
                            <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
                                {displayName}
                            </Text>
                            <Text className="mt-1 text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
                                {emailAddress}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mt-5 rounded-3xl border border-border bg-card p-5">
                    <Text className="text-lg font-sans-bold text-primary">Account</Text>
                    <Text className="mt-2 text-sm font-sans-medium text-muted-foreground">
                        Signing out removes this session from your device. You can sign back in anytime.
                    </Text>

                    {error ? <Text className="mt-4 text-sm font-sans-medium text-destructive">{error}</Text> : null}

                    <Pressable
                        className={`mt-5 items-center rounded-2xl bg-primary py-4 ${
                            isSigningOut ? "bg-primary/50" : ""
                        }`}
                        disabled={isSigningOut}
                        onPress={handleSignOut}
                    >
                        {isSigningOut ? (
                            <ActivityIndicator color="#fff9e3" />
                        ) : (
                            <Text className="font-sans-bold text-background">Sign out</Text>
                        )}
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Settings
