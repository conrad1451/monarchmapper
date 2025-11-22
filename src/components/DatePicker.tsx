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

  //   CHQ: Gemini AI ceated variable
  // Helper to check if a year is a leap year (basic check sufficient for your range)
  const isLeapYear = (year: number) => year % 4 === 0;

  //   CHQ: Gemini AI ceated helper function to calculate the max days in a month for the current year
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

  //   const rangeOfYears = useMemo(
  //     () => Array.from({ length: 3 }, (_, i) => i + 1 + 2022),
  //     []
  //   );
  const rangeOfYears = useMemo(
    () => Array.from({ length: 4 }, (_, i) => i + 2022),
    []
  );
  // Handler to update the selected portion count
  const handleDayChange = (event: SelectChangeEvent<number>) => {
    setChosenDay(event.target.value as number);
  };

  //  CHQ: Gemini AI used the currently selected month to determine
  //  max days and set chosen day to that if it exceeded max days for the month
  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    const newMonth = event.target.value as number;
    setChosenMonth(newMonth);

    // Calculate max days for the NEW month
    const maxDays = getMaxDays(newMonth, chosenYear);

    // If the currently selected day is too high, reset it to the max valid day
    if (chosenDay > maxDays) {
      setChosenDay(maxDays);
    }
  };

  //  CHQ: Gemini AI used the currently selected year and if the current month is Febraury to
  //  determine max days and set chosen day to that if it exceeded max days for the month
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const newYear = event.target.value as number;
    setChosenYear(newYear);

    // Only need to adjust the day if February is the current month
    if (namesOfMonths[chosenMonth - 1] === "February") {
      const maxDays = getMaxDays(chosenMonth, newYear);

      // If the currently selected day (e.g., 29) is now too high (e.g., 28), reset it
      if (chosenDay > maxDays) {
        setChosenDay(maxDays);
      }
    }
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
                ? chosenYear % 4 === 0
                  ? daysOfMonth.slice(0, 29).map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))
                  : daysOfMonth.slice(0, 28).map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))
                : (the30DayMonths.includes(namesOfMonths[chosenMonth - 1])
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
              {/* {monthsOfYear.map((month) => (
                <MenuItem key={month} value={month}>
                  {namesOfMonths[month - 1]}
                </MenuItem>
              ))} */}

              {chosenYear === 2025
                ? monthsOfYear.slice(0, 9).map((month) => (
                    <MenuItem key={month} value={month}>
                      {namesOfMonths[month - 1]}
                    </MenuItem>
                  ))
                : chosenYear === 2022
                ? monthsOfYear.slice(4).map((month) => (
                    <MenuItem key={month} value={month}>
                      {namesOfMonths[month - 1]}
                    </MenuItem>
                  ))
                : monthsOfYear.map((month) => (
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
