import { useMemo } from "react";
import { SidebarProps } from "../lib/types";
import GroupChatsByDate from "@/app/RegularFunctions/GroupChatsByData";
import { Button } from "./ui/button";
import {
  ChatBubbleIcon,
  PlusCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";

export default function SidebarContent({
  conversations,
  activeConversationId,
  onCreateNewChat,
  onSelectChat,
  onDeleteChat,
  onInteraction,
}: SidebarProps & { onInteraction?: () => void }) {
  const {
    groupConversationsByDate,
    sortGroupedConversations,
    formatDateLabel,
  } = GroupChatsByDate();

  const grouped = useMemo(() => {
    const groups = groupConversationsByDate(conversations);
    return sortGroupedConversations(groups);
    //eslint-disable-next-line
  }, [conversations]);

  return (
    <div className="flex flex-col h-full p-4 bg-muted/50 border-r overflow-y-auto">
      <Button
        onClick={() => {
          onCreateNewChat();
          onInteraction?.();
        }}
        className="w-full mb-4"
      >
        <PlusCircledIcon className="mr-2 h-4 w-4" /> New Chat
      </Button>
      <ScrollArea className="flex-1 -mx-4">
        <div className="px-4 space-y-4">
          {grouped.length > 0 ? (
            grouped.map(({ date, conversations }) => (
              <div key={date}>
                <h3 className="text-xs text-muted-foreground mb-2 font-semibold">
                  {formatDateLabel(date)}
                </h3>
                <div className="space-y-1">
                  {conversations.map((convo: any) => (
                    <div
                      key={convo.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select chat: ${convo.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onSelectChat(convo.id);
                          onInteraction?.();
                        }
                      }}
                      onClick={() => {
                        onSelectChat(convo.id);
                        onInteraction?.();
                      }}
                      className={cn(
                        "w-full flex justify-between items-center text-left h-auto py-2.5 px-3 rounded-md cursor-pointer group!",
                        activeConversationId === convo.id
                          ? "bg-primary/20 text-primary hover:bg-primary/25"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <ChatBubbleIcon className="mr-2.5 h-4 w-4 flex-shrink-0" />
                      <span
                        className="flex-1 font-medium text-sm truncate max-w-[180px]!"
                        title={convo.title}
                      >
                        {convo.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`ml-2 h-7 w-7 opacity-100 focus-visible:opacity-100 flex-shrink-0 ${
                          activeConversationId === convo.id
                            ? "bg-primary/20 text-primary hover:bg-primary/25"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => {
                          onDeleteChat(convo.id);
                        }}
                        title="Delete chat"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No chats yet.
            </p>
          )}
        </div>
      </ScrollArea>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        {conversations?.length ? `${conversations.length} chat(s)` : ""}
      </p>
    </div>
  );
}