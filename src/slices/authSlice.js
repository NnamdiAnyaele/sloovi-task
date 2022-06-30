import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "helpers/axios";
import { isEmpty } from "helpers/functions";

export const login = createAsyncThunk(
	"auth/login",
	async (payload, { rejectWithValue }) => {
		try {
			const response = await axios.post("/login", payload);
			localStorage.setItem("token", response.results.token);
			localStorage.setItem("user", JSON.stringify(response.results));
			return response;
		} catch (error) {
			if (error.response) {
				return rejectWithValue(error.response.data.message);
			}
			if (error.request) {
				return rejectWithValue("Network Error");
			}
			if (error.message) {
				return rejectWithValue(error.message);
			}
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState: {
		isAuthenticated: false,
		isProcessing: false,
		isLoggingOut: false,
		user: {},
		message: "",
		error: "",
	},
	reducers: {
		logout(state, action) {
			state.isProcessing = false;
			state.isLoggingOut = false;
			state.isAuthenticated = false;
			state.user = {};
			localStorage.clear();
			window.location = "/";
		},
		loginSuccess(state, action) {
			state.isProcessing = false;
			state.isAuthenticated = !isEmpty(action.payload);
			state.user = action.payload;
			state.message = "";
			state.error = "";
		},
	},
	extraReducers: {
		[login.pending]: (state, action) => {
			state.isProcessing = true;
			state.error = null;
		},
		[login.fulfilled]: (state, action) => {
			state.isProcessing = false;
			state.isAuthenticated = !isEmpty(action.payload.results);
			state.error = null;
			state.user = action.payload.results;
			state.message = "";
		},
		[login.rejected]: (state, action) => {
			state.isProcessing = false;
			state.error = action.payload;
		},
	},
});

export const { logout, loginSuccess } = authSlice.actions;

export default authSlice.reducer;
