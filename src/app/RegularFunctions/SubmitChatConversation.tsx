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
    updateChatHandler,
    addMessageToChatHandler,
    updateMessageInChatHandler,
  } = AddUpdateDeleteChats();

  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  /**
   * Handles the submission of a user's message.
   *
   * @param {string} activeChatId
   * @param {string} currentInput
   * @param {any} activeConversation
   * @param {Function} setCurrentInput
   * @param {FormEvent<HTMLFormElement>} [e]
   */
  const handleSubmitMessage = async (
    activeChatId: string,
    currentInput: string,
    activeConversation: Conversation,
    setCurrentInput: (input: string) => void,
    e?: FormEvent<HTMLFormElement>
  ) => {
    if (e) e.preventDefault();

    if (
      !currentInput.trim() ||
      !activeChatId ||
      !activeConversation ||
      !GEMINI_API_KEY
    ) {
      if (!GEMINI_API_KEY) {
        toast.error("API Key is missing. This is an insecure setup.");
      }
      return;
    }

    const nonErrorConversations = activeConversation?.messages.filter(
      (item: any) => item?.role === "assistant" && !item?.isError
    );

    if (nonErrorConversations.length >= MAX_MESSAGES_PER_CONVERSATION) {
      console.log("code in react js: ", activeConversation);
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
    addMessageToChatHandler(activeChatId, userMessage);

    if (
      activeConversation.messages.length === 0 &&
      activeConversation.title.startsWith("New Chat")
    ) {
      updateChatHandler(activeChatId, {
        title:
          userInput.substring(0, 30) + (userInput.length > 30 ? "..." : ""),
      });
    }
    updateChatHandler(activeChatId, { isLoading: true });

    const assistantMessageId = nanoid();
    addMessageToChatHandler(activeChatId, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      isLoading: true,
      createdAt: new Date().toISOString(),
    });

    const geminiHistory: GeminiContent[] = activeConversation.messages
      .filter(
        (m: ChatMessage) =>
          m.role === "user" || (m.role === "assistant" && m.content)
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

        updateMessageInChatHandler(activeChatId, assistantMessageId, {
          content: `Error: ${errorMessage}`,
          isLoading: false,
          isError: true,
        });
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
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
            const jsonStr = line.substring(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const jsonData = JSON.parse(jsonStr);
              const textChunk =
                jsonData?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textChunk) {
                accumulatedText += textChunk;
              }
            } catch (err: any) {
              console.error("Malformed JSON:", jsonStr);
              console.log("err: ", err);
            }
          }
        }
      }
      await simulateTyping(activeChatId, assistantMessageId, accumulatedText);
    } catch (error: any) {
      toast.error(
        `AI Error: ${
          error?.error ? error.error : "Could not generate response"
        }:`
      );
      updateMessageInChatHandler(activeChatId, assistantMessageId, {
        content: "Error: Could not get response.",
        isLoading: false,
        isError: true,
      });
    } finally {
      updateChatHandler(activeChatId, { isLoading: false });
    }
  };

  /**
   * Updates the assistant's message content incrementally to create a visual typing effect.
   * @param {string} convoId
   * @param {string} messageId
   * @param {string} fullText
   */
  const simulateTyping = useCallback(
    async (convoId: string, messageId: string, fullText: string) => {
      const chunkSize = 5;
      const typingDelay = 100;
      let currentText = "";

      for (let i = 0; i <= fullText.length; i += chunkSize) {
        currentText = fullText.slice(0, i);
        updateMessageInChatHandler(convoId, messageId, {
          content: currentText,
          isLoading: true,
        });
        await new Promise((resolve) => setTimeout(resolve, typingDelay));
      }
      updateMessageInChatHandler(convoId, messageId, {
        content: fullText,
        isLoading: false,
      });
    },
    [updateMessageInChatHandler]
  );

  return { handleSubmitMessage };
}
