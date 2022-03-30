import "./App.css";
import {
  FaGoogle,
  FaPlusCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaDirections,
  Facheck,
  FaCheck,
  FaRegTimesCircle,
} from "react-icons/fa";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useCallbackRef } from "use-callback-ref";
import Search from "./Search";
import Axios from "axios";

const libraries = ["places"];
const mapContainerStyle = {
  width: "76vw",
  height: "110vh",
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  const [algoresult, setalgoresult] = useState("");
  const [algoresultcar, setalgoresultcar] = useState("");
  const [weight, setWeight] = useState("");
  const [cweight, setCweight] = useState("");
  const [ccar, setCcar] = useState("");
  const [estimatedcost, setEstimatedCost] = useState("");
  const [capacityvehicle, setCapacityVehicle] = useState("");
  // const [directionResponse, setDirectionResponse] = useState(null);
  // const [directionResponse2, setDirectionResponse2] = useState(null);
  const [returnStop, setReturnStop] = useState("");

  const [directionResponse, setDirectionResponse] = useState([]);

  const getResult = () => {
    Axios.post("/", {
      pt: stops,
      wcost: parseFloat(weight),
      cost: Number(ccar),
      capcity: Number(capacityvehicle),
    })
      .then((response) => {
        console.log(response.data);
        setReturnStop(response.data.stops);
        setalgoresult(response.data.time);
        setalgoresultcar(response.data.vehicle);
        setEstimatedCost(response.data.cost);
        // setalgoresultcarcost(response.data.cost);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [markers, setMarkers] = React.useState([]);

  const [stops, setStops] = useState([null, null]);
  const randomcolour = [
    "#E5EFC1",
    "#4F44FF",
    "#39AEA9",
    "#392BFF",
    "#FF6C5E",
    "#557B83",
  ];
  const colourindex = 0;

  useEffect(() => {
    console.log(directionResponse);
  }, [directionResponse]);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading";

  function handleClick() {
    setStops([...stops, null]);
    // 1. [...stops, ]爆開stop array
    // 2. [null, null, ]
    // 3. [null, null, null]
  }
  function handleClick_remove() {
    setStops([null, null]);
  }

  async function displayRoute() {
    // const numberofstop=[
    //   {
    //       location: "lokfu",
    //       stopover: false,
    //    }
    //   ,
    //   {
    //     location:"kowloontong",
    //     stopover:false
    //   }
    // ];

    // console.log(returnStop[0].length);

    // For DEBUG
    // const returnStop = [
    //   ["Yuen Long, 香港", "Tai Po, 香港", "Yuen Long, 香港"],
    //   ["Yuen Long, 香港", "Tai Wai, 香港", "Yuen Long, 香港"],
    //   ["Yuen Long, 香港", "Lok Fu, 香港", "Yuen Long, 香港"],
    //   ["Yuen Long, 香港", "Hung Hom, 香港", "Yuen Long, 香港"],
    // ];
    // console.log(returnStop);

    const promises = [];

    for (let j = 0; j < returnStop.length; j++) {
      let numberofstop = [];
      for (let i = 1; i < returnStop[j].length - 1; i++) {
        numberofstop.push({ location: returnStop[j][i], stopover: true });
      }
      // console.log(numberofstop);
      // console.log(returnStop[0][0]);
      // console.log(returnStop[0][returnStop[0].length - 1]);

      const directionsService = new window.google.maps.DirectionsService();
      const method = await directionsService.route({
        travelMode: window.google.maps.TravelMode.DRIVING,
        origin: returnStop[0][0],
        destination: returnStop[0][returnStop[0].length - 1],
        waypoints: numberofstop,
      });
      promises.push(method);
    }

    Promise.all(promises).then((value) => {
      //等齊4個
      setDirectionResponse(value);
    });
  }

  function clearRoute() {
    setDirectionResponse("");
    // stops("");
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

          <HStack spacing={100}>
            <HStack>
              <Button
                leftIcon={<MdAddCircleOutline />}
                colorScheme="teal"
                variant="solid"
                marginTop={"10px"}
                marginBottom={"15px"}
                onClick={handleClick}
              >
                Add stops
              </Button>
              <div classname="helpbtn">
                <Button
                  leftIcon={<MdRemoveCircleOutline />}
                  variant="solid"
                  marginTop={"10px"}
                  colorScheme="red"
                  marginBottom={"15px"}
                  onClick={handleClick_remove}
                >
                  Remove stops
                </Button>
              </div>
            </HStack>

            <div classname="helpbtn">
              <Button
                leftIcon={<FaQuestionCircle />}
                colorScheme="yellow"
                onClick={onOpen}
                size="sm"
              >
                Help
              </Button>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Procedure :</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    abc
                    <br />
                    noe
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Got it!
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </HStack>

          <div className="goal">
            <div className="goal-title">
              <Box bg="grey" w="100%" p={0.2} color="white">
                Set your goal
              </Box>
            </div>
            <div className="goal-space">
              <div className="goal-words">
                <div className="goal-time">Enter your time weight(0-1) :</div>

                {/* <input className="input-number input-time " type="text" > */}
                <NumberInput
                  maxW={32}
                  step={0.1}
                  defaultValue={0.0}
                  min={0.0}
                  max={1}
                  marginLeft={"10px"}
                  onChange={(value) => setCweight(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <div className="goal-words">
                <div className="goal-cost">Enter your cost weight(0-1) :</div>
                {/* <input className="input-number input-weight" type="text" /> */}
                <NumberInput
                  maxW={32}
                  step={0.1}
                  defaultValue={0.0}
                  min={0.0}
                  max={1}
                  marginLeft={"10px"}
                  onChange={(value) => setWeight(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <div className="goal-words">
                <div className="costcar">
                  Enter the cost of each vehicle :
                  <Input
                    htmlSize={4}
                    width="120px"
                    onChange={(e) => {
                      setCcar(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="goal-words">
                <div className="capacitycar">
                  Enter the capacity of each vehicle :
                  <Input
                    htmlSize={4}
                    width="82px"
                    onChange={(e) => {
                      setCapacityVehicle(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="warning">
                <Alert status="warning">
                  <AlertIcon />
                  Time weight + cost must equal to 1
                </Alert>
              </div>
            </div>
          </div>
          {/* <div className="btnresult">
            <label htmlFor=""></label>
            <input type="text" onChange={this.getValue} />
          </div> */}
          {/* <div classname="confirmbtn">
            <Button leftIcon={<FaCheck />} colorScheme="blue" variant="solid">
              Confirm
            </Button>
          </div> */}

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
                  <Container maxW="container.md">{algoresult} mins</Container>
                </div>
              </div>
              <div className="result-words">
                <div className="result-cost">Estimated Cost:</div>
                <div className="result-number">
                  <Container maxW="container.md">{estimatedcost}</Container>
                </div>
              </div>
              <div className="result-words">
                <div className="result-vehicle">Required Vehicles:</div>

                <div className="result-number">
                  <Container maxW="container.md">{algoresultcar}</Container>
                </div>
              </div>
              {/* <div className="result-words">
                <div className="result-vehicle-price">
                  Cost of each vehicle:
                </div>

                <div className="result-number">
                  <Container maxW="container.md">
                    ${algoresultcarcost}
                  </Container>
                </div>
              </div> */}
              {/* <div className="result-vehicle-cap">
                Capacity of each vehicle:
              </div> */}
            </div>
          </div>
          <div className="route">
            <div className="algo-result-button">
              <Button
                colorScheme="blue"
                size="sm"
                id="get-btn"
                onClick={getResult}
                leftIcon={<FaCheck />}
              >
                Get result
              </Button>
            </div>
            <HStack>
              <button className="route-button">
                <Button
                  leftIcon={<FaDirections />}
                  colorScheme="teal"
                  size="lg"
                  onClick={displayRoute}
                >
                  View Route Directions
                </Button>
                <button className="clear-button">
                  <Button
                    colorScheme="red"
                    onClick={clearRoute}
                    size="md"
                    leftIcon={<FaRegTimesCircle />}
                  >
                    Reset Map
                  </Button>
                </button>
              </button>
            </HStack>
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
              {/* {markers.map((marker) => (
                <Marker
                  key={marker.time.toISOString()}
                  position={{ lat: marker.lat, lng: marker.lng }}
                />
              ))} */}

              {/* {directionResponse && (
                <DirectionsRenderer directions={directionResponse} />
              )}
              {directionResponse2 && (
                <DirectionsRenderer
                  directions={directionResponse2}
                  options={{ polylineOptions: { strokeColor: "#00FFFF" } }}
                />
              )} */}
              {directionResponse.length > 0 &&
                directionResponse.map((res, index) => (
                  <DirectionsRenderer
                    key={index}
                    directions={res}
                    options={{
                      polylineOptions: {
                        strokeColor: randomcolour[index],
                      },
                    }}
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
