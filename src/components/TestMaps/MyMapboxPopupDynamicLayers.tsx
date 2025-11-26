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

const pointLayerStyle: LayerProps = {
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

  return (
    <div>
      {/* 2. Button has been REMOVED (it is now in page.tsx) */}

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

        <Layer {...pointLayerStyle} />

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
