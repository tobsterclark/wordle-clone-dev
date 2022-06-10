module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			animation: {
				bounceOnce: "bounce 2s linear",
			},
			screens: {
				hlg: { raw: "(min-height: 600px)" },
				hmd: { raw: "(min-height: 500px)" },
				hsm: { raw: "(min-height: 300px)" },
			},
		},
	},
	plugins: [],
};
