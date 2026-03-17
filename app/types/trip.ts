export interface Activity {
  time: string;
  description: string;
}

export interface DayPlan {
  day: number;
  location: string;
  activities: Activity[];
}

export interface Location {
  city: string;
  coordinates: [number, number];
  openStreetMap: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  estimatedPrice: string;
  duration: number;
  budget: string;
  travelStyle: string;
  interests: string;
  groupType: string;
  country: string;
  imageUrls: string[];
  itinerary: DayPlan[];
  bestTimeToVisit: string[];
  weatherInfo: string[];
  location: Location;
  payment_link: string;
}

export interface TripCardProps {
  id: string;
  name: string;
  location: string;
  imageUrls: string;
  tags: string[];
  price: string;
}

export interface TripsInterest {
  imageUrl: string;
  name: string;
  interest: string;
}

export interface TripFormData {
  country: string;
  travelStyle: string;
  interest: string;
  budget: string;
  duration: number;
  groupType: string;
}

