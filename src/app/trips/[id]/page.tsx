import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getForecast } from "@/lib/weather";
import { generatePackingList } from "@/lib/packing-rules";
import { TripDetail } from "@/components/trip-detail";
import type { ChecklistItem, DailyForecast, PackingItem, Trip } from "@/types";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single<Trip>();

  if (!trip) notFound();

  let forecast: DailyForecast[] = [];
  try {
    forecast = await getForecast(
      trip.latitude,
      trip.longitude,
      trip.start_date,
      trip.end_date
    );
  } catch {
    forecast = [];
  }

  const { data: existingPackingItems } = await supabase
    .from("packing_items")
    .select("*")
    .eq("trip_id", trip.id)
    .returns<PackingItem[]>();

  let packingItems = existingPackingItems ?? [];

  if (packingItems.length === 0) {
    const generated = generatePackingList(trip.trip_types, forecast);
    const { data: inserted } = await supabase
      .from("packing_items")
      .insert(
        generated.map((item) => ({
          trip_id: trip.id,
          name: item.name,
          category: item.category,
          is_custom: false,
        }))
      )
      .select()
      .returns<PackingItem[]>();
    packingItems = inserted ?? [];
  }

  const { data: checklistItems } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("trip_id", trip.id)
    .returns<ChecklistItem[]>();

  return (
    <TripDetail
      trip={trip}
      forecast={forecast}
      initialPackingItems={packingItems}
      initialChecklistItems={checklistItems ?? []}
    />
  );
}
