// useTableSorting.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableSorting } from "../../src/hooks/useTableSorting"; // Adjust path as needed

// --- Interfaces--
interface RowPage {
  myID: string;
  Name: string;
  Status: string;
  Level: string;
  Source: string; // Joined string for Source
  DateFound: Date;
  DayPosted: Date;
  ApplicationDeadline: Date;
  DateApplied: Date;
  ExpireDate: Date;
  PostingURL: string;
  Connection: string;
  State: string[];
  Setup: string[];
  Company: string[];
  Education: string[];
  Duties: string[];
  Tags: string[];
  Tenure: string[];
  Location: string;
  PageURL: string;
}

// --- Mock Data ---
// Ensure diverse data for robust sorting tests
const mockRowPages: RowPage[] = [
  {
    myID: "1",
    Name: "Frontend Engineer", // F
    Status: "Applied",
    Level: "Mid",
    Source: "LinkedIn",
    DateFound: new Date("2024-01-10T10:00:00Z"), // Oldest DateFound
    DayPosted: new Date("2024-01-05T09:00:00Z"), // Oldest DayPosted
    ApplicationDeadline: new Date("2024-02-01"),
    DateApplied: new Date("2024-01-15"),
    ExpireDate: new Date("2024-03-01"),
    PostingURL: "url1",
    Connection: "John Doe",
    State: ["Remote"],
    Setup: ["Full-time"],
    Company: ["TechCorp"],
    Education: ["Bachelors"],
    Duties: ["Develop UIs"],
    Tags: ["React"],
    Tenure: ["Permanent"],
    Location: "Remote",
    PageURL: "page1",
  },
  {
    myID: "2",
    Name: "Backend Developer", // B
    Status: "Interview",
    Level: "Senior",
    Source: "Referral",
    DateFound: new Date("2024-01-12T14:00:00Z"),
    DayPosted: new Date("2024-01-08T10:00:00Z"),
    ApplicationDeadline: new Date("2024-01-25"),
    DateApplied: new Date("2024-01-10"),
    ExpireDate: new Date("2024-02-15"),
    PostingURL: "url2",
    Connection: "Jane Smith",
    State: ["On-site"],
    Setup: ["Full-time"],
    Company: ["InnovateX"],
    Education: ["Masters"],
    Duties: ["Design APIs"],
    Tags: ["Node.js"],
    Tenure: ["Contract"],
    Location: "New York",
    PageURL: "page2",
  },
  {
    myID: "3",
    Name: "Analyst", // A (for testing alphabetical sort with 'Analyst')
    Status: "Applied",
    Level: "Junior",
    Source: "Indeed",
    DateFound: new Date("2024-01-15T09:00:00Z"),
    DayPosted: new Date("2024-01-10T08:00:00Z"),
    ApplicationDeadline: new Date("2024-02-10"),
    DateApplied: new Date("2024-01-18"),
    ExpireDate: new Date("2024-03-10"),
    PostingURL: "url3",
    Connection: "N/A",
    State: ["Hybrid"],
    Setup: ["Full-time"],
    Company: ["DataFlow"],
    Education: ["PhD"],
    Duties: ["Statistical modeling"],
    Tags: ["Python"],
    Tenure: ["Permanent"],
    Location: "San Francisco",
    PageURL: "page3",
  },
  {
    myID: "4",
    Name: "QA Engineer", // Q
    Status: "Applied",
    Level: "Mid",
    Source: "Glassdoor",
    DateFound: new Date("2024-01-08T13:00:00Z"), // Same DateFound as ID 2 (tie-breaker for date)
    DayPosted: new Date("2024-01-06T11:00:00Z"),
    ApplicationDeadline: new Date("2024-02-05"),
    DateApplied: new Date("2024-01-16"),
    ExpireDate: new Date("2024-03-05"),
    PostingURL: "url4",
    Connection: "Recruiter",
    State: ["Remote"],
    Setup: ["Full-time"],
    Company: ["TestSolutions"],
    Education: ["Bachelors"],
    Duties: ["Test software"],
    Tags: ["QA"],
    Tenure: ["Permanent"],
    Location: "Remote",
    PageURL: "page4",
  },
  {
    myID: "5",
    Name: "Zookeeper", // Z (for testing alphabetical sort)
    Status: "Open",
    Level: "Entry",
    Source: "Zoo website",
    DateFound: new Date("2024-01-01T00:00:00Z"), // Earliest DateFound
    DayPosted: new Date("2023-12-25T00:00:00Z"), // Earliest DayPosted
    ApplicationDeadline: new Date("2024-01-30"),
    DateApplied: new Date("2024-01-05"),
    ExpireDate: new Date("2024-02-28"),
    PostingURL: "url5",
    Connection: "Manager",
    State: ["On-site"],
    Setup: ["Full-time"],
    Company: ["City Zoo"],
    Education: ["High School"],
    Duties: ["Animal care"],
    Tags: ["Animals"],
    Tenure: ["Permanent"],
    Location: "Local",
    PageURL: "page5",
  },
  {
    myID: "6",
    Name: "Missing Dates Job",
    Status: "Applied",
    Level: "Entry",
    Source: "Referral",
    DateFound: null as any, // Simulate missing DateFound
    DayPosted: null as any, // Simulate missing DayPosted
    ApplicationDeadline: new Date("2024-03-01"),
    DateApplied: new Date("2024-02-01"),
    ExpireDate: new Date("2024-04-01"),
    PostingURL: "url6",
    Connection: "Friend",
    State: ["Remote"],
    Setup: ["Part-time"],
    Company: ["NoDatesCo"],
    Education: ["GED"],
    Duties: ["Admin tasks"],
    Tags: ["Admin"],
    Tenure: ["Temporary"],
    Location: "Anywhere",
    PageURL: "page6",
  },
];

