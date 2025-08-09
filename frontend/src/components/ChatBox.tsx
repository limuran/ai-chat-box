import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import TypingIndicator from './TypingIndicator';
import ChatHeader from './ChatHeader';
import useChat from '../hooks/useChat';
import { AlertCircle, X } from 'lucide-react';

const ChatBox: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearError, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
      {/* 聊天头部 */}
      <ChatHeader onClear={clearMessages} messageCount={messages.length - 1} />

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50/90 border-l-4 border-red-400 p-4 relative backdrop-blur-sm">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 聊天消息区域 */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 backdrop-blur-sm">
        {messages.map((message) => (
          <div key={message.id} className="message-animation">
            <MessageBubble message={message} />
          </div>
        ))}
        
        {/* 打字指示器 */}
        {isLoading && (
          <div className="message-animation">
            <TypingIndicator />
          </div>
        )}
        
        {/* 用于自动滚动的锚点 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="border-t border-gray-200/50 p-6 bg-white/80 backdrop-blur-sm">
        <InputBox onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatBox;