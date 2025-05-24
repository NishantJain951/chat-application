"use client";
import { Conversation } from "../lib/types";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  PlusCircledIcon,
  ChatBubbleIcon,
  TrashIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { cn } from "../lib/utils";
import { useMemo, useState } from "react";
import { format, parseISO, isToday, isYesterday } from "date-fns";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onCreateNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isSidebarOpen?: any;
  setIsSidebarOpen?: any;
}

function groupConversationsByDate(conversations: any) {
  return (conversations ?? []).reduce((groups: any, convo: any) => {
    const dateKey = new Date(convo.createdAt).toISOString().split("T")[0];

    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(convo);
    return groups;
  }, {} as Record<string, typeof conversations>);
}

function sortGroupedConversations(groups: any) {
  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1)); // newest first

  return sortedDates.map((date) => {
    const convos = groups[date].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return { date, conversations: convos };
  });
}

function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr); // ensures it's a Date object

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "EEE, MMM d, yyyy"); // e.g., "Mon, May 20, 2024"
}

function SidebarContent({
  conversations,
  activeConversationId,
  onCreateNewChat,
  onSelectChat,
  onDeleteChat,
  onInteraction,
}: SidebarProps & { onInteraction?: () => void }) {
  const grouped = useMemo(() => {
    const groups = groupConversationsByDate(conversations);
    return sortGroupedConversations(groups);
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

export default function Sidebar(props: SidebarProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // useEffect(() => {
  //   if (isSheetOpen) props?.setIsSidebarOpen(true);
  //   else props?.setIsSidebarOpen(false);
  //   // eslint-disable-next-line
  // }, [isSheetOpen]);

  return (
    <>
      <div className="md:hidden p-2 sticky top-0 bg-background z-10">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open sidebar"
              className="mt-[5px]"
            >
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Chat History</SheetTitle>
            </SheetHeader>
            <SidebarContent
              {...props}
              onInteraction={() => setIsSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={`md:block w-72 h-full ${
          props?.isSidebarOpen ? "" : "hidden"
        }`}
      >
        <SidebarContent {...props} />
      </aside>
    </>
  );
}
