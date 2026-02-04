// src/hooks/useTableFilters.tsx

// CHQ: Gemini AI generated

import { useState, useMemo } from "react";
// import { SelectChangeEvent } from "@mui/material/Select"; // For Material-UI Select events

import type { RowPage } from "../utils/dataTypes";

// interface Item {
//   value: string;
// }

// const allColumnKeys: Array<keyof RowPage> = [
//   "Name",
//   "Source",
//   "UnitSize",
//   "ServingSize",
//   "Fat",
//   "SatFat",
//   "Sodium",
//   "Protein",
//   "Carbs",
//   "Fiber",
//   "Sugar",
//   "AddedSugar",
//   // "PageURL",
//   // "pageContent",
// ];

// --- Utility Filtering Functions (Can be moved to a separate file like utils/filters.ts) ---

/**
 * Filters RowPage data based on a single selected value for a specified key.
 * @param filterEnabled - Boolean to enable/disable this filter.
 * @param selectedValue - The value to filter by.
 * @param curData - The current array of RowPage objects to filter.
 * @param selection - The key (property name) on which to apply the filter.
 * @returns Filtered array of RowPage objects.
 */
function filterByLocationProperty(
  filterEnabled: boolean,
  selectedValue: string,
  curData: RowPage[],
  selection: "stateProvince" | "county" | "cityOrTown",
): RowPage[] {
  if (filterEnabled && selectedValue !== "") {
    return curData.filter((row) => row[selection] === selectedValue);
  }
  return curData;
}

/**
 * Filters RowPage data based on whether the county property includes the filter text (case-insensitive).
 * @param data - The array of RowPage objects to filter.
 * @param enabled - Boolean to enable/disable this filter.
 * @param filterText - The text to search for in the county property.
 * @returns Filtered array of RowPage objects.
 */
// function filterByCounty(
//   data: RowPage[],
//   enabled: boolean,
//   filterText: string,
// ): RowPage[] {
//   if (enabled && filterText.trim() !== "") {
//     return data.filter((row) =>
//       row.county === null
//         ? ""
//         : row.county.toLowerCase().includes(filterText.toLowerCase()),
//     );
//   }
//   return data;
// }

// --- useTableFilters Custom Hook ---

/**
 * A custom React hook for managing all table filtering logic and state.
 * It takes the raw table data and returns the filtered data, along with
 * filter properties and handler functions to control the filters.
 *
 * @param initialData The initial, unfiltered data in RowPage[] format.
 * @returns An object containing:
 * - filteredData: The RowPage[] array after all filters have been applied.
 * - filterProps: An object containing all the state variables for filters.
 * - filterHandlers: An object containing all the functions to change filter states.
 * - derivedLists: An object containing lists derived from the data for filter options (e.g., tag counts).
 */
export const useTableFilters = (initialData: RowPage[]) => {
  // --- State for Filters ---
  const [pageFilterEnabled, setPageFilterEnabled] = useState(false);
  const [pageFilterText, setPageFilterText] = useState("");

  const [stateFilterEnabled, setStateFilterEnabled] = useState(false);
  const [stateFilterText, setStateFilterText] = useState("");

  const [countyFilterEnabled, setCountyFilterEnabled] = useState(false);
  const [countyFilterText, setCountyFilterText] = useState("");

  const [citytownFilterEnabled, setCitytownFilterEnabled] = useState(false);
  const [citytownFilterText, setCitytownFilterText] = useState("");

  //   const [sourceFilterEnabled, setSourceFilterEnabled] = useState(false);
  //   const [sourceSelected, setSourceSelected] = useState<string>("");

  // --- Filter Handlers ---

  const handlePageFilterToggle = () => {
    setPageFilterEnabled((prev) => !prev);
    setPageFilterText(""); // Clear filter text when toggling off
  };

  const handleStateFilterToggle = () => {
    setStateFilterEnabled((prev) => !prev);
    setStateFilterText(""); // Clear filter text when toggling off
  };

  const handleCountyFilterToggle = () => {
    setCountyFilterEnabled((prev) => !prev);
    setCountyFilterText(""); // Clear filter text when toggling off
  };

  const handleCityTownFilterToggle = () => {
    setCitytownFilterEnabled((prev) => !prev);
    setCitytownFilterText(""); // Clear filter text when toggling off
  };

  //   const handleSourceFilterToggle = () => {
  //     setSourceFilterEnabled((prev) => !prev);
  //   };

  //   const handleSourceChange = (selection: Item | null) => {
  //     setSourceSelected(selection ? selection.value : "");
  //   };

  // --- Reset Functions ---
  const resetPageFilters = () => {
    setPageFilterText("");
    setPageFilterEnabled(false);
  };

  const resetStateFilters = () => {
    setStateFilterText("");
    setStateFilterEnabled(false);
  };

  const resetCountyFilters = () => {
    setCountyFilterText("");
    setCountyFilterEnabled(false);
  };

  const resetCityTownFilters = () => {
    setCitytownFilterText("");
    setCitytownFilterEnabled(false);
  };
  //   const resetSourceFilters = () => setSourceSelected("");

  // --- Memoized Filtered Data ---
  const filteredData = useMemo(() => {
    let currentFilteredData = initialData;

    // // Apply page name filter
    // currentFilteredData = filterByCounty(
    //   currentFilteredData,
    //   pageFilterEnabled,
    //   pageFilterText,
    // );

    // Apply location filter for state
    currentFilteredData = filterByLocationProperty(
      stateFilterEnabled,
      stateFilterText,
      currentFilteredData,
      "stateProvince",
    );

    // Apply location filter for county
    currentFilteredData = filterByLocationProperty(
      countyFilterEnabled,
      countyFilterText,
      currentFilteredData,
      "county",
    );

    // Apply location filter for city/town
    currentFilteredData = filterByLocationProperty(
      citytownFilterEnabled,
      citytownFilterText,
      currentFilteredData,
      "cityOrTown",
    );

    return currentFilteredData;
  }, [initialData, pageFilterEnabled, pageFilterText]);

  return {
    filteredData,
    filterProps: {
      isPageFilterEnabled: pageFilterEnabled,
      pageFilterText,
      isStateFilterEnabled: stateFilterEnabled,
      stateFilterText,
      isCountyFilterEnabled: countyFilterEnabled,
      countyFilterText,
      isCityTownFilterEnabled: citytownFilterEnabled,
      citytownFilterText,
      //   isSourceFilterEnabled: sourceFilterEnabled,
      //   sourceSelected,
    },
    filterHandlers: {
      toggleStateFilter: handleStateFilterToggle,
      setStateFilterText,
      resetStateFilters,

      toggleCountyFilter: handleCountyFilterToggle,
      setCountyFilterEnabled,
      resetCountyFilters,

      toggleCityTownFilter: handleCityTownFilterToggle,
      setCitytownFilterText,
      resetCityTownFilters,

      togglePageFilter: handlePageFilterToggle,
      setPageFilterText,
      resetPageFilters,
      //   resetSourceFilters,
    },
  };
};
