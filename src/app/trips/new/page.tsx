"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { geocodeDestination } from "@/lib/weather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TRIP_TYPES, type TripType } from "@/types";

export default function NewTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripTypes, setTripTypes] = useState<TripType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleType(type: TripType) {
    setTripTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (tripTypes.length === 0) {
      setError("Pick at least one trip type.");
      return;
    }
    if (endDate < startDate) {
      setError("Return date must be after the depart date.");
      return;
    }

    setLoading(true);
    const geo = await geocodeDestination(destination);
    if (!geo) {
      setLoading(false);
      setError("Couldn't find that destination. Try a city name, e.g. 'Lisbon, Portugal'.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: trip, error: insertError } = await supabase
      .from("trips")
      .insert({
        user_id: user!.id,
        destination: `${geo.name}${geo.admin1 ? ", " + geo.admin1 : ""}, ${geo.country}`,
        latitude: geo.latitude,
        longitude: geo.longitude,
        start_date: startDate,
        end_date: endDate,
        trip_types: tripTypes,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError || !trip) {
      setError(insertError?.message ?? "Something went wrong creating the trip.");
      return;
    }

    router.push(`/trips/${trip.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-lg flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Plan a new trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g. Lisbon, Portugal"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="start_date">Depart date</Label>
                <Input
                  id="start_date"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="end_date">Return date</Label>
                <Input
                  id="end_date"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Trip type (pick all that apply)</Label>
              <div className="grid grid-cols-2 gap-2">
                {TRIP_TYPES.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={tripTypes.includes(value)}
                      onCheckedChange={() => toggleType(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
