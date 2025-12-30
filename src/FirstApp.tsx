// CHQ: Gemini AI included imports
import React, { useState, useMemo, useCallback } from "react";
// import React, { useState, useCallback } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  // useTheme,
  Paper,
} from "@mui/material";

import type {
  // DatePickerProps,
  // SightingDisplayProps,
  CoordListProps,
  NavigationButtonsProps,
} from "./utils/dataTypes";
// import { SightingDisplay } from "./components/SightingDisplay";
// import { SightingDisplayAlt } from "./components/SightingDisplay";

import {
  // ButterflyMapSimple,
  // ButterflyMapComplex,
  ButterflyMap,
} from "./components/ButterflyMap";
// import DatePicker from "./components/DatePicker";
import { DatePickerV1, DatePickerV2 } from "./components/DatePicker";
import type { SelectChangeEvent } from "@mui/material/Select";

import { CustomDatePicker } from "./components/CustomDatePicker";
// --- START: Utility Functions ---

// CHQ: Gemini AI included utility functions here
/**
 * Implements the full Gregorian calendar leap year rule:
 * Divisible by 4, but not by 100 unless also by 400.
 */
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// CHQ: Gemini AI included list here
const namesOfMonths = [
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

const the30DayMonths = ["April", "June", "September", "November"];

/**
 * Calculates the maximum number of days for a given month and year.
 * @param monthIndex 1-based index (1=Jan, 12=Dec)
 * @param year The year to check for leap year status
 * @returns The maximum number of days in that month (28, 29, 30, or 31)
 */
const getMaxDays = (monthIndex: number, year: number) => {
  const monthName = namesOfMonths[monthIndex - 1];

  if (monthName === "February") {
    return isLeapYear(year) ? 29 : 28;
  }
  if (the30DayMonths.includes(monthName)) {
    return 30;
  }
  return 31;
};
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
      {/* <Button variant="contained" onClick={() => navigate("/datepicker")}>
        Pick Date to Analyze
      </Button> */}
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

  // CHQ: ChatGPT added
  const [draftDate, setDraftDate] = useState("");
  // Initialize with a date that highlights 2024 as a leap year is available.
  const [chosenDay, setChosenDay] = useState<number>(29);
  const [chosenMonth, setChosenMonth] = useState<number>(2); // February
  const [chosenYear, setChosenYear] = useState<number>(2024); // Leap Year

  const daysOfMonth = useMemo(
    () => Array.from({ length: 31 }, (_, i) => i + 1),
    []
  );

  const monthsOfYear = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );

  const rangeOfYears = useMemo(
    () => Array.from({ length: 4 }, (_, i) => i + 2022), // 2022, 2023, 2024, 2025
    []
  );

  // Calculate the maximum valid day for the current month and year
  const currentMaxDays = useMemo(
    () => getMaxDays(chosenMonth, chosenYear),
    [chosenMonth, chosenYear]
  );
  const daysToRender = daysOfMonth.slice(0, currentMaxDays);

  const handleDayChange = (event: SelectChangeEvent<number>) => {
    setChosenDay(event.target.value as number);
  };

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    const newMonth = event.target.value as number;
    setChosenMonth(newMonth);

    // Calculate max days for the NEW month
    const maxDays = getMaxDays(newMonth, chosenYear);

    // If the currently selected day (e.g., 31) is too high for the new month (e.g., 30), reset it
    if (chosenDay > maxDays) {
      setChosenDay(maxDays);
    }
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const newYear = event.target.value as number;
    setChosenYear(newYear);

    // Only need to adjust the day if February is the current month
    if (namesOfMonths[chosenMonth - 1] === "February") {
      const maxDays = getMaxDays(chosenMonth, newYear);

      // If the currently selected day (e.g., 29 in 2024) is now too high (e.g., 28 in 2023), reset it
      if (chosenDay > maxDays) {
        setChosenDay(maxDays);
      }
    }
  };

  // Handler to update the date in the parent component
  const handleSearchDate = () => {
    // CHQ: Gemini AI pads months and dates to prevent errors with string assembly
    const paddedMonth = String(chosenMonth).padStart(2, "0");
    const paddedDay = String(chosenDay).padStart(2, "0");

    // Format: MMddyyyy (e.g., 02292024)
    const formattedDate = `${paddedMonth}${paddedDay}${chosenYear}`;
    // setDate(formattedDate);
    setDraftDate(formattedDate);
  };

  // Determine the display string for the current selection
  const currentSelectionDisplay = `${
    namesOfMonths[chosenMonth - 1]
  } ${chosenDay}, ${chosenYear}`;

  // const [butterflyCoords, setButterflyCoords] = useState<Array<number>>([]);

  // Function to simulate navigation (replaces useNavigate)
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  const handleDateConfirm = (formattedDate: string) => {
    setChosenDate(formattedDate);
    navigate("/mymap"); // Auto-navigate on confirmation
  };

  let content;

  switch (currentPath) {
    case "/orig":
      content = <SamplePage />;
      break;
    case "/datepicker2":
      // CHQ: ChatGPT modified functional component
      content = (
        <>
          <Box sx={{ p: 4, minWidth: 800, mx: "auto" }}>
            <Typography
              variant="h5"
              gutterBottom
              align="center"
              sx={{ color: "#1976d2" }}
            >
              Date Selection
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Selected Date (Local State): **{currentSelectionDisplay}**
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, color: "green.700" }}>
                Date passed to parent (After Search): **
                {/* {currentDateDisplay || "N/A"} */}
                {draftDate || "N/A"}
                **
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {/* --- Day Select --- */}
                <FormControl sx={{ minWidth: 100 }} size="small">
                  <Select
                    value={chosenDay}
                    displayEmpty
                    onChange={handleDayChange}
                  >
                    {daysToRender.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* --- Month Select --- */}
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <Select
                    value={chosenMonth}
                    displayEmpty
                    onChange={handleMonthChange}
                  >
                    {/* Simplified Month Rendering for demo */}
                    {monthsOfYear.map((month) => (
                      <MenuItem key={month} value={month}>
                        {namesOfMonths[month - 1]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* --- Year Select --- */}
                <FormControl sx={{ minWidth: 100 }} size="small">
                  <Select
                    value={chosenYear}
                    displayEmpty
                    onChange={handleYearChange}
                  >
                    {rangeOfYears.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleSearchDate}
                  sx={{ flexGrow: 1 }}
                >
                  Update Global Date
                </Button>
              </Box>
            </Paper>
          </Box>
          {/* <DatePickerV2
            value={draftDate}
            onChange={setDraftDate}
            onConfirm={() => {
              setChosenDate(draftDate);
              navigate("/mymap");
            }}
          /> */}
          <DatePickerV1
            value={draftDate}
            onConfirm={() => {
              setChosenDate(draftDate);
              navigate("/mymap");
            }}
          />
        </>
      );
      break;
    case "datepicker":
      content = <CustomDatePicker onConfirm={handleDateConfirm} />;
      break;
    // case "/datafetcher": // Automatically navigate here after selecting date
    //   content = (
    //     <SightingDisplay
    //       sightingDate={chosenDate}
    //       setLatLongList={setButterflyCoords}
    //     />
    //   );
    //   // content = <SightingDisplayAlt sightingDate={chosenDate} />;
    //   break;
    case "/mymap": // Automatically navigate here after selecting date
      // content = <ButterflyMapSimple monarchCoordinates={butterflyCoords} />;
      // content = (
      //   <ButterflyMapComplex
      //     monarchCoordinates={butterflyCoords}
      //     sightingDate={chosenDate}
      //     setDate={setChosenDate}
      //     setButterflyCoords={setButterflyCoords}
      //   />
      // );

      content = (
        <ButterflyMap
          coords={butterflyCoords}
          chosenDate={chosenDate}
          setChosenDate={setChosenDate}
          setButterflyCoords={setButterflyCoords}
        />
      );

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
          {/* {chosenDate && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/datafetcher")}
              sx={{ mt: 2 }}
            >
              View Data for {chosenDate}
            </Button>
          )} */}
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
