"use client";
import { ChatMessage } from "../lib/types";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { SymbolIcon } from "@radix-ui/react-icons";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  isConversationLoading?: boolean;
}

export default function MessageList({
  messages,
  isConversationLoading,
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    if (isConversationLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <SymbolIcon className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-muted-foreground">
          Send a message to start chatting.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isConversationLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && (
          <div className="flex justify-start">
            <div className="max-w-[75%] sm:max-w-[70%] p-3 rounded-xl shadow-sm bg-muted italic flex items-center">
              <SymbolIcon className="h-4 w-4 animate-spin mr-2 inline-block" />{" "}
              Assistant is thinking...
            </div>
          </div>
        )}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}