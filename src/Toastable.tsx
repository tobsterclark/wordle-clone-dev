/* 

Author: Toby Clark
Updated: 20/06/22
Purpose: This provides a hook and a provider for creating toasts

*/

import React, { useRef, useState } from "react";

// Creating types for the toasts, toast object, and props
var updateToasts: (newToast: ToastType) => void;
interface ToastType {
	type: string;
	msg: string;
	body?: React.ReactNode;
	duration?: number;
}
interface ToastObjType {
	[key: number]: ToastType;
}
interface Props {
	position?: "top-left" | "top-right" | "top" | "bottom" | "bottom-left" | "bottom-right";
	colour?: string;
	body?: React.ReactNode;
}

// Main Toast provider, manages the toast container and rendering toasts
export const ToastProvider = (props: Props) => {
	const toasts = useRef<ToastObjType>({});
	const [state, updateState] = useState(false);
	var position = "top-0 w-screen items-center";

	// Updating the update toasts function for the useToast hook
	// Enables creating new toasts everytime the function useToast returns
	// is invoked
	updateToasts = (newToast: ToastType) => {
		const key = new Date().getTime() + Math.floor(Math.random() * 100);
		toasts.current[key] = newToast;
		toasts.current[key].body = createToastBody(newToast, key);
		updateState(!state);

		setTimeout(
			() => {
				delete toasts.current[key];
				updateState(!state);
			},
			newToast.duration ? newToast.duration : 1000
		);
	};

	// Creates each individual toast's jsx
	const createToastBody = (toast: ToastType, key: number) => {
		if (props.body) return props.body;
		// Needs work to enable custom react
		else {
			return (
				<div key={key} className={"py-3 px-5 text-white w-fit flex gap-5 rounded-2xl " + (toast.type === "success" ? " bg-green-500" : " bg-red-500")}>
					{toast.msg}
					<button
						onClick={() => {
							delete toasts.current[key];
							updateState(!state);
						}}
					>
						x
					</button>
				</div>
			);
		}
	};

	// Loops over the toast object and displays them within the toast container
	const renderToasts = () => {
		const output = [];
		for (let i in toasts.current) {
			output.push(toasts.current[i].body);
		}
		return <div className="flex gap-y-3 items-center flex-col">{output}</div>;
	};

	// Setting css depending on where the user wants the toast container
	if (props.position === "top") position = "inset-10 m-auto w-fit";
	else if (props.position === "top-left") position = "top-10 left-5";
	else if (props.position === "top-right") position = "top-10 right-5";
	else if (props.position === "bottom") position = "left-0 right-0 bottom-10 m-auto w-fit";
	else if (props.position === "bottom-left") position = "bottom-10 left-5";
	else if (props.position === "bottom-right") position = "bottom-10 right-5";

	// Returning actual toast container
	return <div className={"absolute " + position}>{renderToasts()}</div>;
};

// When invoked, it will create a new toast, requires an object
// that contains at least the toast type and the message
const toast = (newToast: ToastType) => updateToasts(newToast);

export default toast;
