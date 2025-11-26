"use client";

// CHQ: Gemini AI created

import * as React from "react";
import { useState, useMemo } from "react"; // Added useMemo for static data
import Map, {
  Popup,
  Source,
  Layer,
  type LayerProps,
} from "react-map-gl/mapbox"; // 1. Import Source and Layer, and LayerProps type
import "mapbox-gl/dist/mapbox-gl.css";

// 2. Define the style properties for the new layer
// This layer will draw a line around the GeoJSON features.
const layerStyle: LayerProps = {
  id: "us-state-boundaries", // Unique ID for the layer
  type: "line", // The type of visualization (e.g., fill, line, circle, symbol)
  source: "states", // Must match the Source component's id
  layout: {},
  paint: {
    "line-color": "#0099ff", // Blue line color
    "line-width": 2, // Line thickness
  },
};

export function MyMapboxPopupWithLayers() {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const MAPBOX_TOKEN =
    import.meta.env.VITE_BUTTERFLY_MAPBOX_KEY ||
    "YOUR_MAPBOX_PUBLIC_TOKEN_HERE";

  // 3. Define the data source. Using a simple GeoJSON URL for US states.
  const geojsonUrl =
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_1_states_provinces_lines.geojson";

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {/* 4. Add the Source component inside the Map */}
      <Source
        id="states" // Unique ID for the data source
        type="geojson"
        data={geojsonUrl} // The URL or object containing the GeoJSON data
      />

      {/* 5. Add the Layer component, referencing the Source ID */}
      <Layer {...layerStyle} />

      {showPopup && (
        <Popup
          longitude={-100}
          latitude={40}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
        >
          You are here
        </Popup>
      )}
    </Map>
  );
}
