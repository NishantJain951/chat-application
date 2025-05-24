import { FormEvent, useCallback } from "react";
import { MAX_MESSAGES_PER_CONVERSATION } from "../../lib/utils";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { ChatMessage, Conversation, GeminiContent } from "../../lib/types"; 
import ChatApiServices from "../../services/ChatApiService";
import AddUpdateDeleteChats from "./AddUpdateDeleteChats";

export default function SubmitChatFunction(): any {
  const { streamGeminiResponse } = ChatApiServices();

  const {
    updateConversationHandler,
    addMessageToConversationHandler,
    updateMessageInConversationHandler,
  } = AddUpdateDeleteChats();

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  /**
   * Handles the submission of a user's message.
   *
   * @param {string} activeConversationId - The ID of the currently active conversation.
   * @param {string} currentInput - The text content of the user's message.
   * @param {any} activeConversation - The active conversation object (consider using a specific `Conversation` type).
   * @param {Function} setCurrentInput - A state setter function to clear the input field.
   * @param {FormEvent<HTMLFormElement>} [e] - Optional form event to prevent default submission.
   */
  const handleSubmitMessage = async (
    activeConversationId: string,
    currentInput: string,
    activeConversation: Conversation,
    setCurrentInput: (input: string) => void,
    e?: FormEvent<HTMLFormElement>
  ) => {
    if (e) e.preventDefault();

    if (
      !currentInput.trim() ||
      !activeConversationId ||
      !activeConversation ||
      !GEMINI_API_KEY
    ) {
      if (!GEMINI_API_KEY) {
        toast.error("API Key is missing. This is an insecure setup.");
      }
      return;
    }

    if (activeConversation.messages.length >= MAX_MESSAGES_PER_CONVERSATION) {
      toast.error(
        `Maximum limit of ${MAX_MESSAGES_PER_CONVERSATION} messages reached in this conversation. Please start a new conversation.`
      );
      return;
    }
    const userInput = currentInput;
    setCurrentInput("");
    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: userInput,
      createdAt: new Date().toISOString(),
    };
    addMessageToConversationHandler(activeConversationId, userMessage);

    if (
      activeConversation.messages.length === 0 && 
      activeConversation.title.startsWith("New Chat")
    ) {
      updateConversationHandler(activeConversationId, {
        title:
          userInput.substring(0, 30) + (userInput.length > 30 ? "..." : ""),
      });
    }
    updateConversationHandler(activeConversationId, { isLoading: true });

    const assistantMessageId = nanoid();
    addMessageToConversationHandler(activeConversationId, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      isLoading: true,
      createdAt: new Date().toISOString(),
    });

    const geminiHistory: GeminiContent[] = activeConversation.messages
      .filter(
        (m: ChatMessage) => m.role === "user" || (m.role === "assistant" && m.content)
      )
      .map((m: ChatMessage) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content as string }],
      }));

    const contentsForApi: GeminiContent[] = [
      ...geminiHistory,
      { role: "user", parts: [{ text: userInput }] },
    ];

    try {
      const response: any = await streamGeminiResponse({
        contents: contentsForApi,
        apiKey: GEMINI_API_KEY,
      });

      if (!response.ok || !response.body) {
        const errorBody = await response
          .json()
          .catch(() => ({ error: { message: "Unknown API error" } }));
        const errorMessage =
          errorBody.error?.message ||
          response.statusText ||
          "Unknown API error";

        updateMessageInConversationHandler(
          activeConversationId,
          assistantMessageId,
          {
            content: `Error: ${errorMessage}`,
            isLoading: false,
            isError: true,
          }
        );
        throw new Error(
          `API Error (${response.status}): ${errorMessage}`
        );
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      let accumulatedText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const lines = value.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = JSON.parse(line.substring(5));
              if (
                jsonData.candidates &&
                jsonData.candidates[0]?.content?.parts[0]?.text
              ) {
                accumulatedText += jsonData.candidates[0].content.parts[0].text;
              }
            } catch (error: any) {
              console.error("Error parsing streamed JSON data: ", error, "Line:", line);
            }
          }
        }
      }
      await simulateTyping(
        activeConversationId,
        assistantMessageId,
        accumulatedText
      );
    } catch (error: any) {
      console.error("Gemini API call failed:", error);
      toast.error(`AI Error: ${error.message || "Could not get response"}`);
      updateMessageInConversationHandler(
        activeConversationId,
        assistantMessageId,
        {
          content: "Error: Could not get response.",
          isLoading: false,
          isError: true
        }
      );
    } finally {
      updateConversationHandler(activeConversationId, { isLoading: false });
    }
  };

  /**
   * Simulates a typing effect for the assistant's response.
   * Updates the assistant's message content incrementally to create a visual typing effect.
   * @param {string} convoId - The ID of the conversation.
   * @param {string} messageId - The ID of the assistant's message to update.
   * @param {string} fullText - The complete text of the assistant's response.
   */
  const simulateTyping = useCallback(async ( 
    convoId: string,
    messageId: string,
    fullText: string
  ) => {
    const chunkSize = 10;
    const typingDelay = 1;
    let currentText = "";

    for (let i = 0; i <= fullText.length; i += chunkSize) {
      currentText = fullText.slice(0, i)
      updateMessageInConversationHandler(convoId, messageId, {
        content: currentText,
        isLoading: true
      });
      await new Promise((resolve) => setTimeout(resolve, typingDelay));
    }
    updateMessageInConversationHandler(convoId, messageId, {
      content: fullText,
      isLoading: false,
    });
  }, [updateMessageInConversationHandler]);

  return { handleSubmitMessage };
}