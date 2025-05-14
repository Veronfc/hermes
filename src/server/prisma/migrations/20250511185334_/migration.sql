-- CreateIndex
CREATE INDEX "conversation_members_user_id_conversation_id_idx" ON "conversation_members"("user_id", "conversation_id");

-- CreateIndex
CREATE INDEX "conversations_updated_at_idx" ON "conversations"("updated_at");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");
