import { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "./home-page.styles";

type PackedStatus = { packed: number; total: number } | "not-started";

export type Trip = {
  id: string;
  name: string;
  location: string;
  dateRange: string;
  weatherIcon: "rainy" | "snow";
  weatherRange: string;
  packedStatus: PackedStatus;
};

export const initialTrips: Trip[] = [
  {
    id: "1",
    name: "Reykjavík City Break",
    location: "Iceland · 2 stops",
    dateRange: "Nov 8 – 15",
    weatherIcon: "rainy",
    weatherRange: "2–8°",
    packedStatus: { packed: 0, total: 18 },
  },
  {
    id: "2",
    name: "Chamonix Ski Week",
    location: "France",
    dateRange: "Jan 12 – 19",
    weatherIcon: "snow",
    weatherRange: "-6–1°",
    packedStatus: "not-started",
  },
];

type HomePageProps = {
  onLogout: () => void;
  onCreateTrip: () => void;
  onDeleteTrip: (id: string) => void;
  trips: Trip[];
};

export function HomePage({ onLogout, onCreateTrip, onDeleteTrip, trips }: HomePageProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);

  const displayName = "Alex";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  function requestDeleteTrip(trip: Trip) {
    setDeleteTarget(trip);
  }

  function cancelDeleteTrip() {
    setDeleteTarget(null);
  }

  function confirmDeleteTrip() {
    if (!deleteTarget) {
      return;
    }
    onDeleteTrip(deleteTarget.id);
    setDeleteTarget(null);
  }

  function handleLogout() {
    setMenuOpen(false);
    onLogout();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.name}>{displayName}</Text>
        </View>
        <Pressable onPress={() => setMenuOpen(true)} style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitial}</Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
        transparent
        visible={menuOpen}
      >
        <Pressable onPress={() => setMenuOpen(false)} style={styles.menuBackdrop}>
          <View style={[styles.accountMenu, { top: insets.top + 68, right: 20 }]}>
            <Text style={styles.accountName}>{displayName}</Text>
            <Text style={styles.accountEmail}>alex@trailmail.co</Text>
            <View style={styles.accountDivider} />
            <Pressable onPress={handleLogout} style={styles.logoutRow}>
              <Ionicons name="log-out-outline" size={18} color="#c9502e" />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={cancelDeleteTrip}
        transparent
        visible={deleteTarget !== null}
      >
        <Pressable onPress={cancelDeleteTrip} style={styles.confirmBackdrop}>
          <View style={[styles.confirmSheet, { paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.confirmIconWrap}>
              <Ionicons name="trash-outline" size={22} color="#c9502e" />
            </View>
            <Text style={styles.confirmTitle}>Delete this trip?</Text>
            <Text style={styles.confirmMessage}>
              &quot;{deleteTarget?.name}&quot; and its packing list will be removed. This can&apos;t be
              undone.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable onPress={cancelDeleteTrip} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={confirmDeleteTrip} style={styles.deleteConfirmButton}>
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={trips}
        keyExtractor={(trip) => trip.id}
        ListFooterComponent={
          <View style={styles.addTripPrompt}>
            <MaterialCommunityIcons name="bag-suitcase-outline" size={22} color="#c9502e" />
            <Text style={styles.addTripPromptText}>
              Add a trip and Packwise builds your list in seconds — tick things off whenever
              you pack.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionTitle}>Your trips</Text>
            <Text style={styles.sectionCount}>{trips.length} upcoming</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <Text style={styles.tripName}>{item.name}</Text>
              <View style={styles.cardTopActions}>
                <View style={styles.weatherPill}>
                  <Ionicons
                    name={item.weatherIcon === "rainy" ? "rainy-outline" : "snow-outline"}
                    size={14}
                    color="#c9502e"
                  />
                  <Text style={styles.weatherText}>{item.weatherRange}</Text>
                </View>
                <Pressable
                  accessibilityLabel={`Delete ${item.name}`}
                  hitSlop={8}
                  onPress={() => requestDeleteTrip(item)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={18} color="#8a4a2e" />
                </Pressable>
              </View>
            </View>

            <Text style={styles.tripLocation}>{item.location}</Text>

            <View style={styles.cardBottomRow}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={16} color="#c9502e" />
                <Text style={styles.dateText}>{item.dateRange}</Text>
              </View>

              {item.packedStatus === "not-started" ? (
                <View style={styles.statusRow}>
                  <Ionicons name="ellipse-outline" size={14} color="#9c8266" />
                  <Text style={styles.statusText}>List not started</Text>
                </View>
              ) : (
                <View style={styles.statusRow}>
                  <MaterialCommunityIcons name="format-list-checks" size={16} color="#9c8266" />
                  <Text style={styles.statusText}>
                    {item.packedStatus.packed}/{item.packedStatus.total} packed
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <View style={styles.footer}>
        <Pressable
          onPress={onCreateTrip}
          style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
        >
          <Ionicons name="add" size={22} color="#fff8ea" />
          <Text style={styles.createButtonText}>Create new trip</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
