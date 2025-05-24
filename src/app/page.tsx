// "use client";
// import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import {Conversation } from "../lib/types";
// import { ThemeToggle } from "../components/ThemeToggle";
// import { Button } from "../components/ui/button";
// import { ChatBubbleIcon } from "@radix-ui/react-icons";
// import Sidebar from "../components/Sidebar";
// import ChatInput from "../components/ChatInput";
// import MessageList from "../components/MessageList";
// import SubmitChatFunction from "./RegularFunctions/SubmitChatConversation";
// import AddUpdateDeleteChats from "./RegularFunctions/AddUpdateDeleteChats";

// export default function ChatPage() {
//   const {handleCreateNewChat, handleSelectChat, handleDeleteChat} = AddUpdateDeleteChats();
//   const {handleSubmitMessage} = SubmitChatFunction();
//   const [width, setWidth] = useState(0);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [currentInput, setCurrentInput] = useState("");

//   const conversations = useSelector(
//     (state: any) => state.conversations.conversations
//   );
//   const activeConversationId = useSelector(
//     (state: any) => state.conversations.activeConversationId
//   );
//   const activeConversation = conversations?.length
//     ? conversations.find((c: Conversation) => c.id === activeConversationId)
//     : null;

//   /**
//    * Add fixed sidebar for width greater than 768px width
//    */
//   useEffect(() => {
//     const handleResize = () => {
//       setWidth(window.innerWidth);
//       if (window.innerWidth >= 768) setIsSidebarOpen(true);
//       else setIsSidebarOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className="flex h-screen max-h-screen bg-background text-foreground">
//       {width >= 768 ? (
//         <Sidebar
//           conversations={conversations}
//           activeConversationId={activeConversationId}
//           onCreateNewChat={() => handleCreateNewChat(setCurrentInput)}
//           onSelectChat={(id) => handleSelectChat(id, setCurrentInput)}
//           onDeleteChat={handleDeleteChat}
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//         />
//       ) : (
//         <></>
//       )}
//       <main className={`flex flex-col flex-1 h-full w-full overflow-hidden`}>
//         <header className="pl-4 pr-4 md:p-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-sm z-10">
//           <div className="md:hidden">
//             {width < 768 ? (
//               <Sidebar
//                 conversations={conversations}
//                 activeConversationId={activeConversationId}
//                 onCreateNewChat={() => handleCreateNewChat(setCurrentInput)}
//                 onSelectChat={(id) => handleSelectChat(id, setCurrentInput)}
//                 onDeleteChat={handleDeleteChat}
//                 isSidebarOpen={isSidebarOpen}
//                 setIsSidebarOpen={setIsSidebarOpen}
//               />
//             ) : (
//               <></>
//             )}
//           </div>
//           <h1
//             className="text-lg font-semibold truncate flex-1 text-center md:text-left"
//             title={activeConversation?.title || "Chat"}
//           >
//             {activeConversation?.title || "Select a Chat"}
//           </h1>
//           <div className="ml-auto">
//             <ThemeToggle />
//           </div>
//         </header>

//         {activeConversation ? (
//           <>
//             <MessageList
//               messages={activeConversation.messages}
//               isConversationLoading={activeConversation.isLoading}
//             />
//             <ChatInput
//               input={currentInput}
//               onInputChange={setCurrentInput}
//               onSubmit={(event) =>
//                 handleSubmitMessage(
//                   activeConversationId,
//                   currentInput,
//                   activeConversation,
//                   setCurrentInput,
//                   event
//                 )
//               }
//               isLoading={activeConversation.isLoading ?? false}
//               disabled={!activeConversationId}
//             />
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
//             <ChatBubbleIcon className="w-12 h-12 text-muted-foreground mb-4" />
//             <p className="text-lg text-muted-foreground">No chat selected.</p>
//             <p className="text-sm text-muted-foreground mb-4">
//               Create a new chat or select one from the sidebar.
//             </p>
//             <Button onClick={() => handleCreateNewChat(setCurrentInput)}>Start New Chat</Button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";
import { useState, useEffect, FormEvent } from "react"; // Added FormEvent
import { useSelector } from "react-redux";
import { Conversation } from "../lib/types"; // Assuming types are correctly defined
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MessageList";
import SubmitChatFunction from "./RegularFunctions/SubmitChatConversation"; // Make sure paths are correct
import AddUpdateDeleteChats from "./RegularFunctions/AddUpdateDeleteChats"; // Make sure paths are correct

