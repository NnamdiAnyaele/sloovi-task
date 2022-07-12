export const auth = {
	authenticate: () => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			return true;
		}
		return false;
	},
};
