import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import type { Stop } from "../place-and-date-page/place-and-date-page";
import { styles } from "./weather-check-page.styles";

type WeatherCheckPageProps = {
  onBuildPackingList: () => void;
  onBack: () => void;
  stops: Stop[];
};

type ForecastDay = {
  day: string;
  date: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  high: number;
  low: number;
  alert?: boolean;
};

const forecastDays: ForecastDay[] = [
  { day: "Sat", date: 8, icon: "weather-pouring", high: 6, low: 2, alert: true },
  { day: "Sun", date: 9, icon: "weather-cloudy", high: 7, low: 3 },
  { day: "Mon", date: 10, icon: "weather-pouring", high: 5, low: 1, alert: true },
  { day: "Tue", date: 11, icon: "snowflake", high: 4, low: 0, alert: true },
  { day: "Wed", date: 12, icon: "weather-partly-cloudy", high: 8, low: 4 },
  { day: "Thu", date: 13, icon: "weather-pouring", high: 6, low: 2 },
];

function formatLocation(stops: Stop[]): string {
  const firstStop = stops[0];
  if (!firstStop) {
    return "Your destination";
  }
  return firstStop.country ? `${firstStop.city}, ${firstStop.country}` : firstStop.city;
}

export function WeatherCheckPage({ onBack, onBuildPackingList, stops }: WeatherCheckPageProps) {
  const location = formatLocation(stops);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#3a2317" />
        </Pressable>
        <View style={styles.progressRow}>
          <View style={[styles.progressSegment, styles.progressSegmentActive]} />
          <View style={[styles.progressSegment, styles.progressSegmentActive]} />
          <View style={[styles.progressSegment, styles.progressSegmentActive]} />
          <View style={styles.progressSegment} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={styles.stepLabel}>Step 3 · Quick weather check</Text>
        <Text style={styles.title}>A peek at the forecast</Text>

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle-outline" size={20} color="#8b7a65" />
          <Text style={styles.noticeText}>Weather can shift fast. We&apos;ll refresh as your trip nears.</Text>
        </View>

        <View style={styles.heroWeatherCard}>
          <View style={styles.heroWeatherTop}>
            <View>
              <Text style={styles.locationText}>{location}</Text>
              <Text style={styles.currentTemp}>4°</Text>
            </View>
            <MaterialCommunityIcons name="weather-pouring" size={76} color="#ffd184" />
          </View>
          <Text style={styles.feelsText}>Feels like 0° · High 8° Low 1°</Text>
          <View style={styles.weatherStatsRow}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Rain days</Text>
              <Text style={styles.weatherStatValue}>4 / 7</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>Wind</Text>
              <Text style={styles.weatherStatValue}>32 km/h</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatLabel}>UV</Text>
              <Text style={styles.weatherStatValue}>Low</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Your travel window</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.forecastScroller}
          contentContainerStyle={styles.forecastContent}
        >
          {forecastDays.map((day) => (
            <View key={`${day.day}-${day.date}`} style={styles.dayCard}>
              {day.alert ? <View style={styles.dayAlertDot} /> : null}
              <Text style={styles.dayName}>{day.day}</Text>
              <Text style={styles.dayDate}>{day.date}</Text>
              <MaterialCommunityIcons name={day.icon} size={34} color="#c9502e" style={styles.dayIcon} />
              <Text style={styles.dayHigh}>{day.high}°</Text>
              <Text style={styles.dayLow}>{day.low}°</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.extrasCard}>
          <MaterialCommunityIcons name="alert-rhombus-outline" size={32} color="#c27a18" />
          <View style={styles.extrasCopy}>
            <Text style={styles.extrasTitle}>4 weather extras suggested</Text>
            <Text style={styles.extrasText}>
              Cold nights and a few wet days — we&apos;ll flag rain gear and warm layers on your list.
              Bring them, or grab them there.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={onBuildPackingList}
          style={({ pressed }) => [styles.buildButton, pressed && styles.buildButtonPressed]}
        >
          <MaterialCommunityIcons name="format-list-checks" size={24} color="#fff8ea" />
          <Text style={styles.buildButtonText}>Build my packing list</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
