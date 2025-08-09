import React from 'react';
import { useQuery } from '@apollo/client';
import { HEALTH_QUERY } from '../services/graphql';
import { Wifi, WifiOff, Loader } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { data, loading, error } = useQuery(HEALTH_QUERY, {
    pollInterval: 30000, // 每30秒检查一次连接状态
    errorPolicy: 'all',
  });

  const renderStatus = () => {
    if (loading) {
      return (
        <div className="flex items-center text-yellow-600">
          <Loader className="w-4 h-4 mr-1 animate-spin" />
          <span className="text-sm">连接中...</span>
        </div>
      );
    }

    if (error || !data?.health) {
      return (
        <div className="flex items-center text-red-600">
          <WifiOff className="w-4 h-4 mr-1" />
          <span className="text-sm">连接失败</span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-green-600">
        <Wifi className="w-4 h-4 mr-1" />
        <span className="text-sm">已连接</span>
      </div>
    );
  };

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
      {renderStatus()}
    </div>
  );
};

export default ConnectionStatus;