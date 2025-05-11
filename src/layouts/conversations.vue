<script lang="ts" setup>
  const {data: conversations} = await useConversations()

  const convertUtcToLocal = (timestamp?: Date) => {
    if (!timestamp) {
      return
    }

		const utc = new Date(timestamp);
    const today = new Date()

    if (utc.getDate() !== today.getDate()) {
      return utc.toLocaleString("en-GB", {
			hour12: false,
			dateStyle: "medium"
		});
    }

		return utc.toLocaleString("en-GB", {
			hour12: false,
			timeStyle: "short",
		});
	};
</script>

<template>
	<div class="main">
		<div class="list">
			<NuxtLink
				class="conversation"
				v-for="conversation in conversations"
				:key="conversation.id"
				:to="`/conversations/${conversation.id}`">
				<span class="username" :key="conversation.members[0].user.id">
					{{ conversation.members[0].user.username }}
        </span>
				<span class="message">
					{{ conversation.messages[0]?.content }}
        </span>
				<span class="time">
					{{ convertUtcToLocal(conversation.messages[0]?.created_at) }}
        </span>
			</NuxtLink>
			<Icon
				class="loader"
				name="svg-spinners:180-ring"
				v-if="!conversations"></Icon>
		</div>
		<slot />
	</div>
</template>

<style scoped>
	.main {
		@apply flex h-full w-full flex-row;

		.list {
			@apply relative flex flex-col min-w-[20rem] max-w-[20rem] bg-modal p-4 gap-4;

			.conversation {
				@apply h-24 font-body p-4 py-2 text-text-primary rounded-2xl bg-input flex flex-col border border-border justify-center box-border opacity-75;

        &:hover {
          @apply border-accent-border;
        }

        .username {
          @apply font-title tracking-widest;
        }

        .message {
          @apply truncate;
        }

        .time {
          @apply text-text-secondary text-xs text-right border-t pt-1;
        }
			}

      .router-link-active, .router-link-exact-active {
        @apply border-accent-border opacity-100 border-2;
      }
		}

		.loader {
			@apply absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-text-primary !important;
		}
	}
</style>
