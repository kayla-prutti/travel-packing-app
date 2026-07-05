import type { DailyForecast, TripType } from "@/types";

export interface GeneratedItem {
  name: string;
  category: string;
}

const BASE_ITEMS: GeneratedItem[] = [
  { name: "Passport / ID", category: "Documents" },
  { name: "Phone charger", category: "Electronics" },
  { name: "Toothbrush & toothpaste", category: "Toiletries" },
  { name: "Underwear & socks", category: "Clothing" },
];

const TRIP_TYPE_ITEMS: Record<TripType, GeneratedItem[]> = {
  city: [
    { name: "Comfortable walking shoes", category: "Clothing" },
    { name: "Day bag", category: "Gear" },
    { name: "Portable phone battery", category: "Electronics" },
  ],
  beach: [
    { name: "Swimsuit", category: "Clothing" },
    { name: "Water shoes", category: "Clothing" },
    { name: "Beach towel", category: "Gear" },
    { name: "Sunscreen", category: "Toiletries" },
    { name: "After-sun lotion", category: "Toiletries" },
  ],
  hiking: [
    { name: "Hiking boots", category: "Clothing" },
    { name: "Moisture-wicking socks", category: "Clothing" },
    { name: "Refillable water bottle", category: "Gear" },
    { name: "First aid kit", category: "Gear" },
    { name: "Backpack", category: "Gear" },
  ],
  camping: [
    { name: "Tent", category: "Gear" },
    { name: "Sleeping bag", category: "Gear" },
    { name: "Headlamp / flashlight", category: "Gear" },
    { name: "Portable stove", category: "Gear" },
  ],
  ski: [
    { name: "Thermal base layers", category: "Clothing" },
    { name: "Waterproof gloves", category: "Clothing" },
    { name: "Ski goggles", category: "Gear" },
    { name: "Wool socks", category: "Clothing" },
  ],
  business: [
    { name: "Business attire", category: "Clothing" },
    { name: "Laptop & charger", category: "Electronics" },
    { name: "Business cards", category: "Documents" },
  ],
};

export function generatePackingList(
  tripTypes: TripType[],
  forecast: DailyForecast[]
): GeneratedItem[] {
  const items = new Map<string, GeneratedItem>();

  for (const item of BASE_ITEMS) items.set(item.name, item);
  for (const type of tripTypes) {
    for (const item of TRIP_TYPE_ITEMS[type] ?? []) items.set(item.name, item);
  }

  if (forecast.length > 0) {
    const maxTemps = forecast.map((d) => d.tempMaxC);
    const minTemps = forecast.map((d) => d.tempMinC);
    const anyRain = forecast.some((d) => d.precipitationMm > 0.5);
    const anySnow = forecast.some((d) => d.weatherCode >= 71 && d.weatherCode <= 86);
    const hottestC = Math.max(...maxTemps);
    const coldestC = Math.min(...minTemps);
    const bigSwing = hottestC - coldestC >= 12;

    if (anyRain) {
      items.set("Umbrella", { name: "Umbrella", category: "Weather" });
      items.set("Rain jacket", { name: "Rain jacket", category: "Weather" });
    }
    if (anySnow) {
      items.set("Snow boots", { name: "Snow boots", category: "Weather" });
    }
    if (hottestC >= 27) {
      items.set("Sunglasses", { name: "Sunglasses", category: "Weather" });
      items.set("Sunscreen", { name: "Sunscreen", category: "Toiletries" });
      items.set("Light breathable clothing", { name: "Light breathable clothing", category: "Weather" });
    }
    if (coldestC <= 10) {
      items.set("Warm jacket", { name: "Warm jacket", category: "Weather" });
      items.set("Gloves & beanie", { name: "Gloves & beanie", category: "Weather" });
    }
    if (bigSwing) {
      items.set("Layerable clothing", { name: "Layerable clothing (temp swings expected)", category: "Weather" });
    }
  }

  return Array.from(items.values());
}
