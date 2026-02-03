// useTableFilters.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableFilters } from "../../src/hooks/useTableFilters"; // Adjust path as needed
// import { SelectChangeEvent } from "@mui/material/Select"; // For Material-UI Select events

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- Interfaces

interface RowPage {
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

// --- Mock Data ---

const mockRowPages: RowPage[] = [
  {
    myID: 0,
    cityOrTown: "Hamden",
    countryCode: "US",
    county: "New Haven",
    time_only: "08:20:34",
    date_only: new Date("2021-12-15"),
    day: 15,
    day_of_week: 2, // Wednesday
    decimalLatitude: 41.3839,
    decimalLongitude: -72.9026,
    eventDate: new Date("2021-12-15T08:20:34"),
    stateProvince: "Connecticut",
    week_of_year: 50,
    year: 2021,
    month: MONTHS[12 - 1],
    gbifID: "3455383967",
  },
  {
    myID: 1,
    cityOrTown: "New York City",
    countryCode: "US",
    county: "Bronx County",
    time_only: "08:20:34",
    date_only: new Date("2022-07-22"),
    day: 22,
    day_of_week: 4, // Friday
    decimalLatitude: 40.8448,
    decimalLongitude: -73.8648,
    eventDate: new Date("2022-07-22T08:20:34"),
    stateProvince: "New York",
    week_of_year: 29,
    year: 2022,
    month: MONTHS[7 - 1],
    gbifID: "3455383968",
  },
  {
    myID: 2,
    cityOrTown: "Austin",
    countryCode: "US",
    county: "Travis County",
    time_only: "18:40:34",
    date_only: new Date("2022-05-14"),
    day: 14,
    day_of_week: 5, // Saturday
    decimalLatitude: 30.2672,
    decimalLongitude: -97.7431,
    eventDate: new Date("2022-05-14T18:40:34"),
    stateProvince: "Texas",
    week_of_year: 19,
    year: 2022,
    month: MONTHS[5 - 1],
    gbifID: "3455383969",
  },
  {
    myID: 3,
    cityOrTown: "San Francisco",
    countryCode: "US",
    county: "San Francisco",
    time_only: "12:15:00",
    date_only: new Date("2021-11-06"),
    day: 6,
    day_of_week: 5,
    decimalLatitude: 37.7749,
    decimalLongitude: -122.4194,
    eventDate: new Date("2021-11-06T12:15:00"),
    stateProvince: "California",
    week_of_year: 44,
    year: 2021,
    month: MONTHS[11 - 1],
    gbifID: "3455383970",
  },
  {
    myID: 4,
    cityOrTown: "Miami",
    countryCode: "US",
    county: "Miami-Dade",
    time_only: "14:30:00",
    date_only: new Date("2021-11-08"),
    day: 8,
    day_of_week: 0,
    decimalLatitude: 25.7617,
    decimalLongitude: -80.1918,
    eventDate: new Date("2021-11-08T14:30:00"),
    stateProvince: "Florida",
    week_of_year: 45,
    year: 2021,
    month: MONTHS[11 - 1],
    gbifID: "3455383971",
  },
  {
    myID: 5,
    cityOrTown: "Seattle",
    countryCode: "US",
    county: "King",
    time_only: "09:00:00",
    date_only: new Date("2022-08-10"),
    day: 10,
    day_of_week: 2,
    decimalLatitude: 47.6062,
    decimalLongitude: -122.3321,
    eventDate: new Date("2022-08-10T09:00:00"),
    stateProvince: "Washington",
    week_of_year: 32,
    year: 2022,
    month: MONTHS[8 - 1],
    gbifID: "3455383972",
  },
  {
    myID: 6,
    cityOrTown: "Chicago",
    countryCode: "US",
    county: "Cook",
    time_only: "16:20:00",
    date_only: new Date("2022-09-01"),
    day: 1,
    day_of_week: 3,
    decimalLatitude: 41.8781,
    decimalLongitude: -87.6298,
    eventDate: new Date("2022-09-01T16:20:00"),
    stateProvince: "Illinois",
    week_of_year: 35,
    year: 2022,
    month: MONTHS[9 - 1],
    gbifID: "3455383973",
  },
  {
    myID: 7,
    cityOrTown: "Denver",
    countryCode: "US",
    county: "Denver",
    time_only: "11:45:10",
    date_only: new Date("2022-06-20"),
    day: 20,
    day_of_week: 0,
    decimalLatitude: 39.7392,
    decimalLongitude: -104.9903,
    eventDate: new Date("2022-06-20T11:45:10"),
    stateProvince: "Colorado",
    week_of_year: 25,
    year: 2022,
    month: MONTHS[6 - 1],
    gbifID: "3455383974",
  },
];

describe("useTableFilters", () => {
  // Test Case 1: Initial state
  it("should initialize all filters to their default off/empty states", () => {
    const { result } = renderHook(() => useTableFilters(mockRowPages));

    expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
    expect(result.current.filterProps.pageFilterText).toBe("");

    // Initially, filteredData should be all initialData
    expect(result.current.filteredData.length).toBe(mockRowPages.length);
    expect(result.current.filteredData).toEqual(mockRowPages);
  });

  // Test Case 2: Page Name Filter
  describe("Page Name Filter", () => {
    it("should filter by page name when enabled and text is provided", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        result.current.filterHandlers.togglePageFilter(); // Enable
        result.current.filterHandlers.setPageFilterText("frontend");
      });

      expect(result.current.filterProps.isPageFilterEnabled).toBe(true);
      expect(result.current.filterProps.pageFilterText).toBe("frontend");
      expect(result.current.filteredData.length).toBe(1);
    });

    it("should ignore filter when disabled", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      // Enable and set text, then disable
      act(() => {
        result.current.filterHandlers.togglePageFilter();
        result.current.filterHandlers.setPageFilterText("backend");
        result.current.filterHandlers.togglePageFilter(); // Disable
      });

      expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
      expect(result.current.filterProps.pageFilterText).toBe(""); // Should be reset
      expect(result.current.filteredData.length).toBe(mockRowPages.length); // Should show all data
    });

