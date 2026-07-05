import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/sign-out-button";
import type { Trip } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .order("start_date", { ascending: true })
    .returns<Trip[]>();

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (trips ?? []).filter((t) => t.end_date >= today);
  const past = (trips ?? []).filter((t) => t.end_date < today);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Your trips</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/trips/new" className={buttonVariants()}>
            + New trip
          </Link>
          <SignOutButton />
        </div>
      </div>

      <TripSection title="Upcoming" trips={upcoming} emptyText="No upcoming trips yet." />
      <TripSection title="Past" trips={past} emptyText="No past trips yet." />
    </div>
  );
}

function TripSection({
  title,
  trips,
  emptyText,
}: {
  title: string;
  trips: Trip[];
  emptyText: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-3">{title}</h2>
      {trips.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`}>
              <Card className="hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {trip.destination}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    {trip.start_date} → {trip.end_date}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {trip.trip_types.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
