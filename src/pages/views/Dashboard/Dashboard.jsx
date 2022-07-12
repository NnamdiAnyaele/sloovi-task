import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format, differenceInSeconds } from "date-fns";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import { logout } from "slices/authSlice";
import { getTasks } from "slices/taskSlice";
import { getAssignees } from "slices/assigneeSlice";
import { updateTask, deleteTask, createTask } from "api/tasks";
import CreatedTaskCard from "components/CreatedTaskBox";
import DeleteModal from "components/DeleteModal";

const defaultalues = {
	description: "",
	date: null,
	time: null,
	assignee: "",
};

const Dashboard = () => {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { tasks } = useSelector((state) => state.tasks);
	const { assignees } = useSelector((state) => state.assignees);

	useEffect(() => {
		if (user?.company_id) {
			dispatch(getTasks(user?.company_id));
			dispatch(getAssignees(user?.company_id));
		}
	}, [dispatch, user?.company_id]);

	const [newTask, setNewTask] = useState(defaultalues);
	const [editTask, setEditTask] = useState(defaultalues);
	const [displayEditBox, setDisplayEditBox] = useState(false);
	const [displayAddBox, setDisplayAddBox] = useState(false);
	const [deleteModalOpen, handleDeleteModalOpen] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [selectedTask, setSelectedTask] = useState({});
	const [addLoading, setAddLoading] = useState(false);
	const [editLoading, setEditLoading] = useState(false);

	const handleEditClick = (currentTask) => {
		setDisplayEditBox(true);
		setSelectedTask(currentTask);
		setEditTask({
			description: currentTask.task_msg,
			date: new Date(currentTask.task_date_time_in_utc),
			time: new Date(currentTask.task_date_time_in_utc),
			assignee: currentTask.assigned_user,
		});
	};

	const handleTaskDeletion = async () => {
		try {
			setDeleteLoading(true);
			await deleteTask(selectedTask?.id, selectedTask?.company_id);
			dispatch(getTasks(user?.company_id));
			setEditTask(defaultalues);
			setDeleteLoading(false);
			handleDeleteModalOpen(false);
			toast.success("Task deleted successfully");
		} catch (error) {
			setDeleteLoading(false);
			if (error.response) {
				toast.error(error.response.data.message);
			} else if (error.request) {
				toast.error("Internal Server Error");
			} else {
				toast.error("Error", error.message);
			}
		}
	};

	const handleTaskCreation = async () => {
		try {
			setAddLoading(true);
			const payload = {
				assigned_user: newTask.assignee,
				task_date: format(new Date(newTask.date), "yyyy-MM-dd"),
				task_time: differenceInSeconds(
					new Date(newTask.time),
					new Date().setHours(0, 0, 0)
				),
				is_completed: 0,
				time_zone: 3600,
				task_msg: newTask.description,
			};
			await createTask(user?.company_id, payload);
			dispatch(getTasks(user?.company_id));
			setNewTask(defaultalues);
			toast.success("Task added successfully");
			setAddLoading(false);
		} catch (error) {
			setAddLoading(false);
			if (error.response) {
				toast.error(error.response.data.message);
			} else if (error.request) {
				toast.error("Internal Server Error");
			} else {
				toast.error("Error", error.message);
			}
		}
	};

	const handleTaskEdit = async () => {
		try {
			setEditLoading(true);
			const payload = {
				assigned_user: editTask.assignee,
				task_date: format(new Date(editTask.date), "yyyy-MM-dd"),
				task_time: differenceInSeconds(
					new Date(editTask.time),
					new Date().setHours(0, 0, 0)
				),
				is_completed: 0,
				time_zone: 3600,
				task_msg: editTask.description,
			};
			await updateTask(selectedTask?.id, user?.company_id, payload);
			dispatch(getTasks(user?.company_id));
			setEditTask(defaultalues);
			toast.success("Task edited successfully");
			setDisplayEditBox(false);
			setSelectedTask({});
			setEditLoading(false);
		} catch (error) {
			setEditLoading(false);
			if (error.response) {
				toast.error(error.response.data.message);
			} else if (error.request) {
				toast.error("Internal Server Error");
			} else {
				toast.error("Error", error.message);
			}
		}
	};

	return (
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			{/* side bar */}
			<Box
				sx={{
					width: "250px",
					height: "100vh",
					backgroundColor: "#323E4D",
					display: "flex",
					alignItems: "center",
					position: "fixed",
					top: "0",
					bottom: "0",
				}}
			>
				<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
					<Button
						variant="contained"
						color="error"
						onClick={() => dispatch(logout())}
						startIcon={<LogoutIcon />}
					>
						logout
					</Button>
				</Box>
			</Box>

			{/* main content */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					padding: "1rem",
					paddingLeft: "270px",
				}}
			>
				<Box>
					<Box sx={{ width: "400px", border: "1px solid #e8e8e8" }}>
						<Box
							sx={{
								display: "flex",
								backgroundColor: "#F9F9FA",
								justifyContent: "space-between",
							}}
						>
							<Typography
								variant="body1"
								component="p"
								sx={{ padding: "0.5rem" }}
							>
								Task {tasks?.length}
							</Typography>
							<Tooltip title="New Task">
								<Box
									sx={{ borderLeft: "1px solid #e8e8e8", padding: "0.5rem" }}
									onClick={() => {
										setDisplayAddBox(true);
									}}
								>
									<AddIcon />
								</Box>
							</Tooltip>
						</Box>

						{/* created task box */}
						<Box sx={{ backgroundColor: "#F9F9FA" }}>
							{tasks?.map((task) => (
								<Box key={task.id}>
									<CreatedTaskCard
										message={task.task_msg}
										taskDate={task.task_date_time_in_utc}
										onClickEdit={() => handleEditClick(task)}
									/>
								</Box>
							))}
						</Box>

						{/* task adder box */}
						{(tasks?.length === 0 || (displayAddBox && !displayEditBox)) && (
							<Box
								component="form"
								noValidate
								sx={{
									display: "grid",
									backgroundColor: "#EEF7FC",
									padding: "0.5rem",
								}}
							>
								<Box sx={{ mb: "1rem" }}>
									<Typography variant="body1" component="p" gutterBottom>
										Task Description
									</Typography>
									<TextField
										id="outlined-basic"
										label=""
										variant="outlined"
										value={newTask.description}
										onChange={(e) =>
											setNewTask({ ...newTask, description: e.target.value })
										}
										size="small"
										fullWidth
										sx={{ backgroundColor: "#fff" }}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<RememberMeOutlinedIcon />
												</InputAdornment>
											),
										}}
									/>
								</Box>
								<Box sx={{ mb: "1rem", display: "Flex", gap: "1rem" }}>
									<Box>
										<Typography variant="body1" component="p" gutterBottom>
											Date
										</Typography>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DatePicker
												label=""
												value={newTask.date}
												onChange={(newValue) => {
													setNewTask({ ...newTask, date: newValue });
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														size="small"
														sx={{ backgroundColor: "#fff" }}
													/>
												)}
											/>
										</LocalizationProvider>
									</Box>
									<Box>
										<Typography variant="body1" component="p" gutterBottom>
											Time
										</Typography>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												label=""
												value={newTask.time}
												onChange={(newValue) => {
													setNewTask({ ...newTask, time: newValue });
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														size="small"
														sx={{ backgroundColor: "#fff" }}
													/>
												)}
											/>
										</LocalizationProvider>
									</Box>
								</Box>

								<Box sx={{ mb: "1rem" }}>
									<Typography variant="body1" component="p" gutterBottom>
										Assign User
									</Typography>
									<FormControl fullWidth sx={{ backgroundColor: "#fff" }}>
										<InputLabel id="demo-simple-select-label"></InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={newTask.assignee}
											label=""
											onChange={(e) =>
												setNewTask({ ...newTask, assignee: e.target.value })
											}
										>
											{assignees.map((item) => (
												<MenuItem
													key={item.id}
													value={item.id}
												>{`${item.first} ${item.last}`}</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										pb: "1rem",
									}}
								>
									<Box sx={{ ml: "auto" }}>
										<Button
											variant="text"
											sx={{ color: "#000" }}
											onClick={() => setDisplayAddBox(false)}
										>
											cancel
										</Button>
										<Button
											variant="contained"
											color="success"
											sx={{ background: "#47BB7F" }}
											onClick={() => handleTaskCreation()}
											disabled={addLoading}
										>
											{addLoading ? <CircularProgress size="1.5rem" /> : "save"}
										</Button>
									</Box>
								</Box>
							</Box>
						)}

						{/* task edit box */}
						{!displayAddBox && displayEditBox && (
							<Box
								component="form"
								noValidate
								sx={{
									display: "grid",
									backgroundColor: "#EEF7FC",
									padding: "0.5rem",
								}}
							>
								<Box sx={{ mb: "1rem" }}>
									<Typography variant="body1" component="p" gutterBottom>
										Task Description
									</Typography>
									<TextField
										id="outlined-basic"
										label=""
										variant="outlined"
										value={editTask.description}
										onChange={(e) =>
											setEditTask({ ...editTask, description: e.target.value })
										}
										size="small"
										fullWidth
										sx={{ backgroundColor: "#fff" }}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<RememberMeOutlinedIcon />
												</InputAdornment>
											),
										}}
									/>
								</Box>
								<Box sx={{ mb: "1rem", display: "Flex", gap: "1rem" }}>
									<Box>
										<Typography variant="body1" component="p" gutterBottom>
											Date
										</Typography>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DatePicker
												label=""
												value={editTask.date}
												onChange={(newValue) => {
													setEditTask({ ...editTask, date: newValue });
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														size="small"
														sx={{ backgroundColor: "#fff" }}
													/>
												)}
											/>
										</LocalizationProvider>
									</Box>
									<Box>
										<Typography variant="body1" component="p" gutterBottom>
											Time
										</Typography>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												label=""
												value={editTask.time}
												onChange={(newValue) => {
													setEditTask({ ...editTask, time: newValue });
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														size="small"
														sx={{ backgroundColor: "#fff" }}
													/>
												)}
											/>
										</LocalizationProvider>
									</Box>
								</Box>

								<Box sx={{ mb: "1rem" }}>
									<Typography variant="body1" component="p" gutterBottom>
										Assign User
									</Typography>
									<FormControl fullWidth sx={{ backgroundColor: "#fff" }}>
										<InputLabel id="demo-simple-select-label"></InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											value={editTask.assignee}
											label=""
											onChange={(e) =>
												setEditTask({ ...editTask, assignee: e.target.value })
											}
										>
											{assignees.map((item) => (
												<MenuItem
													key={item.id}
													value={item.id}
												>{`${item.first} ${item.last}`}</MenuItem>
											))}
										</Select>
									</FormControl>
								</Box>

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										pb: "1rem",
									}}
								>
									<IconButton
										onClick={() => {
											handleDeleteModalOpen(true);
										}}
									>
										<DeleteIcon />
									</IconButton>
									<Box>
										<Button
											variant="text"
											sx={{ color: "#000" }}
											onClick={() => setDisplayEditBox(false)}
										>
											cancel
										</Button>
										<Button
											variant="contained"
											color="success"
											sx={{ background: "#47BB7F" }}
											onClick={() => handleTaskEdit()}
											disabled={editLoading}
										>
											{editLoading ? (
												<CircularProgress size="1.5rem" />
											) : (
												"save"
											)}
										</Button>
									</Box>
								</Box>
							</Box>
						)}
					</Box>
				</Box>
			</Box>
			<DeleteModal
				open={deleteModalOpen}
				handleClose={() => handleDeleteModalOpen(false)}
				loading={deleteLoading}
				handleDelete={handleTaskDeletion}
			/>
		</Box>
	);
};

export default Dashboard;
