import { useState } from "react";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import CheckIcon from "@mui/icons-material/Check";

const CreatedTaskBox = ({ message, taskDate, onClickEdit }) => {
	const [addButtonShow, setAddButtonShow] = useState(false);
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				p: "0.5rem",
				borderBottom: "1px solid #e8e8e8",
				marginBottom: "0.5rem",
				backgroundColor: "#fff",
			}}
			onMouseEnter={() => setAddButtonShow(true)}
			onMouseLeave={() => setAddButtonShow(false)}
		>
			<Box sx={{ display: "flex", alignItems: "center" }}>
			<Box sx={{ height: "2.5rem", width: "2.5rem", mr: "1rem" }}>
					<img
						src="https://picsum.photos/200"
						alt="task"
						height="100%"
						width="100%"
						style={{ objectFit: "cover" }}
					/>
				</Box>
				<Box>
					<Typography variant="body2" component="p">
						{message}
					</Typography>
					<Typography variant="body2" color="error" component="p">
						{format(new Date(taskDate), "dd/MM/yyyy")}
					</Typography>
				</Box>
			</Box>

			<Box sx={{ display: "flex" }}>
				{addButtonShow && (
					<Box
						sx={{ border: "1px solid #e8e8e8", p: "0.3rem" }}
						onClick={onClickEdit}
					>
						<EditIcon />
					</Box>
				)}
				<Box sx={{ border: "1px solid #e8e8e8", p: "0.3rem" }}>
					<NotificationAddIcon />
				</Box>
				<Box sx={{ border: "1px solid #e8e8e8", p: "0.3rem" }}>
					<CheckIcon />
				</Box>
			</Box>
		</Box>
	);
};

export default CreatedTaskBox;
