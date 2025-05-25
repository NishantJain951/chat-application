"use client";
import formatAssistantMessage from "../components/FormatModelMessages/FormatModelMessages";
import { ChatMessage } from "../lib/types";
import { cn } from "../lib/utils";
import { SymbolIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  /**
   * Copy the code (if code is available in response)
   * @param code 
   */
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const content =
    message.role === "assistant" ? (
      formatAssistantMessage(message.content, handleCopy, copiedCode)
    ) : (
      <div className="whitespace-pre-wrap">{message.content}</div>
    );

  return (
    <div
      className={cn(
        "flex w-full mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%]! sm:max-w-[70%]! px-4 py-[15px]! my-[7px] rounded-[2rem] shadow-xl ring-1 ring-black/10 transition-all",
          isUser ? "bg-primary text-primary-foreground dark:bg-gray-600 dark:text-gray-100 ml-auto" : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        {message.role === "assistant" &&
          message.isLoading &&
          !message.content && (
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <SymbolIcon className="h-3 w-3 animate-spin mr-1" /> Thinking...
            </div>
          )}
        {message.isError && (
          <div className="flex items-center mt-1 text-xs text-red-500">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" /> Failed to load
          </div>
        )}
      </div>
    </div>
  );
}