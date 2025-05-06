/** @type {import('tailwindcss').Config} */
export default {
	content: [],
	darkMode: "selector",
	theme: {
		extend: {
			colors: {
				"bg-start": "#1a202c",
				"bg-mid": "#2d3748",
				"bg-end": "#4a5568",
				"text-primary": "#e2e8f0",
				"text-secondary": "#a0aec0",
				"accent": "#38b2ac",
				"accent-border": "#319795",
				"sent": "#4299e1",
				"received": "#718096",
				"input": "#2d3748",
				"border": "#4a5568",
				"modal": "#1a202c"
			},
			fontFamily: {
				title: ["Cal Sans", "sans-serif"],
				body: ["Quicksand", "sans-serif"]
			}
		}
	},
	plugins: []
};
