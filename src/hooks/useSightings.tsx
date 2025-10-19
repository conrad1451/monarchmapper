// src/hooks/useSightings.ts
// CHQ: Gemini AI generated this

import { useState, useEffect } from "react";
import type { MonarchButterflyRecord } from "../utils/dataTypes";

interface useSightingsResult {
  sightings: MonarchButterflyRecord[];
  loading: boolean;
  error: string | null;
  refetchSightings: () => void; // Add a refetch function
}

// Ensure VITE_API_URL is set in your .env file (e.g., VITE_API_URL=http://localhost:5000/api/sightings)
// const apiURL = import.meta.env.VITE_API_URL_OTHERHOST;
// const apiURL = import.meta.env.VITE_API_URL + "/api/monarchs";
const apiURL = import.meta.env.VITE_API_URL;

export const useSightings = (): useSightingsResult => {
  const [sightings, setSightings] = useState<MonarchButterflyRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // State to trigger refetch

  const fetchSightings = async () => {
    setLoading(true); // Set loading to true on every fetch attempt
    setError(null); // Clear any previous errors

    if (!apiURL) {
      setError("API URL is not defined in environment variables.");
      setLoading(false);
      console.error("VITE_API_URL is not set.");
      return;
    }

    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MonarchButterflyRecord[] = await response.json();
      setSightings(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch butterflies for timeframe selected:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, [triggerRefetch]); // Re-run effect when triggerRefetch changes

  const refetchSightings = () => {
    setTriggerRefetch((prev) => prev + 1); // Increment to trigger refetch
  };

  return { sightings, loading, error, refetchSightings };
};
