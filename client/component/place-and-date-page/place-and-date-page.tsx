import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { geocodeLocation } from "../../src/weather/geocoding";
import { styles } from "./place-and-date-page.styles";

export type Stop = {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  weatherLocationQuery: string;
  startDate: Date;
  endDate: Date;
};

type PlaceAndDatePageProps = {
  onBack: () => void;
  onContinue: (stops: Stop[]) => void;
};

type ActiveField = "startDate" | "endDate" | null;

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatNights(startDate: Date, endDate: Date): string {
  const nights = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) {
    return "";
  }
  return `${nights} night${nights === 1 ? "" : "s"}`;
}

export function PlaceAndDatePage({ onBack, onContinue }: PlaceAndDatePageProps) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

  const canAddStop =
    cityInput.trim() !== "" && startDate !== null && endDate !== null && endDate > startDate;

  function handleDateChange(event: DateTimePickerEvent, selectedDate: Date | undefined) {
    const field = activeField;
    if (Platform.OS === "android") {
      setActiveField(null);
    }
    if (event.type === "dismissed" || !selectedDate || !field) {
      return;
    }
    if (field === "startDate") {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
  }

  async function handleAddStop() {
    if (!canAddStop || !startDate || !endDate) {
      return;
    }
    setLocationError(null);
    setIsCheckingLocation(true);
    const weatherLocationQuery = cityInput.trim().replace(/\s+/g, " ");
    try {
      const location = await geocodeLocation(weatherLocationQuery);
      if (!location) {
        setLocationError("Choose a real city or place so we can get the forecast.");
        return;
      }
      setStops((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          city: location.name,
          country: location.admin1
            ? `${location.admin1}, ${location.country}`
            : location.country,
          latitude: location.latitude,
          longitude: location.longitude,
          weatherLocationQuery,
          startDate,
          endDate,
        },
      ]);
      setCityInput("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Unable to check that location right now.");
    } finally {
      setIsCheckingLocation(false);
    }
  }

  function handleDeleteStop(id: string) {
    setStops((current) => current.filter((stop) => stop.id !== id));
  }

  function handleEditStop(stop: Stop) {
    Alert.alert("Edit stop", `Editing ${stop.city} can be added after this screen.`);
  }

  function handleContinue() {
    if (stops.length > 0) {
      onContinue(stops);
    }
  }

  const pickerValue = (activeField === "startDate" ? startDate : endDate) ?? new Date();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#3a2317" />
        </Pressable>
        <View style={styles.progressRow}>
          <View style={[styles.progressSegment, styles.progressSegmentActive]} />
          <View style={[styles.progressSegment, styles.progressSegmentActive]} />
          <View style={styles.progressSegment} />
          <View style={styles.progressSegment} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <Text style={styles.stepLabel}>Step 2 · Cities & dates</Text>
          <Text style={styles.title}>When & where?</Text>

          <View style={styles.newStopCard}>
            <Text style={styles.newStopLabel}>New stop</Text>

            <Text style={styles.fieldLabel}>City or place</Text>
            <TextInput
              onChangeText={(value) => {
                setCityInput(value);
                setLocationError(null);
              }}
              placeholder="e.g. Reykjavík, Iceland"
              placeholderTextColor="rgba(58,35,23,0.35)"
              style={styles.cityInput}
              value={cityInput}
            />
            <View style={styles.locationMessageSlot}>
              {locationError ? <Text style={styles.locationError}>{locationError}</Text> : null}
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.fieldLabel}>Start date</Text>
                <Pressable onPress={() => setActiveField("startDate")} style={styles.dateInputRow}>
                  <Ionicons name="calendar-outline" size={16} color="#d98a3d" />
                  <Text style={startDate ? styles.dateValueText : styles.datePlaceholderText}>
                    {startDate ? formatDate(startDate) : "Select date"}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.dateField}>
                <Text style={styles.fieldLabel}>End date</Text>
                <Pressable onPress={() => setActiveField("endDate")} style={styles.dateInputRow}>
                  <Ionicons name="calendar-outline" size={16} color="#d98a3d" />
                  <Text style={endDate ? styles.dateValueText : styles.datePlaceholderText}>
                    {endDate ? formatDate(endDate) : "Select date"}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              disabled={!canAddStop}
              onPress={handleAddStop}
              style={({ pressed }) => [
                styles.addStopButton,
                (!canAddStop || isCheckingLocation) && styles.addStopButtonDisabled,
                pressed && canAddStop && !isCheckingLocation && styles.addStopButtonPressed,
              ]}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff8ea" />
              <Text style={styles.addStopButtonText}>
                {isCheckingLocation ? "Checking place..." : "Add this stop"}
              </Text>
            </Pressable>
          </View>

          {stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopCard}>
              <View style={styles.stopTopRow}>
                <View style={styles.stopBadge}>
                  <Text style={styles.stopBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.stopLabel}>Stop {index + 1}</Text>
                <Text style={styles.nightsText}>{formatNights(stop.startDate, stop.endDate)}</Text>
                <Pressable
                  accessibilityLabel={`Delete ${stop.city}`}
                  hitSlop={8}
                  onPress={() => handleDeleteStop(stop.id)}
                  style={styles.stopDeleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#8a4a2e" />
                </Pressable>
              </View>

              <View style={styles.stopCityRow}>
                <Ionicons name="location" size={20} color="#d98a3d" />
                <View style={styles.stopCityTextWrap}>
                  <Text style={styles.stopCity}>{stop.city}</Text>
                  {stop.country ? <Text style={styles.stopCountry}>{stop.country}</Text> : null}
                </View>
                <Pressable
                  accessibilityLabel={`Edit ${stop.city}`}
                  hitSlop={8}
                  onPress={() => handleEditStop(stop)}
                >
                  <Ionicons name="pencil" size={16} color="#a68a6c" />
                </Pressable>
              </View>

              <View style={styles.stopDivider} />

              <View style={styles.dateRow}>
                <View style={styles.dateReadout}>
                  <Text style={styles.fieldLabel}>Start date</Text>
                  <View style={styles.dateInputRow}>
                    <Ionicons name="calendar-outline" size={16} color="#d98a3d" />
                    <Text style={styles.dateValueText}>{formatDate(stop.startDate)}</Text>
                  </View>
                </View>
                <View style={styles.dateReadout}>
                  <Text style={styles.fieldLabel}>End date</Text>
                  <View style={styles.dateInputRow}>
                    <Ionicons name="calendar-outline" size={16} color="#d98a3d" />
                    <Text style={styles.dateValueText}>{formatDate(stop.endDate)}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="bag-suitcase-outline" size={18} color="#c9502e" />
            <Text style={styles.tipText}>
              We&apos;ll tailor your list to each stop — and peek at the forecast for the extras.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Pressable
          disabled={stops.length === 0}
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            stops.length === 0 && styles.continueButtonDisabled,
            pressed && stops.length > 0 && styles.continueButtonPressed,
          ]}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff8ea" />
        </Pressable>
      </View>

      {activeField && Platform.OS === "android" ? (
        <DateTimePicker mode="date" onChange={handleDateChange} value={pickerValue} />
      ) : null}

      {activeField && Platform.OS === "ios" ? (
        <Modal animationType="slide" onRequestClose={() => setActiveField(null)} transparent>
          <Pressable onPress={() => setActiveField(null)} style={styles.pickerBackdrop}>
            <View style={styles.pickerSheet}>
              <DateTimePicker
                display="spinner"
                mode="date"
                onChange={handleDateChange}
                value={pickerValue}
              />
              <Pressable onPress={() => setActiveField(null)} style={styles.pickerDoneButton}>
                <Text style={styles.pickerDoneText}>Done</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}
