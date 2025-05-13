import { FetchError } from "ofetch";

export const logError = (error: any) => {
	if (error instanceof FetchError) {
		console.error(error.statusCode);
		console.error(error.statusMessage);
		console.error(error.stack);
	} else {
		console.error(error);
	}
};
