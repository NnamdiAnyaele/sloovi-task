import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import { login } from "slices/authSlice";
import CircularProgress from "@mui/material/CircularProgress";

const Wrapper = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	height: "100vh",
	padding: "0 0.25rem",
});

const FormComponent = styled(Box)({
	width: "100%",
	maxWidth: "400px",
	backgroundColor: "#fff",
	boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "3rem 1rem",
	borderRadius: "2px",
	gap: "1rem",
});

export default function LoginForm() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isProcessing, isAuthenticated, error } = useSelector(
		(state) => state.auth
	);
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const handleChange = (event) => {
		setUser({ ...user, [event.target.name]: event.target.value });
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const [showPassword, setShowPassword] = useState(false);
	const handleSubmit = (event) => {
		event.preventDefault();
		dispatch(login(user));
	};

	useEffect(() => {
		if (isAuthenticated) {
			window.location = "/dashboard";
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	return (
		<Wrapper>
			<FormComponent
				component="form"
				noValidate
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<p className="header">Welcome!</p>
				<FormControl fullWidth variant="outlined">
					<InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
					<OutlinedInput
						type="text"
						value={user.email}
						name="email"
						label="Email"
						onChange={handleChange}
						required
						startAdornment={
							<InputAdornment position="start">
								<AccountCircle />
							</InputAdornment>
						}
					/>
				</FormControl>
				<FormControl sx={{ mt: "1rem", width: "100%" }} variant="outlined">
					<InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
					<OutlinedInput
						id="filled-adornment-password"
						type={showPassword ? "text" : "password"}
						value={user.password}
						label="Password"
						name="password"
						onChange={handleChange}
						required
						startAdornment={
							<InputAdornment position="start">
								<LockIcon />
							</InputAdornment>
						}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={() => setShowPassword(!showPassword)}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
				<Button
					variant="contained"
					type="submit"
					fullWidth
					sx={{ p: "0.6rem" }}
				>
					{isProcessing ? (
						<CircularProgress size={18} style={{ color: "#fff" }} />
					) : (
						<>
							<LoginIcon />
							&nbsp; Sign In
						</>
					)}
				</Button>
			</FormComponent>
		</Wrapper>
	);
}
