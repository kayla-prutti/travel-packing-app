import { useEffect, useState } from "react";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  useFonts as useInstrumentSansFonts,
} from "@expo-google-fonts/instrument-sans";
import {
  Spectral_600SemiBold,
  useFonts as useSpectralFonts,
} from "@expo-google-fonts/spectral";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HomePage, initialTrips } from "./component/home-page/home-page";
import type { Trip } from "./component/home-page/home-page";
import { LoginPage } from "./component/login-page/login-page";
import { BuildListPage } from "./component/build-list-page/build-list-page";
import { PlaceAndDatePage } from "./component/place-and-date-page/place-and-date-page";
import type { Stop } from "./component/place-and-date-page/place-and-date-page";
import { signOut } from "./src/lib/auth/api";
import { supabase } from "./src/lib/supabase/native";
import { configureTypographyDefaults } from "./src/theme/typography";
import { TripTypePage } from "./component/trip-type-page/trip-type-page";
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
  const [stops, setStops] = useState<Stop[]>([]);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        setScreen("home");
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
    const stopCount = selectedStops.length === 1 ? "1 stop" : `${selectedStops.length} stops`;
    return firstStop.country ? `${firstStop.country} · ${stopCount}` : stopCount;
  }

  function formatDateRange(selectedStops: Stop[]): string {
    if (selectedStops.length === 0) {
      return "Dates pending";
    }
    const sortedArrivals = [...selectedStops].sort((a, b) => a.arrive.getTime() - b.arrive.getTime());
    const sortedLeaves = [...selectedStops].sort((a, b) => b.leave.getTime() - a.leave.getTime());
    const start = sortedArrivals[0].arrive;
    const end = sortedLeaves[0].leave;
    const startText = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endText = end.toLocaleDateString("en-US", { day: "numeric" });
    return `${startText} – ${endText}`;
  }

  function saveTrip(packedStatus: { packed: number; total: number }) {
    const trip: Trip = {
      id: `${Date.now()}`,
      name: formatTripName(stops),
      location: formatTripLocation(stops),
      dateRange: formatDateRange(stops),
      weatherIcon: "rainy",
      weatherRange: "1–8°",
      packedStatus,
    };
    setTrips((current) => [trip, ...current]);
    setStops([]);
    setScreen("home");
  }

  async function handleLogout() {
    await signOut();
    setScreen("login");
  }

  if (!instrumentSansLoaded || !spectralLoaded) {
    return null;
  }

  configureTypographyDefaults();

  return (
    <SafeAreaProvider>
      {screen === "login" && <LoginPage onSignIn={() => setScreen("home")} />}
      {screen === "home" && (
        <HomePage
          onCreateTrip={() => setScreen("trip-type")}
          onDeleteTrip={(id) => setTrips((current) => current.filter((trip) => trip.id !== id))}
          onLogout={handleLogout}
          trips={trips}
        />
      )}
      {screen === "trip-type" && (
        <TripTypePage
          onBack={() => setScreen("home")}
          onContinue={() => setScreen("place-and-date")}
        />
      )}
      {screen === "place-and-date" && (
        <PlaceAndDatePage
          onBack={() => setScreen("trip-type")}
          onContinue={(selectedStops) => {
            setStops(selectedStops);
            setScreen("weather-check");
          }}
        />
      )}
      {screen === "weather-check" && (
        <WeatherCheckPage
          onBack={() => setScreen("place-and-date")}
          onBuildPackingList={() => setScreen("build-list")}
          stops={stops}
        />
      )}
      {screen === "build-list" && (
        <BuildListPage
          onBack={() => setScreen("weather-check")}
          onFinish={saveTrip}
          stops={stops}
        />
      )}
    </SafeAreaProvider>
  );
}
