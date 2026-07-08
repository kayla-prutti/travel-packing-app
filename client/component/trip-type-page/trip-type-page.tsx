import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./trip-type-page.styles";

export type TripType =
  | "hiking"
  | "city"
  | "beach-town"
  | "business"
  | "ski"
  | "backpacking";

type TripTypeOption = {
  id: TripType;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const tripTypeOptions: TripTypeOption[] = [
  { id: "hiking", label: "Hiking", description: "Day trails, no tent", icon: "image-filter-hdr" },
  { id: "city", label: "City", description: "Museums & cafés", icon: "office-building-outline" },
  { id: "beach-town", label: "Beach town", description: "Sun & sand", icon: "beach" },
  { id: "business", label: "Business", description: "Meetings & smart", icon: "briefcase-outline" },
  { id: "ski", label: "Ski", description: "Snow & slopes", icon: "ski" },
  { id: "backpacking", label: "Backpacking", description: "Camping out", icon: "tent" },
];

type TripTypePageProps = {
  initialTripType: TripType | null;
  onBack: () => void;
  onContinue: (tripType: TripType) => void;
};

export function TripTypePage({ initialTripType, onBack, onContinue }: TripTypePageProps) {
  const [selected, setSelected] = useState<TripType | null>(initialTripType);

  function handleContinue() {
    if (selected) {
      onContinue(selected);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#3a2317" />
        </Pressable>
        <View style={styles.progressRow}>
          <View style={[styles.progressSegment, styles.progressSegmentActive]} />
          <View style={styles.progressSegment} />
          <View style={styles.progressSegment} />
          <View style={styles.progressSegment} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={styles.stepLabel}>Step 1 · Trip type</Text>
        <Text style={styles.title}>What kind of trip?</Text>

        <View style={styles.grid}>
          {tripTypeOptions.map((option) => {
            const isSelected = option.id === selected;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelected(option.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                {isSelected ? (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={14} color="#fff8ea" />
                  </View>
                ) : null}
                <View style={styles.cardIconWrap}>
                  <MaterialCommunityIcons name={option.icon} size={24} color="#c9502e" />
                </View>
                <Text style={styles.cardLabel}>{option.label}</Text>
                <Text style={styles.cardDescription}>{option.description}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={!selected}
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            !selected && styles.continueButtonDisabled,
            pressed && !!selected && styles.continueButtonPressed,
          ]}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff8ea" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
