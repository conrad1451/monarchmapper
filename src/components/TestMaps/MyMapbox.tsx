"use client";
// Using Mapbox
import * as React from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export function MyMapComponent() {
  const MAPBOX_TOKEN =
    import.meta.env.VITE_PUBLIC_MAPBOX_KEY || "YOUR_MAPBOX_PUBLIC_TOKEN_HERE";

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
      // StyleSpecification="mapbox://styles/mapbox/streets-v9"
    />
  );

  /**  Property 'StyleSpecification' does not exist on type 'IntrinsicAttributes & MapInitOptions & Partial<ViewState> & MapCallbacks & { mapboxAccessToken?: string | undefined; ... 10 more ...; cursor?: string | undefined; } & GlobalSettings & { ...; } & RefAttributes<...>'.ts(2322)
   */
}
