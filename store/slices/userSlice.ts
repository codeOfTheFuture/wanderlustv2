import { RootState } from "../index";
import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { User } from "../../types/typings";

export interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState = {
  user: null,
  status: "idle",
  error: null,
} as UserState;

export const updateUserSettings = createAsyncThunk(
  "users/settings",
  async ({ userId, formData }: { userId: string; formData: any }) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return await response.json();
  }
);

export const addTourToFavorites = createAsyncThunk(
  "users/addToFavorites",
  async ({ userId, tourId }: { userId: string; tourId: string }) => {
    const response = await fetch(`/api/users/${userId}/favorite`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(tourId),
    });

    return await response.json();
  }
);

export const removeTourFromFavorites = createAsyncThunk(
  "users/removeFromFavorites",
  async ({ userId, tourId }: { userId: string; tourId: string }) => {
    const response = await fetch(`/api/users/${userId}/unfavorite`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(tourId),
    });

    return await response.json();
  }
);

export const bookTour = createAsyncThunk(
  "tours/booktour",
  async ({ tourId, userId }: { tourId: string; userId: string }) => {
    const response = await fetch(`api/users/${userId}/booktour/${tourId}`, {
      method: "PUT",
    });
    return await response.json();
  }
);

export const unBookTour = createAsyncThunk(
  "tours/unBooktour",
  async ({ tourId, userId }: { tourId: string; userId: string }) => {
    const response = await fetch(`api/users/${userId}/unbooktour/${tourId}`, {
      method: "PUT",
    });
    return await response.json();
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(HYDRATE, (state: UserState, action: AnyAction) => {
        if (action.payload.user.user == null) {
          return state;
        }

        state.user = action.payload.user.user;
      })
      .addCase(updateUserSettings.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(addTourToFavorites.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addTourToFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
      })
      .addCase(addTourToFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(removeTourFromFavorites.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeTourFromFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(removeTourFromFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(bookTour.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(bookTour.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.user = action.payload;
      })
      .addCase(bookTour.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      })
      .addCase(unBookTour.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(unBookTour.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(unBookTour.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message as string;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const getUserStatus = (state: RootState) => state.user.status;
export const getUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
