import { createTransform } from "redux-persist";
import { ChatMessage, Conversation } from "../lib/types";

const sanitizeMessage = (m: ChatMessage): ChatMessage => {
  const shouldMarkError = m?.isLoadingError;
  console.log("m: ", m);
  return {
    ...m,
    isLoading: false,
    isError: shouldMarkError ? true : m.isError,
  };
};

const sanitizeConversation = (c: Conversation): Conversation => {
  const messages = c.messages?.map(sanitizeMessage) ?? [];
  return {
    ...c,
    isLoading: false,
    messages,
  };
};

export const conversationsTransform = createTransform(
  // On save (inbound): strip transient states
  (inboundState: any) => ({
    ...inboundState,
    conversations: inboundState.conversations.map((c: Conversation) => ({
      ...c,
      isLoading: false,
      messages: c.messages.map((m: ChatMessage) => ({
        ...m,
        isLoading: false,
        isError: m?.isLoadingError ? true : false,
      })),
    })),
  }),

  // On load (outbound): convert stuck loading/typing to error
  (outboundState: any) => ({
    ...outboundState,
    conversations: outboundState.conversations.map(sanitizeConversation),
  }),

  { whitelist: ["conversations"] }
);