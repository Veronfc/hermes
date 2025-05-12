import { FetchError } from "ofetch";

export const logError = (error: any) => {
	if (error instanceof FetchError) {
		console.error(error.statusCode);
		console.log(error.statusMessage);
	} else {
		console.error(error);
	}
};
