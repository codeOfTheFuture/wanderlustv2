import {
  AnyAction,
  configureStore,
  combineReducers,
  ThunkDispatch,
  Store,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import userReducer from "./slices/userSlice";
import toursReducer from "./slices/toursSlice";
import modalReducer from "./slices/modalSlice";
import searchReducer from "./slices/searchSlice";
import mapReducer from "./slices/mapSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const combinedReducers = combineReducers({
  user: userReducer,
  tours: toursReducer,
  modal: modalReducer,
  search: searchReducer,
  map: mapReducer,
});

export type RootState = ReturnType<typeof combinedReducers>;

export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
  dispatch: AppThunkDispatch;
};

export const makeStore = () =>
  configureStore({
    reducer: combinedReducers,
  });

export const wrapper = createWrapper(makeStore, { debug: true });

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
