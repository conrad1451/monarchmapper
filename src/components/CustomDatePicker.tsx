import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
// import { SelectChangeEvent } from "@mui/material/Select";

// --- Constants & Helpers ---
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
const THIRTY_DAY_MONTHS = [4, 6, 9, 11]; // April, June, Sept, Nov

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getMaxDays = (month: number, year: number): number => {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if (THIRTY_DAY_MONTHS.includes(month)) return 30;
  return 31;
};

interface CustomDatePickerProps {
  onConfirm: (formattedDate: string) => void;
  initialYear?: number;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onConfirm,
  initialYear = 2024,
}) => {
  const [day, setDay] = useState(29);
  const [month, setMonth] = useState(2); // February
  const [year, setYear] = useState(initialYear);

  // Auto-adjust day if it exceeds the max days of a newly selected month/year
  useEffect(() => {
    const max = getMaxDays(month, year);
    if (day > max) setDay(max);
  }, [month, year, day]);

  const daysToRender = useMemo(
    () => Array.from({ length: getMaxDays(month, year) }, (_, i) => i + 1),
    [month, year],
  );

  const handleConfirm = () => {
    const paddedMonth = String(month).padStart(2, "0");
    const paddedDay = String(day).padStart(2, "0");
    onConfirm(`${paddedMonth}${paddedDay}${year}`);
  };

  const displayDate = `${MONTHS[month - 1]} ${day}, ${year}`;

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 2 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Select Sighting Date
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, fontWeight: "bold" }}>
        Current Selection: {displayDate}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Month Select */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((name, idx) => (
              <MenuItem key={name} value={idx + 1}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Day Select */}
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <Select value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {daysToRender.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Select */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{ flexGrow: 1 }}
        >
          Confirm Date
        </Button>
      </Box>
    </Paper>
  );
};
export default CustomDatePicker;
