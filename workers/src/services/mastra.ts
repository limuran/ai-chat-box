import { 
  handleMastraRequest, 
  handleCodeReview, 
  checkMastraHealth,
  selectAppropriateAgent, 
  AgentType,
  createMastra 
} from '../mastra';
import { ClaudeService } from './claude';

export interface MastraServiceConfig {
  claudeApiKey: string;
}

export class MastraService {
  private config: MastraServiceConfig;
  private mastra: any; // Mastra 实例

  constructor(config: MastraServiceConfig) {
    this.config = config;
    // 使用 API 密钥创建 Mastra 实例
    this.mastra = createMastra(config.claudeApiKey);
    console.log('🤖 MastraService initialized with API key');
  }

  /**
   * 使用 Mastra 处理消息，自动选择合适的 Agent
   */
  async processWithMastra(
    message: string, 
    conversationHistory: any[] = [],
    agentType?: AgentType
  ) {
    try {
      // 如果没有指定 agent 类型，自动选择
      const selectedAgent = agentType || selectAppropriateAgent(message);
      
      console.log(`🎯 [MASTRA] Using agent: ${selectedAgent} for message: "${message.slice(0, 50)}..."`);
      console.log(`🚀 [MASTRA] Processing request with Mastra framework`);

      // 使用 Mastra 的标准处理函数，传递 Mastra 实例
      const result = await handleMastraRequest(
        this.mastra,
        selectedAgent,
        message,
        conversationHistory
      );

      console.log(`✅ [MASTRA] Successfully processed with agent: ${result.agentUsed}`);
      console.log(`🔧 [MASTRA] Tools used: ${result.toolsUsed?.join(', ') || 'none'}`);

      return {
        ...result,
        processingMethod: 'MASTRA',
        agentUsed: result.agentUsed,
        toolsUsed: result.toolsUsed || [],
      };

    } catch (error) {
      console.error('❌ [MASTRA] Processing error:', error);
      
      // 如果 Mastra 处理失败，回退到原有的 Claude 服务
      console.log('🔄 [FALLBACK] Falling back to direct Claude API service');
      return this.fallbackToClaude(message, conversationHistory);
    }
  }

  /**
   * 专门用于代码审查的方法
   */
  async reviewCode(code: string, language?: string, context?: string) {
    try {
      console.log(`🔍 [MASTRA] Starting code review with Mastra`);
      console.log(`📝 [MASTRA] Language: ${language || 'auto-detect'}, Code length: ${code.length} chars`);
      
      const result = await handleCodeReview(this.mastra, code, language, context);
      
      console.log(`✅ [MASTRA] Code review completed with agent: ${result.agentUsed}`);
      
      return {
        ...result,
        processingMethod: 'MASTRA',
      };
    } catch (error) {
      console.error('❌ [MASTRA] Code review error:', error);
      throw error;
    }
  }

  /**
   * 回退到原有的 Claude 服务
   */
  private async fallbackToClaude(message: string, conversationHistory: any[]) {
    try {
      console.log(`⚠️ [FALLBACK] Using direct Claude API service`);
      
      const claudeService = new ClaudeService(this.config.claudeApiKey);

      // 转换消息格式为 Claude API 期望的格式
      const claudeMessages = [
        ...conversationHistory.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role,
          timestamp: msg.timestamp,
        })),
        {
          id: Date.now().toString(),
          content: message,
          role: 'USER' as const,
          timestamp: new Date().toISOString(),
        }
      ];

      const response = await claudeService.sendMessage(claudeMessages);
      
      console.log(`✅ [FALLBACK] Claude API responded successfully`);
      
      return {
        success: true,
        content: response,
        agentUsed: 'claude-direct-api',
        toolsUsed: [],
        processingMethod: 'CLAUDE_DIRECT',
      };
    } catch (error) {
      console.error('❌ [FALLBACK] Claude API also failed:', error);
      throw error;
    }
  }

  /**
   * 获取可用的 agents 列表
   */
  getAvailableAgents(): AgentType[] {
    return ['codeReviewAgent', 'generalCodingAgent'];
  }

  /**
   * 检查 Mastra 服务状态
   */
  async healthCheck() {
    try {
      console.log(`🏥 [MASTRA] Running health check`);
      
      const healthStatus = await checkMastraHealth(this.mastra);
      
      console.log(`📊 [MASTRA] Health status: ${healthStatus.status}`);
      
      // 转换格式以匹配 GraphQL 响应
      const agents = Object.entries(healthStatus.agents || {}).map(([name, available]) => ({
        name,
        available: Boolean(available)
      }));

      return {
        status: healthStatus.status,
        agents,
        timestamp: healthStatus.timestamp,
        error: healthStatus.error || null,
      };
    } catch (error) {
      console.error('❌ [MASTRA] Health check failed:', error);
      return {
        status: 'error',
        agents: [],
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
