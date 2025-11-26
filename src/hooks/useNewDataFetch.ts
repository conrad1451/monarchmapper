// useNewDataFetch.ts

import { useCallback } from "react";
// CHQ: Gemini AI exported interface
import type { GeoJsonFeatureCollection } from "../utils/dataTypes";

// CHQ: Gemini debugged hook
export const useNewDataFetch = (
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
