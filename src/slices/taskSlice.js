import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "helpers/axios";

export const getTasks = createAsyncThunk(
	"tasks/tasks",
	async (companyId, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`/task/lead_465c14d0e99e4972b6b21ffecf3dd691?company_id=${companyId}`
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

const taskSlice = createSlice({
	name: "tasks",
	initialState: {
		isProcessing: false,
		tasks: [],
		message: "",
		error: "",
	},
	reducers: {
		deleteTask(state, action) {
			const { id } = action.payload;
			const tasks = state.tasks.filter((task) => task.id !== id);
			state.tasks = tasks;
		},
		editTask(state, action) {
			const { id, task } = action.payload;
			const tasks = state.tasks.map((item) => {
				if (item.id === id) {
					return task;
				}
				return item;
			});
			state.tasks = tasks;
		},
		addTask(state, action) {
			const { task } = action.payload;
			const tasks = [...state.tasks];
			state.tasks = [...tasks, task];
		},
	},
	extraReducers: {
		[getTasks.pending]: (state, action) => {
			state.isProcessing = true;
			state.error = null;
		},
		[getTasks.fulfilled]: (state, action) => {
			state.isProcessing = false;
			state.error = null;
			state.tasks = action.payload.results;
			state.message = action.payload.message;
		},
		[getTasks.rejected]: (state, action) => {
			state.isProcessing = false;
			state.error = action.payload;
		},
	},
});

export const { deleteTask, editTask, addTask } = taskSlice.actions;

export default taskSlice.reducer;
