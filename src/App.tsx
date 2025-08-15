import React from 'react';
import ChatBox from './components/ChatBox';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Chat Box with Mastra
          </h1>
          <p className="text-gray-600">
            智能对话 + 代码审查 | 基于 Claude AI 和 Mastra 框架
          </p>
          <p className="text-sm text-gray-500 mt-2">
            支持自动 Agent 选择、专业代码审查和编程助手功能
          </p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
};

export default App;
