<script setup lang="ts">
	const route = useRoute()
	const conversationId = computed(() => <string>route.params.id)
	const { user } = useAuth();
	const { updateCache } = useConversations();
	const { messages, sendMessage, isLoading, isSending } = useMessages(conversationId);

	const { handleSubmit } = useForm({
		validationSchema: toTypedSchema(sendMessageSchema)
	});

	const { value: content } = useField("content");

	const scrollAnchor = useTemplateRef("scroll-anchor");

	const errorMessage = ref("");
	let errorTimeout: ReturnType<typeof setTimeout>;

	const send = handleSubmit(
		async (values) => {
			if (isSending.value) return;

			try {
				await sendMessage(values.content);
				updateCache(conversationId.value, values.content, user.value!.id);

				content.value = "";
			} catch (error) {
				errorMessage.value = error as string;
			}
		},
		({ errors }) => {
			errorMessage.value = errors.content!;
		}
	);

	const convertUtcToLocal = (timestamp: Date) => {
		if (!timestamp) {
			return;
		}

		const utc = new Date(timestamp);
		const today = new Date();

		if (utc.getDate() !== today.getDate()) {
			return utc.toLocaleString("en-GB", {
				hour12: false,
				timeStyle: "short",
				dateStyle: "medium"
			});
		}

		return utc.toLocaleString("en-GB", {
			hour12: false,
			timeStyle: "short"
		});
	};

	watch(
		() => messages.value,
		async () => {
			await nextTick();
			scrollAnchor.value?.scrollIntoView({ behavior: "smooth" });
		},
		{ deep: true }
	);

	watch(
		() => errorMessage.value,
		(error) => {
			clearTimeout(errorTimeout);

			if (error) {
				errorTimeout = setTimeout(() => {
					errorMessage.value = "";
				}, 2000);
			}
		}
	);

	onMounted(async () => {
		await nextTick();
		scrollAnchor.value?.scrollIntoView({ behavior: "instant" });
	});
</script>

<template>
	<div class="conversation">
		<Icon class="loader" name="svg-spinners:180-ring" v-if="isLoading"></Icon>
		<form @submit="send" class="message-input">
			<input
				v-model="content"
				name="message"
				type="text"
				autocomplete="off"
				:disabled="isSending" />
			<HButton class="button-secondary">Send</HButton>
			<Transition name="toast"
				><div class="toast sending" v-if="isSending">
					Sending message<Icon name="svg-spinners:180-ring"></Icon>
				</div>
			</Transition>
			<Transition name="toast"
				><div class="toast error" v-if="errorMessage">{{ errorMessage }}</div>
			</Transition>
		</form>
		<div class="messages">
			<div
				v-for="message in messages"
				:key="message.id"
				class="message"
				:class="user!.id === message.sender_id ? 'right' : 'left'">
				<span class="message-text">{{ message.content }}</span>
				<span
					class="line"
					:class="
						user!.id === message.sender_id ? 'right' : 'left'
					"></span>
				<span class="message-time">{{
					convertUtcToLocal(message.created_at)
				}}</span>
			</div>
			<div ref="scroll-anchor"></div>
		</div>
	</div>
</template>

<style scoped>
	.conversation {
		@apply relative flex h-svh w-svw flex-col-reverse gap-4 border-border p-8;

		.messages {
			@apply flex flex-col gap-2 overflow-scroll p-[1px];
			-ms-overflow-style: none;
			scrollbar-width: none;

			&::-webkit-scrollbar {
				display: none;
			}

			.message {
				@apply flex max-w-[75%] cursor-pointer flex-col rounded-2xl bg-modal px-4 py-2 font-body text-text-primary outline outline-0 outline-accent;

				&:hover {
					@apply outline-1;
				}

				.message-text {
					@apply text-justify;
				}

				.message-time {
					@apply text-xs text-text-secondary;
				}
			}

			.left {
				@apply self-start;

				.message-time {
					@apply text-left;
				}
			}

			.right {
				@apply self-end;

				.message-time {
					@apply text-right;
				}
			}

			.line {
				@apply mb-2 mt-2 w-full border-t border-border;
			}
		}

		.message-input {
			@apply relative box-border flex gap-4 rounded-2xl bg-modal p-4;

			input {
				@apply w-max grow rounded-lg bg-input px-4 text-text-primary outline-border;

				&:focus {
					@apply outline outline-1;
				}

				&:disabled {
					@apply opacity-25;
				}
			}

			button {
				@apply min-w-min rounded-lg !important;
			}

			.toast {
				@apply absolute -top-3/4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded px-4 py-2 font-body text-text-primary drop-shadow-[0_.125rem_.125rem_black] duration-300;
			}

			.sending {
				@apply bg-accent-border;
			}

			.error {
				@apply bg-red-500 text-center;
			}

			.toast-enter-to,
			.toast-leave-from {
				@apply -top-3/4;
			}

			.toast-enter-from,
			.toast-leave-to {
				@apply top-0 opacity-5 ease-linear;
			}
		}
		.loader {
			@apply absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-text-primary !important;
		}
	}
</style>
