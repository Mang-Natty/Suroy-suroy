"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type MapStop = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  index: number;
};

// CARTO Voyager raster tiles — free with visible OSM + CARTO attribution
// (same proven setup as the portfolio's AtlasMap).
const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    voyager: {
      type: "raster",
      tiles: ["a", "b", "c", "d"].map(
        (s) =>
          `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png`,
      ),
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: "voyager", type: "raster", source: "voyager" }],
};

// Cebu as a neutral PH default before any stop exists
const PH_CENTER: [number, number] = [123.89, 10.32];

const ROUTE_SOURCE = "day-route";

export default function TripMap({
  stops,
  route,
  pending,
  onMapClick,
}: {
  stops: MapStop[];
  route?: [number, number][];
  /** A tapped-but-not-yet-confirmed pin */
  pending?: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const pendingMarkerRef = useRef<maplibregl.Marker | null>(null);
  const loadedRef = useRef(false);
  const clickRef = useRef(onMapClick);
  clickRef.current = onMapClick;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: PH_CENTER,
      zoom: 9,
      attributionControl: { compact: false },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }));
    map.on("click", (e) => clickRef.current?.(e.lngLat.lat, e.lngLat.lng));
    map.on("load", () => {
      loadedRef.current = true;
      map.addSource(ROUTE_SOURCE, {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });
      map.addLayer({
        id: "day-route-casing",
        type: "line",
        source: ROUTE_SOURCE,
        paint: { "line-color": "#123f3a", "line-width": 7, "line-opacity": 0.9 },
        layout: { "line-cap": "round", "line-join": "round" },
      });
      map.addLayer({
        id: "day-route-line",
        type: "line",
        source: ROUTE_SOURCE,
        paint: { "line-color": "#c2410c", "line-width": 4 },
        layout: { "line-cap": "round", "line-join": "round" },
      });
      syncRoute();
    });
    mapRef.current = map;
    return () => {
      loadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncRoute() {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    const src = map.getSource(ROUTE_SOURCE) as maplibregl.GeoJSONSource | undefined;
    src?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: route ?? [] },
    });
  }

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = stops.map((stop) => {
      const el = document.createElement("div");
      el.style.cssText =
        "width:32px;height:32px;border-radius:9999px;border:2px solid #123f3a;" +
        "background:#f2a93b;color:#123f3a;display:flex;align-items:center;" +
        "justify-content:center;font-weight:800;font-size:14px;" +
        "box-shadow:2px 2px 0 #123f3a;cursor:default;";
      el.textContent = String(stop.index);
      el.setAttribute("aria-label", `Stop ${stop.index}: ${stop.title}`);
      return new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([stop.lng, stop.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20, closeButton: false }).setText(
            stop.title,
          ),
        )
        .addTo(map);
    });

    const points: [number, number][] = [
      ...stops.map((s) => [s.lng, s.lat] as [number, number]),
      ...(route ?? []),
    ];
    if (points.length > 0) {
      const bounds = points.reduce(
        (b, p) => b.extend(p),
        new maplibregl.LngLatBounds(points[0], points[0]),
      );
      map.fitBounds(bounds, { padding: 56, maxZoom: 14, duration: 400 });
    }

    syncRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, route]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    pendingMarkerRef.current?.remove();
    pendingMarkerRef.current = null;
    if (!pending) return;
    const el = document.createElement("div");
    el.style.cssText =
      "width:32px;height:32px;border-radius:9999px;border:2px solid #123f3a;" +
      "background:#c2410c;color:#fffdf7;display:flex;align-items:center;" +
      "justify-content:center;font-weight:800;font-size:18px;line-height:1;" +
      "box-shadow:2px 2px 0 #123f3a;";
    el.textContent = "+";
    el.setAttribute("aria-label", "New pin — confirm below to add a stop");
    pendingMarkerRef.current = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat([pending.lng, pending.lat])
      .addTo(map);
  }, [pending]);

  return (
    <div
      ref={containerRef}
      className="h-[45dvh] min-h-72 w-full rounded-2xl border-2 border-ink shadow-poster"
      role="region"
      aria-label="Trip map"
    />
  );
}
