import images from "@/constants/images";
import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { styled } from "nativewind";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Onboarding = () => {
    const router = useRouter();
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-accent">
                <ActivityIndicator color="#fff8e7" />
            </SafeAreaView>
        );
    }

    if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

    return (
        <SafeAreaView className="flex-1 bg-accent">
            <View className="flex-1 justify-between overflow-hidden px-4 pb-12 pt-8">
                <Image
                    source={images.splashPattern}
                    resizeMode="cover"
                    className="-mx-4 h-[60%] w-[112%]"
                />

                <View className="gap-5">
                    <View className="items-center">
                        <Text className="text-center text-4xl font-sans-extrabold text-white">
                            Gain Financial Clarity
                        </Text>
                        <Text className="mt-4 text-center text-xl font-sans-semibold text-white/90">
                            Track, analyze and cancel with ease
                        </Text>
                    </View>

                    <Pressable
                        className="items-center rounded-full bg-white py-4"
                        onPress={() => router.replace("/(tabs)")}
                    >
                        <Text className="text-base font-sans-extrabold text-primary">
                            Get Started
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Onboarding;
