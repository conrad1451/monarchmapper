"use client";
// ButterflyMap.tsx
import { useState, useEffect, useMemo } from "react";
import "../pagestyle.css";
import { Box, Button, Typography } from "@mui/material"; // Import necessary MUI components

// CHQ: Gemini AI refactored to import hook into parent component
import {
  useCustomDataFetch,
  useDefaultDataFetch,
} from "../hooks/useNewDataFetch";

import type {
  GeoJsonFeatureCollection,
  SidebarControlsProps,
  CoordListProps,
  RowPage,
  // SightingDisplayProps,
} from "../utils/dataTypes";

import { transformMonarchButterflyRecordToRowPage } from "../utils/dataTransforms";

import { useSightings } from "../hooks/useSightings";
// import { SightingDisplayV2 } from "./SightingDisplay";

import DatePicker from "./DatePicker";

import { MyMapComponent } from "./TestMaps/MyMapbox";
import { MyMapboxPopup } from "./TestMaps/MyMapboxPopup";
import { MyMapboxPopupWithLayers } from "./TestMaps/MyMapboxPopupWithLayers";
import { MyMapboxDynamicLayer } from "./TestMaps/MyMapboxPopupDynamicLayers";
// import { MyMapboxLayersAlt } from "./TestMaps/MyMapboxLayersAlt";

import SightingTable from "./SightingTable";

const SidebarControls = ({ currentMap, setMapType }: SidebarControlsProps) => {
  return (
    <>
      <h2>🗺️ Map Controls</h2>
      <p>Currently showing: **{currentMap}**</p>
      <button
        onClick={() => setMapType("Popup")}
        disabled={currentMap === "Popup"}
        style={{
          margin: "5px",
          padding: "10px",
          display: "block",
          width: "90%",
        }}
      >
        Show Popup Map
      </button>
      <button
        onClick={() => setMapType("PopupWithLayers")}
        disabled={currentMap === "PopupWithLayers"}
        style={{
          margin: "5px",
          padding: "10px",
          display: "block",
          width: "90%",
        }}
      >
        Show PopupWithLayers Map
      </button>
      <button
        onClick={() => setMapType("PopupWithDyanmicLayers")}
        disabled={currentMap === "PopupWithDyanmicLayers"}
        style={{
          margin: "5px",
          padding: "10px",
          display: "block",
          width: "90%",
        }}
      >
        Show PopupWithDyanmicLayers Map
      </button>
      {/* <button
        onClick={() => setMapType("PopupWithLayersAlt")}
        disabled={currentMap === "PopupWithLayersAlt"}
        style={{
          margin: "5px",
          padding: "10px",
          display: "block",
          width: "90%",
        }}
      >
        Show PopupWithLayersAlt Map
      </button> */}
      <button
        onClick={() => setMapType("Basic")}
        disabled={currentMap === "Basic"}
        style={{
          margin: "5px",
          padding: "10px",
          display: "block",
          width: "90%",
        }}
      >
        Show Basic Map
      </button>
    </>
  );
};

