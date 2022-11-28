import { RootState } from "../index";
import { createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  searchQuery: string;
}

const initialState: SearchState = {
  searchQuery: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSearchQuery } = searchSlice.actions;

export const selectSearchQuery = (state: RootState) => state.search.searchQuery;

export default searchSlice.reducer;
