import {
  addConversation,
  addMessageToConversation,
  deleteConversation,
  setActiveConversationId,
  updateChat,
  updateMessageInChat,
} from "../../redux/Actions";
import { ChatMessage, Conversation } from "../../lib/types";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";

export default function AddUpdateDeleteChats(): any {
  const dispatch = useDispatch();
  const { resolvedTheme } = useTheme();

  /**
   * Creates a new chat conversation.
   *
   * @param {Function} setCurrentInput
   */
  const handleCreateNewChat = (setCurrentInput: (input: string) => void) => {
    const newId = nanoid();
    console.log("resolvedTheme: ", resolvedTheme);
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
   * @param {string} id
   * @param {Function} setCurrentInput
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
   *
   * @param {string} id
   */
  const handleDeleteChat = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this chat?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: resolvedTheme === "dark" ? "#1f2937" : "#fff",
      color: resolvedTheme === "dark" ? "#f9fafb" : "#111827",
      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
        popup: "rounded-xl",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteConversation(id));
      }
    });
  };

  /**
   * Adds a new message to a specific conversation.
   *
   * @param {string} convoId
   * @param {ChatMessage} message
   */
  const addMessageToChatHandler = (convoId: string, message: ChatMessage) => {
    dispatch(addMessageToConversation({ convoId, message }));
  };

  /**
   * Updates properties of an existing message within a specific conversation/chat.
   *
   * @param {string} convoId
   * @param {string} messageId
   * @param {Partial<ChatMessage>} updates
   */
  const updateMessageInChatHandler = (
    convoId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ) => {
    dispatch(updateMessageInChat({ convoId, messageId, updates }));
  };

  /**
   * Updates properties of an existing conversation/chat.
   *
   * @param {string} id
   * @param {Partial<Conversation>} updates
   */
  const updateChatHandler = (id: string, updates: Partial<Conversation>) => {
    dispatch(updateChat({ id, updates }));
  };

  return {
    handleCreateNewChat,
    handleSelectChat,
    handleDeleteChat,
    updateChatHandler,
    addMessageToChatHandler,
    updateMessageInChatHandler,
  };
}