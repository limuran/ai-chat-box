import React from 'react';
import ChatBox from './components/ChatBox';
import ConnectionStatus from './components/ConnectionStatus';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Chat Box
          </h1>
          <p className="text-gray-600 mb-4">
            基于 GraphQL + Cloudflare Workers 的 Claude AI 聊天助手
          </p>
          <ConnectionStatus />
        </div>
        <ChatBox />
      </div>
    </div>
  );
};

export default App;