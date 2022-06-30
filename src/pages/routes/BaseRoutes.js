import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "pages/views/Login/LoginForm";
import Dashboard from "pages/views/Dashboard/Dashboard";

const BaseRoute = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<LoginForm />} />
			<Route path="/dashboard" element={<Dashboard />} />
		</Routes>
	</BrowserRouter>
);

export default BaseRoute;
