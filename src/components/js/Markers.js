import { Marker, Popup } from "react-leaflet";

let latLngCoordsObjArr = [];

function Markers(latLngCoordsData) {
  const MarkerElement = (props) => {
    const { elementData } = props;
    const { id, lat, lng } = elementData;
    let markerId = "marker-" + id;
    return (
      <>
        <Marker
          className="leaflet-map-marker"
          key={markerId}
          position={[lat, lng]}
        >
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
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
    console.log(latLngCoordsData);
    for (let i = 0; i < latLngCoordsData.latLngCoordsData.length; i++) {
      let markerObj = new Object();
      let id = i + 1;
      let lat = latLngCoordsData.latLngCoordsData[i][0];
      let lng = latLngCoordsData.latLngCoordsData[i][1];
      markerObj.id = id;
      markerObj.lat = lat;
      markerObj.lng = lng;
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
