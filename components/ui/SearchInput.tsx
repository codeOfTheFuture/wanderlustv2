import { Combobox } from "@headlessui/react";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
} from "react";
import { useAppSelector } from "../../store";
import { selectSearchQuery } from "../../store/slices/searchSlice";
import { AddressSuggestion } from "../../types/typings";

interface Props {
  value: string;
  suggestions: any[];
  selectedSuggestion: AddressSuggestion | null;
  setSelectedSuggestion: Dispatch<SetStateAction<AddressSuggestion | null>>;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  setZoomLevel: (placeType: string, category: string) => void;
  comboBoxStyles: string;
  comboboxInputStyles: string;
}

const SearchInput: FC<Props> = ({
  value,
  suggestions,
  selectedSuggestion,
  setSelectedSuggestion,
  handleAddressChange,
  setZoomLevel,
  comboBoxStyles,
  comboboxInputStyles,
}) => {
  const searchQuery = useAppSelector(selectSearchQuery) as string;

  return (
    <Combobox
      as="div"
      value={selectedSuggestion}
      onChange={setSelectedSuggestion}
      className={comboBoxStyles}>
      <Combobox.Input
        value={value}
        onChange={handleAddressChange}
        className={comboboxInputStyles}
        displayValue={(suggestion: any) => {
          if (searchQuery && !suggestion) return searchQuery;
          if (suggestion?.place_type[0] === "poi") return suggestion?.text;
          return suggestion?.place_name;
        }}
        required
      />

      <button
        className="absolute top-2 right-2 flex justify-center items-center w-20 h-12 sm:w-32 sm:h-16 bg-primary-color text-light-text text-lg border border-primary-text cursor-pointer"
        type="submit">
        Search
      </button>

      <Combobox.Options
        className={`${
          suggestions.length ? "flex" : "hidden"
        } flex-col justify-center items-start gap-2 absolute w-2/3 rounded bg-white top-20 p-2 z-10 border border-gray-500 shadow-xl`}>
        {suggestions.map(suggestion => (
          <Combobox.Option key={suggestion.id} value={suggestion} as={Fragment}>
            {({ active }) => (
              <li
                className={`
                ${active && "bg-primary-color text-white shadow-2xl"}
                cursor-pointer p-2 rounded w-full
              `}
                onClick={() => {
                  setSelectedSuggestion(suggestion);
                  setZoomLevel(
                    suggestion.place_type[0],
                    suggestion.properties.category
                  );
                }}>
                {suggestion.place_name}
              </li>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};

export default SearchInput;
