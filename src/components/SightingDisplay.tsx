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

// CHQ: Gemini AI destructured the prop
// Change component signature to destructure the required prop
export const SightingDisplay = ({
  sightingDate,
  setLatLongList,
}: {
  sightingDate: string;
  setLatLongList: React.Dispatch<React.SetStateAction<CoordListProps[]>>;
}) => {
  const { sightings, loading, error, refetchSightings } = useSightings({
    // sightingDate: "06302025",
    // sightingDate: props.sightingDate,
    sightingDate: sightingDate,
  });

  // Set this to `false` to use real data from the API
  // const useSampleData = true;
  const useSampleData = false;

  // CHQ: Gemini AI moved dataForTable outside conditional statement to top level
  // Conditionally determine the data for the table (can be null/empty if loading/error)
  const dataForTable: RowPage[] = useMemo(() => {
    return sightings ? transformMonarchButterflyRecordToRowPage(sightings) : [];
  }, [sightings]);

  // CHQ: Gemini AI moved useMemo hook to top level
  // 2. HOOK: useMemo is called unconditionally at the top
  const coordList: CoordListProps[] = useMemo(() => {
    return dataForTable.map((sighting) => ({
      lat: sighting.decimalLatitude,
      lon: sighting.decimalLongitude,
    }));
  }, [dataForTable]);

  // CHQ: Gemini AI moved useEffect hook to top level
  // 3. HOOK: useEffect is called unconditionally at the top
  useEffect(() => {
    // We only set the coordinates if we have data (i.e., dataForTable is not empty)
    if (dataForTable.length > 0) {
      // props.setLatLongList(coordList);
      setLatLongList(coordList);
    } else {
      // Optionally clear the map if data is cleared
      // props.setLatLongList([]);
      setLatLongList([]);
    }
    // }, [coordList, props.setLatLongList, dataForTable.length]);
  }, [coordList, setLatLongList, dataForTable.length]);

  // --- EARLY RETURNS (Conditional Rendering) ---

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

  // --- REGULAR RENDER ---

  const isHidingEmptyDatabase = false; // Moved out of the conditional block

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Monarch Butterfly Sighting Dashboard
      </Typography>

      {!error &&
      dataForTable.length === 0 &&
      !useSampleData &&
      isHidingEmptyDatabase ? (
        <EmptyDatabase theRefetchOfSightings={refetchSightings} />
      ) : (
        <SightingTable thePages={dataForTable} />
      )}
    </Box>
  );
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
