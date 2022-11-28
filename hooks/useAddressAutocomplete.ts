import { useRouter } from "next/router";
import {
  selectSearchQuery,
  setSearchQuery,
} from "./../store/slices/searchSlice";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";

const useAddressAutocomplete = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue),
    [suggestions, setSuggestions] = useState<any[]>([]);

  const searchQuery = useAppSelector(selectSearchQuery) as string;
  const router = useRouter();
  const dispatch = useAppDispatch();

  let types: string;

  if (
    router.pathname === "/create-tour" ||
    router.pathname === "/update-tour"
  ) {
    types = "address";
  } else {
    types = "country,region,place,poi";
  }

  const MAPBOX_ENDPOINT = `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=US&types=${types}&autocomplete=true`;

  const handleAddressChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (searchQuery) dispatch(setSearchQuery(""));

    try {
      const response = await fetch(MAPBOX_ENDPOINT);
      const results = await response.json();
      console.log(results);
      setSuggestions(results.features);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    value,
    handleAddressChange,
    suggestions,
  };
};

export default useAddressAutocomplete;
