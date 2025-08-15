import React, { useState } from 'react';
import { Message } from '../types/chat';
import { User, Bot, Copy, Check, Settings, Cpu } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  agentUsed?: string;
  toolsUsed?: string[];
  processingMethod?: 'MASTRA' | 'CLAUDE_DIRECT';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  agentUsed, 
  toolsUsed = [], 
  processingMethod 
}) => {
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

  const getProcessingMethodDisplay = () => {
    if (!processingMethod) return null;
    
    return processingMethod === 'MASTRA' ? {
      icon: <Settings className="w-3 h-3" />,
      text: 'Mastra',
      color: 'text-green-600 bg-green-100',
      tooltip: `智能Agent: ${agentUsed}${toolsUsed.length > 0 ? ` • 工具: ${toolsUsed.join(', ')}` : ''}`
    } : {
      icon: <Cpu className="w-3 h-3" />,
      text: 'Claude API',
      color: 'text-blue-600 bg-blue-100',
      tooltip: '直接调用 Claude API'
    };
  };

  const processingInfo = getProcessingMethodDisplay();

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
          {/* 使用 MarkdownRenderer 来正确渲染内容 */}
          {isUser ? (
            // 用户消息保持简单的文本显示
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          ) : (
            // AI 回复使用 Markdown 渲染
            <div className="prose prose-sm max-w-none">
              <MarkdownRenderer 
                content={message.content} 
                className="text-gray-800"
              />
            </div>
          )}
          
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
        
        {/* 处理方法和时间戳 */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          {/* 处理方法指示器 - 只在 AI 回复时显示 */}
          {!isUser && processingInfo && (
            <div 
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${processingInfo.color}`}
              title={processingInfo.tooltip}
            >
              {processingInfo.icon}
              <span>{processingInfo.text}</span>
            </div>
          )}
          
          {/* 时间戳 */}
          <p className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </p>
        </div>
        
        {/* Agent 和工具信息 - 详细信息，只在悬停时显示 */}
        {!isUser && processingMethod === 'MASTRA' && (agentUsed || toolsUsed.length > 0) && (
          <div className="mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs text-gray-400 space-y-0.5">
              {agentUsed && (
                <div>🤖 Agent: <span className="font-mono">{agentUsed}</span></div>
              )}
              {toolsUsed.length > 0 && (
                <div>🔧 Tools: <span className="font-mono">{toolsUsed.join(', ')}</span></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;