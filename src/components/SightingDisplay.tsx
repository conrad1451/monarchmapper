// SightingDisplay.tsx

import React, { useEffect, useMemo } from "react";
import { useSightings } from "../hooks/useSightings";
import SightingTable from "./SightingTable";

import { Box, Button, Typography } from "@mui/material"; // Import necessary MUI components
import type {
  RowPage,
  SightingDisplayProps,
  CoordListProps,
} from "../utils/dataTypes"; // Import both
import { transformMonarchButterflyRecordToRowPage } from "../utils/dataTransforms";

// Define the prop type for EmptyDatabase for better type safety
interface EmptyDatabaseProps {
  theRefetchOfSightings: () => void;
}

const EmptyDatabase = (props: EmptyDatabaseProps) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body1">
        No sightings found. Add some from your database or via a POST request.
      </Typography>
      <Button
        variant="contained"
        onClick={props.theRefetchOfSightings}
        sx={{ mt: 2 }}
      >
        Refresh Sightings
      </Button>
    </Box>
  );
};

// CHQ: Gemini AI renamed and refactored this.
//      It split a single functional component into a hook and a component
export const SightingDisplay = (props: {
  sightingDate: string;
  // setLatLongList: CoordListProps[];
  // setLatLongList: any;
  // setLatLongList: React.Dispatch<React.SetStateAction<number[]>>;
  setLatLongList: React.Dispatch<React.SetStateAction<CoordListProps[]>>;
}) => {
  const { sightings, loading, error, refetchSightings } = useSightings({
    // sightingDate: "06302025",
    sightingDate: props.sightingDate,
  });

  // Set this to `false` to use real data from the API
  // const useSampleData = true;
  const useSampleData = false;

  if (!loading && !(error && !useSampleData)) {
    // --- Prepare the data for SightingTable based on 'useSampleData' flag ---
    const dataForTable: RowPage[] =
      transformMonarchButterflyRecordToRowPage(sightings);
    // --- END DATA PREPARATION ---

    // CHQ: Gemini AI corrected coordList implementation to avoid infinite render loop
    // NEW: Calculate the coordinate list once, using useMemo
    const coordList: CoordListProps[] = useMemo(() => {
      return dataForTable.map((sighting) => ({
        lat: sighting.decimalLatitude,
        lon: sighting.decimalLongitude,
      }));
    }, [dataForTable]); // Re-calculate only when dataForTable changes

    // CHQ: Gemini AI corrected coordList implementation to avoid infinite render loop
    // NEW: Use useEffect to call the parent state setter ONLY when the coordList changes
    useEffect(() => {
      // This runs only after the component has rendered AND coordList has changed.
      props.setLatLongList(coordList);
    }, [coordList, props.setLatLongList]); // Dependencies: coordList and the setter function
    // const isHidingEmptyDatabase = true;

    const isHidingEmptyDatabase = false;
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Monarch Butterfly Sighting Dashboard
        </Typography>

        {/* Show EmptyDatabase component if no error, no real sightings, AND not using sample data */}

        {!error &&
        dataForTable.length === 0 &&
        !useSampleData &&
        isHidingEmptyDatabase ? (
          <EmptyDatabase theRefetchOfSightings={refetchSightings} />
        ) : (
          // Render SightingTable with the prepared data (either transformed real data or sample data)
          <SightingTable thePages={dataForTable} />
        )}
      </Box>
    );
  } else {
    if (loading) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">Loading sightings...</Typography>
        </Box>
      );
    }

    // Display error message if there's an error and we're not explicitly using sample data
    if (error && !useSampleData) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" color="error">
            Error: {error}
          </Typography>
          <Button variant="contained" onClick={refetchSightings} sx={{ mt: 2 }}>
            Retry Fetch
          </Button>
        </Box>
      );
    }
  }
};

export const SightingDisplayAlt: React.FC<SightingDisplayProps> = ({
  sightingDate,
}) => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <Typography variant="h4" color="secondary">
      Sighting Data Fetcher
    </Typography>
    <Typography variant="body1" mt={2}>
      The parent app has selected this date:
      <Box component="span" sx={{ fontWeight: "bold", color: "red" }}>
        {sightingDate || "No date selected yet."}
      </Box>
    </Typography>
    <Typography variant="caption" display="block" mt={1}>
      (Format: MMddyyyy)
    </Typography>
  </Box>
);

// export default SightingDisplay;
