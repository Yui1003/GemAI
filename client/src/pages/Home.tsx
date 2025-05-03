import { useState, useEffect } from "react";
import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import { Message, modelOptions } from "@shared/schema";
import { nanoid } from "nanoid";

// Define interfaces for chat history
interface ChatConversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
  model: string;
}

export default function Home() {
  // Current chat state
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('gemAI-conversations');
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        
        // If there's a current chat ID saved, load that conversation
        const savedCurrentChatId = localStorage.getItem('gemAI-currentChatId');
        if (savedCurrentChatId) {
          const currentChat = parsed.find((conv: ChatConversation) => conv.id === savedCurrentChatId);
          if (currentChat) {
            setCurrentChatId(currentChat.id);
            setMessages(currentChat.messages);
            setSelectedModel(currentChat.model);
          }
        }
      } catch (error) {
        console.error("Failed to parse saved conversations:", error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('gemAI-conversations', JSON.stringify(conversations));
    }
    
    // Also save current chat ID if it exists
    if (currentChatId) {
      localStorage.setItem('gemAI-currentChatId', currentChatId);
    }
  }, [conversations, currentChatId]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  // Get a title for a conversation based on the first user message
  const generateChatTitle = (msgs: Message[]): string => {
    const firstUserMessage = msgs.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      // Get first 30 chars of message or first line, whichever is shorter
      const title = firstUserMessage.content.split('\n')[0].trim();
      return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
    return 'New conversation';
  };

  // Update existing conversation or create a new one
  const saveCurrentConversation = (msgs: Message[]) => {
    if (msgs.length === 0) return;

    const now = Date.now();

    if (currentChatId) {
      // Update existing conversation
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === currentChatId 
            ? {
                ...conv,
                messages: msgs,
                lastUpdated: now,
                model: selectedModel,
                title: conv.title || generateChatTitle(msgs)
              }
            : conv
        )
      );
    } else if (msgs.length > 0) {
      // Create new conversation
      const newId = nanoid();
      const newConversation: ChatConversation = {
        id: newId,
        title: generateChatTitle(msgs),
        messages: msgs,
        lastUpdated: now,
        model: selectedModel
      };

      setCurrentChatId(newId);
      setConversations(prevConversations => [newConversation, ...prevConversations]);
    }
  };

  // Load a specific conversation
  const loadConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setCurrentChatId(id);
      setMessages(conversation.messages);
      setSelectedModel(conversation.model);
      setIsMobileSidebarOpen(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    localStorage.removeItem('gemAI-currentChatId');
  };

  const startNewChat = () => {
    clearChat();
    setIsMobileSidebarOpen(false);
  };

  const addMessage = (newMessage: Message) => {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      
      // Save the conversation after a short delay to ensure UI updates first
      setTimeout(() => saveCurrentConversation(newMessages), 100);
      
      return newMessages;
    });
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
              conversations={conversations}
              currentChatId={currentChatId}
              onSelectConversation={loadConversation}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
        <Sidebar 
          onNewChat={startNewChat} 
          conversations={conversations}
          currentChatId={currentChatId}
          onSelectConversation={loadConversation}
        />
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
