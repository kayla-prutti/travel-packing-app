import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import type { Stop } from "../place-and-date-page/place-and-date-page";
import type { TripType } from "../trip-type-page/trip-type-page";
import { styles } from "./build-list-page.styles";

type BuildListPageProps = {
  onBack: () => void;
  onFinish: (packedStatus: { packed: number; total: number }) => void;
  stops: Stop[];
  tripType: TripType | null;
  weatherAvailable: boolean;
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

const sharedSections: PackingSection[] = [
  {
    title: "Documents",
    items: [
      { id: "passport", label: "Passport", packed: false },
      { id: "boarding-passes", label: "Boarding passes", packed: false },
      { id: "insurance-card", label: "Travel insurance card", packed: false },
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
];

const tripTypeSections: Record<TripType, PackingSection[]> = {
  hiking: [
    {
      title: "Trail gear",
      items: [
        { id: "hiking-daypack", label: "Daypack", packed: false },
        { id: "hiking-water-bottle", label: "Water bottle or hydration bladder", packed: false },
        { id: "hiking-navigation", label: "Map or offline trail app", packed: false },
        { id: "hiking-first-aid", label: "Small first-aid kit", packed: false },
      ],
    },
    {
      title: "Trail clothing",
      items: [
        { id: "hiking-trail-shoes", label: "Hiking shoes", packed: false },
        { id: "hiking-socks", label: "Wool or hiking socks", packed: false },
        { id: "hiking-layers", label: "Breathable layers", packed: false },
      ],
    },
  ],
  city: [
    {
      title: "City days",
      items: [
        { id: "city-walking-shoes", label: "Comfortable walking shoes", packed: false },
        { id: "city-day-bag", label: "Small day bag", packed: false },
        { id: "city-outfit", label: "Dinner outfit", packed: false },
        { id: "city-sunglasses", label: "Sunglasses", packed: false },
      ],
    },
    {
      title: "Clothing",
      items: [
        { id: "city-tops", label: "Tops for each day", packed: false },
        { id: "city-bottoms", label: "Trousers, jeans, or skirt", packed: false },
        { id: "city-sleepwear", label: "Sleepwear", packed: false },
      ],
    },
  ],
  "beach-town": [
    {
      title: "Beach gear",
      items: [
        { id: "beach-swimwear", label: "Swimwear", packed: false },
        { id: "beach-coverup", label: "Cover-up or light shirt", packed: false },
        { id: "beach-sandals", label: "Sandals", packed: false },
        { id: "beach-dry-bag", label: "Wet/dry bag", packed: false },
      ],
    },
    {
      title: "Sun care",
      items: [
        { id: "beach-sunscreen", label: "Sunscreen", packed: false },
        { id: "beach-hat", label: "Sun hat", packed: false },
        { id: "beach-after-sun", label: "After-sun lotion", packed: false },
      ],
    },
  ],
  business: [
    {
      title: "Work essentials",
      items: [
        { id: "business-laptop", label: "Laptop", packed: false },
        { id: "business-laptop-charger", label: "Laptop charger", packed: false },
        { id: "business-notebook", label: "Notebook or meeting notes", packed: false },
        { id: "business-cards", label: "Business cards", packed: false },
      ],
    },
    {
      title: "Business clothing",
      items: [
        { id: "business-outfit", label: "Meeting outfit", packed: false },
        { id: "business-shoes", label: "Dress shoes", packed: false },
        { id: "business-belt", label: "Belt or accessories", packed: false },
      ],
    },
  ],
  ski: [
    {
      title: "Ski gear",
      items: [
        { id: "ski-goggles", label: "Goggles", packed: false },
        { id: "ski-gloves", label: "Ski gloves", packed: false },
        { id: "ski-neck-warmer", label: "Neck warmer", packed: false },
        { id: "ski-pass", label: "Lift pass or booking info", packed: false },
      ],
    },
    {
      title: "Cold layers",
      items: [
        { id: "ski-base-layers", label: "Thermal base layers", packed: false },
        { id: "ski-socks", label: "Ski socks", packed: false },
        { id: "ski-mid-layer", label: "Fleece or mid-layer", packed: false },
      ],
    },
  ],
  backpacking: [
    {
      title: "Backpacking gear",
      items: [
        { id: "backpacking-pack", label: "Backpack", packed: false },
        { id: "backpacking-packing-cubes", label: "Packing cubes or stuff sacks", packed: false },
        { id: "backpacking-lock", label: "Travel lock", packed: false },
        { id: "backpacking-laundry", label: "Laundry bag", packed: false },
      ],
    },
    {
      title: "Flexible clothing",
      items: [
        { id: "backpacking-quick-dry", label: "Quick-dry shirts", packed: false },
        { id: "backpacking-versatile-bottoms", label: "Versatile bottoms", packed: false },
        { id: "backpacking-light-jacket", label: "Light jacket", packed: false },
      ],
    },
  ],
};

const fallbackSections: PackingSection[] = [
  {
    title: "Clothing",
    items: [
      { id: "general-tops", label: "Tops for each day", packed: false },
      { id: "general-bottoms", label: "Trousers or jeans", packed: false },
      { id: "general-sleepwear", label: "Sleepwear", packed: false },
    ],
  },
];

const toiletrySection: PackingSection = {
  title: "Toiletries",
  items: [
    { id: "toothbrush", label: "Toothbrush & paste", packed: false },
    { id: "deodorant", label: "Deodorant", packed: false },
    { id: "moisturiser", label: "Moisturiser", packed: false },
    { id: "lip-balm", label: "Lip balm", packed: false },
  ],
};

function getBaseSections(tripType: TripType | null): PackingSection[] {
  return [
    ...sharedSections,
    ...(tripType ? tripTypeSections[tripType] : fallbackSections),
    toiletrySection,
  ];
}

function getAllStaticItems(sections: PackingSection[], includeWeatherItems: boolean) {
  return [
    ...(includeWeatherItems ? weatherItems : []),
    ...sections.flatMap((section) => section.items),
  ];
}

function formatTripTitle(stops: Stop[]): string {
  const firstStop = stops[0];
  if (!firstStop) {
    return "Trip packing";
  }
  return `${firstStop.city} city break`;
}

function createInitialItems(sections: PackingSection[], includeWeatherItems: boolean): Record<string, boolean> {
  const allItems = getAllStaticItems(sections, includeWeatherItems);
  return allItems.reduce<Record<string, boolean>>((current, item) => {
    current[item.id] = false;
    return current;
  }, {});
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkCircle, checked && styles.checkCircleChecked]}>
      {checked ? <Ionicons name="checkmark" size={17} color="#fff8ea" /> : null}
    </View>
  );
}

export function BuildListPage({
  onBack,
  onFinish,
  stops,
  tripType,
  weatherAvailable,
}: BuildListPageProps) {
  const baseSections = useMemo(() => getBaseSections(tripType), [tripType]);
  const [packedItems, setPackedItems] = useState(() => createInitialItems(baseSections, weatherAvailable));
  const [customItems, setCustomItems] = useState<PackingItem[]>([]);
  const [customInput, setCustomInput] = useState("");
  const tripTitle = formatTripTitle(stops);

  const totals = useMemo(() => {
    const staticItems = getAllStaticItems(baseSections, weatherAvailable);
    const allItems = [...staticItems, ...customItems];
    const packedCount = allItems.filter((item) => packedItems[item.id]).length;
    return { packedCount, totalCount: allItems.length };
  }, [baseSections, customItems, packedItems, weatherAvailable]);

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
        <Text style={styles.tripLabel}>{tripTitle}</Text>
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
        {weatherAvailable ? (
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
        ) : null}

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
            <Ionicons name="add" size={22} color="#8b7a65" />
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
              <Ionicons name="arrow-up" size={22} color="#fff8ea" />
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
