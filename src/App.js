import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "store/index";
import { auth } from "helpers/auth";
import { loginSuccess } from "slices/authSlice";
import BaseRoute from "pages/routes/BaseRoutes";

import "react-toastify/dist/ReactToastify.css";

if (auth.authenticate()) {
	const user = localStorage.getItem("user");
	store.dispatch(loginSuccess(JSON.parse(user)));
}
function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<ToastContainer />
				<BaseRoute />
			</div>
		</Provider>
	);
}

export default App;
