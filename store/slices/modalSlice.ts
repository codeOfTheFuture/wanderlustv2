import { RootState } from "../index";
import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface ModalState {
  modalOpen: boolean;
}

const initialState: ModalState = {
  modalOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
    closeModal: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(HYDRATE, (state, action: AnyAction) => {
      if (action.payload.modal != null) {
        return state;
      }
      state.modalOpen = action.payload.modal;
    });
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = modalSlice.actions;

export const selectModalOpen = (state: RootState) => state.modal.modalOpen;

export default modalSlice.reducer;
