import L from "leaflet";

export const backendJSPort = 5000;
export const backendPythonPort = 4000;
export const mapQuestKey = "ghmpUiVTD8GQkci0Vv1pLFj1L4T9BSbA";
export const defaultCenter = [37.5, -95.0];
export const defaultZoom = 4;
export const red = "#FF0000";
export const green = "#006400";
export const clearPathColor = "#1B9C85";
export const southWestBound = L.latLng(24.396308, -125.0);
export const northEastBound = L.latLng(49.345786, -66.93457);
export const bounds = L.latLngBounds(southWestBound, northEastBound).pad(2);
export const minZoom = 3;
export const maxZoom = 12;
export const minGrocerySalesDataDate = "2019-10-06";
export const maxGrocerySalesDataDate = "2023-05-07";
