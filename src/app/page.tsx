"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Conversation } from "../lib/types";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import SubmitChatFunction from "./RegularFunctions/SubmitChatConversation";
import AddUpdateDeleteChats from "./RegularFunctions/AddUpdateDeleteChats";
import { deleteChatMessages } from "@/redux/Actions";

export default function ChatPage() {
  const { handleCreateNewChat, handleSelectChat, handleDeleteChat } =
    AddUpdateDeleteChats();
  const { handleSubmitMessage } = SubmitChatFunction();
  const [width, setWidth] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const dispatch = useDispatch();

  const conversations = useSelector(
    (state: any) => state.conversations.conversations
  );
  const activeChatId = useSelector(
    (state: any) => state.conversations.activeChatId
  );
  const activeConversation = conversations?.length
    ? conversations.find((c: Conversation) => c.id === activeChatId)
    : null;

  /**
   * If we reload app before chat response is completed,
   * then re-run that chat again
   */
  useEffect(() => {
    if (!activeConversation || !activeConversation.messages?.length) return;
    const messages = [...activeConversation.messages];
    const lastMsg = messages[messages.length - 1];
    const secondLastMsg = messages[messages.length - 2];

    if (lastMsg?.isLoading && secondLastMsg?.role === "user") {
      handleDeleteChatMessages(activeChatId, 2);
      handleSubmitMessage(
        activeChatId,
        secondLastMsg.content,
        activeConversation,
        setCurrentInput
      );
    }
    //eslint-disable-next-line
  }, []);

  const handleDeleteChatMessages = (id: any, count: any) => {
    dispatch(deleteChatMessages({ convoId: id, count }));
  };

  /**
   * Add fixed sidebar for width greater than 768px width
   */
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen max-h-screen bg-background text-foreground">
      {width >= 768 ? (
        <Sidebar
          conversations={conversations}
          activeChatId={activeChatId}
          onCreateNewChat={() => handleCreateNewChat(setCurrentInput)}
          onSelectChat={(id) => handleSelectChat(id, setCurrentInput)}
          onDeleteChat={handleDeleteChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      ) : (
        <></>
      )}
      <main
        className={`flex flex-col flex-1 h-[94%]! md:h-full! w-full! overflow-hidden`}
      >
        <header className="pl-4 pr-4 md:p-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="md:hidden">
            {width < 768 ? (
              <Sidebar
                conversations={conversations}
                activeChatId={activeChatId}
                onCreateNewChat={() => handleCreateNewChat(setCurrentInput)}
                onSelectChat={(id) => handleSelectChat(id, setCurrentInput)}
                onDeleteChat={handleDeleteChat}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            ) : (
              <></>
            )}
          </div>
          <h1
            className="text-lg font-semibold truncate flex-1 text-center md:text-left"
            title={activeConversation?.title || "Chat"}
          >
            {activeConversation?.title || "Select a Chat"}
          </h1>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {activeConversation ? (
          <>
            <MessageList
              messages={activeConversation.messages}
              isConversationLoading={activeConversation.isLoading}
            />
            <ChatInput
              input={currentInput}
              onInputChange={setCurrentInput}
              onSubmit={(event) =>
                handleSubmitMessage(
                  activeChatId,
                  currentInput,
                  activeConversation,
                  setCurrentInput,
                  event
                )
              }
              isLoading={activeConversation.isLoading ?? false}
              disabled={!activeChatId}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <ChatBubbleIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No chat selected.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new chat or select one from the sidebar.
            </p>
            <Button onClick={() => handleCreateNewChat(setCurrentInput)}>
              Start New Chat
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}