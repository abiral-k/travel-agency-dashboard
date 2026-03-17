import React, { useEffect, useMemo, useState } from "react";
import { Header, TripCard } from "~/components";
import type { Route } from "./+types/trips";
import { useSearchParams } from "react-router";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import { PagerComponent } from "@syncfusion/ej2-react-grids";
import type { ShouldRevalidateFunction } from "react-router";
import type { Trip } from "~/types";

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

const Trips = ({}: Route.ComponentProps) => {
  const limit = 8;
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const offset = useMemo(() => (currentPage - 1) * limit, [currentPage]);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const { allTrips, total } = await getAllTrips(limit, offset);
        if (cancelled) return;
        setTrips(
          allTrips.map((doc) => {
            const d = doc as unknown as {
              $id: string;
              tripDetail: string;
              imageUrls?: string[];
            };
            return {
              id: d.$id,
              ...parseTripData(d.tripDetail),
              imageUrls: d.imageUrls ?? [],
            } as Trip;
          }),
        );
        setTotal(total);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [limit, offset]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans"
        ctaText="Create a trip"
        ctaUrl="/trips/create"
      />
      <section>
        <h1 className="p-24-semibold text-dark-100 mb-4">
          Manage Created Trips
        </h1>
        <div className="trip-grid mb-4">
          {isLoading ?
            Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-light-200 bg-white h-[260px] animate-pulse"
              />
            ))
          : trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id.toString()}
                name={trip.name!}
                imageUrls={trip.imageUrls[0]}
                location={trip.itinerary?.[0]?.location ?? ""}
                tags={[trip.interests!, trip.travelStyle!]}
                price={trip.estimatedPrice!}
              />
            ))
          }
        </div>
        <PagerComponent
          totalRecordsCount={total}
          pageSize={limit}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  );
};

export default Trips;
