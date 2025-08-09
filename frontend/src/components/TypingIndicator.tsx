import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3">
      {/* AI头像 */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5" />
      </div>

      {/* 打字动画 */}
      <div className="flex-1 max-w-xs lg:max-w-md">
        <div className="inline-block p-4 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-lg">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full typing-indicator"></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 px-1">
          Claude 正在思考中...
        </p>
      </div>
    </div>
  );
};

export default TypingIndicator;