import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { User } from "../lib/useUser";

// Type for our state
export interface AuthState {
    authState: boolean;
    user?: User;
}

// Initial state
const initialState: AuthState = {
	authState: false,
	user: undefined,
};

// Actual Slice
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Action to set the authentication status
		setAuthState(state, action) {
			state.authState = action.payload;
		},
		setAuthUser(state, action) {
			state.user = action.payload;
		},
		logoutUser(state) {
			console.log(state);
			state.user = undefined;
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

export const { setAuthState, setAuthUser, logoutUser } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.authState;
export const selectAuthUser = (state: AppState) => state.auth.user;

export default authSlice.reducer;