const MyApp = function (props: { coords: CoordListProps[] }) {
  // const [mapType, setMapType] = useState("Popup");
  // CHQ: Gemini AI changed default map
  // Change "Popup" to the component name that uses the dynamicGeoJson state
  const [mapType, setMapType] = useState("PopupWithDyanmicLayers");

  // CHQ: Gemini AI: 1. STATE AND HOOK LIFTED UP: Define state for dynamic data
  // const [dynamicGeoJson, setDynamicGeoJson] = useState({
  //   type: "FeatureCollection",
  //   features: [], // Starts with an empty array
  // });

  const [dynamicGeoJson, setDynamicGeoJson] =
    useState<GeoJsonFeatureCollection>({
      type: "FeatureCollection",
      features: [], // Starts with an empty array
    });

  const dataChoice: number = 2;

  // CHQ: Gemini AI: 2. HOOK CALL: Call the custom hook to get the stable fetch function
  const fetchNewData = useDefaultDataFetch(setDynamicGeoJson);

  const fetchCustomData = useCustomDataFetch(props.coords, setDynamicGeoJson);

  // CHQ: Gemini AI: 3. INITIAL DATA LOAD: Use useEffect to call the function on mount
  useEffect(() => {
    if (dataChoice === 1) {
      fetchNewData();
    } else {
      fetchCustomData();
    }
  }, [fetchNewData, fetchCustomData]); // fetchNewData is stable due to useCallback in the hook

  // CHQ: Gemini AI added
  // ADDED: useEffect to log the GeoJSON state whenever it changes
  useEffect(() => {
    console.log("🐛 dynamicGeoJson Updated:", dynamicGeoJson);
    // You can also check if the features array is populated:
    if (dynamicGeoJson.features.length > 0) {
      console.log(`✅ Loaded ${dynamicGeoJson.features.length} points.`);
      // Check the structure of the first feature to ensure it's GeoJSON
      console.log(
        "First Feature Geometry:",
        dynamicGeoJson.features[0].geometry
      );
    }
  }, [dynamicGeoJson]); // Dependency array ensures this runs whenever dynamicGeoJson state changes

  // Function to conditionally render the correct map component
  const renderMap = () => {
    switch (mapType) {
      case "Popup":
        return <MyMapboxPopup />;
      case "Basic":
        return <MyMapComponent />;
      case "PopupWithLayers":
        return <MyMapboxPopupWithLayers />;
      // case "PopupWithLayersAlt":
      //   return <MyMapboxLayersAlt />;
      case "PopupWithDyanmicLayers":
        // CHQ: Gemini AI: 4. PASS PROPS: Render the dynamic map and pass the data state
        return <MyMapboxDynamicLayer dynamicGeoJson={dynamicGeoJson} />;
      default:
        return <p>Select a map type from the sidebar.</p>;
    }
  };

  return (
    <>
      <div className="App">
        {/* <div className="header">
          <h1>Hello, Next.js! ({mapType} View)</h1>
        </div> */}
        <div className="container">
          <div className="sidebar">
            <SidebarControls currentMap={mapType} setMapType={setMapType} />
          </div>

          <div className="content">
            <h2>Main Content: Map Integration</h2>
            {renderMap()}

            {mapType === "PopupWithDyanmicLayers" && (
              <button
                onClick={dataChoice === 1 ? fetchNewData : fetchCustomData}
                // onClick={dataChoice === 1 ? fetchNewData() : fetchCustomData()}
                style={{
                  margin: "10px 5px", // Adjusted margin for better placement
                  padding: "10px",
                  display: "block",
                  width: "90%",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Generate random points ({dynamicGeoJson.features.length} points)
              </button>
            )}
          </div>
        </div>
        <div className="footer">
          <h3>The footer is here!</h3>
        </div>
      </div>
    </>
  );
};

// const MyButterflyContent = function (props: {}) {

const MyButterflyContent = function (props: {
  mapType: string;
  dataForTable: RowPage[];
  dynamicGeoJson: GeoJsonFeatureCollection;
  loading: boolean;
  // error: boolean;
  error: string | null;
  refetchSightings: () => void;
}) {
  const {
    mapType,
    dataForTable,
    dynamicGeoJson,
    loading,
    error,
    refetchSightings,
  } = props;

  const renderMap = () => {
    switch (mapType) {
      case "Popup":
        return <MyMapboxPopup />;
      case "Basic":
        return <MyMapComponent />;
      case "PopupWithLayers":
        // return <MyMapboxPopupWithLayers />;
        return <SightingTable thePages={dataForTable} />;

      // case "PopupWithLayersAlt":
      //   return <MyMapboxLayersAlt />;
      case "PopupWithDyanmicLayers":
        // CHQ: Gemini AI: 4. PASS PROPS: Render the dynamic map and pass the data state
        return <MyMapboxDynamicLayer dynamicGeoJson={dynamicGeoJson} />;
      default:
        return <p>Select a map type from the sidebar.</p>;
    }
  };

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
            <Button
              variant="contained"
              onClick={refetchSightings}
              sx={{ mt: 2 }}
            >
              Retry Fetch
            </Button>
          </Box>
        ) : (
          <div>{renderMap()}</div>
        )}
      </>

      {/* <div>
                <SightingDisplayV2
                  sightingDate={props.chosenDate}
                  setLatLongList={props.setButterflyCoords}
                  exposeRefetch={setTrigger}
                />
              </div> */}

      {/* <Button
                variant="outlined"
                color="secondary"
                onClick={() => triggerUpdateOfSightingDisplay?.()}
                sx={{ mt: 2 }}
              >
                View Data for {props.chosenDate}
              </Button> */}
    </div>
  );
};

