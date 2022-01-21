import "./App.css";
import { FaGoogle, FaPlusCircle } from "react-icons/fa";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { useEffect } from "react";
import { ChakraProvider, Input, Button, ButtonGroup } from "@chakra-ui/react";
import { MdAddCircleOutline } from "react-icons/md";

const libraries = ["places"];
const mapContainerStyle = {
  width: "60vw",
  height: "100vh",
};
const center = {
  lat: 22.396427,
  lng: 114.109497,
};
function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });
  if (loadError) return "Error";
  if (!isLoaded) return "Loading";
  return (
    <ChakraProvider>
      <div className="App">
        <div className="algo">
          {/* <h2>Start over</h2> */}
          {/* <img
         src="https://png.pngtree.com/png-vector/20191021/ourlarge/pngtree-vector-car-icon-png-image_1834527.jpg"
      /> */}
          {/* <input
            className="address"
            type="text"
            placeholder="Enter any address"
          /> */}
          <Input placeholder="Enter any address" />
          {/* <input
            className="address"
            type="text"
            placeholder="Enter any address"
          /> */}
          <Input placeholder="Enter any address" />
          {/* <div className="stop-button">
            <FaPlusCircle />
            Add stop
          </div> */}

          <Button
            leftIcon={<MdAddCircleOutline />}
            colorScheme="teal"
            variant="solid"
          >
            Add Stop
          </Button>
          <div className="goal">
            <div className="goal-title">Set your goal </div>
            <div className="goal-space">
              <div className="goal-words">
                <div className="goal-time">Enter your time weight(0-1):</div>
                <input className="input-number input-time " type="text" />
              </div>
              <div className="goal-words">
                <div className="goal-cost">Enter your cost weight(0-1):</div>
                <input className="input-number input-weight" type="text" />
              </div>
              <div className="warning">Time weight + cost must equal to 1</div>
            </div>
          </div>

          <div className="result">
            <div className="result-title">Result</div>
            <div className="result-space">
              <div className="result-words">
                <div className="result-time">Estimated Time:</div>
                <div className="result-number">30 mins</div>
              </div>
              <div className="result-words">
                <div className="result-cost">Estimated Cost:</div>
                <div className="result-number">$20</div>
              </div>
              <div className="result-words">
                <div className="result-vehicle">Required Vehicles:</div>
                <div className="result-number">2</div>
              </div>
            </div>
          </div>
          <div className="route">
            <button className="route-button">View Route Directions</button>
          </div>
        </div>

        <Search />
        <div className="map">
          <div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={8}
              center={center}
            ></GoogleMap>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

function Search() {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestion,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 22.396427, lng: () => 114.109497 },
      radius: 100 * 1000,
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="search">
      <Combobox
        OnSelect={(address) => {
          console.log(address);
        }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          disabled={!ready}
          placeholder="Enter an address"
        />
        <ComboboxPopover>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default App;
