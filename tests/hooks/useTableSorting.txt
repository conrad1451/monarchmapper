// useTableSorting.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableSorting } from "../../src/hooks/useTableSorting"; // Adjust path as needed

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

type SortableTableColumns = "cityOrTown" | "stateProvince" | "county";

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

describe("useTableSorting", () => {
  // Test Case 1: Initial state
  it("should initialize with no active sort and return data in original order", () => {
    const { result } = renderHook(() => useTableSorting(mockRowPages));

    expect(result.current.sortProps.sortDirection).toBeNull();

    // Verify that the sortedData is initially the same as the input filteredData
    expect(result.current.sortedData).toEqual(mockRowPages);
  });

  // Test Case 2: Name Sorting
  describe("Name Sorting", () => {
    it("should sort by Name in ascending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleSort(colName as SortableTableColumns);
      });

      expect(result.current.sortProps.sortColumn).toBe("cityOrTown");
      // Check that other sorts are reset

      // // Expected order: Analyst, Backend Developer, Frontend Engineer, Missing Dates Job, QA Engineer, Zookeeper
      // const expectedNames = [
      //   "Analyst",
      //   "Backend Developer",
      //   "Frontend Engineer",
      //   "Missing Dates Job",
      //   "QA Engineer",
      //   "Zookeeper",
      // ];
      // expect(result.current.sortedData.map((row) => row.Name)).toEqual(
      //   expectedNames,
      // );
    });

    it("should sort by Name in descending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleSort("cityOrTown");
      });

      expect(result.current.sortProps.sortDirection).toBe("desc");
      // const expectedNames = [
      //   "Zookeeper",
      //   "QA Engineer",
      //   "Missing Dates Job",
      //   "Frontend Engineer",
      //   "Backend Developer",
      //   "Analyst",
      // ];
      // expect(result.current.sortedData.map((row) => row.eventDate)).toEqual(
      //   expectedNames,
      // );
    });
    // "should reset Name sort"
  });

  // Test Case 3: DateFound Sorting
  describe("DateFound Sorting", () => {
    it("should sort by DateFound in ascending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDateFoundSort("asc");
      });

      expect(result.current.sortProps.sortDirectionDateFound).toBe("asc");
      expect(result.current.sortProps.sortDirectionName).toBeNull(); // Ensure other sorts are reset
      expect(result.current.sortProps.sortDirectionDayPosted).toBeNull();

      // Expected order: Zookeeper (01/01), Frontend Engineer (01/10), QA Engineer (01/08), Backend Developer (01/12), Analyst (01/15), Missing Dates Job (null)
      // Note: QA Engineer (01/08) comes before Backend Developer (01/12) because 01/08 < 01/12.
      // Missing Dates Job (null) should be last due to -Infinity handling.
      const expectedNames = [
        "Zookeeper", // 2024-01-01
        "QA Engineer", // 2024-01-08 (Same day as Backend, but lower ID in mock, order might depend on stability)
        "Backend Developer", // 2024-01-08
        "Frontend Engineer", // 2024-01-10
        "Analyst", // 2024-01-12
        "Missing Dates Job", // null dates sort last
      ];
      // Due to the tie in DateFound for QA Engineer and Backend Developer (both Jan 8th), and no secondary sort,
      // the order between them might depend on the JS sort stability.
      // Let's refine the expected order based on stable sort:
      const sortedByDateFound = [...mockRowPages].sort((a, b) => {
        const dateA =
          a.DateFound instanceof Date ? a.DateFound.getTime() : -Infinity;
        const dateB =
          b.DateFound instanceof Date ? b.DateFound.getTime() : -Infinity;
        return dateA - dateB;
      });

      expect(result.current.sortedData.map((row) => row.Name)).toEqual(
        sortedByDateFound.map((row) => row.Name),
      );
    });

    it("should sort by DateFound in descending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDateFoundSort("desc");
      });

      expect(result.current.sortProps.sortDirectionDateFound).toBe("desc");

      const sortedByDateFoundDesc = [...mockRowPages]
        .sort((a, b) => {
          const dateA =
            a.DateFound instanceof Date ? a.DateFound.getTime() : -Infinity;
          const dateB =
            b.DateFound instanceof Date ? b.DateFound.getTime() : -Infinity;
          return dateB - dateA; // Sort descending
        })
        .filter((row) => row.DateFound !== null); // Filter out null dates for explicit comparison first

      const missingDatesJob = mockRowPages.find(
        (row) => row.Name === "Missing Dates Job",
      );
      let expectedNamesDesc = sortedByDateFoundDesc.map((row) => row.Name);
      if (missingDatesJob) {
        expectedNamesDesc = [...expectedNamesDesc, missingDatesJob.Name]; // Nulls go last in descending too
      }

      expect(result.current.sortedData.map((row) => row.Name)).toEqual(
        expectedNamesDesc,
      );
    });

    it("should reset DateFound sort", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDateFoundSort("asc");
      });
      expect(result.current.sortProps.sortDirectionDateFound).toBe("asc");

      act(() => {
        result.current.sortHandlers.resetDateFoundSort();
      });
      expect(result.current.sortProps.sortDirectionDateFound).toBeNull();
      expect(result.current.sortedData).toEqual(mockRowPages);
    });
  });

  // Test Case 4: DayPosted Sorting
  describe("DayPosted Sorting", () => {
    it("should sort by DayPosted in ascending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDayPostedSort("asc");
      });

      expect(result.current.sortProps.sortDirectionDayPosted).toBe("asc");
      expect(result.current.sortProps.sortDirectionName).toBeNull();
      expect(result.current.sortProps.sortDirectionDateFound).toBeNull();

      // Expected order: Zookeeper (12/25), Frontend (01/05), QA (01/06), Data Scientist (01/07), Backend (01/08), Analyst (01/10), Missing Dates (null)
      const sortedByDayPosted = [...mockRowPages].sort((a, b) => {
        const dateA =
          a.DayPosted instanceof Date ? a.DayPosted.getTime() : -Infinity;
        const dateB =
          b.DayPosted instanceof Date ? b.DayPosted.getTime() : -Infinity;
        return dateA - dateB;
      });
      expect(result.current.sortedData.map((row) => row.Name)).toEqual(
        sortedByDayPosted.map((row) => row.Name),
      );
    });

    it("should sort by DayPosted in descending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDayPostedSort("desc");
      });

      expect(result.current.sortProps.sortDirectionDayPosted).toBe("desc");

      const sortedByDayPostedDesc = [...mockRowPages]
        .sort((a, b) => {
          const dateA =
            a.DayPosted instanceof Date ? a.DayPosted.getTime() : -Infinity;
          const dateB =
            b.DayPosted instanceof Date ? b.DayPosted.getTime() : -Infinity;
          return dateB - dateA; // Sort descending
        })
        .filter((row) => row.DayPosted !== null);

      const missingDatesJob = mockRowPages.find(
        (row) => row.Name === "Missing Dates Job",
      );
      let expectedNamesDesc = sortedByDayPostedDesc.map((row) => row.Name);
      if (missingDatesJob) {
        expectedNamesDesc = [...expectedNamesDesc, missingDatesJob.Name]; // Nulls go last in descending too
      }
      expect(result.current.sortedData.map((row) => row.Name)).toEqual(
        expectedNamesDesc,
      );
    });

    it("should reset DayPosted sort", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDayPostedSort("asc");
      });
      expect(result.current.sortProps.sortDirectionDayPosted).toBe("asc");

      act(() => {
        result.current.sortHandlers.resetDayPostedSort();
      });
      expect(result.current.sortProps.sortDirectionDayPosted).toBeNull();
      expect(result.current.sortedData).toEqual(mockRowPages);
    });
  });

  // Test Case 5: Priority - only one sort should be active at a time
  describe("Sort Priority and Reset on New Sort", () => {
    it("should reset Name sort when DateFound sort is applied", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleNameSort("asc");
      });
      expect(result.current.sortProps.sortDirectionName).toBe("asc");

      act(() => {
        result.current.sortHandlers.handleDateFoundSort("desc");
      });
      expect(result.current.sortProps.sortDirectionDateFound).toBe("desc");
      expect(result.current.sortProps.sortDirectionName).toBeNull(); // Name sort should be reset
    });

    it("should reset DateFound sort when DayPosted sort is applied", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleDateFoundSort("asc");
      });
      expect(result.current.sortProps.sortDirectionDateFound).toBe("asc");

      act(() => {
        result.current.sortHandlers.handleDayPostedSort("desc");
      });
      expect(result.current.sortProps.sortDirectionDayPosted).toBe("desc");
      expect(result.current.sortProps.sortDirectionDateFound).toBeNull(); // DateFound sort should be reset
    });
  });

  // Test Case 6: Handling empty or single-item data
  it("should handle empty data gracefully", () => {
    const { result } = renderHook(() => useTableSorting([]));
    expect(result.current.sortedData).toEqual([]);
    act(() => {
      result.current.sortHandlers.handleNameSort("asc");
    });
    expect(result.current.sortedData).toEqual([]);
  });

  it("should handle single-item data gracefully", () => {
    const singlePage = [mockRowPages[0]];
    const { result } = renderHook(() => useTableSorting(singlePage));
    expect(result.current.sortedData).toEqual(singlePage);
    act(() => {
      result.current.sortHandlers.handleNameSort("asc");
    });
    expect(result.current.sortedData).toEqual(singlePage);
  });
});
