import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import type { Stop } from "../place-and-date-page/place-and-date-page";
import { styles } from "./build-list-page.styles";

type BuildListPageProps = {
  onBack: () => void;
  onFinish: (packedStatus: { packed: number; total: number }) => void;
  stops: Stop[];
};

type PackingItem = {
  id: string;
  label: string;
  detail?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  packed: boolean;
};

type PackingSection = {
  title: string;
  items: PackingItem[];
};

const weatherItems: PackingItem[] = [
  {
    id: "rain-jacket",
    label: "Waterproof rain jacket",
    detail: "Rain forecast on 4 of 7 days",
    icon: "weather-pouring",
    packed: true,
  },
  {
    id: "thermal-layer",
    label: "Thermal base layer",
    detail: "Lows near 0-2° at night",
    icon: "snowflake",
    packed: true,
  },
  {
    id: "umbrella",
    label: "Compact umbrella",
    detail: "Heavy showers midweek",
    icon: "umbrella-outline",
    packed: false,
  },
  {
    id: "waterproof-boots",
    label: "Waterproof boots",
    detail: "Wet streets all week",
    icon: "water-outline",
    packed: false,
  },
];

const baseSections: PackingSection[] = [
  {
    title: "Documents",
    items: [
      { id: "passport", label: "Passport", packed: false },
      { id: "boarding-passes", label: "Boarding passes", packed: false },
      { id: "insurance-card", label: "Travel insurance card", packed: false },
    ],
  },
  {
    title: "Clothing",
    items: [
      { id: "tops", label: "Tops for each day", packed: false },
      { id: "trousers", label: "Trousers or jeans", packed: false },
      { id: "sleepwear", label: "Sleepwear", packed: false },
    ],
  },
  {
    title: "Tech",
    items: [
      { id: "phone-charger", label: "Phone + charger", packed: false },
      { id: "power-bank", label: "Power bank", packed: false },
      { id: "travel-adapter", label: "Travel adapter", packed: false },
    ],
  },
  {
    title: "Toiletries",
    items: [
      { id: "toothbrush", label: "Toothbrush & paste", packed: false },
      { id: "moisturiser", label: "Moisturiser", packed: false },
      { id: "lip-balm", label: "Lip balm", packed: false },
    ],
  },
];

function formatTripTitle(stops: Stop[]): string {
  const firstStop = stops[0];
  if (!firstStop) {
    return "Trip packing";
  }
  return `${firstStop.city} city break`;
}

function createInitialItems(): Record<string, boolean> {
  const allItems = [
    ...weatherItems,
    ...baseSections.flatMap((section) => section.items),
  ];
  return allItems.reduce<Record<string, boolean>>((current, item) => {
    current[item.id] = item.packed;
    return current;
  }, {});
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkCircle, checked && styles.checkCircleChecked]}>
      {checked ? <Ionicons name="checkmark" size={22} color="#fff8ea" /> : null}
    </View>
  );
}

export function BuildListPage({ onBack, onFinish, stops }: BuildListPageProps) {
  const [packedItems, setPackedItems] = useState(createInitialItems);
  const [customItems, setCustomItems] = useState<PackingItem[]>([]);
  const [customInput, setCustomInput] = useState("");
  const tripTitle = formatTripTitle(stops);

  const totals = useMemo(() => {
    const staticItems = [
      ...weatherItems,
      ...baseSections.flatMap((section) => section.items),
    ];
    const allItems = [...staticItems, ...customItems];
    const packedCount = allItems.filter((item) => packedItems[item.id]).length;
    return { packedCount, totalCount: allItems.length };
  }, [customItems, packedItems]);

  const progress =
    totals.totalCount === 0 ? 0 : totals.packedCount / totals.totalCount;

  function toggleItem(id: string) {
    setPackedItems((current) => ({ ...current, [id]: !current[id] }));
  }

  function addCustomItem() {
    const trimmedInput = customInput.trim();
    if (!trimmedInput) {
      return;
    }
    const id = `custom-${Date.now()}`;
    setCustomItems((current) => [
      ...current,
      { id, label: trimmedInput, packed: false },
    ]);
    setPackedItems((current) => ({ ...current, [id]: false }));
    setCustomInput("");
  }

  function handleFinish() {
    onFinish({ packed: totals.packedCount, total: totals.totalCount });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#3a2317" />
        </Pressable>
        <View style={styles.stepperRow}>
          <View style={[styles.stepperSegment, styles.stepperSegmentActive]} />
          <View style={[styles.stepperSegment, styles.stepperSegmentActive]} />
          <View style={[styles.stepperSegment, styles.stepperSegmentActive]} />
          <View style={[styles.stepperSegment, styles.stepperSegmentActive]} />
        </View>
      </View>

      <View style={styles.headerCopy}>
        <Text style={styles.stepLabel}>Step 4 · Build list</Text>
        <Text style={styles.title}>Packing list</Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(progress * 100, 8)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {totals.packedCount} / {totals.totalCount} packed
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.weatherSection}>
          <View style={styles.weatherHeadingRow}>
            <Text style={styles.weatherBang}>!</Text>
            <Text style={styles.weatherTitle}>Because of the weather</Text>
          </View>
          <Text style={styles.weatherIntro}>
            Extra items worth having. Skip any you&apos;d rather borrow or buy
            at your destination.
          </Text>
          <View style={styles.weatherList}>
            {weatherItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => toggleItem(item.id)}
                style={styles.weatherItem}
              >
                <View style={styles.weatherIconWrap}>
                  <MaterialCommunityIcons
                    name={item.icon ?? "bag-personal-outline"}
                    size={24}
                    color="#c27a18"
                  />
                </View>
                <View style={styles.itemTextWrap}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.detail ? (
                    <View style={styles.itemDetailRow}>
                      <Ionicons
                        name="information-circle-outline"
                        size={16}
                        color="#c27a18"
                      />
                      <Text style={styles.itemDetail}>{item.detail}</Text>
                    </View>
                  ) : null}
                </View>
                <CheckCircle checked={!!packedItems[item.id]} />
              </Pressable>
            ))}
          </View>
        </View>

        {baseSections.map((section) => (
          <View key={section.title} style={styles.sectionWrap}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.basicList}>
              {section.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  style={styles.basicItem}
                >
                  <CheckCircle checked={!!packedItems[item.id]} />
                  <Text style={styles.basicItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionLabel}>My items</Text>
          {customItems.length > 0 ? (
            <View style={styles.basicList}>
              {customItems.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  style={styles.basicItem}
                >
                  <CheckCircle checked={!!packedItems[item.id]} />
                  <Text style={styles.basicItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={styles.addItemRow}>
            <Ionicons name="add" size={28} color="#8b7a65" />
            <TextInput
              onChangeText={setCustomInput}
              onSubmitEditing={addCustomItem}
              placeholder="Add your own item..."
              placeholderTextColor="#b9aa91"
              returnKeyType="done"
              style={styles.addItemInput}
              value={customInput}
            />
            <Pressable onPress={addCustomItem} style={styles.addItemButton}>
              <Ionicons name="arrow-up" size={30} color="#fff8ea" />
            </Pressable>
          </View>
          <Text style={styles.helperText}>
            No need to tick it all now — come back and pack whenever.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleFinish}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
        >
          <MaterialCommunityIcons
            name="map-check-outline"
            size={24}
            color="#fff8ea"
          />
          <Text style={styles.saveButtonText}>Save list & finish</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
