import { useSupabaseUser, useSupabaseClient } from "#imports";

export const useAuth = () => {
	const user = useSupabaseUser();
	const supabase = useSupabaseClient();

	const isAuthenticated = computed(() => !!user.value);

	const signup = async (email: string, password: string, username: string) => {
		const response = await $fetch("/api/users/check-username", {
			method: "POST",
			query: { username }
		});

		if (response) {
			throw createError({
				statusCode: 409,
				statusMessage: "Please enter a different username"
			});
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { username },
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
			console.error(`[Signup Error]: ${error.message} (${error.code})`);
			throw createError({
				statusCode: 500,
				statusMessage: "Database error"
			});
		}
	};

	const login = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error.code === "email_not_confirmed") {
				alert(
					"Email not verified.\nPlease click on the confirmation link in the verification email."
				);

				//TODO: make resend optional
				const { error: resendError } = await supabase.auth.resend({
					type: "signup",
					email,
					options: {
						emailRedirectTo: "http://localhost:3000/confirm"
					}
				});

				if (resendError) {
					console.error(
						`[Resend Error]: ${resendError.message} (${resendError.code})`
					);
					throw createError({
						statusCode: 500,
						statusMessage: "Database error. Please try again in a minute."
					});
				}
			}

			if (error.code === "invalid_credentials") {
				throw createError({
					statusCode: 401,
					statusMessage: "Incorrect email address or password."
				});
			}

			console.error(`[Login Error]: ${error.message} (${error.code})`);
			throw createError({
				statusCode: 500,
				statusMessage: "A server error has occurred"
			});
		}
	};

	const loginWithCode = async (code: string) => {
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) {
			console.error(`[Exchange Code Error]: ${error.message} (${error.code})`);
			throw createError({
				statusCode: 500,
				statusMessage: "A server error has occurred"
			});
		}
	};

	const logout = async () => {
		await supabase.auth.signOut();
	};

	return {
		user,
		isAuthenticated,
		signup,
		login,
		loginWithCode,
		logout
	};
};
