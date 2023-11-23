import L from "leaflet";

export const backendPort = 5000;
export const mapQuestKey = "ghmpUiVTD8GQkci0Vv1pLFj1L4T9BSbA";
export const defaultCenter = [37.5, -95.0];
export const defaultZoom = 4;
export const red = "#FF0000";
export const green = "#006400";
export const clearPathColor = "#1B9C85";
export const southWestBound = L.latLng(24.396308, -125.0);
export const northEastBound = L.latLng(49.345786, -66.93457);
export const bounds = L.latLngBounds(southWestBound, northEastBound).pad(1);
export const minZoom = 3;
export const maxZoom = 12;
