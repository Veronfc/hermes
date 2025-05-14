import { FetchError } from "ofetch";

export const logError = (error: any) => {
	if (error instanceof FetchError) {
		console.error(`[${error.statusCode}] ${error.statusMessage}\nStack: ${error.stack}`)
	} else {
		console.error(error);
	}
};
