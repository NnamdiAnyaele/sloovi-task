import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function BasicModal({
	open,
	handleClose,
	loading,
	handleDelete,
}) {
	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
						sx={{ textAlign: "center" }}
					>
						Delete Task
					</Typography>
					<Typography
						id="modal-modal-description"
						sx={{ mt: 2, textAlign: "center" }}
					>
						Are you sure you want to delete this task?
					</Typography>

					<Box sx={{ display: "flex", p: "1rem" }}>
						<Box sx={{ ml: "auto" }}>
							<Button
								variant="contained"
								sx={{ mr: "0.5rem" }}
								disabled={loading}
                                onClick={() => handleDelete()}
							>
								{loading ? <CircularProgress size="1.5rem" /> : "ok"}
							</Button>
							<Button variant="outlined" onClick={() => handleClose()}>
								cancel
							</Button>
						</Box>
					</Box>
				</Box>
			</Modal>
		</div>
	);
}
