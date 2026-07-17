import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getFieldError = (
  errors: ReturnType<typeof useSignUp>["errors"],
  field: "emailAddress" | "password" | "code",
) => errors.fields[field]?.message;

const formatMissingRequirements = (missingFields?: string[], unverifiedFields?: string[]) => {
  const readableFields = [...(missingFields ?? []), ...(unverifiedFields ?? [])]
    .filter(Boolean)
    .map((field) => field.replace(/_/g, " "));

  if (!readableFields.length) {
    return "Clerk still has incomplete sign-up requirements. Check your dashboard required fields.";
  }

  return `Clerk still needs: ${readableFields.join(", ")}.`;
};

type SignUpCompletionState = {
  status?: string | null;
  missingFields?: string[];
  unverifiedFields?: string[];
};

export default function SignUp() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const isSubmitting = fetchStatus === "fetching";
  const normalizedEmail = emailAddress.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  const formError = useMemo(() => {
    if (!emailAddress && !username && !password && !confirmPassword) return "";
    if (emailAddress && !emailPattern.test(normalizedEmail)) return "Enter a valid email address.";
    if (username && !/^[a-z0-9_]{3,24}$/.test(normalizedUsername)) {
      return "Use 3-24 letters, numbers, or underscores for your username.";
    }
    if (password && password.length < 8) return "Password must be at least 8 characters.";
    if (confirmPassword && password !== confirmPassword) return "Passwords do not match.";
    return "";
  }, [
    confirmPassword,
    emailAddress,
    normalizedEmail,
    normalizedUsername,
    password,
    username,
  ]);

  const navigateAfterAuth = ({ session, decorateUrl }: any) => {
    if (session?.currentTask) {
      setLocalError("Your account needs one more security step before continuing.");
      return;
    }

    const url = decorateUrl("/(tabs)");
    if (Platform.OS === "web" && url.startsWith("http")) {
      window.location.href = url;
      return;
    }

    router.replace(url as Href);
  };

  const handleSubmit = async () => {
    setLocalError("");

    if (!emailPattern.test(normalizedEmail)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (!/^[a-z0-9_]{3,24}$/.test(normalizedUsername)) {
      setLocalError("Use 3-24 letters, numbers, or underscores for your username.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    const { error } = await signUp.password({
      emailAddress: normalizedEmail,
      username: normalizedUsername,
      password,
    });

    if (error) return;

    await signUp.verifications.sendEmailCode();
    setIsVerifyingEmail(true);
  };

  const handleVerify = async () => {
    setLocalError("");

    if (code.trim().length < 6) {
      setLocalError("Enter the verification code from your email.");
      return;
    }

    const result = await signUp.verifications.verifyEmailCode({ code: code.trim() });
    const { error } = result;
    if (error) return;

    const currentSignUp = (result as unknown as { signUp?: SignUpCompletionState }).signUp ?? signUp;

    if (currentSignUp.status === "complete") {
      await signUp.finalize({ navigate: navigateAfterAuth });
      return;
    }

    setLocalError(
      formatMissingRequirements(currentSignUp.missingFields, currentSignUp.unverifiedFields),
    );
  };

  const resendCode = async () => {
    setLocalError("");
    await signUp.verifications.sendEmailCode();
  };

  const disabled =
    isSubmitting ||
    Boolean(formError) ||
    !normalizedEmail ||
    !normalizedUsername ||
    !password ||
    !confirmPassword;

  const visibleError =
    localError ||
    formError ||
    getFieldError(errors, "emailAddress") ||
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

            <Text className="auth-title">
              {isVerifyingEmail ? "Check your email" : "Create your account"}
            </Text>
            <Text className="auth-subtitle">
              {isVerifyingEmail
                ? "Enter the verification code to activate your secure Recurly workspace."
                : "Start tracking renewals, spend, and subscriptions in one quiet place."}
            </Text>
          </View>

          <View className="auth-card">
            {isVerifyingEmail ? (
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
                  <Text className="auth-helper">We sent it to {normalizedEmail}.</Text>
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
                    <Text className="auth-button-text">Verify and continue</Text>
                  )}
                </Pressable>

                <Pressable className="auth-secondary-button" onPress={resendCode}>
                  <Text className="auth-secondary-button-text">Send a new code</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    signUp.reset();
                    setIsVerifyingEmail(false);
                    setCode("");
                  }}
                  className="items-center py-2"
                >
                  <Text className="auth-link">Edit account details</Text>
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
                    className={`auth-input ${getFieldError(errors, "emailAddress") ? "auth-input-error" : ""}`}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Username</Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="username"
                    className="auth-input"
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    secureTextEntry
                    textContentType="newPassword"
                    className={`auth-input ${getFieldError(errors, "password") ? "auth-input-error" : ""}`}
                  />
                  <Text className="auth-helper">Use at least 8 characters.</Text>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Confirm password</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repeat your password"
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    secureTextEntry
                    textContentType="newPassword"
                    className="auth-input"
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
                    <Text className="auth-button-text">Create account</Text>
                  )}
                </Pressable>

                <View className="auth-link-row">
                  <Text className="auth-link-copy">Already have an account?</Text>
                  <Link href="/(auth)/sign-in">
                    <Text className="auth-link">Sign in</Text>
                  </Link>
                </View>
              </View>
            )}
          </View>

          <View nativeID="clerk-captcha" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
