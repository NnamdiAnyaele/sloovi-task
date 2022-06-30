import axios from "axios";

const customAxios = axios.create({
	baseURL: "https://stage.api.sloovi.com",
	timeout: 50000,
});

const requestHandler = (request) => {
	// Token will be dynamic so we can use any app-specific way to always
	// fetch the new token before making the call
	request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;

	return request;
};

const responseHandler = (response) => {
	if (response.status === 403) {
		localStorage.clear();
		window.location = "/";
	}
	return response.data;
};

const errorHandler = (error) => {
	if (error.response.status === 403) {
		localStorage.clear();
		window.location = "/";
	}
	return Promise.reject(error);
};

customAxios.interceptors.request.use(
	(request) => requestHandler(request),
	(error) => errorHandler(error)
);

customAxios.interceptors.response.use(
	(response) => responseHandler(response),
	(error) => errorHandler(error)
);

// Step-4: Export the newly created Axios instance to be used in different locations.
export default customAxios;
