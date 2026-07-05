"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { describeWeatherCode } from "@/lib/weather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChecklistItem, DailyForecast, PackingItem, Trip } from "@/types";

export function TripDetail({
  trip,
  forecast,
  initialPackingItems,
  initialChecklistItems,
}: {
  trip: Trip;
  forecast: DailyForecast[];
  initialPackingItems: PackingItem[];
  initialChecklistItems: ChecklistItem[];
}) {
  const [packingItems, setPackingItems] = useState(initialPackingItems);
  const [checklistItems, setChecklistItems] = useState(initialChecklistItems);
  const [newPackingItem, setNewPackingItem] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const isPast = trip.end_date < today;

  const packingByCategory = useMemo(() => groupBy(packingItems, (i) => i.category), [packingItems]);

  const visitedCount = checklistItems.filter((c) => c.is_visited).length;

  async function togglePackingItem(item: PackingItem) {
    const supabase = createClient();
    setPackingItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_checked: !i.is_checked } : i))
    );
    await supabase
      .from("packing_items")
      .update({ is_checked: !item.is_checked })
      .eq("id", item.id);
  }

  async function addPackingItem() {
    if (!newPackingItem.trim()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("packing_items")
      .insert({
        trip_id: trip.id,
        name: newPackingItem.trim(),
        category: "Custom",
        is_custom: true,
      })
      .select()
      .single<PackingItem>();
    if (data) setPackingItems((prev) => [...prev, data]);
    setNewPackingItem("");
  }

  async function toggleChecklistItem(item: ChecklistItem) {
    const supabase = createClient();
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_visited: !i.is_visited } : i))
    );
    await supabase
      .from("checklist_items")
      .update({ is_visited: !item.is_visited })
      .eq("id", item.id);
  }

  async function addChecklistItem() {
    if (!newChecklistItem.trim()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("checklist_items")
      .insert({ trip_id: trip.id, name: newChecklistItem.trim() })
      .select()
      .single<ChecklistItem>();
    if (data) setChecklistItems((prev) => [...prev, data]);
    setNewChecklistItem("");
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 p-6">
      <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
        ← Back to trips
      </Link>
      <div className="mt-2 mb-6">
        <h1 className="text-2xl font-semibold">{trip.destination}</h1>
        <p className="text-sm text-muted-foreground">
          {trip.start_date} → {trip.end_date}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {trip.trip_types.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {isPast && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trip summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              You visited <strong>{visitedCount}</strong> of{" "}
              <strong>{checklistItems.length}</strong> must-visit spots on your list
              {checklistItems.length > 0 &&
                ` (${Math.round((visitedCount / checklistItems.length) * 100)}%)`}
              .
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="weather">
        <TabsList>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="packing">Packing</TabsTrigger>
          <TabsTrigger value="checklist">Must-visit</TabsTrigger>
        </TabsList>

        <TabsContent value="weather">
          {forecast.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">
              No forecast yet — Open-Meteo only provides forecasts about 16 days out.
              Check back closer to your trip.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3">
              {forecast.map((day) => (
                <Card key={day.date}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">{day.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {describeWeatherCode(day.weatherCode)}
                    </p>
                    <p className="text-sm mt-1">
                      {Math.round(day.tempMinC)}° – {Math.round(day.tempMaxC)}°C
                    </p>
                    {day.precipitationMm > 0.5 && (
                      <p className="text-xs text-muted-foreground">
                        {day.precipitationMm.toFixed(1)}mm precipitation
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="packing">
          <div className="mt-4 flex flex-col gap-6">
            {Object.entries(packingByCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={item.is_checked}
                        onCheckedChange={() => togglePackingItem(item)}
                      />
                      <span className={item.is_checked ? "line-through text-muted-foreground" : ""}>
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Add an item…"
                value={newPackingItem}
                onChange={(e) => setNewPackingItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPackingItem()}
              />
              <Button onClick={addPackingItem}>Add</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <div className="mt-4 flex flex-col gap-2">
            {checklistItems.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add the must-visit places or activities for this trip.
              </p>
            )}
            {checklistItems.map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={item.is_visited}
                  onCheckedChange={() => toggleChecklistItem(item)}
                />
                <span className={item.is_visited ? "line-through text-muted-foreground" : ""}>
                  {item.name}
                </span>
              </label>
            ))}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="e.g. Belém Tower"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
              />
              <Button onClick={addChecklistItem}>Add</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
