<script setup lang="ts">
	import type { Message } from "@prisma/client";
	import { FetchError } from 'ofetch'

	const user = useSupabaseUser();
	const props = defineProps<{
		messages: Message[];
		conversationId: string
	}>();

	const { handleSubmit } = useForm({
		validationSchema: toTypedSchema(sendMessageSchema),
	});

	const { value: content } = useField("content");

	const scrollAnchor = useTemplateRef("scroll-anchor");

	const convertUtcToLocal = (timestamp: Date) => {
		const utc = new Date(timestamp);
		return utc.toLocaleString("en-GB", {hour12: false, timeStyle: "short", dateStyle: "medium"});
	}

	const sendMessage = handleSubmit(async (values) => {
		try {
			const response = await $fetch("/api/messages", {
				method: "post",
				body: {
					conversationId: props.conversationId,
					content: values.content
				}
			})

			content.value = ""
			console.log(response.message)
		} catch (error) { 
			if (error instanceof FetchError) {
				console.error(error.statusCode)
				console.log(error.statusMessage)
			}
		}
	});

	watch(() => props.messages, async () => {
		await nextTick()
		scrollAnchor.value?.scrollIntoView({behavior: 'smooth'})
	}, {immediate: true, deep: true})
</script>

<template>
	<div class="conversation">
		<form @submit="sendMessage" class="message-input">
			<input v-model="content" name="message" type="text" autocomplete="off"/>
			<HButton class="button-secondary">Send</HButton>
		</form>
		<div class="messages">
			<div
				v-for="message in messages"
				:key="message.id"
				class="message"
				:class="user!.id === message.sender_id ? 'right' : 'left'">
				<span class="message-text">{{ message.content }}</span>
				<span class="line" :class="user!.id === message.sender_id ? 'right' : 'left'"></span>
				<span class="message-time">{{ convertUtcToLocal(message.created_at) }}</span>
			</div>
			<div ref="scroll-anchor"></div>
		</div>
	</div>
</template>

<style scoped>
	.conversation {
		@apply flex h-svh w-svw flex-col-reverse gap-4 border-border p-8;

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
					@apply text-text-secondary text-xs;
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
				@apply w-full border-t mt-2 mb-2 border-border;
			}
		}

		.message-input {
			@apply box-border flex gap-4 rounded-2xl bg-modal p-4;

			input {
				@apply w-max grow rounded-lg bg-input px-4 text-text-primary outline-border;

				&:focus {
					@apply outline outline-1;
				}
			}

			button {
				@apply min-w-min rounded-lg !important;
			}
		}
	}
</style>
