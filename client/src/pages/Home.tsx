import { useState, useEffect } from "react";
import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import { Message } from "@shared/schema";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("chutes/deepseek-v3");

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const startNewChat = () => {
    clearChat();
  };

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/80 md:hidden"
          onClick={toggleMobileSidebar}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              onNewChat={startNewChat}
              onClose={toggleMobileSidebar}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
        <Sidebar onNewChat={startNewChat} />
      </div>

      {/* Main content */}
      <Chat
        messages={messages}
        addMessage={addMessage}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onClearChat={clearChat}
        onToggleSidebar={toggleMobileSidebar}
      />
    </div>
  );
}
