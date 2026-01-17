// SightingTable.tsx (From front end code)

// import React, { useState, useEffect, useMemo } from "react";
import React, { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  // IconButton,
  // TextField, // Added TextField for better input control in modals
} from "@mui/material";
import Modal from "@mui/material/Modal";
// import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icon for the action button

// --- Import Custom Hooks ---
import { useTableFilters } from "../hooks/useTableFilters";
import { useTableSorting } from "../hooks/useTableSorting";
import {
  useColumnVisibilityMiniTable,
  visibilityPresetsMiniTable,
} from "../hooks/useColumnVisibility";

import type { ColumnVisibilityMiniTable } from "../hooks/useColumnVisibility";
// import type { Item, RowPage } from "../utils/dataTypes";
import type { RowPage, TableNameItem } from "../utils/dataTypes";
import { HydrationShield } from "./HydrationShield";
import { useMonarchInventory } from "../hooks/useMonarchInventory";

// --- WebFormProps & WebForm Component ---
// interface WebFormProps {
//   onSubmit: (event: React.FormEvent) => Promise<void>;
// }

// interface ConfirmUpdateProps {
//   first_name: string;
//   last_name: string;
//   email: string;
//   major: string;
// }

// const WebForm: React.FC<WebFormProps> = ({ onSubmit }) => {
//   return (
//     <form onSubmit={onSubmit}>
//       {" "}
//       {/* Pass the onSubmit handler directly */}
//       <button type="submit">Submit data to database</button>
//     </form>
//   );
// };

// interface ApiResponse {
//   message: string;
//   // ... other properties
// }

const allColumnKeys: Array<keyof ColumnVisibilityMiniTable> = [
  "gbifID",
  // "DatasetKey",
  // "PublishingOrgKey",
  "eventDate",
  // "EventDateParsed",
  "year",
  "month",
  "day",
  "day_of_week",
  "week_of_year",
  "time_only",
  "date_only",
  // "ScientificName",
  // "VernacularName",
  // "TaxonKey",
  // "Kingdom",
  // "Phylum",
  // "Class",
  // "Order",
  // "Family",
  // "Genus",
  // "Species",
  "decimalLatitude",
  "decimalLongitude",
  // "CoordinateUncertaintyInMeters",
  "countryCode",
  "stateProvince",
  // "IndividualCount",
  // "BasisOfRecord",
  // "RecordedBy",
  // "OccurrenceID",
  // "CollectionCode",
  // "CatalogNumber",
  "county",
  "cityOrTown",
];
const ColumnVisibilityToggles = (props: {
  visibleColumns: ColumnVisibilityMiniTable;
  handleToggleColumn: (event: React.ChangeEvent<HTMLInputElement>) => void;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {props.theColumnKeys.map((colName) => (
        <FormControlLabel
          key={colName}
          control={
            <Switch
              checked={props.visibleColumns[colName]}
              onChange={props.handleToggleColumn}
              name={colName}
            />
          }
          label={colName}
        />
      ))}
    </Box>
  );
};

