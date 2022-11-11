import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface UiState {
    sidebarOpen: boolean;
}

// Initial state
const initialState: UiState = {
	sidebarOpen: true,
};

// Actual Slice
export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		// Action to set the authentication status
		setSidebarToggle(state, action) {
			state.sidebarOpen = action.payload
		},
	},
	extraReducers: {
		[HYDRATE]: (state, action) => {
			const newState = {
				...state,
				...action.payload.auth,
			};

			return newState;
		},
	},
});

export const { setSidebarToggle } = uiSlice.actions;

export const selectUiSidebarOpen = (state: AppState) => state.ui.sidebarOpen;

export default uiSlice.reducer;
