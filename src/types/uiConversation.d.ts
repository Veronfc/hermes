export interface Conversation {
	id: string;
	updated_at: Date;
	type: string;
	last_message?: string;
	last_sender_id?: string;
	members: [
		{
			user: {
				id: string;
				username: string;
			};
		}
	];
}
