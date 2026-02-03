// useColumnVisibility.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useColumnVisibility,
  ColumnVisibilityMiniTable,
  //   ColumnPresetName,
} from "../../src/hooks/useColumnVisibility";

// Define the expected default and preset visibility settings directly in the test file
// This makes tests independent of the internal structure of visibilitySettings Map,
// focusing on the public API's output.
const defaultColumnVisibilityMiniTable: ColumnVisibilityMiniTable = {
  myID: true,
  Qty: true,
  cityOrTown: true,
  countryCode: true,
  county: true,
  time_only: true,
  date_only: true,
  day: true,
  day_of_week: false,
  decimalLatitude: false,
  decimalLongitude: false,
  eventDate: false,
  stateProvince: true,
  week_of_year: false,
  year: false,
  month: true,
  gbifID: true,
};

const smartphoneVisibilityMiniTable: ColumnVisibilityMiniTable = {
  myID: true,
  Qty: true,
  cityOrTown: true,
  countryCode: true,
  county: true,
  time_only: true,
  date_only: true,
  day: false,
  day_of_week: false,
  decimalLatitude: true,
  decimalLongitude: true,
  eventDate: true,
  stateProvince: true,
  week_of_year: true,
  year: true,
  month: true,
  gbifID: true,
};

describe("useColumnVisibility", () => {
  // Test case 1: Initial state without an initial preset key
  it("should initialize with default column visibility when no initial preset is provided", () => {
    const { result } = renderHook(() => useColumnVisibility());
    expect(result.current.visibleColumns).toEqual(
      defaultColumnVisibilityMiniTable,
    );
  });

  it("should reset column visibility to default", () => {
    const { result } = renderHook(() => useColumnVisibility("smartphone")); // Start with a non-default preset

    // Verify it's not default initially
    expect(result.current.visibleColumns).toEqual(
      smartphoneVisibilityMiniTable,
    );
    expect(result.current.visibleColumns).not.toEqual(
      defaultColumnVisibilityMiniTable,
    );

    // Reset visibility
    act(() => {
      result.current.resetVisibility();
    });

    // Verify it's back to default
    expect(result.current.visibleColumns).toEqual(
      defaultColumnVisibilityMiniTable,
    );
  });
});
