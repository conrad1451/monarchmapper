// dataTransforms.ts

import type { Item } from "./dataTypes";

import type { RowPage, MonarchButterflyRecord } from "./dataTypes";

/**
 * Creates a stable, deterministic ID for records that might lack a primary key.
 * This prevents React Hydration Mismatch (Error #527).
 */
function generateStableId(page: MonarchButterflyRecord, index: number): string {
  // 1. Priority: Use the official Global Biodiversity ID if it exists
  if (page.gbifID) return String(page.gbifID);

  // 2. Secondary: Use the record's internal ID if it exists
  if (page.id) return String(page.id);

  // 3. Fallback: Create a hash string from unique sighting data
  // Even if index changes, the data attributes remain the same.
  return `alt-${page.decimalLatitude}-${page.decimalLongitude}-${page.eventDate}`;
}

export function createCustomTableData(
  myID: number,
  cityOrTown: string,
  countryCode: string,
  county: string,
  time_only: string,
  date_only: Date,
  day: number,
  day_of_week: number,
  decimalLatitude: number,
  decimalLongitude: number,
  eventDate: Date,
  stateProvince: string,
  week_of_year: number,
  year: number,
  month: string,
  gbifID: string
): RowPage {
  return {
    myID,
    cityOrTown,
    countryCode,
    county,
    time_only,
    date_only,
    day,
    day_of_week,
    decimalLatitude,
    decimalLongitude,
    eventDate,
    stateProvince,
    week_of_year,
    year,
    month,
    gbifID,
  };
}

// Note: The mapPagesToCustomTableData function (if it exists in your MyTable.tsx)
// will also need to be updated to pass arguments to createCustomTableData in this new order.
// For example:
/**/
// export function mapPagesToCustomTableData(pages: MonarchButterflyRecord[]): RowPage[] {
//   return pages.map((page) =>
//     createCustomTableData(
//       page.id,
//       page.FirstName,
//       page.LastName,
//       page.Email,
//       page.Major
//     )
//   );
// }

// Helper function to transform MonarchButterflyRecord to RowPage
export function transformMonarchButterflyRecordToRowPage(
  pages: MonarchButterflyRecord[]
): RowPage[] {
  return pages.map((page, index) => {
    // Generate the stable ID once here
    const stableIdString = generateStableId(page, index);
    const stableIdNumber = page.id || 1000 + index; // Consistent offset for numeric ID needs

    return {
      myID: stableIdNumber,
      cityOrTown: page.cityOrTown,
      countryCode: page.countryCode,
      county: page.county,
      time_only: page.time_only,
      date_only: page.date_only,
      day: page.day,
      day_of_week: page.day_of_week,
      decimalLatitude: page.decimalLatitude,
      decimalLongitude: page.decimalLongitude,
      eventDate: page.eventDate,
      stateProvince: page.stateProvince,
      week_of_year: page.week_of_year,
      year: page.year,
      month: page.month,
      gbifID: stableIdString, // Now guaranteed to be a stable string
    };
  });
}
/**
 * Generates a list of unique property values from an array of RowPage objects,
 * suitable for populating dropdown filters. It can handle both single-string properties
 * (like 'Source' or 'Area') and array-of-string properties (like 'Tags').
 *
 * @param myTableView An array of `RowPage` objects representing the current table data.
 * This data is used to extract the property values.
 * @param selection The key (property name) from `RowPage` whose values are to be extracted.
 * This function is designed to work with string or string array properties.
 * Example: "Tags", "Source", "Area".
 * @returns An array of `Item` objects, where each `Item` has a `value` property (string).
 * Each `value` in the returned list is a unique, non-empty string extracted
 * from the specified `selection` property across all `myTableView` rows.
 */
export function producePropList(
  myTableView: RowPage[],
  selection: keyof RowPage
): Item[] {
  // Helper to determine if the property on RowPage is expected to be an array of strings.
  // This list should be updated if new array-type properties are added to RowPage
  // that need to be processed by this function.
  const isArrayProp = (prop: keyof RowPage) =>
    ["Area", "Source", "Tags"].includes(prop as string);

  // Use reduce to iterate over each row and accumulate all relevant property values
  // into a single flat array of strings.
  const rawList: string[] = myTableView.reduce<string[]>((accumulator, row) => {
    const propValue = row[selection]; // Get the value of the selected property from the current row

    // Check if the property is expected to be an array and if its value is indeed an array.
    if (isArrayProp(selection) && Array.isArray(propValue)) {
      // CHQ: The two lines below determine the text that fills the options for the dropdown list
      // If it's an array, spread its elements into the accumulator.
      // return [...accumulator, ..."propValue"];
      return [...accumulator, ...propValue];
    } else if (
      // If it's not an array property, check if its value is a non-empty string.
      // CHQ: No need to keep single selects out of options that dropdown can select from
      // !isArrayProp(selection) &&
      typeof propValue === "string" &&
      propValue.trim() !== ""
    ) {
      // If it's a valid non-empty string, add it to the accumulator.
      return [...accumulator, propValue];
    }
    // If the value is not a string, or an empty string, or doesn't match the expected type,
    // it's ignored and the accumulator remains unchanged.
    return accumulator;
  }, []);

  // Create a Set from the raw list to automatically filter out duplicate values,
  // then convert it back to an array.
  const uniqueList = [...new Set(rawList)];

  // Map the unique string values into the { value: string } format required by the Item interface.
  const propList: Item[] = uniqueList.map((theProp, id) => ({
    id: id,
    value: theProp,
  }));

  return propList;
}