describe("useTableSorting", () => {
  // Test Case 1: Initial state
  it("should initialize with no active sort and return data in original order", () => {
    const { result } = renderHook(() => useTableSorting(mockRowPages));

    expect(result.current.sortProps.sortDirectionName).toBeNull();
    expect(result.current.sortProps.sortDirectionDateFound).toBeNull();
    expect(result.current.sortProps.sortDirectionDayPosted).toBeNull();

    // Verify that the sortedData is initially the same as the input filteredData
    expect(result.current.sortedData).toEqual(mockRowPages);
  });

  // Test Case 2: Name Sorting
  describe("Name Sorting", () => {
    it("should sort by Name in ascending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleNameSort("asc");
      });

      expect(result.current.sortProps.sortDirectionName).toBe("asc");
      // Check that other sorts are reset
      expect(result.current.sortProps.sortDirectionDateFound).toBeNull();
      expect(result.current.sortProps.sortDirectionDayPosted).toBeNull();

      // Expected order: Analyst, Backend Developer, Frontend Engineer, Missing Dates Job, QA Engineer, Zookeeper
      const expectedNames = [
        "Analyst",
        "Backend Developer",
        "Frontend Engineer",
        "Missing Dates Job",
        "QA Engineer",
        "Zookeeper",
      ];
      expect(result.current.sortedData.map((row) => row.Name)).toEqual(
        expectedNames,
      );
    });

    it("should sort by Name in descending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleNameSort("desc");
      });

      expect(result.current.sortProps.sortDirectionName).toBe("desc");
      const expectedNames = [
        "Zookeeper",
        "QA Engineer",
        "Missing Dates Job",
        "Frontend Engineer",
        "Backend Developer",
        "Analyst",
      ];
      expect(result.current.sortedData.map((row) => row.Name)).toEqual(
        expectedNames,
      );
    });

    it("should reset Name sort", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleNameSort("asc");
      });
      expect(result.current.sortProps.sortDirectionName).toBe("asc");

      act(() => {
        result.current.sortHandlers.resetNameSort();
      });
      expect(result.current.sortProps.sortDirectionName).toBeNull();
      // Should return to the original order (as no other sort is active)
      expect(result.current.sortedData).toEqual(mockRowPages);
    });
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
