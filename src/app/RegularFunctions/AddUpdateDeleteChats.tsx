import {
  addConversation,
  addMessageToConversation,
  deleteConversation,
  setActiveConversationId,
  updateConversation,
  updateMessageInConversation,
} from "../../redux/Actions";
import { ChatMessage, Conversation } from "../../lib/types";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";

export default function AddUpdateDeleteChats(): any {
  const dispatch = useDispatch();

  /**
   * Creates a new chat conversation.
   *
   * @param {Function} setCurrentInput - A useState function to clear the message input field in the UI.
   */
  const handleCreateNewChat = (setCurrentInput: (input: string) => void) => {
    const newId = nanoid();
    const now = format(new Date(), "hh:mm:a");
    const newConvo: Conversation = {
      id: newId,
      title: `New Chat ${now}`,
      messages: [],
      createdAt: new Date().toISOString(),
      isLoading: false,
    };
    dispatch(addConversation(newConvo));
    dispatch(setActiveConversationId(newId));
    setCurrentInput("");
  };

  /**
   * Selects an existing chat conversation, making it the active one.
   *
   * @param {string} id - The ID of the conversation to select.
   * @param {Function} setCurrentInput - A state setter function to clear the message input field.
   */
  const handleSelectChat = (
    id: string,
    setCurrentInput: (input: string) => void
  ) => {
    dispatch(setActiveConversationId(id));
    setCurrentInput("");
  };

  /**
   * Deletes a chat conversation.
   * Dispatches an action to remove the specified conversation from the Redux store.
   *
   * @param {string} id - The ID of the conversation to delete.
   */
  const handleDeleteChat = (id: string) => {
    dispatch(deleteConversation(id));
  };

  /**
   * Adds a new message to a specific conversation.
   *
   * @param {string} convoId - The ID of the conversation to add the message to.
   * @param {ChatMessage} message - The chat message object to add.
   */
  const addMessageToConversationHandler = (
    convoId: string,
    message: ChatMessage
  ) => {
    dispatch(addMessageToConversation({ convoId, message }));
  };

  /**
   * Updates properties of an existing message within a specific conversation..
   *
   * @param {string} convoId - The ID of the conversation containing the message.
   * @param {string} messageId - The ID of the message to update.
   * @param {Partial<ChatMessage>} updates - An object containing the message properties to update.
   */
  const updateMessageInConversationHandler = (
    convoId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ) => {
    dispatch(updateMessageInConversation({ convoId, messageId, updates }));
  };

  /**
   * Updates properties of an existing conversation.
   *
   * @param {string} id - The ID of the conversation to update.
   * @param {Partial<Conversation>} updates - An object containing the conversation properties like API loading to update.
   */
  const updateConversationHandler = (
    id: string,
    updates: Partial<Conversation>
  ) => {
    dispatch(updateConversation({ id, updates }));
  };

  return {
    handleCreateNewChat,
    handleSelectChat,
    handleDeleteChat,
    updateConversationHandler,
    addMessageToConversationHandler,
    updateMessageInConversationHandler,
  };
}