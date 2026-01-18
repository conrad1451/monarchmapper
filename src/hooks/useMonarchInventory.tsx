// CHQ: Gemini AI generated file

// src/hooks/useMonarchInventory.ts

// import { useState, useEffect, useCallback } from "react";
import { useState, useEffect } from "react";

import type { TableNameItem } from "../utils/dataTypes";

/**
 * Custom hook to fetch and manage the monarch data inventory.
 * @param {string} baseUrl - The URL of your Render backend.
 */
// export const useMonarchInventory = (baseUrl: string) => {
export const useMonarchInventory = () => {
  const [inventory, setInventory] = useState<TableNameItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // // Helper to turn "2021-12-01" into "December 1st, 2021"
  // const formatDate = useCallback((dateString) => {
  //   if (!dateString) return "";
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // }, []);

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        // const response = await fetch(
        //   `${baseUrl}/monarchbutterlies/scanneddates`,
        // );
        const response = await fetch(
          baseUrl + "/monarchbutterlies/scanneddates",
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: TableNameItem[] = await response.json();

        // // Optional: Sort by date so the newest scans appear first
        // const sortedData = data.sort(
        //   (a, b) => new Date(b.available_date) - new Date(a.available_date),
        // );

        // setInventory(sortedData);
        setInventory(data);
      } catch (err) {
        // FIX: Check if err is an instance of Error before accessing .message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (baseUrl) {
      fetchInventory();
    }
  }, [baseUrl]);

  // return { inventory, loading, error, formatDate };
  return { inventory, loading, error };
};
