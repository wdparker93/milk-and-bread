let locationArray = [];

function Locations(params) {
  const LocationOptionElement = (props) => {
    const { elementData } = props;
    //console.log(locationArray);
    //console.log(elementData);
    return (
      <>
        <option value={elementData}>{elementData}</option>
      </>
    );
  };

  const populateLocationData = () => {
    locationArray.push("--");
    for (const key in params.locationObjectsData) {
      const locationObject = params.locationObjectsData[key];
      //console.log(locationObject);
      let insertToArray = true;
      for (let i = 0; i < locationArray.length; i++) {
        if (key === locationArray[i]) {
          insertToArray = false;
        }
      }
      if (insertToArray === true) {
        locationArray.push(key);
      }
    }
  };

  const retrieveLocationData = () => {
    return locationArray.map((el) => (
      <LocationOptionElement elementData={el} />
    ));
  };

  locationArray = [];
  populateLocationData();

  return <>{retrieveLocationData()}</>;
}

export default Locations;
