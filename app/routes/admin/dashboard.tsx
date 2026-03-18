import { Header, StatsCard, TripCard } from "~/components";
import {
  StatsCardSkeleton,
  TripCardSkeleton,
  CardSkeleton,
} from "~/components/ui/skeletons";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
} from "@syncfusion/ej2-react-grids";
import type { ShouldRevalidateFunction } from "react-router";
import { useRouteLoaderData } from "react-router";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import type {
  DashboardStats,
  Trip,
  TripsInterest,
  User,
  UserData,
  UsersItineraryCount,
} from "~/types";

const DashboardCharts = React.lazy(
  () => import("~/components/DashboardCharts"),
);

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

type DashboardClientData = {
  dashboardStats: DashboardStats;
  allTrips: Trip[];
  userGrowth: { day: string; count: number }[];
  tripsByTravelStyle: { travelStyle: string; count: number }[];
  allUsers: UsersItineraryCount[];
};

const Dashboard = ({}: Route.ComponentProps) => {
  const layoutUserDoc = useRouteLoaderData(
    "routes/admin/admin-layout",
  ) as unknown as {
    $id?: string;
    name?: string;
    email?: string;
    imageUrl?: string | null;
    joinedAt?: string;
  } | null;

  const user: User | null =
    layoutUserDoc ?
      {
        id: layoutUserDoc.$id ?? "",
        name: layoutUserDoc.name ?? "",
        email: layoutUserDoc.email ?? "",
        imageUrl: layoutUserDoc.imageUrl ?? "",
        dateJoined: layoutUserDoc.joinedAt ?? "",
      }
    : null;

  const [data, setData] = useState<DashboardClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);

        const [
          dashboardStats,
          trips,
          userGrowth,
          tripsByTravelStyle,
          allUsers,
        ] = await Promise.all([
          getUsersAndTripsStats(),
          getAllTrips(4, 0),
          getUserGrowthPerDay(),
          getTripsByTravelStyle(),
          getAllUsers(4, 0),
        ]);

        const allTrips = trips.allTrips.map((doc) => {
          const d = doc as unknown as {
            $id: string;
            tripDetail: string;
            imageUrls?: string[];
          };

          return {
            id: d.$id,
            ...parseTripData(d.tripDetail),
            imageUrls: d.imageUrls ?? [],
          };
        });

        const mappedUsers: UsersItineraryCount[] = allUsers.users.map(
          (user) => {
            const u = user as unknown as {
              imageUrl?: string;
              name?: string;
              itineraryCount?: number;
            };

            return {
              imageUrl: u.imageUrl ?? "",
              name: u.name ?? "",
              count: u.itineraryCount ?? Math.floor(Math.random() * 10),
            };
          },
        );

        if (cancelled) return;
        setData({
          dashboardStats,
          allTrips: allTrips as Trip[],
          userGrowth,
          tripsByTravelStyle,
          allUsers: mappedUsers,
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const tripsMapped: TripsInterest[] = useMemo(() => {
    if (!data) return [];
    return data.allTrips.map((trip) => ({
      imageUrl: trip.imageUrls[0] ?? "",
      name: trip.name ?? "",
      interest: trip.interests ?? "",
    }));
  }, [data]);

  const usersAndTrips = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "Latest user signups",
        dataSource: data.allUsers,
        field: "count",
        headerText: "Trips created",
      },
      {
        title: "Trips based on interests",
        dataSource: tripsMapped,
        field: "interest",
        headerText: "Interests",
      },
    ];
  }, [data, tripsMapped]);

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.name ?? "Guest"} 👋`}
        description="Track activity, trends and popular destinations in real time"
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {data ?
            <>
              <StatsCard
                headerTitle="Total Users"
                total={data.dashboardStats.totalUsers}
                currentMonthCount={data.dashboardStats.usersJoined.currentMonth}
                lastMonthCount={data.dashboardStats.usersJoined.lastMonth}
              />
              <StatsCard
                headerTitle="Total Trips"
                total={data.dashboardStats.totalTrips}
                currentMonthCount={
                  data.dashboardStats.tripsCreated.currentMonth
                }
                lastMonthCount={data.dashboardStats.tripsCreated.lastMonth}
              />
              <StatsCard
                headerTitle="Active Users"
                total={data.dashboardStats.userRole.total}
                currentMonthCount={data.dashboardStats.userRole.currentMonth}
                lastMonthCount={data.dashboardStats.userRole.lastMonth}
              />
            </>
          : <>
              <StatsCardSkeleton label="Total Users" />
              <StatsCardSkeleton label="Total Trips" />
              <StatsCardSkeleton label="Active Users" />
            </>
          }
        </div>
      </section>
      <section className="container">
        <h1 className="text-xl font-semibold text-dark-100">Created Trips</h1>

        <div className="trip-grid">
          {data ?
            data.allTrips.map((trip) => (
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
          : Array.from({ length: 4 }).map((_, i) => (
              <TripCardSkeleton key={i} />
            ))
          }
        </div>
      </section>

      <Suspense
        fallback={
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CardSkeleton height="h-[320px]" />
            <CardSkeleton height="h-[320px]" />
          </section>
        }
      >
        {data ?
          <DashboardCharts
            userGrowth={data.userGrowth}
            tripsByTravelStyle={data.tripsByTravelStyle}
          />
        : <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CardSkeleton height="h-[320px]" />
            <CardSkeleton height="h-[320px]" />
          </section>
        }
      </Suspense>

      <section className="user-trip wrapper">
        {data ?
          usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
            <div key={i} className="flex flex-col gap-5">
              <h3 className="p-20-semibold text-dark-100">{title}</h3>

              <GridComponent dataSource={dataSource} gridLines="None">
                <ColumnsDirective>
                  <ColumnDirective
                    field="name"
                    headerText="Name"
                    width="200"
                    textAlign="Left"
                    template={(props: UserData) => (
                      <div className="flex items-center gap-1.5 px-4">
                        <img
                          src={props.imageUrl}
                          alt="user"
                          className="rounded-full size-8 aspect-square"
                          referrerPolicy="no-referrer"
                        />
                        <span>{props.name}</span>
                      </div>
                    )}
                  />

                  <ColumnDirective
                    field={field}
                    headerText={headerText}
                    width="150"
                    textAlign="Left"
                  />
                </ColumnsDirective>
              </GridComponent>
            </div>
          ))
        : <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CardSkeleton height="h-[360px]" />
            <CardSkeleton height="h-[360px]" />
          </div>
        }
      </section>
    </main>
  );
};
export default Dashboard;