export const ButterflyMap = function (props: {
  coords: CoordListProps[];
  chosenDate: string;
  setChosenDate: (date: string) => void;
  setButterflyCoords: React.Dispatch<React.SetStateAction<CoordListProps[]>>;
}) {
  // const [mapType, setMapType] = useState("Popup");
  // CHQ: Gemini AI changed default map
  // Change "Popup" to the component name that uses the dynamicGeoJson state

  const { coords, chosenDate, setChosenDate, setButterflyCoords } = props;
  // const { coords, chosenDate, setButterflyCoords } = props;

  const [mapType, setMapType] = useState("PopupWithDyanmicLayers");

  const { sightings, loading, error, refetchSightings } = useSightings({
    // sightingDate: "06302025",
    // sightingDate: props.sightingDate,
    sightingDate: chosenDate,
  });

  // CHQ: Gemini AI: 1. STATE AND HOOK LIFTED UP: Define state for dynamic data
  // const [dynamicGeoJson, setDynamicGeoJson] = useState({
  //   type: "FeatureCollection",
  //   features: [], // Starts with an empty array
  // });

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
      // props.setButterflyCoords(coordList);
      setButterflyCoords(coordList);
    } else {
      // Optionally clear the map if data is cleared
      // props.setButterflyCoords([]);
      setButterflyCoords([]);
    }
    // }, [coordList, props.setButterflyCoords, dataForTable.length]);
  }, [coordList, setButterflyCoords, dataForTable.length]);

  // CHQ: ChatGPT added
  // const [triggerUpdateOfSightingDisplay, setTrigger] = useState<
  //   (() => void) | null
  // >(null);

  const [dynamicGeoJson, setDynamicGeoJson] =
    useState<GeoJsonFeatureCollection>({
      type: "FeatureCollection",
      features: [], // Starts with an empty array
    });

  const dataChoice: number = 2;

  // CHQ: Gemini AI: 2. HOOK CALL: Call the custom hook to get the stable fetch function
  const fetchNewData = useDefaultDataFetch(setDynamicGeoJson);

  // const fetchCustomData = useCustomDataFetch(props.coords, setDynamicGeoJson);
  const fetchCustomData = useCustomDataFetch(coords, setDynamicGeoJson);

  // CHQ: Gemini AI: 3. INITIAL DATA LOAD: Use useEffect to call the function on mount
  useEffect(() => {
    if (dataChoice === 1) {
      fetchNewData();
    } else {
      fetchCustomData();
    }
  }, [fetchNewData, fetchCustomData]); // fetchNewData is stable due to useCallback in the hook

  // CHQ: Gemini AI added
  // ADDED: useEffect to log the GeoJSON state whenever it changes
  useEffect(() => {
    console.log("🐛 dynamicGeoJson Updated:", dynamicGeoJson);
    // You can also check if the features array is populated:
    if (dynamicGeoJson.features.length > 0) {
      console.log(`✅ Loaded ${dynamicGeoJson.features.length} points.`);
      // Check the structure of the first feature to ensure it's GeoJSON
      console.log(
        "First Feature Geometry:",
        dynamicGeoJson.features[0].geometry
      );
    }
  }, [dynamicGeoJson]); // Dependency array ensures this runs whenever dynamicGeoJson state changes

  // Function to conditionally render the correct map component

  return (
    <>
      <div className="App">
        {/* <div className="header">
          <h1>Hello, Next.js! ({mapType} View)</h1>
        </div> */}
        <div className="container">
          <div className="sidebar">
            <SidebarControls currentMap={mapType} setMapType={setMapType} />
          </div>

          <div className="content">
            <h2>Main Content: Map Integration</h2>
            <MyButterflyContent
              mapType={mapType}
              dataForTable={dataForTable}
              dynamicGeoJson={dynamicGeoJson}
              loading={loading}
              error={error}
              refetchSightings={refetchSightings}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={refetchSightings}
              sx={{ mt: 2 }}
            >
              View Data for {chosenDate}
            </Button>
            <DatePicker
              setDate={setChosenDate}
              currentDateDisplay={chosenDate}
            />
          </div>
        </div>
        <div className="footer">
          <h3>The footer is here!</h3>
        </div>
      </div>
    </>
  );
};

export function ButterflyMapSimple(props: {
  monarchCoordinates: CoordListProps[];
}) {
  return (
    <>
      <MyApp coords={props.monarchCoordinates} />
    </>
  );
}

// export function ButterflyMapComplex(props: {
//   monarchCoordinates: CoordListProps[];
//   sightingDate: string;
//   setDate: (date: string) => void;
//   setButterflyCoords: React.Dispatch<React.SetStateAction<CoordListProps[]>>;
// }) {
//   const { monarchCoordinates, sightingDate, setDate, setButterflyCoords } =
//     props;

//   return (
//     <>
//       <ButterflyMap
//         coords={monarchCoordinates}
//         chosenDate={sightingDate}
//         setChosenDate={setDate}
//         setButterflyCoords={setButterflyCoords}
//       />
//     </>
//   );
// }
