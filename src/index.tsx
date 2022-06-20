import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ToastProvider } from "./Toastable";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<CookiesProvider>
		<App />
		<ToastProvider position="top" />
	</CookiesProvider>
);
