"use client";
// Sources:
// [1]: https://visgl.github.io/react-map-gl/docs/api-reference/mapbox/popup

import * as React from "react";
import { useState } from "react";
import Map, { Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export function MyMapboxPopup() {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const MAPBOX_TOKEN =
    import.meta.env.VITE_BUTTERFLY_MAPBOX_KEY ||
    "YOUR_MAPBOX_PUBLIC_TOKEN_HERE";

  return (
    <Map
      // https://visgl.github.io/react-map-gl/docs/get-started/mapbox-tokens
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
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
