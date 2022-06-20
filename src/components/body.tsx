/* eslint-disable react-hooks/exhaustive-deps */

/* 

Author: Toby Clark
Updated: 18/06/22
Purpose: This component renders the 5 x 5 grid layout as well as running the main game functions

*/

import React, { ReactElement, useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import toast from "../Toastable";

const Body = (props: any) => {
	const [cookies, setCookie] = useCookies();
	type Squares = { past: Array<string>; current: string; total: number; currentLength: number };
	const [word, setWord] = useState<string>("");
	const [wordList, setWordList] = useState<Array<string>>([""]);
	const keyboardData = useRef({ code: "", key: "" });
	const [squares, setSquares] = useState<Squares>({ past: [], current: "", total: 1, currentLength: 0 });

	// Functions to trigger onKeyPress from inbuilt keyboard
	const handleInbuiltKeyboardPress = () => onKeyPress(keyboardData.current);

	// onKeyPress' purpose is to handle key inputs into the 5x5 grid, it can either be triggered by
	// the users keyboard or by the inbuilt keyboard
	const onKeyPress = (keyboardEvent: KeyboardEvent | { code: string; key: string }) => {
		// If key entered is a letter (All letters start with the word Key)
		if (keyboardEvent.code.includes("Key")) {
			if (squares.currentLength >= 5) {
				toast({ type: "error", msg: "Too long" });
				setSquares({ ...squares });
			} else {
				const newCurrent: string = squares.current + keyboardEvent.key.toUpperCase();
				setSquares({ past: squares.past, current: newCurrent, total: squares.total, currentLength: squares.currentLength + 1 });
			}

			// If key entered is a backspace
		} else if (keyboardEvent.code.includes("Backspace")) {
			if (squares.currentLength === 0) {
				toast({ type: "error", msg: "Too short" });
				setSquares({ ...squares });
			} else {
				const newCurrent: string = squares.current.substring(0, squares.current.length - 1);
				setSquares({ past: squares.past, current: newCurrent, total: squares.total, currentLength: squares.currentLength - 1 });
			}

			// If key entered is an enter
		} else if (keyboardEvent.code.includes("Enter")) {
			if (squares.currentLength === 5) {
				if (wordList.includes(squares.current)) {
					// Check if actual word
					const newPast: Array<string> = [...squares.past];
					newPast.push(squares.current);
					setSquares({ past: newPast, current: "", total: squares.total + 1, currentLength: 0 });
				} else toast({ type: "error", msg: "Word not in word list" });
			} else {
				toast({ type: "error", msg: "Too short" });
				setSquares({ ...squares });
			}
		} else setSquares({ ...squares });
	};

	// This function runs once when the grid is first rendered, it grabs both the word of the day and the list
	// of all valid words. Words are valid or not based off of the scrabble dictionary
	useEffect(() => {
		fetch("https://us-central1-wordle-9d59a.cloudfunctions.net/word")
			.then((response) => response.text())
			.then((data) => setWord(data));

		fetch("https://us-central1-wordle-9d59a.cloudfunctions.net/wordList")
			.then((response) => response.text())
			.then((data) => {
				const newData: string = data.slice(2, -2);
				setWordList(newData.split('","'));
			});
	}, []);

	// Handles keypress data from inbuilt keyboard, reruns if props.keyboard data is changed
	useEffect(() => {
		keyboardData.current = props.keyboardData;
	}, [props.keyboardData]);

	// Main effect loop, is run evertime squares is changed
	useEffect(() => {
		// Sends the function which handles inbuilt keyboard presses to parent function.
		// This will be called from keyboard.tsk
		props.dataToParent("body", handleInbuiltKeyboardPress);

		// Checks if the user has correctly guessed the word or if they have run out of space,
		// if so updates the cookies holding score, the total games, the total wins.
		// Then sends "completed" to the parent component (App.tsx)
		if (squares.past.includes(word)) {
			setCookie("word", word);
			setCookie("total", (cookies.total ? parseInt(cookies.total) : 0) + 1);
			setCookie("wins", (cookies.wins ? parseInt(cookies.wins) : 0) + 1);
			setCookie("percent", cookies.percent && cookies.wins ? ((parseFloat(cookies.wins) + 1) / (parseFloat(cookies.total) + 1)) * 100 : 100);
			setTimeout(() => {
				setCookie("completed", { completed: true, type: "win" });
				props.dataToParent("completed", "win");
			}, 500);
		} else if (squares.total >= 6) {
			setCookie("word", word);
			setCookie("total", (cookies.total ? parseInt(cookies.total) : 0) + 1);
			setCookie("percent", cookies.percent && cookies.wins ? (parseFloat(cookies.wins) / (parseFloat(cookies.total) + 1)) * 100 : 0);
			props.dataToParent("completed", "loss");
			setCookie("completed", { completed: true, type: "loss" });
		}

		// Creates a listener checking if a key is pressed
		document.addEventListener("keyup", onKeyPress);

		// Deletes the listener in case squares is re-rendered through inbuilt keyboard
		return () => document.removeEventListener("keyup", onKeyPress);
	}, [squares]);

	// Check if a letter is correct, in the wrong spot or outright wrong and sets letter colour accordingly
	const correct = (letter: string, index: number) => {
		if (word.includes(letter)) {
			for (let i = 0; i < word.length; i++) {
				if (word[i] === letter && index === i) {
					return "bg-green-500";
				}
			}
			return "bg-yellow-500";
		} else return "bg-gray-500";
	};

	// Renders 5x5 grid layout, filled with letters
	const renderSquares = () => {
		const output: Array<ReactElement> = [];
		let row: Array<ReactElement> = [];
		// Runs through past guesses and renders each one
		for (let i in squares.past) {
			for (let t = 0; t < 5; t++) {
				row.push(
					<span key={squares.past[i] + t + Math.random()} className={"h-full justify-center flex flex-none items-center border-2 border-transparent " + correct(squares.past[i][t], t)}>
						{squares.past[i][t]}
					</span>
				);
			}
			output.push(
				<div className="h-full grid grid-cols-5 gap-1" key={squares.past[i] + Math.random()}>
					{row}
				</div>
			);
			row = [];
		}

		// Renders the current guess (If not all 5 letters will render blank tiles to fill up space)
		if (squares.total < 6) {
			for (let i = 0; i < 5; i++) {
				if (i < squares.currentLength)
					row.push(
						<span key={i} className="h-full justify-center flex flex-none items-center border-2 border-gray-300 ">
							{squares.current[i]}
						</span>
					);
				else
					row.push(
						<span key={i} className="h-full border-gray-500 border-2 text-transparent select-none">
							A
						</span>
					);
			}
			output.push(
				<div key={"current"} className="grid grid-cols-5 gap-1 h-full">
					{row}
				</div>
			);
			row = [];
		}

		// Renders the rest of the 5 x 5 grid with blank squares
		for (let i = 0; i < 5 - squares.total; i++) {
			for (let t = 0; t < 5; t++) {
				row.push(
					<span key={i + t} className="h-full border-gray-500 border-2 text-transparent select-none">
						A
					</span>
				);
			}
			output.push(
				<div key={i} className="grid grid-cols-5 gap-1 h-full">
					{row}
				</div>
			);
			row = [];
		}

		return <div className="grid grid-rows-5 h-4/5 gap-1 aspect-square font-black text-xs hlg:text-lg ">{output}</div>;
	};

	return (
		<div key={props} className="h-full flex items-center justify-center max-w-screen">
			{renderSquares()}
		</div>
	);
};

export default Body;
