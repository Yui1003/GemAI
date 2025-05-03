import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ModelSelector from "./ModelSelector";
import { Message, modelOptions } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  onClearChat: () => void;
  onToggleSidebar: () => void;
}

export default function Chat({
  messages,
  addMessage,
  selectedModel,
  onModelChange,
  onClearChat,
  onToggleSidebar,
}: ChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message to state
    addMessage({ role: "user", content });

    try {
      setIsLoading(true);

      // Send request to backend
      const response = await apiRequest("POST", "/api/chat", {
        model: selectedModel,
        messages: [
          ...messages,
          { role: "user", content },
        ],
      });

      const data = await response.json();

      // Add AI response to state
      if (data.message) {
        addMessage({ role: "assistant", content: data.message });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message to chat
      let errorMessage = "Sorry, there was an error getting a response.";
      
      // Try to get more specific error message
      if (error instanceof Response) {
        try {
          const data = await error.json();
          if (data.error) {
            errorMessage = data.error;
          }
        } catch (e) {
          // Use default error message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Add as system message
      // Check for specific error types
      if (errorMessage.includes('Rate limit') || errorMessage.includes('credits') || errorMessage.includes('free tier')) {
        // Credit or rate limit errors - provide clear guidance
        addMessage({ 
          role: "assistant", 
          content: `⚠️ ${errorMessage}` 
        });
      } else {
        // Generic errors
        addMessage({ 
          role: "assistant", 
          content: `⚠️ ${errorMessage} Please try again with a different question.` 
        });
      }
      
      // Show toast notification
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setExamplePrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
            onClick={onToggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={onModelChange} 
          />
        </div>
        <button
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          onClick={onClearChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear chat
        </button>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto bg-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Gem AI</h2>
            <p className="text-gray-600 max-w-md mb-8">
              Ask me anything or start a conversation. I have internet access and can provide up-to-date information. Choose from multiple powerful AI models with the selector in the header.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              <ExamplePromptButton
                title="Explain quantum computing"
                description="Learn about quantum bits and computing principles"
                onClick={() => setExamplePrompt("Explain quantum computing")}
              />
              <ExamplePromptButton
                title="Write a poem about space"
                description="Get creative with a cosmic theme"
                onClick={() => setExamplePrompt("Write a poem about space")}
              />
              <ExamplePromptButton
                title="Explain React hooks"
                description="Get examples of useState and useEffect"
                onClick={() => setExamplePrompt("Explain React hooks")}
              />
              <ExamplePromptButton
                title="Plan a 7-day itinerary for Japan"
                description="Get travel suggestions for your vacation"
                onClick={() => setExamplePrompt("Plan a 7-day itinerary for Japan")}
              />
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </main>

      {/* Input area */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <MessageInput onSendMessage={sendMessage} isDisabled={isLoading} />
      </footer>
    </div>
  );
}

interface ExamplePromptButtonProps {
  title: string;
  description: string;
  onClick: () => void;
}

function ExamplePromptButton({ title, description, onClick }: ExamplePromptButtonProps) {
  return (
    <button
      className="bg-gray-100 p-3 rounded-lg text-left hover:bg-gray-200 transition text-sm"
      onClick={onClick}
    >
      <div className="font-medium mb-1 text-gray-900">{title}</div>
      <div className="text-gray-600">{description}</div>
    </button>
  );
}
