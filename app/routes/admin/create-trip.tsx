import { Header } from "~/components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";
import type { Country, CreateTripResponse, TripFormData } from "~/types";

const COUNTRIES_CACHE_KEY = "countries:v1";
const COUNTRIES_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const CreateTrip = ({}: Route.ComponentProps) => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const readCache = () => {
      try {
        const raw = sessionStorage.getItem(COUNTRIES_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { ts: number; data: Country[] };
        if (!parsed?.ts || !Array.isArray(parsed.data)) return null;
        if (Date.now() - parsed.ts > COUNTRIES_CACHE_TTL_MS) return null;
        return parsed.data;
      } catch {
        return null;
      }
    };

    const writeCache = (data: Country[]) => {
      try {
        sessionStorage.setItem(
          COUNTRIES_CACHE_KEY,
          JSON.stringify({ ts: Date.now(), data }),
        );
      } catch {
        // ignore
      }
    };

    (async () => {
      setCountriesLoading(true);
      const cached = readCache();
      if (cached?.length) {
        if (!cancelled) {
          setCountries(cached);
          setFormData((prev) => ({ ...prev, country: prev.country || cached[0]?.name || "" }));
          setCountriesLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=flag,name,latlng,maps",
        );
        const data = await response.json();
        const mapped: Country[] = data.map((country: any) => ({
          name: country.name.common,
          coordinates: country.latlng,
          value: country.name.common,
          openStreetMap: country.maps?.openStreetMap,
        }));

        writeCache(mapped);
        if (cancelled) return;
        setCountries(mapped);
        setFormData((prev) => ({ ...prev, country: prev.country || mapped[0]?.name || "" }));
      } catch (e) {
        console.error("Failed to load countries", e);
      } finally {
        if (!cancelled) setCountriesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError("Please provide values for all fields");
      setLoading(false);
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days");
      setLoading(false);
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) navigate(`/trips/${result.id}`);
      else console.error("Failed to generate a trip");
    } catch (e) {
      console.error("Error generating trip", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };
  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit AI Generated travel plans"
      />

      <section className="mt-2.5 wrapper-md">
        {countriesLoading ?
          <div className="trip-form animate-pulse">
            <div>
              <div className="h-4 w-24 rounded bg-light-300" />
              <div className="h-11 w-full rounded-xl bg-light-300" />
            </div>
            <div>
              <div className="h-4 w-24 rounded bg-light-300" />
              <div className="h-11 w-full rounded-xl bg-light-300" />
            </div>
            <div>
              <div className="h-4 w-32 rounded bg-light-300" />
              <div className="h-11 w-full rounded-xl bg-light-300" />
            </div>
            <div>
              <div className="h-4 w-32 rounded bg-light-300" />
              <div className="h-11 w-full rounded-xl bg-light-300" />
            </div>
            <div>
              <div className="h-4 w-32 rounded bg-light-300" />
              <div className="h-11 w-full rounded-xl bg-light-300" />
            </div>
            <div>
              <div className="h-4 w-32 rounded bg-light-300" />
              <div className="h-11 w-full rounded-xl bg-light-300" />
            </div>
            <div>
              <div className="h-4 w-48 rounded bg-light-300" />
              <div className="h-[260px] w-full rounded-xl bg-light-300" />
            </div>
          </div>
        : <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query),
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    })),
                );
              }}
            />
          </div>

          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="Enter a number of days"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>

              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();

                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      })),
                  );
                }}
                className="combo-box"
              />
            </div>
          ))}

          <div>
            <label htmlFor="location">Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="bg-gray-200 h-px w-full" />

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class h-12! w-full!"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>}
      </section>
    </main>
  );
};

export default CreateTrip;
