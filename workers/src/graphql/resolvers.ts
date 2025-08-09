import { ClaudeService } from '../services/claude';
import { GraphQLContext, SendMessageInput, Message } from './types';

export const resolvers = {
  Query: {
    health: () => {
      return 'AI Chat Workers is running!';
    },
    
    availableModels: () => {
      return [
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-3-opus-20240229'
      ];
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      { input }: { input: SendMessageInput },
      context: GraphQLContext
    ) => {
      try {
        const { content, conversationHistory = [] } = input;
        
        if (!content.trim()) {
          return {
            success: false,
            error: '消息内容不能为空',
          };
        }

        if (!context.env.CLAUDE_API_KEY) {
          return {
            success: false,
            error: 'Claude API Key 未配置',
          };
        }

        const claudeService = new ClaudeService(context.env.CLAUDE_API_KEY);
        
        // 准备对话历史
        const messages = [...conversationHistory, {
          id: Date.now().toString(),
          content,
          role: 'user' as const,
          timestamp: new Date().toISOString(),
        }];

        // 调用 Claude API
        const response = await claudeService.sendMessage(messages);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };

        return {
          success: true,
          message: assistantMessage,
        };
      } catch (error) {
        console.error('SendMessage error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '未知错误',
        };
      }
    },

    clearConversation: () => {
      // 这里可以实现清理对话的逻辑
      // 目前只返回成功状态
      return true;
    },
  },
};