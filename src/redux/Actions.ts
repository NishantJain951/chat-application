import { Conversation, ChatMessage } from "../lib/types";
import {
  ADD_CONVERSATION,
  SET_ACTIVE_CONVERSATION_ID,
  DELETE_CONVERSATION,
  UPDATE_CONVERSATION,
  ADD_MESSAGE_TO_CONVERSATION,
  UPDATE_MESSAGE_IN_CONVERSATION,
  DELETE_CHAT_MESSAGES,
} from "./ActionTypes";

export const addConversation = (conversation: Conversation) => ({
  type: ADD_CONVERSATION,
  payload: conversation,
});

export const setActiveConversationId = (id: string | null) => ({
  type: SET_ACTIVE_CONVERSATION_ID,
  payload: id,
});

export const deleteConversation = (id: string) => ({
  type: DELETE_CONVERSATION,
  payload: id,
});

export const updateChat = (payload: {
  id: string;
  updates: Partial<Conversation>;
}) => ({
  type: UPDATE_CONVERSATION,
  payload,
});

export const addMessageToConversation = (payload: {
  convoId: string;
  message: ChatMessage;
}) => ({
  type: ADD_MESSAGE_TO_CONVERSATION,
  payload,
});

export const updateMessageInChat = (payload: {
  convoId: string;
  messageId: string;
  updates: Partial<ChatMessage>;
}) => ({
  type: UPDATE_MESSAGE_IN_CONVERSATION,
  payload,
});

export const deleteChatMessages = (payload: {
  convoId: string;
  count: number;
}) => ({
  type: DELETE_CHAT_MESSAGES,
  payload,
});