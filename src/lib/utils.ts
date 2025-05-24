import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CONVERSATIONS_KEY = "geminiClientChat_conversations";
export const ACTIVE_ID_KEY = "geminiClientChat_activeId";
export const MAX_MESSAGES_PER_CONVERSATION = 20;