const ColumnVisibilityControlModal = (props: {
  open: boolean;
  onClose: () => void;
  visibleColumns: ColumnVisibilityMiniTable;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectPreset: (preset: keyof typeof visibilityPresetsMiniTable) => void;
  onReset: () => void;
  presets: Map<string, ColumnVisibilityMiniTable>;
}) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 800 },
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Customize Column Visibility
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Apply Preset:</Typography>
          <FormControl fullWidth size="small">
            <Select
              value=""
              label="Presets"
              onChange={(e) =>
                props.onSelectPreset(
                  e.target.value as keyof typeof visibilityPresetsMiniTable
                )
              }
            >
              <MenuItem value="">
                <em>None (Select Preset)</em>
              </MenuItem>
              {[...props.presets.keys()].map((key) => (
                <MenuItem key={key} value={key}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={props.onReset} variant="outlined" sx={{ mt: 1 }}>
            Reset to Default
          </Button>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Toggle Individual Columns:
        </Typography>
        <ColumnVisibilityToggles
          visibleColumns={props.visibleColumns}
          handleToggleColumn={props.onToggle}
          theColumnKeys={allColumnKeys}
        />

        <Button onClick={props.onClose} variant="contained" sx={{ mt: 3 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const TableHeaderCells = (props: {
  visibleColumns: ColumnVisibilityMiniTable;
  sortProps: ReturnType<typeof useTableSorting>["sortProps"];
  sortHandlers: ReturnType<typeof useTableSorting>["sortHandlers"];
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  type SortableTableColumns = "cityOrTown" | "stateProvince" | "county";

  return (
    <TableHead>
      <TableRow>
        {props.theColumnKeys.map((colName) =>
          props.visibleColumns[colName] ? (
            <TableCell key={colName}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {colName}
                </Typography>
                {(
                  [
                    "cityOrTown",
                    "stateProvince",
                    "county",
                  ] as SortableTableColumns[]
                ).includes(colName as SortableTableColumns) && (
                  <>
                    <Button
                      onClick={() =>
                        props.sortHandlers.handleSort(
                          colName as SortableTableColumns
                        )
                      }
                      title={
                        props.sortProps.sortColumn === colName &&
                        props.sortProps.sortDirection === "asc"
                          ? "Current: Ascending. Click to sort Descending."
                          : "Click to sort Ascending."
                      }
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        // Only show the up arrow if not currently sorted ascending
                        visibility:
                          props.sortProps.sortColumn === colName &&
                          props.sortProps.sortDirection === "asc"
                            ? "visible" // Show if currently ascending
                            : "visible", // Always visible to allow sorting
                      }}
                    >
                      {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection === "asc"
                        ? "▲"
                        : "⬆️"}
                    </Button>
                    <Button
                      onClick={() =>
                        props.sortHandlers.handleSort(
                          colName as SortableTableColumns
                        )
                      }
                      title={
                        props.sortProps.sortColumn === colName &&
                        props.sortProps.sortDirection === "desc"
                          ? "Current: Descending. Click to reset sort."
                          : "Click to sort Descending."
                      }
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        // Only show the down arrow if not currently sorted descending
                        visibility:
                          props.sortProps.sortColumn === colName &&
                          props.sortProps.sortDirection === "desc"
                            ? "visible" // Show if currently descending
                            : "visible", // Always visible to allow sorting
                      }}
                    >
                      {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection === "desc"
                        ? "▼"
                        : "⬇️"}
                    </Button>

                    {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection && (
                        <Button
                          onClick={props.sortHandlers.resetSort}
                          title="Reset All Sorts"
                          sx={{ minWidth: "auto", p: "2px" }}
                        >
                          🔄
                        </Button>
                      )}
                  </>
                )}
              </Box>
            </TableCell>
          ) : null
        )}
        {/* New TableCell for Actions header */}
        <TableCell>
          <Box
            component="span"
            sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
          >
            Actions
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

// --- TableBodyRowsProps and TableBodyRows Component ---
interface TableBodyRowsProps {
  data: RowPage[];
  visibleColumns: ColumnVisibilityMiniTable;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
  // onOpenActionModal: (sighting: RowPage) => void;
  // NEW PROPS - passed down from SightingTable
  myId: number;
  // myFirstName: string;
  // setMyFirstName: (value: string) => void;
  myCity: string;
  SetMyCity: (value: string) => void;
  myCounty: string;
  setMyCounty: (value: string) => void;
  myStateProvince: string;
  setMyStateProvince: (value: string) => void;
  // loading: boolean;
  // successMessage: string | null;
  // errorMessage: string | null;
  // onNewSightingSubmit: (event: React.FormEvent) => Promise<void>;
}

const TableBodyRows = (props: TableBodyRowsProps) => {
  return (
    <TableBody>
      {props.data.map((row) => (
        <TableRow key={row.gbifID}>
          {props.theColumnKeys.map((colName) =>
            props.visibleColumns[colName] ? (
              <TableCell key={colName}>
                {String(row[colName as keyof RowPage])}
              </TableCell>
            ) : null
          )}
          {/* TableCell for Actions button for existing rows */}
          {/* <TableCell key={`actions-${row.gbifID || row.myID}`}>
            <IconButton
              aria-label="actions"
              onClick={() => props.onOpenActionModal(row)}
            >
              <MoreVertIcon />
            </IconButton>
          </TableCell> */}
        </TableRow>
      ))}

      {/* Footer row (Count of Sightings) - This also needs a unique key! */}
      <TableRow key="footer-row">
        {props.theColumnKeys.map((colName) =>
          props.visibleColumns[colName] ? (
            // ✅ FIX: The key is correctly placed on the <TableCell> here too
            <TableCell key={`footer-${colName}`}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {colName === "cityOrTown"
                    ? "Count of Sightings: " + String(props.data.length)
                    : ""}
                </Typography>
              </Box>
            </TableCell>
          ) : null
        )}
        {/* Empty cell for the actions column in the footer row */}
        {/* ✅ FIX: Add a unique key to this static cell */}
        <TableCell key="footer-actions-cell"></TableCell>
      </TableRow>
    </TableBody>
  );
};
const MyChevronRightIcon = () => {
  return <>▶️</>;
};

const MyExpandMoreIcon = () => {
  return <>🔽</>;
};

const DisplayModule = function (props: { inventory: TableNameItem[] }) {
  const { inventory } = props;
  {
    /* CHQ: module below made by Gemini AI, and I encapsulated in a functional component */
  }
  return (
    <div className="grid gap-4">
      {inventory.map((item) => (
        <div key={item.id} className="p-4 border rounded shadow-sm bg-white">
          {/* <h3 className="font-bold text-lg">
                    {formatDate(item.available_date)}
                  </h3> */}
          <p className="text-gray-600">
            Total Monarchs Tracked:{" "}
            <span className="text-orange-600 font-mono">
              {/* {item.recordCount} */}
              {item.record_count}
            </span>
          </p>
          <small className="text-xs text-gray-400">
            {/* Database Table: {item.tableName} */}
            Database Table: {item.table_name}
          </small>
        </div>
      ))}
    </div>
  );
};

const AllowedDatetable = function (props: {
  // inventory: string;
  inventory: TableNameItem[];
  loading: boolean;
  error: string | null;
}) {
  const { inventory, loading, error } = props;

  const listOfValidDates: string[] = inventory.map((tableTitle) => {
    // return tableTitle.tableName;
    return tableTitle.table_name;
  });

  return (
    <div style={{ display: "flex", width: "20vw" }}>
      <>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5">Loading sightings...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" color="error">
              Error: {error}
            </Typography>
            {/* <Button
              variant="contained"
              onClick={refetchSightings}
              sx={{ mt: 2 }}
            >
              Retry Fetch
            </Button> */}
          </Box>
        ) : (
          <div>
            <ul>
              {listOfValidDates.map((elem) => {
                return <li key={elem}>{elem}</li>;
              })}
            </ul>
            <DisplayModule inventory={inventory} />
          </div>
        )}
      </>
    </div>
  );
};
// const idGenerator = (rawTableData: RowPage[]) => {
//   // CHQ: Gemini AI added following logic to calculate new ID
//   // --- Logic to determine the new myID ---
//   const maxId = rawTableData.reduce((max, row) => {
//     const currentId = row.myID; // Assuming myID is already a number
//     return isNaN(currentId) ? max : Math.max(max, currentId);
//   }, 0); // Start with 0 if no valid IDs found
//   return maxId + 1;
// };

const SightingTable = (props: { thePages: RowPage[] }) => {
  // CHQ: Gemini AI turned this from a variable assigned from a prop into a state variable
  const [rawTableData, setRawTableData] = useState<RowPage[]>(props.thePages); // Manage table data locally for updates

  useEffect(() => {
    setRawTableData(props.thePages); // Update local state if props.thePages changes
  }, [props.thePages]);

  // const initialTableDataForHooks = rawTableData.filter(
  //   (row) => row && row.FirstName && row.FirstName.trim() !== ""
  // );

  // const { inventory, loading, error, formatDate } = useMonarchInventory();
  const { inventory, loading, error } = useMonarchInventory();

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const {
    visibleColumns,
    handleToggleColumn,
    setPresetVisibility,
    resetVisibility,
    presets,
  } = useColumnVisibilityMiniTable("default");

  // const { filteredData } = useTableFilters(initialTableDataForHooks);
  const { filteredData } = useTableFilters(rawTableData);

  const { sortedData, sortProps, sortHandlers } = useTableSorting(filteredData);

  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  // --- Moved state variables and submission logic from TableBodyRows to SightingTable ---
  // const [myFirstName, setMyFirstName] = useState("");
  const [myCity, SetMyCity] = useState("");
  const [myCounty, setMyCounty] = useState("");
  const [myStateProvince, setMyStateProvince] = useState("");

  // const newMyID: number = idGenerator(rawTableData);

  return (
    <HydrationShield>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <AllowedDatetable
            inventory={inventory}
            loading={loading}
            error={error}
          />
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h5" component="div">
              Sighting Data
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setIsColumnModalOpen(true)}
              >
                Customize Columns
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsTableCollapsed(!isTableCollapsed)}
              >
                {isTableCollapsed ? (
                  <MyChevronRightIcon />
                ) : (
                  <MyExpandMoreIcon />
                )}{" "}
                {isTableCollapsed ? "Expand" : "Collapse"} Table
              </Button>
            </Box>
          </Box>

          <ColumnVisibilityControlModal
            open={isColumnModalOpen}
            onClose={() => setIsColumnModalOpen(false)}
            visibleColumns={visibleColumns}
            onToggle={handleToggleColumn}
            onSelectPreset={setPresetVisibility}
            onReset={resetVisibility}
            presets={presets}
          />

          {!isTableCollapsed && (
            <TableContainer>
              <Table stickyHeader aria-label="sighting table">
                <TableHeaderCells
                  visibleColumns={visibleColumns}
                  sortProps={sortProps}
                  sortHandlers={sortHandlers}
                  theColumnKeys={allColumnKeys}
                />
                <TableBodyRows
                  data={sortedData}
                  visibleColumns={visibleColumns}
                  theColumnKeys={allColumnKeys}
                  // onOpenActionModal={handleOpenActionModal}
                  myId={0} // Pass the newly generated ID
                  // myFirstName={myFirstName}
                  // setMyFirstName={setMyFirstName}
                  myCity={myCity}
                  SetMyCity={SetMyCity}
                  myCounty={myCounty}
                  setMyCounty={setMyCounty}
                  myStateProvince={myStateProvince}
                  setMyStateProvince={setMyStateProvince}
                  // loading={loading}
                  // successMessage={successMessage}
                  // errorMessage={errorMessage}
                  // onNewSightingSubmit={handleNewSightingSubmit}
                />
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </HydrationShield>
  );
};

export default SightingTable;
