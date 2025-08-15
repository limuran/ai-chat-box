import { 
  handleMastraRequest, 
  handleCodeReview, 
  checkMastraHealth,
  selectAppropriateAgent, 
  AgentType 
} from '../mastra';
import { ClaudeService } from './claude';

export interface MastraServiceConfig {
  claudeApiKey: string;
}

export class MastraService {
  private config: MastraServiceConfig;

  constructor(config: MastraServiceConfig) {
    this.config = config;
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
      
      console.log(`Using agent: ${selectedAgent} for message: ${message.slice(0, 100)}...`);

      // 使用 Mastra 的标准处理函数
      const result = await handleMastraRequest(
        selectedAgent,
        message,
        conversationHistory
      );

      return result;

    } catch (error) {
      console.error('Mastra processing error:', error);
      
      // 如果 Mastra 处理失败，回退到原有的 Claude 服务
      console.log('Falling back to Claude service');
      return this.fallbackToClaude(message, conversationHistory);
    }
  }

  /**
   * 专门用于代码审查的方法
   */
  async reviewCode(code: string, language?: string, context?: string) {
    try {
      const result = await handleCodeReview(code, language, context);
      return result;
    } catch (error) {
      console.error('Code review error:', error);
      throw error;
    }
  }

  /**
   * 回退到原有的 Claude 服务
   */
  private async fallbackToClaude(message: string, conversationHistory: any[]) {
    try {
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
      
      return {
        success: true,
        content: response,
        agentUsed: 'claude-fallback',
        toolsUsed: [],
      };
    } catch (error) {
      console.error('Fallback to Claude failed:', error);
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
      const healthStatus = await checkMastraHealth();
      
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
      return {
        status: 'error',
        agents: [],
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
