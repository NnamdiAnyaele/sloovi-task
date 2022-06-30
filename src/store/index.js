import { configureStore } from "@reduxjs/toolkit";
import authSlice from "slices/authSlice";
import taskSlice from "slices/taskSlice";
import assigneeSlice from "slices/assigneeSlice";

export const store = configureStore({
	reducer: {
		auth: authSlice,
		tasks: taskSlice,
		assignees: assigneeSlice,
	},
});
