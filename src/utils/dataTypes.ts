// dataTypes.ts
import type { SetStateAction } from "react";
export interface GeoJsonFeatureCollection {
  type: "FeatureCollection";
  features: Array<any>; // Use a more specific type if possible
}

export interface MyMapboxDynamicLayerProps {
  dynamicGeoJson: GeoJsonFeatureCollection;
}

// CHQ: create new interface for sidebar controls
export interface SidebarControlsProps {
  currentMap: string;
  // setMapType is a state setter function for a string state
  setMapType: React.Dispatch<SetStateAction<string>>;
}

export interface RowPage {
  myID: number;
  cityOrTown: string;
  countryCode: string;
  county: string;
  time_only: string;
  date_only: Date;
  day: number;
  day_of_week: number;
  decimalLatitude: number;
  decimalLongitude: number;
  eventDate: Date;
  stateProvince: string;
  week_of_year: number;
  year: number;
  month: string;
  gbifID: string;
}

// export interface MonarchButterflyRecord {
//   id: number;
//   FirstName: string;
//   LastName: string;
//   Email: string;
//   Major: string;
//   // EnrollmentDate: string;
// }

export interface MonarchButterflyRecord {
  id: number;
  cityOrTown: string;
  countryCode: string;
  county: string;
  time_only: string;
  date_only: Date;
  day: number;
  day_of_week: number;
  decimalLatitude: number;
  decimalLongitude: number;
  eventDate: Date;
  stateProvince: string;
  week_of_year: number;
  year: number;
  month: string;
  gbifID: string;
}

export interface Item {
  id: number;
  value: string;
}

export interface DatePickerProps {
  setDate: (date: string) => void;
  // This prop will be used to show the currently selected date, but doesn't manage selection.
  currentDateDisplay: string;
}

export interface SightingDisplayProps {
  sightingDate: string;
}

export interface NavigationButtonsProps {
  navigate: (path: string) => void;
}

export interface CoordListProps {
  lat: number;
  lon: number;
}
