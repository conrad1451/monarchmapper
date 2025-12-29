// CHQ: Gemini AI included imports
// import React, { useState, useMemo, useCallback } from "react";
import React, { useState, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  // FormControl,
  // Select,
  // MenuItem,
  // useTheme,
  // Paper,
} from "@mui/material";

import type {
  // DatePickerProps,
  // SightingDisplayProps,
  CoordListProps,
  NavigationButtonsProps,
} from "./utils/dataTypes";
import { SightingDisplay } from "./components/SightingDisplay";
// import { SightingDisplayAlt } from "./components/SightingDisplay";

import ButterflyMap from "./components/ButterflyMap";
import DatePicker from "./components/DatePicker";

// --- END: Utility Functions ---

const SamplePage: React.FC = () => (
  <Box sx={{ p: 4, textAlign: "center" }}>
    <Typography variant="h4" color="primary">
      Original Sample Page
    </Typography>
    <Typography variant="body1" mt={2}>
      This is a placeholder for your original content.
    </Typography>
  </Box>
);

// --- END: Placeholder Components ---

// --- START: Navigation & Main App ---

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ navigate }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", p: 4 }}>
      <Button variant="contained" onClick={() => navigate("/orig")}>
        Go to original page
      </Button>
      <Button variant="contained" onClick={() => navigate("/datepicker")}>
        Pick Date to Analyze
      </Button>
      <Button variant="contained" onClick={() => navigate("/mymap")}>
        See Map
      </Button>
    </Box>
  );
};

function App() {
  const [chosenDate, setChosenDate] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("/");

  const [butterflyCoords, setButterflyCoords] = useState<Array<CoordListProps>>(
    []
  );

  // const [butterflyCoords, setButterflyCoords] = useState<Array<number>>([]);

  // Function to simulate navigation (replaces useNavigate)
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  let content;

  switch (currentPath) {
    case "/orig":
      content = <SamplePage />;
      break;
    case "/datepicker":
      content = (
        <DatePicker setDate={setChosenDate} currentDateDisplay={chosenDate} />
      );
      break;
    case "/datafetcher": // Automatically navigate here after selecting date
      content = (
        <SightingDisplay
          sightingDate={chosenDate}
          setLatLongList={setButterflyCoords}
        />
      );
      // content = <SightingDisplayAlt sightingDate={chosenDate} />;
      break;
    case "/mymap": // Automatically navigate here after selecting date
      content = <ButterflyMap monarchCoordinates={butterflyCoords} />;
      // content = <SightingDisplayAlt sightingDate={chosenDate} />;
      break;
    case "/":
    default:
      content = (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            Welcome
          </Typography>
          <NavigationButtons navigate={navigate} />
          {chosenDate && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/datafetcher")}
              sx={{ mt: 2 }}
            >
              View Data for {chosenDate}
            </Button>
          )}
        </Box>
      );
      break;
  }

  return (
    // CHQ: Gemini AI modified to apply flexbox to the outer container to center the inner container.

    <Box
      sx={{
        fontFamily: "Inter",
        bgcolor: "#f4f7f9",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex", // Enable flex container
        justifyContent: "center", // Center content horizontally
        // alignItems: 'flex-start', // (Optional) Keep content aligned to the top
      }}
    >
      <Box
        sx={{
          // maxWidth: 800,
          // minWidth: 1400,
          // minWidth: 1000,
          width: "100%", // Ensure it uses max width available up to 800px
          pt: 4,
        }}
      >
        {currentPath !== "/" && (
          <Button
            onClick={() => navigate("/")}
            sx={{ mb: 2, ml: 2 }}
            variant="text"
          >
            ← Back to Home
          </Button>
        )}
        {content}
      </Box>
    </Box>
  );
}

export default App;
