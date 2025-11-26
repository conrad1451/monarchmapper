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
  // Destructure the setter function from the component
  coordList: CoordListProps[],
  setGeoJSON: (geoJson: GeoJsonFeatureCollection) => void
) => {
  // Use useCallback to memoize the function, making it stable
  const fetchData = useCallback(() => {
    // This is where you would typically make an API call
    // For this example, we'll generate 5 random points.
    // const newFeatures = Array.from({ length: 5 }).map((_, index) => ({
    //   type: "Feature",
    //   geometry: {
    //     type: "Point",
    //     // Generate random long/lat around initial center (-100, 40)
    //     coordinates: [
    //       -100 + (Math.random() - 0.5) * 10, // Longitude +/- 5
    //       40 + (Math.random() - 0.5) * 5, // Latitude +/- 2.5
    //     ],
    //   },
    //   properties: {
    //     name: `Dynamic Point ${index + 1}`,
    //   },
    // }));

    // Call the setter function passed from the component
    setGeoJSON({
      type: "FeatureCollection",
      features: coordList,
      // features: props.coordList,
    });
  }, [setGeoJSON]); // Dependency array ensures the function is stable unless setGeoJSON changes

  // The hook returns the stable, memoized function
  return fetchData;
};
