<script setup lang="ts">
	const props = defineProps<{
		inputName: string;
		inputRequired: boolean;
		label: string;
		errorCondition?: string;
		isPassword: boolean;
	}>();

	const model = defineModel();

	const showPassword = ref(false);
	const fieldType = ref("password");

	watch(showPassword, () => {
		if (!props.isPassword) {
			return;
		}
		if (showPassword.value) fieldType.value = "text";
		else fieldType.value = "password";
	});
</script>

<template>
	<div>
		<input
			:name="inputName"
			v-model="model"
			:class="{ invalid: errorCondition }"
			:required="inputRequired"
			:autocomplete="isPassword ? 'off' : 'on'"
			:type="isPassword ? fieldType : 'text'" />
		<label>{{ label }}</label>
		<span class="error-message" v-if="errorCondition">{{
			errorCondition
		}}</span>
		<button
			@click.prevent="showPassword = !showPassword"
			title="Toggle password visibility"
			v-if="isPassword">
			<icon name="mdi:eye-outline" class="toggle" v-show="showPassword"></icon>
			<icon
				name="mdi:eye-off-outline"
				class="toggle"
				v-show="!showPassword"></icon>
		</button>
	</div>
</template>

<style scoped>
	div {
		@apply relative flex flex-col gap-1;

		label {
			@apply pointer-events-none absolute flex translate-x-3 translate-y-2 flex-col font-body text-text-secondary duration-300;
		}

		input {
			@apply w-60 rounded bg-input px-3 py-2 font-body text-text-primary caret-text-primary;
		}

		input:is(:focus, :valid) + label {
			@apply -translate-y-7 translate-x-1 text-sm text-text-secondary;
		}

		.error-message {
			@apply self-start text-sm text-red-500 !important;
		}

		.invalid {
			@apply border border-red-500;
		}

		.password {
			@apply pr-10;
		}

		.toggle {
			@apply absolute right-3 top-[.8rem] cursor-pointer text-text-primary;
		}
	}
</style>
