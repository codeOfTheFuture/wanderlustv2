import { RootState } from "../index";
import { AnyAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { Tour } from "../../types/typings";

export interface MapState {
  center: number[];
  zoom: number;
  mapResults: Tour[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MapState = {
  center: [],
  zoom: 5,
  mapResults: [],
  status: "idle",
  error: null,
};

export const fetchMapResults = createAsyncThunk(
  "tours/map/results",
  async ({
    bounds,
  }: {
    bounds: {
      southWestLat: number;
      northWestLat: number;
      southWestLng: number;
      northEastLng: number;
    };
  }) => {
    console.log("Bounds>>>>>", bounds);
    const { southWestLat, northWestLat, southWestLng, northEastLng } = bounds;

    const URL = `api/tours/search/map?sWLat=${southWestLat}&nWLat=${northWestLat}&sWLng=${southWestLng}&nWLng=${northEastLng}`;

    const response = await fetch(URL);
    const data = await response.json();

    return data;
  }
);

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setViewPort(state, action) {
      state.center = action.payload.center;
      state.zoom = action.payload.zoom;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state: MapState) => {
        return state;
      })
      .addCase(fetchMapResults.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMapResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mapResults = action.payload;
      })
      .addCase(fetchMapResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setViewPort } = mapSlice.actions;

export const selectViewport = (state: RootState) => state.map.center;
export const selectZoom = (state: RootState) => state.map.zoom;
export const selectMapResults = (state: RootState) => state.map.mapResults;

export default mapSlice.reducer;
