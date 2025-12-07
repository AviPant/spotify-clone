import { AxiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

// Types
interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: Socket;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

// Base URL for socket server
const baseURL = "http://localhost:5000";

// Pre-initialized socket instance (but not connected)
const socket = io(baseURL, {
	autoConnect: false,
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	// Set selected chat user
	setSelectedUser: (user) => set({ selectedUser: user }),

	// Fetch all users
	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await AxiosInstance.get("/api/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch users." });
		} finally {
			set({ isLoading: false });
		}
	},

	// Initialize and connect the socket
	initSocket: (userId: string) => {
		const socket = get().socket;

		// Only connect if not already connected
		if (!get().isConnected && socket) {
			socket.auth = { userId };
			socket.connect();

			// Emit to server that user is online
			socket.emit("user_connected", userId);

			// List of currently online users
			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			// Incoming chat message
			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			// Live activity updates
			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			// Real-time user status changes
			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const updatedSet = new Set(state.onlineUsers);
					updatedSet.delete(userId);
					return { onlineUsers: updatedSet };
				});
			});

			set({ isConnected: true });
		}
	},

	// Disconnect socket
	disconnectSocket: () => {
		const socket = get().socket;
		if (get().isConnected && socket) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	// Send a message to another user
	sendMessage: (receiverId, senderId, content) => {
		const socket = get().socket;
		if (!socket || !get().isConnected) return;

		const message = {
			receiverId,
			senderId,
			content,
		};

		socket.emit("send_message", message);
	},

	// Load chat history
	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await AxiosInstance.get(`/api/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch messages." });
		} finally {
			set({ isLoading: false });
		}
	},
}));
