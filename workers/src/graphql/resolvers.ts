import { ClaudeService } from '../services/claude';
import { MastraService } from '../services/mastra';
import { GraphQLContext, SendMessageInput, Message, CodeReviewInput } from './types';

// 辅助函数：获取 API 密钥
function getApiKey(env: GraphQLContext['env']): string | null {
  return env.ANTHROPIC_API_KEY || env.CLAUDE_API_KEY || null;
}

export const resolvers = {
  Query: {
    health: () => {
      return 'AI Chat Workers with Mastra integration is running!';
    },
    
    availableModels: () => {
      return [
        'claude-3-5-sonnet-20241022', // 最新的 Claude 3.5 Sonnet
        'claude-3-5-haiku-20241022',  // Claude 3.5 Haiku
        'claude-3-opus-20240229'      // Claude 3 Opus (如果仍然可用)
      ];
    },

    availableAgents: () => {
      return [
        'CODE_REVIEW_AGENT',
        'GENERAL_CODING_AGENT',
        'AUTO_SELECT'
      ];
    },

    // 验证API连接状态
    validateApiKey: async (
      _: any,
      __: any,
      context: GraphQLContext
    ) => {
      try {
        const apiKey = getApiKey(context.env);
        
        if (!apiKey) {
          return {
            valid: false,
            error: 'API 密钥未配置 - 请设置 ANTHROPIC_API_KEY 或 CLAUDE_API_KEY'
          };
        }

        console.log('🔑 [API-KEY] Validating API key...');
        const claudeService = new ClaudeService(apiKey);
        const isValid = await claudeService.validateApiKey();
        
        console.log(`✅ [API-KEY] Validation result: ${isValid}`);
        
        return {
          valid: isValid,
          error: isValid ? null : 'API 密钥无效或网络连接问题'
        };
      } catch (error) {
        console.error('❌ [API-KEY] Validation error:', error);
        return {
          valid: false,
          error: error instanceof Error ? error.message : '验证失败'
        };
      }
    },

    // Mastra 健康检查
    mastraHealth: async (
      _: any,
      __: any,
      context: GraphQLContext
    ) => {
      try {
        const apiKey = getApiKey(context.env);
        
        if (!apiKey) {
          return {
            status: 'error',
            agents: [],
            timestamp: new Date().toISOString(),
            error: 'API 密钥未配置 - 请设置 ANTHROPIC_API_KEY 或 CLAUDE_API_KEY'
          };
        }

        console.log('🏥 [MASTRA-HEALTH] Checking Mastra health...');

        const mastraService = new MastraService({
          claudeApiKey: apiKey
        });

        const healthStatus = await mastraService.healthCheck();
        
        console.log(`📊 [MASTRA-HEALTH] Status: ${healthStatus.status}`);
        
        const agents = Object.entries(healthStatus.agents || {}).map(([name, available]) => ({
          name,
          available: Boolean(available)
        }));

        return {
          status: healthStatus.status,
          agents,
          timestamp: healthStatus.timestamp,
          error: healthStatus.error || null
        };
      } catch (error) {
        console.error('❌ [MASTRA-HEALTH] Error:', error);
        return {
          status: 'error',
          agents: [],
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : '健康检查失败'
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
        const { content, conversationHistory = [], agentType } = input;
        
        if (!content.trim()) {
          return {
            success: false,
            error: '消息内容不能为空',
          };
        }

        const apiKey = getApiKey(context.env);
        
        if (!apiKey) {
          return {
            success: false,
            error: 'API 密钥未配置 - 请设置 ANTHROPIC_API_KEY 或 CLAUDE_API_KEY',
          };
        }

        console.log('📨 [SEND-MESSAGE] Processing message with Mastra integration');
        
        // 创建 Mastra 服务实例
        const mastraService = new MastraService({
          claudeApiKey: apiKey
        });

        // 映射 GraphQL agentType 到 Mastra agentType
        let mastraAgentType = undefined;
        if (agentType === 'CODE_REVIEW_AGENT') {
          mastraAgentType = 'codeReviewAgent';
        } else if (agentType === 'GENERAL_CODING_AGENT') {
          mastraAgentType = 'generalCodingAgent';
        }
        // AUTO_SELECT 或未指定时，让 Mastra 自动选择

        // 使用 Mastra 处理消息
        const result = await mastraService.processWithMastra(
          content,
          conversationHistory,
          mastraAgentType
        );

        if (!result.success) {
          return {
            success: false,
            error: '处理消息时发生错误',
          };
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.content,
          role: 'ASSISTANT',
          timestamp: new Date().toISOString(),
        };

        return {
          success: true,
          message: assistantMessage,
          agentUsed: result.agentUsed,
          toolsUsed: result.toolsUsed || [],
          processingMethod: result.processingMethod || 'MASTRA',
        };
      } catch (error) {
        console.error('❌ [SEND-MESSAGE] Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '未知错误',
        };
      }
    },

    // 专门的代码审查功能
    reviewCode: async (
      _: any,
      { input }: { input: CodeReviewInput },
      context: GraphQLContext
    ) => {
      try {
        const { code, language, context: codeContext } = input;
        
        if (!code.trim()) {
          return {
            success: false,
            content: '',
            agentUsed: '',
            error: '代码内容不能为空',
          };
        }

        const apiKey = getApiKey(context.env);
        
        if (!apiKey) {
          return {
            success: false,
            content: '',
            agentUsed: '',
            error: 'API 密钥未配置 - 请设置 ANTHROPIC_API_KEY 或 CLAUDE_API_KEY',
          };
        }

        console.log('🔍 [CODE-REVIEW] Starting code review with Mastra');
        
        const mastraService = new MastraService({
          claudeApiKey: apiKey
        });

        const result = await mastraService.reviewCode(code, language, codeContext);

        return {
          success: result.success,
          content: result.content,
          agentUsed: result.agentUsed,
          error: result.success ? null : '代码审查失败',
          processingMethod: result.processingMethod || 'MASTRA',
        };
      } catch (error) {
        console.error('❌ [CODE-REVIEW] Error:', error);
        return {
          success: false,
          content: '',
          agentUsed: '',
          error: error instanceof Error ? error.message : '代码审查失败',
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
