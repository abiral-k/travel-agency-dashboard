import { Header } from "~/components";
import {
  ColumnsDirective,
  ColumnDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import type { ShouldRevalidateFunction } from "react-router";
import type { UserData } from "~/types";
import React, { useEffect, useState } from "react";

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

const AllUsers = ({}: Route.ComponentProps) => {
  const UsersTableSkeleton = () => (
    <section className="rounded-xl border border-light-200 bg-white shadow-100 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-light-200 flex items-center justify-between">
        <div className="h-5 w-40 rounded bg-light-300" />
        <div className="h-9 w-28 rounded-lg bg-light-300" />
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* header row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 h-4 rounded bg-light-300" />
          <div className="col-span-4 h-4 rounded bg-light-300" />
          <div className="col-span-2 h-4 rounded bg-light-300" />
          <div className="col-span-2 h-4 rounded bg-light-300" />
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 items-center py-3 border-b border-light-200 last:border-b-0"
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="size-8 rounded-full bg-light-300" />
              <div className="h-4 w-40 rounded bg-light-300" />
            </div>
            <div className="col-span-4 h-4 w-56 rounded bg-light-300" />
            <div className="col-span-2 h-4 w-24 rounded bg-light-300" />
            <div className="col-span-2">
              <div className="h-6 w-20 rounded-2xl bg-light-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const { users } = await getAllUsers(10, 0);
        if (cancelled) return;
        setUsers(users as unknown as UserData[]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed user profiles"
      />

      {isLoading ?
        <UsersTableSkeleton />
      : <GridComponent dataSource={users} gridLines="None">
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
            field="email"
            headerText="Email Address"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="140"
            textAlign="Left"
            template={({ joinedAt }: { joinedAt: string }) =>
              formatDate(joinedAt)
            }
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-success-50" : "bg-light-300",
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-success-500" : "bg-gray-500",
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    status === "user" ? "text-success-700" : "text-gray-500",
                  )}
                >
                  {status}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>}
    </main>
  );
};
export default AllUsers;
