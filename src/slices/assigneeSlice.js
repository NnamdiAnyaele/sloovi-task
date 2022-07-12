import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "helpers/axios";

export const getAssignees = createAsyncThunk(
	"assignees/assignees",
	async (companyId, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`/team?product=outreach&company_id=${companyId}`
			);
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

const assigneeSlice = createSlice({
	name: "assignees",
	initialState: {
		isProcessing: false,
		assignees: [],
		message: "",
		error: "",
	},
	reducers: {},
	extraReducers: {
		[getAssignees.pending]: (state, action) => {
			state.isProcessing = true;
			state.error = null;
		},
		[getAssignees.fulfilled]: (state, action) => {
			state.isProcessing = false;
			state.error = null;
			state.assignees = action.payload.results.data;
			state.message = action.payload.message;
		},
		[getAssignees.rejected]: (state, action) => {
			state.isProcessing = false;
			state.error = action.payload;
		},
	},
});

export default assigneeSlice.reducer;
