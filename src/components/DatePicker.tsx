// MiniTable.tsx
// import React, { useState, useEffect, useMemo } from "react";
import { useState, useMemo } from "react";

import {
  //   Table,
  //   TableBody,
  //   TableCell,
  //   TableContainer,
  //   TableHead,
  //   TableRow,
  //   Paper,
  Button,
  Box,
  Typography,
  //   Switch,
  // TextField,
  //   FormControlLabel,
  FormControl,
  // InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

const MyChevronRightIcon = () => {
  return <>▶️</>;
};

const MyExpandMoreIcon = () => {
  return <>🔽</>;
};

const DatePicker = () => {
  const [myText, setMyText] = useState<string>("");
  const [chosenDay, setChosenDay] = useState<number>(1);

  const [chosenMonth, setChosenMonth] = useState<number>(1);

  // CHQ: Gemini AI corrected the year chosen
  const [chosenYear, setChosenYear] = useState<number>(2023);

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

  const daysOfMonth = useMemo(
    () => Array.from({ length: 31 }, (_, i) => i + 1),
    []
  );

  const monthsOfYear = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );

  //   const yearsSince2023 = useMemo(
  //     () => Array.from({ length: 3 }, (_, i) => i + 1 + 2022),
  //     []
  //   );
  const yearsSince2023 = useMemo(
    () => Array.from({ length: 2 }, (_, i) => i + 1 + 2022),
    []
  );
  // Handler to update the selected portion count
  const handleDayChange = (event: SelectChangeEvent<number>) => {
    setChosenDay(event.target.value as number);
  };

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setChosenMonth(event.target.value as number);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setChosenYear(event.target.value as number);
  };
  // Handler to add a new portioning row
  const handleSearchDate = () => {
    setMyText(
      namesOfMonths[chosenMonth - 1] +
        " " +
        String(chosenDay) +
        ", " +
        String(chosenYear)
    );
  };

  return (
    <>
      <p>{myText}</p>{" "}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", ml: 2, gap: 1 }}>
          <FormControl sx={{ minWidth: 100 }} size="small">
            {/* <InputLabel id="num-portions-setter-label">
                        Portions
                    </InputLabel> */}
            <Select
              //   labelId="num-portions-setter-label"
              //   id="num-portions-setter"
              value={chosenDay}
              label="day"
              //   color="black"
              onChange={handleDayChange}
            >
              {/* CHQ: Gemini AI corrected the indexing */}
              {/* CHQ: Gemini AI mapped the array of numbers to MenuItem components in the February condition */}
              {namesOfMonths[chosenMonth - 1] === "February"
                ? daysOfMonth.slice(0, 28).map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))
                : (the30DayMonths.includes(namesOfMonths[chosenMonth])
                    ? daysOfMonth.slice(0, 30)
                    : daysOfMonth.slice(0, 31)
                  ).map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }} size="small">
            {/* <InputLabel id="num-portions-setter-label">
                        Portions
                    </InputLabel> */}
            <Select
              //   labelId="num-portions-setter-label"
              //   id="num-portions-setter"
              value={chosenMonth}
              label="month"
              //   color="black"
              onChange={handleMonthChange}
            >
              {monthsOfYear.map((month) => (
                <MenuItem key={month} value={month}>
                  {namesOfMonths[month - 1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }} size="small">
            {/* <InputLabel id="num-portions-setter-label">
                        Portions
                    </InputLabel> */}
            <Select
              //   labelId="num-portions-setter-label"
              //   id="num-portions-setter"
              value={chosenYear}
              label="year"
              //   color="black"
              onChange={handleYearChange}
            >
              {yearsSince2023.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSearchDate}
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            Search Date
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default DatePicker;
