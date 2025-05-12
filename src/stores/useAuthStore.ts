export const useAuthStore = defineStore("auth", () => {
	const user = useSupabaseUser();
	const supabase = useSupabaseClient();

	const isAuthenticated = computed(() => Boolean(user.value));

	const signup = async (email: string, password: string, username: string) => {
		const response = await $fetch("/api/users/check-username", {
			method: "post",
			query: {
				username: username
			}
		});

		if (response) {
			throw createError({
				statusCode: 409,
				statusMessage: "Please enter a different username"
			});
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					username: username
				},
				emailRedirectTo: "http://localhost:3000/confirm"
			}
		});

		if (
			data.session === null &&
			error === null &&
			data.user?.identities?.length === 0
		) {
			throw createError({
				statusCode: 409,
				statusMessage: "Please enter a different email address"
			});
		}

		if (error) {
			console.error(
				`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
			);

			throw createError({
				statusCode: 500,
				statusMessage: "Database error"
			});
		}
	};

	const login = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			if (error.code === "email_not_confirmed") {
				alert(
					"Email not verified.\nPlease click on the confirmation link in the verification email sent to you."
				);

				//TODO: make resend optional
				const { error: resendError } = await supabase.auth.resend({
					type: "signup",
					email: email,
					options: {
						emailRedirectTo: "http://localhost:3000/confirm"
					}
				});

				if (resendError) {
					//EXP: for debugging
					console.error(
						`Message: ${resendError.message}\nCode: ${resendError.code}\nName: ${resendError.name}`
					);

					throw createError({
						statusCode: 500,
						statusMessage: "Database error.\n\nPlease try again in a minute."
					});
				}
			}

			if (error.code === "invalid_credentials") {
				throw createError({
					statusCode: 401,
					statusMessage: "Incorrect email address or password."
				});
			}

			//EXP: for debugging
			console.error(
				`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
			);

			//EXP: for unexpected errors
			throw createError({
				statusCode: 500,
				statusMessage: "A server error has occurred"
			});
		}
	};

	const loginWithCode = async (code: string) => {
		const { error } = await supabase.auth.exchangeCodeForSession(code!);

		if (error) {
			console.error(
				`Message: ${error.message}\nCode: ${error.code}\nName: ${error.name}`
			);

			throw createError({
				statusCode: 500,
				statusMessage: "A server error has occurred"
			});
		}
	};

	const logout = async () => {
		await supabase.auth.signOut();
	};

	return { user, isAuthenticated, signup, login, loginWithCode, logout };
});
