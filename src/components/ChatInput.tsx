"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PaperPlaneIcon, SymbolIcon } from "@radix-ui/react-icons";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  disabled = false,
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 md:p-4 border-t bg-background mx-[5px]"
    >
      <div className="flex items-end gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? "Select or create a chat" : "Send a message..."
          }
          disabled={isLoading || disabled}
          className="flex-1"
          aria-label="Chat message input"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim() || disabled}
          aria-label="Send message"
        >
          {isLoading ? (
            <SymbolIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PaperPlaneIcon className="h-4 w-4" />
          )}
          <span className="sr-only md:not-sr-only md:ml-2">Send</span>
        </Button>
      </div>
    </form>
  );
}