import React from "react";

interface SidebarProps {
  onNewChat: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onNewChat, onClose, isMobile = false }: SidebarProps) {
  return (
    <div className="flex flex-col flex-1 h-full">
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Gem AI</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {!isMobile && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-primary">Gem AI</h1>
        </div>
      )}

      <div className="p-4 flex-1 overflow-y-auto">
        <button
          className="w-full mb-3 flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-white hover:bg-primary/90 transition"
          onClick={onNewChat}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
        <div className="mt-4">
          <h3 className="text-xs font-medium uppercase text-gray-500 mb-2">
            Recent Conversations
          </h3>
          <div className="space-y-1">
            <div className="py-2 px-3 rounded-md bg-gray-100 text-gray-900 text-sm flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Current Chat
            </div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">Powered by DeepSeek Coder via OpenRouter</div>
        </div>
      )}
    </div>
  );
}
