import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Message, ChatState } from '../types/chat';
import { SEND_MESSAGE_MUTATION } from '../services/graphql';

const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        content: '你好！我是Claude AI助手，有什么可以帮助你的吗？',
        role: 'ASSISTANT',
        timestamp: new Date().toISOString(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const [sendMessageMutation] = useMutation(SEND_MESSAGE_MUTATION);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'USER',
      timestamp: new Date().toISOString(),
    };

    // 添加用户消息并设置加载状态
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      // 准备对话历史（转换为 GraphQL 需要的格式）
      const conversationHistory = state.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        timestamp: msg.timestamp,
      }));

      // 调用 GraphQL mutation
      const { data } = await sendMessageMutation({
        variables: {
          input: {
            content,
            conversationHistory,
          },
        },
      });

      if (data?.sendMessage?.success && data.sendMessage.message) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, data.sendMessage.message],
          isLoading: false,
        }));
      } else {
        const errorMessage = data?.sendMessage?.error || '发送消息失败';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    } catch (error) {
      console.error('Send message error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '网络错误，请稍后再试',
      }));
    }
  }, [state.messages, sendMessageMutation]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setState({
      messages: [
        {
          id: '1',
          content: '你好！我是Claude AI助手，有什么可以帮助你的吗？',
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
        }
      ],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearError,
    clearMessages,
  };
};

export default useChat;