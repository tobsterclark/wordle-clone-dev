import React from "react";

const Keyboard = (props: any) => {
	const firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
	const secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	const thirdRow = ["Z", "X", "C", "V", "B", "N", "M"];

	const keyboardInput = (code: string, letter: string) => {
		const element = document.getElementById(letter);
		if (element) element.blur();
		props.dataToParent("keyboard", { code: code, key: letter });
		setTimeout(() => {
			if (props.bodyData) props.bodyData();
		}, 100);
	};

	const styledLetter = (letter: string) => {
		return (
			<button
				key={letter}
				id={letter}
				onClick={() => {
					if (letter === "Backspace") keyboardInput("Backspace", "Backspace");
					else if (letter === "Enter") keyboardInput("Enter", "enter");
					else keyboardInput("Key" + letter, letter);
				}}
				className="bg-gray-500 p-2 hmd:p-3 hlg:p-5 rounded-md"
			>
				{letter === "Backspace" ? "Delete" : letter}
			</button>
		);
	};

	const letters = () => {
		const output: Array<JSX.Element> = [];
		for (let i = 0; i < 3; i++) {
			let row: Array<JSX.Element> = [];
			if (i === 0) firstRow.forEach((l) => row.push(styledLetter(l)));
			else if (i === 1) secondRow.forEach((l) => row.push(styledLetter(l)));
			else {
				row.push(styledLetter("Enter"));
				thirdRow.forEach((l) => row.push(styledLetter(l)));
				row.push(styledLetter("Backspace"));
			}

			output.push(
				<span key="row1" className="flex gap-x-1 justify-center">
					{row}
				</span>
			);
			row = [];
		}

		return <div className="flex flex-col gap-1 py-5">{output}</div>;
	};

	return (
		<div className="w-full text-xs hlg:text-lg ">
			<div>{letters()}</div>
		</div>
	);
};

export default Keyboard;
