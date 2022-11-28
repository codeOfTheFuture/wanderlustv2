import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { TourResults } from "../../types/typings";
import { RootState } from "../index";

interface ToursState {
  tourResults: TourResults;
  filter: "popular" | "deals" | "categories";
  category: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState = {
  tourResults: {
    results: [],
    currentPage: 1,
    totalPages: 1,
    limit: 8,
  },
  filter: "popular",
  category: null,
  status: "idle",
  error: null,
} as ToursState;

export const getPopularTours = createAsyncThunk(
  "tours/popular",
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await fetch(
      `api/tours/popular?page=${page || 1}&limit=${limit}`
    );
    return await response.json();
  }
);

export const getTourDeals = createAsyncThunk(
  "tours/deals",
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await fetch(
      `api/tours/deals?page=${page || 1}&limit=${limit}`
    );
    return await response.json();
  }
);

export const fetchTourCategory = createAsyncThunk(
  "tours/category",
  async (category: string) => {
    const response = await fetch(`api/tours/categories/${category}`);
    const data = await response.json();
    return { category, data };
  }
);

export const getUserFavoriteTours = createAsyncThunk(
  "tours/getFavorites",
  async ({
    page,
    limit,
    userId,
  }: {
    page: number;
    limit: number;
    userId: string;
  }) => {
    const response = await fetch(
      `api/users/${userId}/favorite?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchToursSearch = createAsyncThunk(
  "tours/search",
  async ({
    page,
    limit,
    bounds,
  }: {
    page: number;
    limit: number;
    bounds: {
      southWestLat: number;
      northWestLat: number;
      southWestLng: number;
      northEastLng: number;
    };
  }) => {
    const { southWestLat, northWestLat, southWestLng, northEastLng } = bounds;

    const URL = `api/tours/search?page=${page}&limit=${limit}&sWLat=${southWestLat}&nWLat=${northWestLat}&sWLng=${southWestLng}&nWLng=${northEastLng}`;

    const response = await fetch(URL);
    const data = await response.json();

    return data;
  }
);

export const fetchOfferedTours = createAsyncThunk(
  "tours/offered-tours",
  async ({
    page,
    limit,
    userId,
  }: {
    page: number;
    limit: number;
    userId: string;
  }) => {
    const response = await fetch(
      `/api/tours/${userId}?page=${page}&limit=${limit}`
    );

    const data = await response.json();

    return data;
  }
);

export const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setTours(state: ToursState, action: PayloadAction<TourResults>) {
      state.tourResults = action.payload;
      state.filter = "popular";
      state.category = null;
    },
    categoriesClicked(state: ToursState) {
      state.filter = "categories";
    },
  },

  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state: ToursState, action: AnyAction) => {
        if (action.payload.tours.tourResults == null) {
          return state;
        }

        state.tourResults = action.payload.tours.tourResults;
      })
      .addCase(fetchOfferedTours.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOfferedTours.fulfilled, (state, action) => {
        state.tourResults = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOfferedTours.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(getPopularTours.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPopularTours.fulfilled, (state, action) => {
        state.tourResults = action.payload;
        state.filter = "popular";
        state.category = null;
        state.status = "succeeded";
      })
      .addCase(getPopularTours.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(getTourDeals.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTourDeals.fulfilled, (state, action) => {
        state.tourResults = action.payload;
        state.filter = "deals";
        state.category = null;
        state.status = "succeeded";
      })
      .addCase(getTourDeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(fetchTourCategory.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTourCategory.fulfilled, (state, action) => {
        state.tourResults = action.payload.data;
        state.category = action.payload.category;
        state.status = "succeeded";
      })
      .addCase(fetchTourCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(getUserFavoriteTours.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUserFavoriteTours.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tourResults = action.payload;
      })
      .addCase(getUserFavoriteTours.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(fetchToursSearch.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchToursSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tourResults = action.payload;
      })
      .addCase(fetchToursSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      });
  },
});

export const { setTours, categoriesClicked } = toursSlice.actions;

export const selectTours = (state: RootState) => state.tours.tourResults;
export const getToursFilter = (state: RootState) => state.tours.filter;
export const getToursCategory = (state: RootState) => state.tours.category;
export const getToursStatus = (state: RootState) => state.tours.status;
export const getToursError = (state: RootState) => state.tours.error;

export default toursSlice.reducer;
