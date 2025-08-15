import React, { useState, useRef, useEffect } from 'react';
import CodeReviewModal from './CodeReviewModal';
import MarkdownRenderer from './MarkdownRenderer';
import { graphqlService, Message, SendMessageInput } from '../services/graphql';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeReviewOpen, setIsCodeReviewOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<'AUTO_SELECT' | 'CODE_REVIEW_AGENT' | 'GENERAL_CODING_AGENT'>('AUTO_SELECT');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'USER',
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const input: SendMessageInput = {
        content: inputMessage,
        conversationHistory: messages,
        agentType: selectedAgent,
      };

      const response = await graphqlService.sendMessage(input);

      if (response.success && response.message) {
        addMessage(response.message);
      } else {
        setError(response.error || '发送消息失败');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : '发送消息时出现错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeReview = async (code: string, language?: string, context?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await graphqlService.reviewCode({
        code,
        language,
        context,
      });

      if (response.success) {
        // 将代码审查结果作为消息添加到聊天中
        const reviewMessage: Message = {
          id: Date.now().toString(),
          content: `## 🔍 代码审查结果\n\n**使用 Agent**: ${response.agentUsed}\n\n---\n\n${response.content}`,
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
        };
        addMessage(reviewMessage);
        setIsCodeReviewOpen(false);
      } else {
        setError(response.error || '代码审查失败');
      }
    } catch (error) {
      console.error('Error reviewing code:', error);
      setError(error instanceof Error ? error.message : '代码审查时出现错误');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = async () => {
    try {
      await graphqlService.clearConversation();
      setMessages([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      setError('清理对话失败');
    }
  };

  const getAgentDisplayName = (agentType: string) => {
    switch (agentType) {
      case 'AUTO_SELECT':
        return '自动选择';
      case 'CODE_REVIEW_AGENT':
        return '代码审查专家';
      case 'GENERAL_CODING_AGENT':
        return '编程助手';
      default:
        return agentType;
    }
  };

  const getAgentIcon = (agentType: string) => {
    switch (agentType) {
      case 'CODE_REVIEW_AGENT':
        return '🔍';
      case 'GENERAL_CODING_AGENT':
        return '💻';
      default:
        return '🤖';
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 头部工具栏 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-semibold">AI Chat with Mastra</h2>
          
          <div className="flex items-center space-x-4">
            {/* Agent 选择器 */}
            <div className="flex items-center space-x-2">
              <label className="text-sm">Agent:</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value as any)}
                className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
                disabled={isLoading}
              >
                <option value="AUTO_SELECT">🤖 自动选择</option>
                <option value="CODE_REVIEW_AGENT">🔍 代码审查专家</option>
                <option value="GENERAL_CODING_AGENT">💻 编程助手</option>
              </select>
            </div>

            {/* 代码审查按钮 */}
            <button
              onClick={() => setIsCodeReviewOpen(true)}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>代码审查</span>
            </button>

            {/* 清理对话按钮 */}
            <button
              onClick={clearConversation}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              清理
            </button>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">🤖</div>
            <p>欢迎使用 AI Chat Box with Mastra!</p>
            <p className="text-sm mt-2">支持智能对话和代码审查功能</p>
            <div className="mt-4 text-xs space-y-1">
              <p>💡 支持 Markdown 格式渲染</p>
              <p>🔍 专业代码审查和分析</p>
              <p>🤖 智能 Agent 自动选择</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-4xl px-4 py-3 rounded-lg ${
                  message.role === 'USER'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}
              >
                {message.role === 'USER' ? (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                ) : (
                  <MarkdownRenderer 
                    content={message.content}
                    className="text-sm leading-relaxed"
                  />
                )}
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 border-opacity-30">
                  <div className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  {message.role === 'ASSISTANT' && (
                    <div className="text-xs opacity-70 flex items-center space-x-1">
                      <span>{getAgentIcon('ASSISTANT')}</span>
                      <span>AI Assistant</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">
                  {getAgentIcon(selectedAgent)} {getAgentDisplayName(selectedAgent)} 正在思考...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="输入您的消息... (支持 Markdown 格式)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            发送
          </button>
        </div>
        
        {/* 输入提示 */}
        <div className="mt-2 text-xs text-gray-500 flex items-center space-x-4">
          <span>💡 支持 Markdown 语法</span>
          <span>🔍 可使用代码审查功能</span>
          <span>当前: {getAgentIcon(selectedAgent)} {getAgentDisplayName(selectedAgent)}</span>
        </div>
      </form>

      {/* 代码审查模态框 */}
      <CodeReviewModal
        isOpen={isCodeReviewOpen}
        onClose={() => setIsCodeReviewOpen(false)}
        onSubmit={handleCodeReview}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatBox;
