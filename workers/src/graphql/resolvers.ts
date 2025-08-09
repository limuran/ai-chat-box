import { ClaudeService } from '../services/claude';
import { GraphQLContext, SendMessageInput, Message } from './types';

export const resolvers = {
  Query: {
    health: () => {
      return 'AI Chat Workers is running!';
    },
    
    availableModels: () => {
      return [
        'claude-3-5-sonnet-20241022', // 最新的 Claude 3.5 Sonnet
        'claude-3-5-haiku-20241022',  // Claude 3.5 Haiku
        'claude-3-opus-20240229'      // Claude 3 Opus (如果仍然可用)
      ];
    },

    // 验证API连接状态
    validateApiKey: async (
      _: any,
      __: any,
      context: GraphQLContext
    ) => {
      try {
        if (!context.env.CLAUDE_API_KEY) {
          return {
            valid: false,
            error: 'Claude API Key 未配置'
          };
        }

        const claudeService = new ClaudeService(context.env.CLAUDE_API_KEY);
        const isValid = await claudeService.validateApiKey();
        
        return {
          valid: isValid,
          error: isValid ? null : 'API 密钥无效或网络连接问题'
        };
      } catch (error) {
        console.error('API key validation error:', error);
        return {
          valid: false,
          error: error instanceof Error ? error.message : '验证失败'
        };
      }
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

        console.log('Creating Claude service with API key length:', context.env.CLAUDE_API_KEY.length);
        const claudeService = new ClaudeService(context.env.CLAUDE_API_KEY);
        
        // 准备对话历史 - 修复role类型问题
        const messages = [...conversationHistory, {
          id: Date.now().toString(),
          content,
          role: 'USER' as const,
          timestamp: new Date().toISOString(),
        }];

        console.log('Sending message to Claude, total messages:', messages.length);

        // 调用 Claude API
        const response = await claudeService.sendMessage(messages);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'ASSISTANT',
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