import React, { useRef, useState } from "react";

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

export const Toast = (props: Props) => {
	const toasts = useRef<ToastObjType>({});
	const [state, updateState] = useState(false);
	var position = "top-0 w-screen items-center";
	updateToasts = (newToast: ToastType) => {
		const key = new Date().getTime() + Math.floor(Math.random() * 100);
		toasts.current[key] = newToast;
		toasts.current[key].body = newToastBody(newToast, key);
		updateState(!state);

		setTimeout(
			() => {
				delete toasts.current[key];
				updateState(!state);
			},
			newToast.duration ? newToast.duration : 1000
		);
	};

	const newToastBody = (toast: ToastType, key: number) => {
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

	const renderToasts = () => {
		const output = [];
		console.log(toasts.current);
		for (let i in toasts.current) {
			output.push(toasts.current[i].body);
		}
		return <div className="flex gap-y-3 items-center flex-col">{output}</div>;
	};

	if (props.position === "top") position = "inset-10 m-auto w-fit";
	else if (props.position === "top-left") position = "top-10 left-5";
	else if (props.position === "top-right") position = "top-10 right-5";
	else if (props.position === "bottom") position = "left-0 right-0 bottom-10 m-auto w-fit";
	else if (props.position === "bottom-left") position = "bottom-10 left-5";
	else if (props.position === "bottom-right") position = "bottom-10 right-5";

	return <div className={"absolute " + position}>{renderToasts()}</div>;
};

const useToast = () => {
	return (newToast: ToastType) => {
		updateToasts(newToast);
	};
};

export default useToast;
