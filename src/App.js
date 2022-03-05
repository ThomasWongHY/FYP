import "./App.css";
import { FaGoogle, FaPlusCircle, FaExclamationCircle } from "react-icons/fa";
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
import "@reach/combobox/styles.css";
import {
  ChakraProvider,
  Input,
  Button,
  ButtonGroup,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
} from "@chakra-ui/react";
import { MdAddCircleOutline } from "react-icons/md";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useCallbackRef } from "use-callback-ref";
import Search from "./Search";

const libraries = ["places"];
const mapContainerStyle = {
  width: "76vw",
  height: "100vh",
};
const center = {
  lat: 22.3476629743,
  lng: 114.151823768,
};

// type PlacesProps = {
//   setOffice: (position: google.maps.LatLngLiteral) => void,
// };

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  const [markers, setMarkers] = React.useState([]);

  const [stops, setStops] = useState([null, null]);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading";

  // const [office, setOffice] = useState<LatLngLiteral>();

  function handleClick() {
    setStops([...stops, null]);
    // 1. [...stops, ]爆開stop array
    // 2. [null, null, ]
    // 3. [null, null, null]
  }

  return (
    <ChakraProvider>
      <div className="App">
        <div className="algo">
          {stops.map((stop, index) => (
            <Search
              key={index}
              index={index}
              stops={stops}
              setStops={setStops}
            />
          ))}

          <Button
            leftIcon={<MdAddCircleOutline />}
            colorScheme="teal"
            variant="solid"
            margin={"20px"}
            onClick={handleClick}
          >
            Add stops
          </Button>
          <div className="goal">
            <div className="goal-title">
              <Box bg="grey" w="100%" p={0.2} color="white">
                Set your goal
              </Box>
            </div>
            <div className="goal-space">
              <div className="goal-words">
                <div className="goal-time">Enter your time weight(0-1):</div>
                {/* <input className="input-number input-time " type="text" > */}
                <NumberInput
                  maxW={32}
                  step={0.1}
                  defaultValue={0.0}
                  min={0.0}
                  max={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <div className="goal-words">
                <div className="goal-cost">Enter your cost weight(0-1):</div>
                {/* <input className="input-number input-weight" type="text" /> */}
                <NumberInput
                  maxW={32}
                  step={0.1}
                  defaultValue={0.0}
                  min={0.0}
                  max={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <div className="warning">
                <Alert status="warning">
                  <AlertIcon />
                  Time weight + cost must equal to 1
                </Alert>
              </div>
            </div>
          </div>

          <div className="result">
            <div className="result-title">
              <Box bg="grey" w="100%" p={0.2} color="white">
                Result
              </Box>
            </div>
            <div className="result-space">
              <div className="result-words">
                <div className="result-time">Estimated Time:</div>
                <div className="result-number">
                  <Container maxW="container.md">30 mins</Container>
                </div>
              </div>
              <div className="result-words">
                <div className="result-cost">Estimated Cost:</div>
                <div className="result-number">
                  <Container maxW="container.md">$20</Container>
                </div>
              </div>
              <div className="result-words">
                <div className="result-vehicle">Required Vehicles:</div>
                <div className="result-number">
                  <Container maxW="container.md">2</Container>
                </div>
              </div>
            </div>
          </div>
          <div className="route">
            <button className="route-button">
              <Button colorScheme="teal" size="md">
                View Route Directions
              </Button>
            </button>
          </div>
        </div>

        {/* <Search /> */}
        <div className="map">
          <div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={12}
              center={center}
              onLoad={onMapLoad}
              onClick={(event) => {
                setMarkers((current) => [
                  ...current,
                  {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    time: new Date(),
                  },
                ]);
              }}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.time.toISOString()}
                  position={{ lat: marker.lat, lng: marker.lng }}
                />
              ))}
              {
                /// <Places ></Places>*/
                /* //   setOffice={(position) => { */
                /* //     setOffice(position);
              //     mapRef.current?.panTo(position);
              //   }}
              // />
              // < office && <Marker position={office}></> */
              }
            </GoogleMap>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

// function Search() {
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestion,
//   } = usePlacesAutocomplete({
//     requestOptions: {
//       location: { lat: () => 22.396427, lng: () => 114.109497 },
//       radius: 100 * 1000,
//     },
//   });

//   useEffect(() => {
//     console.log(data);
//   }, [data]);

//   return (
//     <div className="search">
//       <Combobox
//         onSelect={async (address) => {
//           try {
//             const results = await getGeocode({ address });
//             const { lat, lng } = await getLatLng(results[0]);
//             console.log(lat, lng);
//             console.log(results[0]);
//           } catch (error) {
//             console.log("Error!");
//           }
//           console.log(address);
//         }}
//       >
//         <ComboboxInput
//           value={value}
//           onChange={(e) => {
//             setValue(e.target.value);
//           }}
//           disabled={!ready}
//           placeholder="Enter an address"
//         />
//         <ComboboxPopover>
//           {status === "OK" &&
//             data.map(({ id, description }) => (
//               <ComboboxOption key={id} value={description} />
//             ))}
//         </ComboboxPopover>
//       </Combobox>
//     </div>
//   );
// }

export default App;
