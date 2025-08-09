import React from 'react';
import { Trash2, MessageSquare, Zap } from 'lucide-react';

interface ChatHeaderProps {
  onClear: () => void;
  messageCount: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear, messageCount }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Claude AI 助手</h2>
            <p className="text-blue-100 text-sm">
              基于 GraphQL + Cloudflare Workers
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 消息计数 */}
          <div className="flex items-center space-x-1 text-blue-100">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{messageCount} 条消息</span>
          </div>
          
          {/* 清空按钮 */}
          <button
            onClick={onClear}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
            <span>清空</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;