    // CHQ: Gemini AI claimed this test was redundant
    // it("should reset page filter text when toggled off", () => {
    //   const { result } = renderHook(() => useTableFilters(mockRowPages));

    //   act(() => {
    //     result.current.filterHandlers.togglePageFilter();
    //     result.current.filterHandlers.setPageFilterText("engineer");
    //   });
    //   expect(result.current.filterProps.pageFilterText).toBe("engineer");

    //   act(() => {
    //     result.current.filterHandlers.togglePageFilter(); // Toggle off
    //   });
    //   expect(result.current.filterProps.pageFilterText).toBe("");
    //   expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
    //   expect(result.current.filteredData.length).toBe(mockRowPages.length);
    // });

    it("should reset page filter using resetPageFilters handler", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        result.current.filterHandlers.togglePageFilter();
        result.current.filterHandlers.setPageFilterText("dev");
      });
      expect(result.current.filterProps.pageFilterText).toBe("dev");
      expect(result.current.filterProps.isPageFilterEnabled).toBe(true);
      expect(result.current.filteredData.length).toBe(2); // Backend Developer, DevOps Engineer

      act(() => {
        result.current.filterHandlers.resetPageFilters();
      });
      expect(result.current.filterProps.pageFilterText).toBe("");
      expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
      expect(result.current.filteredData.length).toBe(mockRowPages.length);
    });
  });

  // Test Case 6: Combined Filters
  describe("Combined Filters", () => {
    it("should apply multiple filters simultaneously", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        // Page name filter
        result.current.filterHandlers.togglePageFilter();
        result.current.filterHandlers.setPageFilterText("engineer"); // Frontend, Backend, QA, DevOps

        // x filter:

        // y filter:
      });

      expect(result.current.filteredData.length).toBe(1); // Still Frontend Engineer

      expect(result.current.filteredData.length).toBe(0); // No job has "Frontend" AND "React" AND "TypeScript" AND "Node.js"
    });

    it("should correctly reset all filters by calling individual reset handlers", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        // Apply various filters
        result.current.filterHandlers.togglePageFilter();
        result.current.filterHandlers.setPageFilterText("e");
      });

      // Verify filters are applied
      expect(result.current.filteredData.length).toBeLessThan(
        mockRowPages.length,
      );

      act(() => {
        // Reset all filters individually
        result.current.filterHandlers.resetPageFilters();
      });

      // All data should be visible again
      expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
      expect(result.current.filterProps.pageFilterText).toBe("");
      expect(result.current.filteredData.length).toBe(mockRowPages.length);
      expect(result.current.filteredData).toEqual(mockRowPages);
    });
  });
});
