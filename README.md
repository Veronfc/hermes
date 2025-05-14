# **Hermes: A Real-Time Messaging Application**

Hermes is a full-stack real-time messaging application built to demonstrate proficiency in various web development technologies and architectural patterns. The goal is to create a robust and feature-rich platform for users to communicate instantly.

## **Features**

- **User Authentication:** Secure signup, login, and session management using Supabase Auth.
- **User Profiles:** Customizable user profiles with usernames and avatars.
- **Direct Messaging:** Real-time one-on-one conversations between users.
- **Group Messaging:** (Planned) Create and participate in group chats.
- **Message Management:** Send, receive, view history (with pagination), edit, and soft-delete messages.
- **Media & File Sharing:** (Planned) Ability to send images and other file types.
- **Message Reactions:** (Planned) React to messages with emojis.
- **Replies/Threading:** (Planned) Reply directly to specific messages.
- **User Blocking:** (Planned) Block unwanted users.
- **Real-Time Updates:** Instant message delivery, typing indicators, and presence using Supabase Realtime.
- **Cross-Platform Sync:** (Planned) Seamless experience across multiple user devices.
- **Push Notifications:** (Planned) Receive notifications for new messages.
- **Persistent User Settings:** Customizable application settings per user.
- **End-to-End Encryption:** (Planned) Secure message content.
- **Voice/Video Calls:** (Planned) Integrated calling features.
- **Message Translation:** (Planned) Translate messages within the app.
- **Chat Bots/AI Integration:** (Planned) Interact with automated bots.
- **Ephemeral Messages:** (Planned) Messages that automatically disappear after a set time.

## **Goals and Objectives**

The primary goal of the Hermes project is to build a comprehensive messaging application from the ground up, serving as a practical demonstration of:

- Building full-stack applications with Nuxt 3\.
- Leveraging Supabase as a Backend-as-a-Service (BaaS) for Authentication, Database, Storage, and Realtime.
- Implementing database schemas and managing them with Prisma.
- Designing and securing RESTful API endpoints in Nuxt 3 server routes.
- Implementing robust validation using Zod and integrating it with frontend forms (VeeValidate).
- Handling real-time data synchronization and events.
- Implementing secure Row Level Security (RLS) policies in Supabase.
- Managing file uploads and storage.
- Implementing core UI/UX patterns for a messaging interface, including loading states.
- Following a structured development process with defined milestones.

## **Technology Stack**

- **Frontend Framework:** Nuxt 3 (Vue 3\)
- **Backend/BaaS:** Supabase (PostgreSQL Database, Auth, Storage, Realtime)
- **ORM:** Prisma
- **Validation:** Zod (Schema definition), VeeValidate (Form validation)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## **Milestones Checklist**

This checklist tracks the progress through the planned development milestones:

- [x] **Milestone 1: Project Setup and Core One-on-One Messaging**
  - [x] 1.1 Project Setup
  - [x] 1.2 User Authentication (Supabase Auth)
  - [x] 1.3 Core Messaging Functionality (Sending/Receiving 1:1)
  - [x] 1.4 Core Messaging UI
- [ ] **Milestone 2: Group Messaging and Core UX**
  - [ ] 2.1 Group Conversation Support
  - [ ] 2.2 Conversation List UI
  - [ ] 2.3 User Status (Online/Offline)
  - [ ] 2.4 Message History and Pagination
- [ ] **Milestone 3: Media and File Sharing**
  - [ ] 3.1 File Upload (Supabase Storage)
  - [ ] 3.2 Displaying Shared Media/Files
- [ ] **Milestone 4: Enhanced Messaging Features**
  - [ ] 4.1 Message Status (Sent/Delivered/Read)
  - [ ] 4.2 Message Editing
  - [ ] 4.3 Message Deletion (Soft Delete)
- [ ] **Milestone 5: Advanced Interactions**
  - [ ] 5.1 Message Replies/Threading
  - [ ] 5.2 Message Reactions
  - [ ] 5.3 User Blocking
  - [ ] 5.4 Muting Conversations
- [ ] **Milestone 6: Cross-Platform and Notifications**
  - [ ] 6.1 Multi-Device Sync
  - [ ] 6.2 Push Notifications (Basic)
- [ ] **Milestone 7: Complex Implementations**
  - [ ] 7.1 End-to-End Encryption (Conceptual/Basic Implementation)
  - [ ] 7.2 Voice/Video Calls (Basic Integration)
- [ ] **Milestone 8: Experimental Features**
  - [ ] 8.1 Message Translation
  - [ ] 8.2 Chat Bots/AI Integration
  - [ ] 8.3 Ephemeral Messages
- [ ] **Milestone 9: Polish, Documentation, and Deployment**
  - [ ] 9.1 UI/UX Refinements
  - [ ] 9.2 Performance Optimizations
  - [ ] 9.3 Documentation
  - [ ] 9.4 Deployment
- [ ] **Milestone 10+: Future Enhancements**
  - [ ] ... (Any features beyond the initial scope)
