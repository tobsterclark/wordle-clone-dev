/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Body from "./components/body";
import Keyboard from "./components/keyboard";
import Statistics from "./components/statistics";
import { useCookies } from "react-cookie";

function App() {
	const [bodyData, setBodyData] = useState<any>(() => console.log("test"));
	const [keyboardData, setKeyboardData] = useState<any>({ code: "", key: "" });
	const [cookies, setCookie] = useCookies();
	const [completed, setCompleted] = useState<{ completed: boolean; type: string }>({ completed: false, type: "" });
	const dataToParent = (sent: string, data: any) => {
		if (sent === "body") setBodyData(() => data);
		else if (sent === "completed") setCompleted({ completed: true, type: data });
		else if (sent === "keyboard") setKeyboardData(data);
	};

	const renderComplete = (type: string) => {
		return (
			<div className="boder-2 text-center flex flex-col justify-center items-center h-full gap-10">
				<span>{type === "win" ? "You won todays wordle!" : "You lost todays wordle."}</span>
				<Statistics />
			</div>
		);
	};

	const fetchWord = async () => {
		let word: string = "";
		await fetch("https://us-central1-wordle-9d59a.cloudfunctions.net/word")
			.then((response) => response.text())
			.then((data) => (word = data));

		if (cookies.completed) {
			if (cookies.completed.completed) {
				if (word !== cookies.word) setCookie("completed", { completed: false, type: "" });
			}
		}
	};

	useEffect(() => {
		fetchWord();
	}, []);

	const main = () => {
		if (completed.completed) return renderComplete(completed.type);
		else if (cookies.completed) {
			if (cookies.completed.completed) return renderComplete(cookies.completed.type);
		}
		return (
			<div className="h-full w-screen flex flex-col">
				<div className="grow shrink w-full">
					<Body dataToParent={dataToParent} keyboardData={keyboardData} />
				</div>
				<div className="shrink-0 w-full">
					<Keyboard dataToParent={dataToParent} bodyData={bodyData} />
				</div>
			</div>
		);
	};

	return (
		<div className="h-screen w-screen flex flex-col text-white bg-slate-800 font-mono">
			<header className="w-full">
				<Header />
			</header>
			{main()}
		</div>
	);
}

export default App;
