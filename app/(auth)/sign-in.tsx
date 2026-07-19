import { useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { posthog } from "../../src/config/posthog";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const TASKS_ROUTE = "/(auth)/tasks" as Href;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getFieldError = (
  errors: ReturnType<typeof useSignIn>["errors"],
  field: "identifier" | "password" | "code",
) => errors.fields[field]?.message;

export default function SignIn() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");

  const isSubmitting = fetchStatus === "fetching";
  const normalizedEmail = emailAddress.trim().toLowerCase();
  const isCodeStep =
    signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor";

  const formError = useMemo(() => {
    if (!emailAddress && !password) return "";
    if (emailAddress && !emailPattern.test(normalizedEmail)) return "Enter a valid email address.";
    if (password && password.length < 8) return "Password must be at least 8 characters.";
    return "";
  }, [emailAddress, normalizedEmail, password]);

  const navigateAfterAuth = ({ session, decorateUrl }: any) => {
    const userId = session?.user?.id;
    if (userId) {
      posthog.identify(userId, {
        $set: { username: session?.user?.username },
        $set_once: { first_sign_in_date: new Date().toISOString() },
      });
    }
    posthog.capture('user_signed_in', { auth_method: 'email_password' });

    if (session?.currentTask) {
      router.replace(TASKS_ROUTE);
      return;
    }

    const url = decorateUrl("/onboarding");
    if (Platform.OS === "web" && url.startsWith("http")) {
      window.location.href = url;
      return;
    }

    router.replace(url as Href);
  };

  const completeSignIn = async () => {
    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
      return;
    }

    if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
      const emailFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailFactor) {
        await signIn.mfa.sendEmailCode();
        return;
      }
    }

    setLocalError("We need an enabled Clerk second factor to finish this sign in.");
  };

  const handleSubmit = async () => {
    setLocalError("");

    if (!emailPattern.test(normalizedEmail)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    const { error } = await signIn.password({
      emailAddress: normalizedEmail,
      password,
    });

    if (error) {
      posthog.capture('sign_in_failed', { reason: error.message });
      return;
    }
    await completeSignIn();
  };

  const handleVerify = async () => {
    setLocalError("");

    if (code.trim().length < 6) {
      setLocalError("Enter the verification code from your email.");
      return;
    }

    const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
    if (error) return;
    await completeSignIn();
  };

  const resendCode = async () => {
    setLocalError("");
    await signIn.mfa.sendEmailCode();
  };

  const disabled = isSubmitting || Boolean(formError) || !normalizedEmail || !password;
  const visibleError =
    localError ||
    formError ||
    getFieldError(errors, "identifier") ||
    getFieldError(errors, "password") ||
    getFieldError(errors, "code");

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content justify-center"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            <Text className="auth-title">{isCodeStep ? "Verify it is you" : "Welcome back"}</Text>
            <Text className="auth-subtitle">
              {isCodeStep
                ? "Enter the code Clerk sent to your email to protect your account."
                : "Sign in to continue managing your subscriptions with confidence."}
            </Text>
          </View>

          <View className="auth-card">
            {isCodeStep ? (
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter your code"
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    className="auth-input"
                  />
                </View>

                {visibleError ? <Text className="auth-error">{visibleError}</Text> : null}

                <Pressable
                  className={`auth-button ${isSubmitting || !code ? "auth-button-disabled" : ""}`}
                  disabled={isSubmitting || !code}
                  onPress={handleVerify}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Verify account</Text>
                  )}
                </Pressable>

                <Pressable className="auth-secondary-button" onPress={resendCode}>
                  <Text className="auth-secondary-button-text">Send a new code</Text>
                </Pressable>

                <Pressable onPress={() => signIn.reset()} className="items-center py-2">
                  <Text className="auth-link">Start over</Text>
                </Pressable>
              </View>
            ) : (
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    className={`auth-input ${getFieldError(errors, "identifier") ? "auth-input-error" : ""}`}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    secureTextEntry
                    textContentType="password"
                    className={`auth-input ${getFieldError(errors, "password") ? "auth-input-error" : ""}`}
                  />
                </View>

                {visibleError ? <Text className="auth-error">{visibleError}</Text> : null}

                <Pressable
                  className={`auth-button ${disabled ? "auth-button-disabled" : ""}`}
                  disabled={disabled}
                  onPress={handleSubmit}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Sign in</Text>
                  )}
                </Pressable>

                <View className="auth-link-row">
                  <Text className="auth-link-copy">New to Recurly?</Text>
                  <Link href="/(auth)/sign-up">
                    <Text className="auth-link">Create an account</Text>
                  </Link>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
