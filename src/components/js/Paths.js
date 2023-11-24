import { Polyline } from "react-leaflet";
import React from "react";
import { clearPathColor } from "../../util/Constants.js";

let latLngCoordsArr = [];

function Paths(params) {
  const PathElement = (props) => {
    const elementData = props;
    return (
      <>
        <Polyline
          className="leaflet-path"
          positions={elementData}
          color={clearPathColor}
        />
      </>
    );
  };

  const retrievePathData = () => {
    for (let i = 0; i < latLngCoordsArr.length; i++) {
      return PathElement(latLngCoordsArr[i]);
    }
  };

  latLngCoordsArr = params.coordsArrayData;

  return (
    <>
      <div className="path-element">{retrievePathData()}</div>
    </>
  );
}

export default Paths;
