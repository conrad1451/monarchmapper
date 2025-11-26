// useDefaultDataFetch.ts

import { useCallback } from "react";
import type {
  CoordListProps,
  GeoJsonFeatureCollection,
} from "../utils/dataTypes";

export const useDefaultDataFetch = (
  // Destructure the setter function from the component
  setGeoJSON: (geoJson: GeoJsonFeatureCollection) => void
) => {
  // Use useCallback to memoize the function, making it stable
  const fetchData = useCallback(() => {
    // This is where you would typically make an API call
    // For this example, we'll generate 5 random points.
    const newFeatures = Array.from({ length: 5 }).map((_, index) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        // Generate random long/lat around initial center (-100, 40)
        coordinates: [
          -100 + (Math.random() - 0.5) * 10, // Longitude +/- 5
          40 + (Math.random() - 0.5) * 5, // Latitude +/- 2.5
        ],
      },
      properties: {
        name: `Dynamic Point ${index + 1}`,
      },
    }));

    // Call the setter function passed from the component
    setGeoJSON({
      type: "FeatureCollection",
      features: newFeatures,
    });
  }, [setGeoJSON]); // Dependency array ensures the function is stable unless setGeoJSON changes

  // The hook returns the stable, memoized function
  return fetchData;
};

export const useCustomDataFetch = (
  // Data passed as a prop to the hook
  coordList: CoordListProps[],
  // Setter function passed from the parent component
  setGeoJSON: (geoJson: GeoJsonFeatureCollection) => void
) => {
  // Use useCallback to memoize the function, making it stable
  // The data transformation must happen INSIDE this function.
  const fetchData = useCallback(() => {
    // 1. TRANSFORM the incoming coordList data into GeoJSON Features
    const newFeatures = coordList.map((coord) => {
      // We assume coord is { lat: number, lon: number } from CoordListProps
      return {
        type: "Feature",
        // The original data is not in the coordList here,
        // so we can only store the basic coordinates in properties.
        properties: {
          latitude: coord.lat,
          longitude: coord.lon,
        },
        geometry: {
          type: "Point",
          // GeoJSON convention is [Longitude, Latitude]
          coordinates: [coord.lon, coord.lat],
        },
      };
    });

    // 2. Call the setter function with the correctly structured GeoJSON
    setGeoJSON({
      type: "FeatureCollection",
      features: newFeatures, // <-- Use the converted newFeatures array
    });
  }, [setGeoJSON, coordList]); // Dependency array: Recreate fetchData only if setGeoJSON or coordList changes

  // The hook returns the stable, memoized function
  return fetchData;
};