export default function ChatPage() {
  const { handleCreateNewChat, handleSelectChat, handleDeleteChat } =
    AddUpdateDeleteChats();
  const { handleSubmitMessage } = SubmitChatFunction();
  const [width, setWidth] = useState(0); // Consider initializing with window.innerWidth if not SSR
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");

  const conversations = useSelector(
    (state: any) => state.conversations.conversations // Adjust if your Redux state structure is different
  );
  const activeConversationId = useSelector(
    (state: any) => state.conversations.activeConversationId // Adjust
  );
  const activeConversation: Conversation | null | undefined = conversations?.length // Typed activeConversation
    ? conversations.find((c: Conversation) => c.id === activeConversationId)
    : null;

  /**
   * Manages sidebar visibility based on window width.
   * For widths >= 768px, the sidebar is always "open" (visible and fixed).
   * For widths < 768px, the sidebar state (isSidebarOpen) controls its overlay visibility.
   */
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);
      // For larger screens, the sidebar is part of the main layout, not an overlay.
      // For smaller screens, its 'open' state is for the drawer/overlay behavior.
      if (currentWidth < 768) {
        // setIsSidebarOpen(false); // You might want to close it on resize to small, or maintain state
      }
    };

    // Set initial width and sidebar state
    handleResize(); // Call on mount
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true); // For desktop, sidebar is "conceptually" always open if rendered
    }


    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array, runs once on mount and cleans up on unmount

  const commonSidebarProps = {
    conversations: conversations,
    activeConversationId: activeConversationId,
    onCreateNewChat: () => handleCreateNewChat(setCurrentInput),
    onSelectChat: (id: string) => handleSelectChat(id, setCurrentInput),
    onDeleteChat: handleDeleteChat,
    isSidebarOpen: isSidebarOpen, // This prop will control the actual drawer open/close
    setIsSidebarOpen: setIsSidebarOpen,
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar (always part of layout if width allows) */}
      {width >= 768 && <Sidebar {...commonSidebarProps} />}

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="pl-4 pr-4 md:pr-4 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-sm z-20 h-16 shrink-0">
          {/* Mobile Sidebar Toggle/Button (renders Sidebar as a drawer) */}
          {width < 768 && (
             <Sidebar {...commonSidebarProps} />
          )}
          <h1
            className="text-lg font-semibold truncate flex-1 text-center md:text-left md:ml-4" // Added md:ml-4 for spacing when mobile sidebar button is present
            title={activeConversation?.title || "Chat"}
          >
            {activeConversation?.title || "Select or Start a Chat"}
          </h1>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Chat Content Area */}
        {activeConversation ? (
          <>
            {/* MessageList will take remaining space and be scrollable */}
            <div className="flex-1 overflow-y-auto">
              <MessageList
                messages={activeConversation.messages}
                isConversationLoading={activeConversation.isLoading}
              />
            </div>
            {/* ChatInput sticks to the bottom of this flex container */}
            <div className="shrink-0"> {/* Prevent ChatInput from shrinking */}
              <ChatInput
                input={currentInput}
                onInputChange={setCurrentInput}
                onSubmit={(event?: FormEvent<HTMLFormElement>) => // Make event optional
                  handleSubmitMessage(
                    activeConversationId as string, // Ensure activeConversationId is string
                    currentInput,
                    activeConversation,
                    setCurrentInput,
                    event
                  )
                }
                isLoading={activeConversation.isLoading ?? false}
                disabled={!activeConversationId}
              />
            </div>
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