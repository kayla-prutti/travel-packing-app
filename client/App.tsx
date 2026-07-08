import { useCallback, useEffect, useState } from "react";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  useFonts as useInstrumentSansFonts,
} from "@expo-google-fonts/instrument-sans";
import type { Session } from "@supabase/supabase-js";
import {
  Spectral_600SemiBold,
  useFonts as useSpectralFonts,
} from "@expo-google-fonts/spectral";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HomePage } from "./component/home-page/home-page";
import type { Trip } from "./component/home-page/home-page";
import { LoginPage } from "./component/login-page/login-page";
import { BuildListPage } from "./component/build-list-page/build-list-page";
import { PlaceAndDatePage } from "./component/place-and-date-page/place-and-date-page";
import type { Stop } from "./component/place-and-date-page/place-and-date-page";
import { signOut } from "./src/auth/auth-client";
import { supabase } from "./src/lib/supabase/native";
import { configureTypographyDefaults } from "./src/theme/typography";
import { TripTypePage } from "./component/trip-type-page/trip-type-page";
import type { TripType } from "./component/trip-type-page/trip-type-page";
import { WeatherCheckPage } from "./component/weather-check-page/weather-check-page";

type Screen = "login" | "home" | "trip-type" | "place-and-date" | "weather-check" | "build-list";

export default function App() {
  const [instrumentSansLoaded] = useInstrumentSansFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
  });
  const [spectralLoaded] = useSpectralFonts({
    Spectral_600SemiBold,
  });
  const [screen, setScreen] = useState<Screen>("login");
  const [tripType, setTripType] = useState<TripType | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [weatherAvailable, setWeatherAvailable] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tripsByUser, setTripsByUser] = useState<Record<string, Trip[]>>({});

  const currentUserId = session?.user.id ?? null;
  const currentTrips = currentUserId ? tripsByUser[currentUserId] ?? [] : [];
  const accountEmail = session?.user.email ?? "";
  const displayName = accountEmail ? accountEmail.split("@")[0] : "Traveler";

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        setSession(data.session);
        setScreen("home");
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setScreen(session ? "home" : "login");
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  function formatTripName(selectedStops: Stop[]): string {
    const firstStop = selectedStops[0];
    if (!firstStop) {
      return "New Trip";
    }
    return `${firstStop.city} City Break`;
  }

  function formatTripLocation(selectedStops: Stop[]): string {
    const firstStop = selectedStops[0];
    if (!firstStop) {
      return "Destination pending";
    }
    return firstStop.weatherLocationQuery || firstStop.city;
  }

  function getTripDateBounds(selectedStops: Stop[]): { start: Date; end: Date } | null {
    if (selectedStops.length === 0) {
      return null;
    }
    const sortedStarts = [...selectedStops].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const sortedEnds = [...selectedStops].sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
    return {
      start: sortedStarts[0].startDate,
      end: sortedEnds[0].endDate,
    };
  }

  function formatDateRange(selectedStops: Stop[]): string {
    const bounds = getTripDateBounds(selectedStops);
    if (!bounds) {
      return "Dates pending";
    }
    const { start, end } = bounds;
    const startText = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endText = end.toLocaleDateString("en-US", { day: "numeric" });
    return `${startText} – ${endText}`;
  }

  function saveTrip(packedStatus: { packed: number; total: number }) {
    if (selectedTripId && currentUserId) {
      setTripsByUser((current) => ({
        ...current,
        [currentUserId]: (current[currentUserId] ?? []).map((trip) =>
          trip.id === selectedTripId ? { ...trip, packedStatus } : trip,
        ),
      }));
      setSelectedTripId(null);
      setStops([]);
      setScreen("home");
      return;
    }

    const dateBounds = getTripDateBounds(stops);
    if (!dateBounds) {
      setScreen("home");
      return;
    }
    const trip: Trip = {
      id: `${Date.now()}`,
      name: formatTripName(stops),
      location: formatTripLocation(stops),
      dateRange: formatDateRange(stops),
      startDate: dateBounds.start,
      endDate: dateBounds.end,
      stops,
      tripType,
      weatherAvailable,
      weatherIcon: "rainy",
      weatherRange: "1–8°",
      packedStatus,
    };
    if (currentUserId) {
      setTripsByUser((current) => ({
        ...current,
        [currentUserId]: [trip, ...(current[currentUserId] ?? [])],
      }));
    }
    setStops([]);
    setScreen("home");
  }

  async function handleLogout() {
    await signOut();
    setScreen("login");
  }

  const handleWeatherAvailabilityChange = useCallback((available: boolean) => {
    setWeatherAvailable(available);
  }, []);

  if (!instrumentSansLoaded || !spectralLoaded) {
    return null;
  }

  configureTypographyDefaults();

  return (
    <SafeAreaProvider>
      {screen === "login" && <LoginPage onSignIn={() => setScreen("home")} />}
      {screen === "home" && (
        <HomePage
          accountEmail={accountEmail}
          displayName={displayName}
          onCreateTrip={() => {
            setSelectedTripId(null);
            setTripType(null);
            setStops([]);
            setWeatherAvailable(false);
            setScreen("trip-type");
          }}
          onDeleteTrip={(id) => {
            if (!currentUserId) {
              return;
            }
            setTripsByUser((current) => ({
              ...current,
              [currentUserId]: (current[currentUserId] ?? []).filter((trip) => trip.id !== id),
            }));
          }}
          onLogout={handleLogout}
          onOpenTrip={(trip) => {
            setSelectedTripId(trip.id);
            setTripType(trip.tripType);
            setStops(trip.stops);
            setWeatherAvailable(trip.weatherAvailable);
            setScreen("build-list");
          }}
          trips={currentTrips}
        />
      )}
      {screen === "trip-type" && (
        <TripTypePage
          initialTripType={tripType}
          onBack={() => setScreen("home")}
          onContinue={(selectedTripType) => {
            setTripType(selectedTripType);
            setScreen("place-and-date");
          }}
        />
      )}
      {screen === "place-and-date" && (
        <PlaceAndDatePage
          existingTrips={currentTrips}
          initialStops={stops}
          onBack={() => setScreen("trip-type")}
          onContinue={(selectedStops) => {
            setStops(selectedStops);
            setWeatherAvailable(false);
            setScreen("weather-check");
          }}
        />
      )}
      {screen === "weather-check" && (
        <WeatherCheckPage
          onBack={() => setScreen("place-and-date")}
          onBuildPackingList={() => setScreen("build-list")}
          onWeatherAvailabilityChange={handleWeatherAvailabilityChange}
          stops={stops}
        />
      )}
      {screen === "build-list" && (
        <BuildListPage
          onBack={() => setScreen(selectedTripId ? "home" : "weather-check")}
          onFinish={saveTrip}
          stops={stops}
          tripType={tripType}
          weatherAvailable={weatherAvailable}
        />
      )}
    </SafeAreaProvider>
  );
}
