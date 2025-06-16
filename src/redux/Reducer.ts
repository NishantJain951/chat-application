import { Conversation } from "../lib/types";
import {
  ADD_CONVERSATION,
  SET_ACTIVE_CONVERSATION_ID,
  DELETE_CONVERSATION,
  UPDATE_CONVERSATION,
  ADD_MESSAGE_TO_CONVERSATION,
  UPDATE_MESSAGE_IN_CONVERSATION,
  DELETE_CHAT_MESSAGES,
} from "./ActionTypes";

interface ConversationsState {
  conversations: Conversation[];
  activeChatId: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  activeChatId: null,
};

export default function conversationsReducer(
  state = initialState,
  action: any
): ConversationsState {
  switch (action.type) {
    case ADD_CONVERSATION:
      const newConversions = state?.conversations?.length
        ? [action.payload, ...state.conversations]
        : [action.payload];
      return {
        ...state,
        conversations: newConversions,
      };
    case SET_ACTIVE_CONVERSATION_ID:
      return {
        ...state,
        activeChatId:
          action.payload &&
          state.conversations.find((c) => c.id === action.payload)
            ? action.payload
            : state.conversations.length > 0
            ? state.conversations[0].id
            : null,
      };
    case DELETE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.filter(
          (c) => c.id !== action.payload
        ),
        activeChatId:
          state.activeChatId === action.payload
            ? state.conversations.length > 1
              ? state.conversations.find((c) => c.id !== action.payload)!.id
              : null
            : state.activeChatId,
      };
    case UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
    case ADD_MESSAGE_TO_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.convoId
            ? { ...c, messages: [...c.messages, action.payload.message] }
            : c
        ),
      };
    case UPDATE_MESSAGE_IN_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.convoId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === action.payload.messageId
                    ? { ...m, ...action.payload.updates }
                    : m
                ),
              }
            : c
        ),
      };
    case DELETE_CHAT_MESSAGES:
      const count = Number(action.payload.count) || 1;
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.convoId
            ? {
                ...c,
                messages:
                  c.messages.length > 0 &&
                  c.messages[c.messages.length - 1].isLoading
                    ? c.messages.slice(0, -count)
                    : c.messages,
              }
            : c
        ),
      };

    default:
      return state;
  }
}