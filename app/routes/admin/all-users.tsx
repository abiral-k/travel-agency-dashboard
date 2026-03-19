import { Header } from "~/components";
import {
  ColumnsDirective,
  ColumnDirective,
  GridComponent,
  PagerComponent,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";
import type { UserData } from "~/types";
import { useLoaderData, useSearchParams } from "react-router";
import { useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const LIMIT = 10;

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const offset = (page - 1) * LIMIT;
  const { users, total } = await getAllUsers(LIMIT, offset, search);
  return { users: users as unknown as UserData[], total, search };
};

const AllUsers = ({}: Route.ComponentProps) => {
  const { users, total, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  // Local state just to keep the input responsive while debounce is pending
  const [searchInput, setSearchInput] = useState(search);

  // Debounce so the loader doesn't fire on every keystroke
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchParams({ page: "1", ...(value ? { search: value } : {}) });
  }, 300);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), ...(search ? { search } : {}) });
  };

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and manage users"
      />

      <div className="flex flex-col gap-2 mb-1">
        <input
          type="text"
          placeholder="Search by name across all users..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearch(e.target.value);
          }}
          className="px-4 py-2 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="min-h-[20px]">
          {search && (
            <p className="text-sm text-gray-100">
              Found {total} user{total !== 1 ? "s" : ""} for "{search}"
            </p>
          )}
        </div>
      </div>

      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: UserData) => (
              <div className="flex items-center gap-1.5 px-4">
                <img
                  src={props.imageUrl || "/assets/icons/default-avatar.svg"}
                  alt={props.name ?? "user"}
                  className="rounded-full size-8 aspect-square"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/assets/icons/default-avatar.svg";
                  }}
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
      </GridComponent>

      <PagerComponent
        totalRecordsCount={total}
        pageSize={LIMIT}
        currentPage={currentPage}
        click={(args) => handlePageChange(args.currentPage)}
        cssClass="!mb-4"
      />
    </main>
  );
};

export default AllUsers;
