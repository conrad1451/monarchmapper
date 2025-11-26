"use client";

// MyMapboxPopupDynamicLayers.tsx

import * as React from "react";

import Map, {
  Popup,
  Source,
  Layer,
  type LayerProps,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

import type { MyMapboxDynamicLayerProps } from "../../utils/dataTypes";

const stateBoundariesLayer: LayerProps = {
  id: "us-state-boundaries", // Unique ID for the layer
  type: "line", // The type of visualization (e.g., fill, line, circle, symbol)
  source: "states", // Must match the Source component's id
  layout: {},
  paint: {
    "line-color": "#0099ff", // Blue line color
    "line-width": 2, // Line thickness
  },
};

const butterflyCoordsLayer: LayerProps = {
  id: "dynamic-points",
  type: "circle",
  source: "dynamic-data",
  paint: {
    "circle-color": "#ff4500",
    "circle-radius": 6,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};

// 1. Component accepts dynamicGeoJson as a prop
export function MyMapboxDynamicLayer({
  dynamicGeoJson,
}: MyMapboxDynamicLayerProps) {
  // Keep local state for the popup
  const [showPopup, setShowPopup] = React.useState<boolean>(true);

  const MAPBOX_TOKEN =
    import.meta.env.VITE_BUTTERFLY_MAPBOX_KEY ||
    "YOUR_MAPBOX_PUBLIC_TOKEN_HERE";

  const geojsonUrl =
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_1_states_provinces_lines.geojson";

  return (
    <div>
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
        {/* 3. The Source component uses the prop data */}
        <Source
          id="dynamic-data"
          type="geojson"
          data={dynamicGeoJson} // <--- Uses the prop passed from the parent
        />

        <Layer {...butterflyCoordsLayer} />

        {/* 4. Add the Source component inside the Map */}
        <Source
          id="states" // Unique ID for the data source
          type="geojson"
          data={geojsonUrl} // The URL or object containing the GeoJSON data
        />

        {/* 5. Add the Layer component, referencing the Source ID */}
        <Layer {...stateBoundariesLayer} />

        {showPopup && (
          <Popup
            longitude={-100}
            latitude={40}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
          >
            Initial Center
          </Popup>
        )}
      </Map>
    </div>
  );
}
