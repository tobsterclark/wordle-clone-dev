/* eslint-disable react-hooks/exhaustive-deps */

/* 

Author: Toby Clark
Updated: 20/06/22
Purpose: This is the main component in charge of choosing which other components to render as well as managing
transferring data between components

*/

import React, { useEffect, useState } from "react";
import Header from "./components/header";
import Body from "./components/body";
import Keyboard from "./components/keyboard";
import Statistics from "./components/statistics";
import { useCookies } from "react-cookie";

const App = () => {
	// States for transferring data between components
	const [bodyData, setBodyData] = useState<any>();
	const [keyboardData, setKeyboardData] = useState<{ code: string; key: string }>({ code: "", key: "" });
	const [completed, setCompleted] = useState<{ completed: boolean; type: string }>({ completed: false, type: "" });

	// State for word of the day, filled by fetchWord
	const [word, setWord] = useState<string>("");

	// Grabbing active cookies
	const [cookies, setCookie] = useCookies();

	// This is a callback function setup to transfer data between the keyboard, the body, and this component
	const dataToParent = (sent: string, data: any) => {
		if (sent === "body") setBodyData(() => data);
		else if (sent === "completed") setCompleted({ completed: true, type: data });
		else if (sent === "keyboard") setKeyboardData(data);
	};

	// Fetches the current days word from Firebase Functions and sets whether the wordle has been completed
	const fetchWord = async () => {
		let databaseWord: string = "";
		await fetch("https://us-central1-wordle-9d59a.cloudfunctions.net/word")
			.then((response) => response.text())
			.then((data) => {
				databaseWord = data;
				setWord(data);
			});

		if (cookies.completed) {
			if (cookies.completed.completed) {
				if (databaseWord !== cookies.word) setCookie("completed", { completed: false, type: "" });
			}
		}
	};

	useEffect(() => {
		fetchWord();
	}, []);

	// Renders win/loss statement and the statistics page
	const renderComplete = (type: string) => {
		return (
			<div className="boder-2 text-center flex flex-col justify-center items-center h-full gap-10">
				<span>{type === "win" ? "You won todays wordle! The word is " + word.toLowerCase() : "You lost todays wordle. The word is " + word.toLowerCase()}</span>
				<Statistics />
			</div>
		);
	};

	// Checks whether the wordle has been completed or not and renders either the game or
	// the statistics
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

	// Always renders the header and calls the main function for the body
	return (
		<div className="h-screen w-screen flex flex-col text-white bg-slate-800 font-mono">
			<header className="w-full">
				<Header />
			</header>
			{main()}
		</div>
	);
};

export default App;
