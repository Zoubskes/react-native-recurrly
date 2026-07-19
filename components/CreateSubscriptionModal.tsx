import type { CreateSubscriptionInput } from "@/lib/api";
import { posthog } from "@/src/config/posthog";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const frequencies = ["Monthly", "Yearly"] as const;
const categories = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Frequency = (typeof frequencies)[number];
type Category = (typeof categories)[number];

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: CreateSubscriptionInput) => Promise<void> | void;
};

const categoryColors: Record<Category, string> = {
  Entertainment: "#f6eecf",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8e8d0",
  Cloud: "#d7ecff",
  Music: "#f7d7c8",
  Other: "#fff8e7",
};

const CreateSubscriptionModal = ({ visible, onClose, onCreate }: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category>("Entertainment");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setPrice("");
    setPaymentMethod("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setError("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getApiCategory = (value: Category) => (value === "Entertainment" ? "Entertainment" : "Other");

  const handleSubmit = async () => {
    const normalizedName = name.trim();
    const parsedPrice = Number.parseFloat(price.replace(",", "."));

    if (!normalizedName) {
      setError("Enter a subscription name.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a positive price.");
      return;
    }

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly" ? startDate.add(1, "month") : startDate.add(1, "year");

    setIsSubmitting(true);

    try {
      await onCreate({
        name: normalizedName,
        price: parsedPrice,
        frequency: frequency.toLowerCase(),
        category: getApiCategory(category),
        startDate: startDate.toISOString(),
        renewalDate: renewalDate.toISOString(),
        color: categoryColors[category],
        currency: "USD",
        paymentMethod: paymentMethod.trim() || "Not provided",
      });

      posthog.capture("subscription_created", {
        subscription_name: normalizedName,
        subscription_price: parsedPrice,
        subscription_frequency: frequency,
        subscription_category: category,
      });
      resetForm();
      onClose();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not create subscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedPrice = Number.parseFloat(price.replace(",", "."));
  const isSubmitDisabled =
    isSubmitting || !name.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="modal-overlay"
      >
        <Pressable className="flex-1" onPress={handleClose} />

        <View className="modal-container">
          <View className="modal-header bg-accent/45">
            <Text className="modal-title">New Subscription</Text>
            <Pressable className="modal-close" onPress={handleClose}>
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerClassName="modal-body"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Netflix, Figma, OpenAI..."
                placeholderTextColor="rgba(0,0,0,0.45)"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="12.99"
                placeholderTextColor="rgba(0,0,0,0.45)"
                keyboardType="decimal-pad"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Payment method</Text>
              <TextInput
                value={paymentMethod}
                onChangeText={setPaymentMethod}
                placeholder="Visa ending in 8530"
                placeholderTextColor="rgba(0,0,0,0.45)"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                {frequencies.map((option) => {
                  const isActive = frequency === option;

                  return (
                    <Pressable
                      key={option}
                      className={clsx("picker-option", isActive && "picker-option-active")}
                      onPress={() => setFrequency(option)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          isActive && "picker-option-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {categories.map((option) => {
                  const isActive = category === option;

                  return (
                    <Pressable
                      key={option}
                      className={clsx("category-chip", isActive && "category-chip-active")}
                      onPress={() => setCategory(option)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          isActive && "category-chip-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {error ? <Text className="auth-error">{error}</Text> : null}

            <Pressable
              className={clsx("auth-button", isSubmitDisabled && "auth-button-disabled")}
              disabled={isSubmitDisabled}
              onPress={handleSubmit}
            >
              <Text className="auth-button-text">
                {isSubmitting ? "Creating..." : "Create subscription"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
