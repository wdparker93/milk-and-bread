import { Marker, Popup } from "react-leaflet";
import React, { useState } from "react";

let latLngCoordsObjArr = [];

function Markers(params) {
  const MarkerElement = (props) => {
    const { elementData } = props;
    const { id, lat, lng, milk, bread } = elementData;
    let locationId = id;
    return (
      <>
        <Marker
          className="leaflet-map-marker"
          key={locationId}
          position={[lat, lng]}
        >
          <Popup>
            <span>
              <h3>Location Inventory</h3>
              <p>Id : {locationId}</p>
              <p>Milk : {milk}</p>
              <p>Bread : {bread}</p>
              <button
                class="update-inventory-button"
                onClick={() => params.updateInvHandler(locationId)}
              >
                Manage Inventory
              </button>
            </span>
          </Popup>
        </Marker>
      </>
    );
  };

  const retrieveMarkerData = () => {
    return latLngCoordsObjArr.map((el) => <MarkerElement elementData={el} />);
  };

  const populateMarkerData = () => {
    for (let i = 0; i < params.locationObjectsData.length; i++) {
      let markerObj = new Object();
      let id = params.locationObjectsData[i].key;
      let lat = params.locationObjectsData[i].coords[0];
      let lng = params.locationObjectsData[i].coords[1];
      let milk = params.locationObjectsData[i].milk;
      let bread = params.locationObjectsData[i].bread;
      markerObj.id = id;
      markerObj.lat = lat;
      markerObj.lng = lng;
      markerObj.milk = milk;
      markerObj.bread = bread;
      latLngCoordsObjArr.push(markerObj);
    }
  };

  latLngCoordsObjArr = [];
  populateMarkerData();

  return (
    <>
      <div class="marker-test-from-return">{retrieveMarkerData()}</div>
    </>
  );
}

export default Markers;
