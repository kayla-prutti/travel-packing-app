import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import type { Stop } from "../place-and-date-page/place-and-date-page";
import {
  fetchTripForecast,
  type TripForecastResult,
  type WeatherPackingItem,
} from "../../src/weather/forecast";
import { styles } from "./weather-check-page.styles";

type WeatherCheckPageProps = {
  onBuildPackingList: () => void;
  onBack: () => void;
  onWeatherAvailabilityChange: (
    available: boolean,
    weatherPackingItems: WeatherPackingItem[]
  ) => void;
  stops: Stop[];
};

function formatLocation(stops: Stop[]): string {
  const firstStop = stops[0];
  if (!firstStop) {
    return "Your destination";
  }
  if (firstStop.weatherLocationQuery) {
    return firstStop.weatherLocationQuery;
  }
  return firstStop.country
    ? `${firstStop.city}, ${firstStop.country}`
    : firstStop.city;
}

function formatMonthDay(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatAvailableFrom(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function WeatherCheckPage({
  onBack,
  onBuildPackingList,
  onWeatherAvailabilityChange,
  stops,
}: WeatherCheckPageProps) {
  const location = formatLocation(stops);
  const forecastRequestKey = stops
    .map(
      (stop) =>
        `${
          stop.id
        }-${stop.startDate.toISOString()}-${stop.endDate.toISOString()}`
    )
    .join("|");
  const [forecastState, setForecastState] = useState<{
    key: string;
    result: TripForecastResult;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchTripForecast(stops).then((result) => {
      if (isMounted) {
        setForecastState({ key: forecastRequestKey, result });
        onWeatherAvailabilityChange(
          result.status === "available" &&
            result.forecast.suggestedPackingItems.length > 0,
          result.status === "available"
            ? result.forecast.suggestedPackingItems
            : []
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, [forecastRequestKey, onWeatherAvailabilityChange, stops]);

  const forecastResult =
    forecastState?.key === forecastRequestKey ? forecastState.result : null;
  const forecast =
    forecastResult?.status === "available" ? forecastResult.forecast : null;
  const isTooFar = forecastResult?.status === "too-far";
  const isError = forecastResult?.status === "error";
  const highLowText = forecast
    ? forecast.high !== null && forecast.low !== null
      ? `High ${forecast.high}° Low ${forecast.low}°`
      : "High and low pending"
    : "High and low pending";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#3a2317" />
        </Pressable>
        <View style={styles.progressRow}>
          <View
            style={[styles.progressSegment, styles.progressSegmentActive]}
          />
          <View
            style={[styles.progressSegment, styles.progressSegmentActive]}
          />
          <View
            style={[styles.progressSegment, styles.progressSegmentActive]}
          />
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

        <View style={[styles.noticeCard, isTooFar && styles.noticeCardWarning]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#8b7a65"
          />
          <Text style={styles.noticeText}>
            {isTooFar && forecastResult.status === "too-far"
              ? `Forecast data is not available yet for these dates. Check back around ${formatAvailableFrom(
                  forecastResult.availableFrom
                )}, but you can still build your packing list now.`
              : isError && forecastResult.status === "error"
              ? `${forecastResult.message} You can still continue with the packing list.`
              : "Weather can shift fast. We'll refresh as your trip nears."}
          </Text>
        </View>

        <View style={styles.heroWeatherCard}>
          {!forecastResult ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#ffd184" />
              <Text style={styles.loadingText}>
                Loading forecast for {location}...
              </Text>
            </View>
          ) : forecast ? (
            <>
              <View style={styles.heroWeatherTop}>
                <View>
                  <Text style={styles.locationText}>{forecast.location}</Text>
                  <Text style={styles.currentTemp}>
                    {forecast.currentTemperature !== null
                      ? `${forecast.currentTemperature}°`
                      : "--"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={forecast.currentWeatherIcon}
                  size={76}
                  color="#ffd184"
                />
              </View>
              <Text style={styles.feelsText}>
                {forecast.feelsLike !== null
                  ? `Feels like ${forecast.feelsLike}° · `
                  : ""}
                {highLowText}
              </Text>
              <View style={styles.weatherStatsRow}>
                <View style={styles.weatherStat}>
                  <Text style={styles.weatherStatLabel}>Rain days</Text>
                  <Text style={styles.weatherStatValue}>
                    {forecast.rainDays} / {forecast.days.length}
                  </Text>
                </View>
                <View style={styles.weatherStat}>
                  <Text style={styles.weatherStatLabel}>Wind</Text>
                  <Text style={styles.weatherStatValue}>
                    {forecast.averageWindSpeed !== null
                      ? `${forecast.averageWindSpeed} km/h`
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.weatherStat}>
                  <Text style={styles.weatherStatLabel}>UV</Text>
                  <Text style={styles.weatherStatValue}>
                    {forecast.uvLabel}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.loadingWrap}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={56}
                color="#ffd184"
              />
              <Text style={styles.locationText}>{location}</Text>
              <Text style={styles.unavailableText}>
                {isTooFar
                  ? "Forecast is not available this far ahead yet."
                  : "Forecast is unavailable right now."}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>Your travel window</Text>
        {forecast ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.forecastScroller}
            contentContainerStyle={styles.forecastContent}
          >
            {forecast.days.map((day) => (
              <View key={day.date.toISOString()} style={styles.dayCard}>
                {day.alert ? <View style={styles.dayAlertDot} /> : null}
                <Text style={styles.dayName}>
                  {day.date.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <Text style={styles.dayDate}>{formatMonthDay(day.date)}</Text>
                <MaterialCommunityIcons
                  name={day.icon}
                  size={34}
                  color="#c9502e"
                  style={styles.dayIcon}
                />
                <Text style={styles.dayHigh}>{day.high}°</Text>
                <Text style={styles.dayLow}>{day.low}°</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.windowFallbackCard}>
            <Text style={styles.windowFallbackTitle}>
              Forecast window pending
            </Text>
            <Text style={styles.windowFallbackText}>
              We&apos;ll show daily weather here once the forecast is available
              for your dates.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={onBuildPackingList}
          style={({ pressed }) => [
            styles.buildButton,
            pressed && styles.buildButtonPressed,
          ]}
        >
          <MaterialCommunityIcons
            name="format-list-checks"
            size={24}
            color="#fff8ea"
          />
          <Text style={styles.buildButtonText}>Build my packing list</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
