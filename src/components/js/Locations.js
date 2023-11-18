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
    for (let i = 0; i < params.locationObjectsData.length; i++) {
      const locationObject = params.locationObjectsData[i];
      //console.log(locationObject);
      const locationId = locationObject.key;
      if (locationArray.length > 0) {
        locationArray.push(locationId);
      } else {
        let insertToArray = true;
        for (let j = 0; j < locationArray.length; j++) {
          if (locationId === locationArray[i]) {
            insertToArray = false;
          }
        }
        if (insertToArray === true) {
          locationArray.push(locationId);
        }
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
