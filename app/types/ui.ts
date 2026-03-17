import type { Country, DropdownItem } from "./geo";
import type { TripFormData } from "./trip";

export interface SelectProps {
  data: Country[] | DropdownItem[];
  onValueChange: (value: string) => void;
  id: string;
  label: string;
  placeholder: string;
}

export interface PillProps {
  text: string;
  bgColor?: string;
  textColor?: string;
}

export interface StatsCardProps {
  headerTitle: string;
  total: number;
  lastMonthCount: number;
  currentMonthCount: number;
}

export interface DestinationProps {
  containerClass?: string;
  bigCard?: boolean;
  activityCount: number;
  rating: number;
  bgImage: string;
  title: string;
}

export interface InfoPillProps {
  text: string;
  image: string;
}

export const selectItems = [
  "groupType",
  "travelStyle",
  "interest",
  "budget",
] as (keyof TripFormData)[];

