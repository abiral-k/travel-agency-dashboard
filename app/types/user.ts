export type UserStatus = "user" | "admin";

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  imageUrl: string;
}

export type User = BaseUser;

export interface UserData extends BaseUser {
  itineraryCreated: number | string;
  status: UserStatus;
}

export interface UsersItineraryCount {
  imageUrl: string;
  name: string;
  count: number;
}

