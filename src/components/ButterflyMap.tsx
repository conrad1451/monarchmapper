"use client";
// page.tsx
import { useState, useEffect } from "react";
// import "./pagestyle.css";

// CHQ: Gemini AI refactored to import hook into parent component
import { useNewDataFetch } from "../hooks/useNewDataFetch";

import type {
  GeoJsonFeatureCollection,
  SidebarControlsProps,
} from "../utils/dataTypes";

import { MyMapComponent } from "./TestMaps/MyMapbox";
import { MyMapboxPopup } from "./TestMaps/MyMapboxPopup";
import { MyMapboxPopupWithLayers } from "./TestMaps/MyMapboxPopupWithLayers";
import { MyMapboxDynamicLayer } from "./TestMaps/MyMapboxPopupDynamicLayers";
// import { MyMapboxLayersAlt } from "./TestMaps/MyMapboxLayersAlt";

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

const MyApp = function () {
  const [mapType, setMapType] = useState("Popup");

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

  // CHQ: Gemini AI: 2. HOOK CALL: Call the custom hook to get the stable fetch function
  const fetchNewData = useNewDataFetch(setDynamicGeoJson);

  // CHQ: Gemini AI: 3. INITIAL DATA LOAD: Use useEffect to call the function on mount
  useEffect(() => {
    fetchNewData(); //
  }, [fetchNewData]); // fetchNewData is stable due to useCallback in the hook

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
        <div className="header">
          <h1>Hello, Next.js! ({mapType} View)</h1>
        </div>
        <div className="container">
          <div className="sidebar">
            <SidebarControls currentMap={mapType} setMapType={setMapType} />
          </div>

          <div className="content">
            <h2>Main Content: Map Integration</h2>
            {renderMap()}

            {/* 5. CHQ: Gemini put button here: Conditionally render and wire the button */}
            {mapType === "PopupWithDyanmicLayers" && (
              <button
                onClick={fetchNewData} //
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

export default function ButterflyMap() {
  return (
    <>
      <MyApp />
    </>
  );
}
