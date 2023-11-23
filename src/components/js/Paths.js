import { Polyline } from "react-leaflet";
import React from "react";

let latLngCoordsArr = [];

function Paths(params) {
  const PathElement = (props) => {
    const elementData = props;
    return (
      <>
        <Polyline
          className="leaflet-path"
          positions={elementData}
          color="light blue"
        />
      </>
    );
  };

  const retrievePathData = () => {
    return PathElement(latLngCoordsArr);
  };

  const populatePathData = () => {
    for (const key in params.locationObjectsData) {
      const location = params.locationObjectsData[key];
      latLngCoordsArr.push(location["coords"]);
    }
  };

  latLngCoordsArr = [];
  populatePathData();

  return (
    <>
      <div className="path-element">{retrievePathData()}</div>
    </>
  );
}

export default Paths;
