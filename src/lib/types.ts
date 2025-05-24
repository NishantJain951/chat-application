export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date | string;
  isLoading?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  isLoading?: boolean;
}

export interface GeminiContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}