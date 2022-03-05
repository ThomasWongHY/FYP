import "./App.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import React, { useState, useEffect } from "react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

const Search = ({ stops, setStops, index }) => {
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

  return (
    <>
      <AutoComplete
        openOnFocus
        onChange={async (address) => {
          try {
            const results = await getGeocode({ address }); //address 係到
            const { lat, lng } = await getLatLng(results[0]);
            console.log(lat, lng);
            console.log(address);
            const newplaces = [...stops];
            newplaces[index] = { address }; // This address is slightly different from what from the input, maybe use address instead
            setStops(newplaces);
          } catch (error) {
            console.log("Error!");
          }
        }}
      >
        <AutoCompleteInput
          variant="filled"
          placeholder="Enter any address"
          marginBottom={"10px"}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        {status === "OK" && (
          <AutoCompleteList>
            {data.map(({ id, description }) => (
              <AutoCompleteItem
                key={id}
                value={description}
                textTransform="capitalize"
              >
                {description}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        )}
      </AutoComplete>
    </>
  );
};

export default Search;
