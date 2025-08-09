import React, { useState } from 'react';
import { Message } from '../types/chat';
import { User, Bot, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'USER';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex items-start space-x-3 group ${
      isUser ? 'flex-row-reverse space-x-reverse' : ''
    }`}>
      {/* 头像 */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
      }`}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 max-w-xs lg:max-w-md xl:max-w-lg ${
        isUser ? 'text-right' : 'text-left'
      }`}>
        <div className={`relative inline-block p-4 rounded-2xl text-sm shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
        }`}>
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
          
          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
              isUser 
                ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
            title="复制消息"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        
        {/* 时间戳 */}
        <p className={`text-xs text-gray-500 mt-1 px-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;