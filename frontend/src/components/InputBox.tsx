import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

interface InputBoxProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // 重置高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // 自动调整高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex items-end space-x-3">
      {/* 附件按钮（未来可实现） */}
      <button 
        className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        title="附件（即将推出）"
        disabled
      >
        <Paperclip className="w-5 h-5" />
      </button>

      {/* 文本输入框 */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? '正在处理中...' : '输入你的消息... (Shift+Enter 换行)'}
          disabled={disabled}
          rows={1}
          className={`w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 ${
            disabled ? 'opacity-50' : ''
          }`}
          style={{
            minHeight: '48px',
            maxHeight: '120px',
          }}
        />
        
        {/* 字数统计 */}
        {message.length > 0 && (
          <div className="absolute bottom-1 right-12 text-xs text-gray-400">
            {message.length}
          </div>
        )}
      </div>

      {/* 语音按钮（未来可实现） */}
      <button 
        className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
        title="语音输入（即将推出）"
        disabled
      >
        <Mic className="w-5 h-5" />
      </button>

      {/* 发送按钮 */}
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          disabled || !message.trim()
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-blue-500/25'
        }`}
        title={disabled ? '请稍候...' : '发送消息'}
      >
        <Send 
          className={`w-5 h-5 ${
            disabled || !message.trim() ? 'text-gray-500' : 'text-white'
          }`} 
        />
      </button>
    </div>
  );
};

export default InputBox;